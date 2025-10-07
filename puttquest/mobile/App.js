import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, Animated, Easing } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { Audio } from 'expo-av';
import { MotiView, MotiText } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';

const { width, height } = Dimensions.get('window');

const PUTTER_SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const PUTTER_CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

export default function App() {
  const [appState, setAppState] = useState({
    screen: 'connection',
    putterConnected: false,
    currentHole: 1,
    strokes: 0,
    power: 0,
    angle: 0,
    ballPosition: { x: width * 0.2, y: height * 0.7 },
    holePosition: { x: width * 0.8, y: height * 0.3 },
    isSwinging: false,
    gameId: null,
    userId: null
  });

  const [playerStats, setPlayerStats] = useState({
    level: 1,
    xp: 0,
    coins: 100,
    totalPutts: 0,
    accuracy: 0,
    longestPutt: 0,
    gamesPlayed: 0,
    holesInOne: 0
  });

  const [sounds, setSounds] = useState({});
  const [putterDevice, setPutterDevice] = useState(null);
  const [socket, setSocket] = useState(null);

  const bleManager = useRef(new BleManager()).current;
  const ballAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const initialize = async () => {
      try {
        await loadSounds();
        await loadSavedGame();
        setupSocketConnection();
        scanForPutter();
      } catch (e) {
        console.error('Initialization error:', e);
      }
    };
    initialize();
    return () => { bleManager.destroy(); socket?.disconnect(); };
  }, []);

  const loadSounds = async () => {
    try {
      const swingSound = new Audio.Sound();
      const successSound = new Audio.Sound();
      setSounds({ swingSound, successSound });
    } catch {}
  };

  const loadSavedGame = async () => {
    try {
      const savedStats = await AsyncStorage.getItem('@puttquest_playerStats');
      const savedGame = await AsyncStorage.getItem('@puttquest_currentGame');
      if (savedStats) setPlayerStats(JSON.parse(savedStats));
      if (savedGame) setAppState(prev => ({ ...prev, ...JSON.parse(savedGame) }));
    } catch {}
  };

  const saveGame = async () => {
    try {
      await AsyncStorage.setItem('@puttquest_playerStats', JSON.stringify(playerStats));
      await AsyncStorage.setItem('@puttquest_currentGame', JSON.stringify({
        currentHole: appState.currentHole,
        strokes: appState.strokes,
        ballPosition: appState.ballPosition
      }));
    } catch {}
  };

  const setupSocketConnection = () => {
    const url = 'http://localhost:3000';
    const s = io(url, { transports: ['websocket'] });
    s.on('connect', () => setSocket(s));
    s.on('game_joined', (data) => setAppState(prev => ({ ...prev, gameId: data.gameId })));
    s.on('ball_moved', (data) => animateBallMovement(data.newPosition, data.trajectory));
    s.on('error', (data) => Alert.alert('Game Error', data.message));
  };

  const scanForPutter = () => {
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) { return; }
      if (device?.name === 'PuttQuest-Putter-V1') {
        bleManager.stopDeviceScan();
        connectToPutter(device);
      }
    });
  };

  const connectToPutter = async (device) => {
    try {
      const connected = await device.connect();
      setPutterDevice(connected);
      await connected.discoverAllServicesAndCharacteristics();
      await setupPutterNotifications(connected);
      setAppState(prev => ({ ...prev, putterConnected: true, screen: 'home' }));
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      Alert.alert('Connection Failed', 'Could not connect to putter.');
    }
  };

  const setupPutterNotifications = async (device) => {
    try {
      await device.monitorCharacteristicForService(
        PUTTER_SERVICE_UUID,
        PUTTER_CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) return;
          const data = characteristic?.value;
          if (!data) return;
          handlePutterData(data);
        }
      );
    } catch {}
  };

  const handlePutterData = (data) => {
    try {
      if (data.includes('SWING_COMPLETE')) {
        const [, power, angle] = data.split(',');
        handleSwingComplete(parseFloat(power), parseFloat(angle));
      } else {
        const [power, angle] = data.split(',').map(Number);
        setAppState(prev => ({ ...prev, power: Math.min(100, power || 0), angle: angle || 0 }));
      }
    } catch {}
  };

  const handleSwingComplete = async (power, angle) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setAppState(prev => ({ ...prev, isSwinging: false, strokes: prev.strokes + 1 }));
      if (sounds.swingSound) await sounds.swingSound.replayAsync();
      const shotResult = calculateAdvancedShotResult(power, angle);
      executeShot(shotResult);
      saveGame();
    } catch {}
  };

  const calculateAdvancedShotResult = (power, angle) => {
    const maxDistance = width * 0.6;
    const baseDistance = (power / 100) * maxDistance;
    const windEffect = Math.random() * 20 - 10;
    const effectiveDistance = baseDistance + windEffect;
    const radians = (angle * Math.PI) / 180;
    const newX = appState.ballPosition.x + Math.cos(radians) * effectiveDistance;
    const newY = appState.ballPosition.y - Math.sin(radians) * effectiveDistance;
    const boundedX = Math.max(30, Math.min(width - 30, newX));
    const boundedY = Math.max(30, Math.min(height - 200, newY));
    const distanceToHole = Math.hypot(boundedX - appState.holePosition.x, boundedY - appState.holePosition.y);
    return { newPosition: { x: boundedX, y: boundedY }, isInHole: distanceToHole < 25, distanceToHole };
  };

  const animateBallMovement = (newPosition) => {
    ballAnimation.setValue(0);
    Animated.timing(ballAnimation, { toValue: 1, duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start(({ finished }) => {
      if (finished) setAppState(prev => ({ ...prev, ballPosition: newPosition }));
    });
  };

  const executeShot = async (shotResult) => {
    animateBallMovement(shotResult.newPosition);
    setPlayerStats(prev => ({ ...prev, totalPutts: prev.totalPutts + 1, longestPutt: Math.max(prev.longestPutt, shotResult.distanceToHole) }));
    if (shotResult.isInHole) await handleHoleComplete();
  };

  const handleHoleComplete = async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (sounds.successSound) await sounds.successSound.replayAsync();
      const xpEarned = Math.max(20, 100 - (appState.strokes * 15));
      const coinsEarned = appState.strokes <= 3 ? 50 : 25;
      setPlayerStats(prev => ({
        ...prev,
        xp: prev.xp + xpEarned,
        coins: prev.coins + coinsEarned,
        gamesPlayed: prev.gamesPlayed + 1,
        holesInOne: appState.strokes === 1 ? prev.holesInOne + 1 : prev.holesInOne
      }));
      setAppState(prev => ({ ...prev, screen: 'results' }));
      saveGame();
    } catch {}
  };

  const startNewHole = () => {
    setAppState(prev => ({
      ...prev,
      screen: 'playing',
      currentHole: prev.currentHole + 1,
      strokes: 0,
      power: 0,
      angle: 0,
      ballPosition: { x: width * 0.2, y: height * 0.7 },
      holePosition: { x: Math.random() * (width - 100) + 50, y: Math.random() * (height - 250) + 50 },
      isSwinging: false
    }));
  };

  return (
    <View style={styles.container}>
      {appState.screen === 'connection' && (
        <ConnectionScreen onRetry={scanForPutter} isConnected={appState.putterConnected} />
      )}
      {appState.screen === 'home' && (
        <HomeScreen onStartGame={() => setAppState(prev => ({ ...prev, screen: 'playing' }))} playerStats={playerStats} putterConnected={appState.putterConnected} />
      )}
      {appState.screen === 'playing' && (
        <GameScreen appState={appState} playerStats={playerStats} ballAnimation={ballAnimation} />
      )}
      {appState.screen === 'results' && (
        <ResultsScreen appState={appState} playerStats={playerStats} onNextHole={startNewHole} onMenu={() => setAppState(prev => ({ ...prev, screen: 'home' }))} />
      )}
    </View>
  );
}

const ConnectionScreen = ({ onRetry, isConnected }) => (
  <View style={styles.connectionContainer}>
    <MotiView from={{ rotate: '0deg' }} animate={{ rotate: isConnected ? '0deg' : '360deg' }} transition={{ type: 'timing', duration: 2000, loop: !isConnected }} style={styles.connectionIcon}>
      <Ionicons name="bluetooth" size={80} color={isConnected ? '#4CAF50' : '#007AFF'} />
    </MotiView>
    <MotiText from={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.connectionTitle}>
      {isConnected ? 'Putter Connected! 🎯' : 'Searching for Putter...'}
    </MotiText>
    <Text style={styles.connectionSubtitle}>
      {isConnected ? "You're ready to start putting!" : 'Make sure your PuttQuest putter is powered on and nearby'}
    </Text>
    {!isConnected && (
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Ionicons name="refresh" size={20} color="#FFF" />
        <Text style={styles.retryButtonText}>Search Again</Text>
      </TouchableOpacity>
    )}
    <LottieView source={require('./assets/animations/connection.json')} autoPlay loop={!isConnected} style={styles.connectionAnimation} />
  </View>
);

const HomeScreen = ({ onStartGame, playerStats, putterConnected }) => (
  <View style={styles.homeContainer}>
    <MotiText from={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={styles.title}>PuttQuest</MotiText>
    <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} delay={300} style={[styles.connectionStatus, { backgroundColor: putterConnected ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)' }]}>
      <Ionicons name={putterConnected ? 'checkmark-circle' : 'close-circle'} size={24} color={putterConnected ? '#4CAF50' : '#F44336'} />
      <Text style={styles.connectionStatusText}>{putterConnected ? 'Putter Connected' : 'Putter Disconnected'}</Text>
    </MotiView>
    <View style={styles.statsGrid}>
      <StatCard icon="trophy" value={playerStats.level} label="Level" color="#FFD700" />
      <StatCard icon="star" value={playerStats.xp} label="XP" color="#4CAF50" />
      <StatCard icon="diamond" value={playerStats.coins} label="Coins" color="#2196F3" />
    </View>
    <MotiView from={{ opacity: 0, translateY: 40 }} animate={{ opacity: 1, translateY: 0 }} delay={600}>
      <TouchableOpacity style={[styles.primaryButton, !putterConnected && styles.buttonDisabled]} onPress={onStartGame} disabled={!putterConnected}>
        <Ionicons name="golf" size={24} color="#FFF" />
        <Text style={styles.buttonText}>Start Putting</Text>
      </TouchableOpacity>
    </MotiView>
    <View style={styles.tutorial}>
      <Text style={styles.tutorialTitle}>How to Play:</Text>
      <Text style={styles.tutorialStep}>🏌️ Hold putter naturally and swing</Text>
      <Text style={styles.tutorialStep}>🎯 Watch ball physics in real-time</Text>
      <Text style={styles.tutorialStep}>⭐ Earn XP and coins for good shots</Text>
      <Text style={styles.tutorialStep}>🏆 Level up and unlock new courses</Text>
    </View>
  </View>
);

const StatCard = ({ icon, value, label, color }) => (
  <MotiView from={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={styles.statCard}>
    <Ionicons name={icon} size={24} color={color} />
    <Text style={styles.statNumber}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </MotiView>
);

const GameScreen = ({ appState, playerStats, ballAnimation }) => {
  const interpolatedPosition = {
    x: ballAnimation.interpolate({ inputRange: [0, 1], outputRange: [appState.ballPosition.x, appState.ballPosition.x] }),
    y: ballAnimation.interpolate({ inputRange: [0, 1], outputRange: [appState.ballPosition.y, appState.ballPosition.y] })
  };
  return (
    <View style={styles.gameContainer}>
      <View style={styles.gameHeader}>
        <View style={styles.gameInfo}>
          <Text style={styles.gameInfoText}>Hole #{appState.currentHole}</Text>
          <Text style={styles.gameInfoText}>Strokes: {appState.strokes}</Text>
          <Text style={styles.gameInfoText}>Lvl: {playerStats.level}</Text>
        </View>
      </View>
      <View style={styles.course}>
        <View style={styles.green}>
          <View style={styles.greenPattern} />
        </View>
        <View style={[styles.hole, { left: appState.holePosition.x - 20, top: appState.holePosition.y - 20 }]}>
          <View style={styles.holeInner} />
          <View style={styles.holeFlag}>
            <Ionicons name="flag" size={20} color="#F44336" />
          </View>
        </View>
        <Animated.View style={[styles.ball, { left: interpolatedPosition.x, top: interpolatedPosition.y }]}>
          <View style={styles.ballShine} />
        </Animated.View>
        <View style={styles.swingData}>
          <PowerMeter power={appState.power} />
          <AngleDisplay angle={appState.angle} />
        </View>
      </View>
      <View style={styles.putterStatus}>
        <Ionicons name="hardware-chip" size={20} color="#4CAF50" />
        <Text style={styles.putterStatusText}>{appState.isSwinging ? 'Swinging...' : 'Swing to putt!'}</Text>
      </View>
    </View>
  );
};

const PowerMeter = ({ power }) => (
  <View style={styles.powerMeter}>
    <Text style={styles.meterLabel}>Power</Text>
    <View style={styles.meterBackground}>
      <MotiView style={[styles.meterFill, { width: `${power}%` }, power > 80 ? styles.meterHigh : styles.meterGood]} from={{ width: '0%' }} animate={{ width: `${power}%` }} transition={{ type: 'timing', duration: 100 }} />
    </View>
    <Text style={styles.meterValue}>{Math.round(power)}%</Text>
  </View>
);

const AngleDisplay = ({ angle }) => (
  <View style={styles.angleDisplay}>
    <Text style={styles.meterLabel}>Angle</Text>
    <MotiText style={styles.angleValue} from={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {Math.round(angle)}°
    </MotiText>
  </View>
);

const ResultsScreen = ({ appState, playerStats, onNextHole, onMenu }) => {
  const getScoreData = (strokes) => {
    if (strokes === 1) return { text: 'HOLE IN ONE!', color: '#FFD700', icon: '🏆' };
    if (strokes === 2) return { text: 'BIRDIE!', color: '#4CAF50', icon: '🦅' };
    if (strokes === 3) return { text: 'PAR', color: '#2196F3', icon: '✅' };
    if (strokes === 4) return { text: 'BOGEY', color: '#FF9800', icon: '⛳' };
    return { text: `${strokes - 3} OVER`, color: '#F44336', icon: '🎯' };
  };
  const scoreData = getScoreData(appState.strokes);
  const xpEarned = Math.max(20, 100 - (appState.strokes * 15));
  const coinsEarned = appState.strokes <= 3 ? 50 : 25;
  return (
    <View style={styles.resultsContainer}>
      <MotiView from={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} style={styles.resultsCard}>
        <Text style={styles.resultsTitle}>Hole Complete! {scoreData.icon}</Text>
        <View style={styles.scoreDisplay}>
          <Text style={styles.strokesText}>{appState.strokes} Strokes</Text>
          <MotiText from={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} delay={300} style={[styles.scoreText, { color: scoreData.color }]}>
            {scoreData.text}
          </MotiText>
        </View>
        <View style={styles.rewardsSection}>
          <Text style={styles.rewardsTitle}>Rewards Earned</Text>
          <RewardItem icon="star" text={`+${xpEarned} XP`} color="#FFD700" />
          <RewardItem icon="diamond" text={`+${coinsEarned} Coins`} color="#00BCD4" />
          {appState.strokes === 1 && <RewardItem icon="trophy" text="Hole in One Badge!" color="#FFD700" />}
        </View>
        <View style={styles.resultsActions}>
          <TouchableOpacity style={styles.secondaryButton} onPress={onMenu}>
            <Text style={styles.secondaryButtonText}>Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton} onPress={onNextHole}>
            <Text style={styles.buttonText}>Next Hole</Text>
          </TouchableOpacity>
        </View>
      </MotiView>
    </View>
  );
};

const RewardItem = ({ icon, text, color }) => (
  <MotiView from={{ opacity: 0, translateX: -50 }} animate={{ opacity: 1, translateX: 0 }} style={styles.rewardItem}>
    <Ionicons name={icon} size={20} color={color} />
    <Text style={styles.rewardText}>{text}</Text>
  </MotiView>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1F35' },
  connectionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  connectionIcon: { marginBottom: 30 },
  connectionTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF', marginBottom: 10, textAlign: 'center' },
  connectionSubtitle: { fontSize: 16, color: '#CCC', textAlign: 'center', marginBottom: 30, lineHeight: 22 },
  retryButton: { backgroundColor: '#007AFF', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 20, flexDirection: 'row', alignItems: 'center' },
  retryButtonText: { color: '#FFF', fontWeight: 'bold', marginLeft: 8 },
  connectionAnimation: { width: 200, height: 200, marginTop: 30 },
  homeContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 48, fontWeight: 'bold', color: '#4CAF50', marginBottom: 20 },
  connectionStatus: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginBottom: 40 },
  connectionStatusText: { color: '#FFF', marginLeft: 8, fontSize: 16, fontWeight: '600' },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 40 },
  statCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', padding: 15, borderRadius: 15, alignItems: 'center', marginHorizontal: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  statNumber: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginVertical: 5 },
  statLabel: { color: '#CCC', fontSize: 12, fontWeight: '500' },
  primaryButton: { backgroundColor: '#4CAF50', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 25, flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  buttonDisabled: { backgroundColor: '#666' },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  tutorial: { marginTop: 40, padding: 20, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 15, width: '100%', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  tutorialTitle: { color: '#4CAF50', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  tutorialStep: { color: '#FFF', fontSize: 14, marginBottom: 8, lineHeight: 20 },
  gameContainer: { flex: 1 },
  gameHeader: { paddingTop: 50, paddingHorizontal: 20, backgroundColor: 'rgba(0,0,0,0.3)', paddingBottom: 10 },
  gameInfo: { flexDirection: 'row', justifyContent: 'space-between' },
  gameInfoText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  course: { flex: 1, margin: 20, borderRadius: 20, overflow: 'hidden', backgroundColor: '#2E7D32', borderWidth: 2, borderColor: '#1B5E20' },
  green: { ...StyleSheet.absoluteFillObject, backgroundColor: '#4CAF50' },
  greenPattern: { ...StyleSheet.absoluteFillObject },
  hole: { position: 'absolute', width: 40, height: 40, backgroundColor: '#000', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  holeInner: { width: 30, height: 30, backgroundColor: '#1A1A1A', borderRadius: 15 },
  holeFlag: { position: 'absolute', bottom: 35 },
  ball: { position: 'absolute', width: 30, height: 30, backgroundColor: '#FFF', borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  ballShine: { width: 10, height: 10, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 5, position: 'absolute', top: 5, left: 5 },
  swingData: { position: 'absolute', top: 20, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between' },
  powerMeter: { flex: 2, marginRight: 10 },
  angleDisplay: { flex: 1, alignItems: 'center' },
  meterLabel: { color: '#FFF', fontSize: 14, marginBottom: 5, fontWeight: '600' },
  meterBackground: { height: 20, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  meterFill: { height: '100%', borderRadius: 10 },
  meterGood: { backgroundColor: '#4CAF50' },
  meterHigh: { backgroundColor: '#FF9800' },
  meterValue: { color: '#FFF', fontSize: 12, marginTop: 2, textAlign: 'center', fontWeight: '600' },
  angleValue: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  putterStatus: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 15, backgroundColor: 'rgba(76, 175, 80, 0.2)', margin: 20, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(76, 175, 80, 0.3)' },
  putterStatusText: { color: '#4CAF50', marginLeft: 8, fontWeight: '600' },
  resultsContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: 'rgba(0,0,0,0.7)' },
  resultsCard: { backgroundColor: 'rgba(255,255,255,0.95)', padding: 30, borderRadius: 25, alignItems: 'center', width: '90%' },
  resultsTitle: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 30, textAlign: 'center' },
  scoreDisplay: { alignItems: 'center', marginBottom: 30 },
  strokesText: { fontSize: 18, color: '#666', marginBottom: 10, fontWeight: '600' },
  scoreText: { fontSize: 32, fontWeight: 'bold', textAlign: 'center' },
  rewardsSection: { marginBottom: 30, alignItems: 'center', width: '100%' },
  rewardsTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  rewardItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, paddingHorizontal: 15, paddingVertical: 8, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 10, width: '100%' },
  rewardText: { fontSize: 16, color: '#333', marginLeft: 10, fontWeight: '500' },
  resultsActions: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  secondaryButton: { backgroundColor: '#9E9E9E', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 20, flex: 1, marginRight: 10, alignItems: 'center' },
  secondaryButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});
