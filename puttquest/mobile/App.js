import React, { useState, useEffect, useRef, useCallback } from 'react  useEffect(() => {
   useEffect(() => {
    const initialize = async () => {
      try {
        await loadSounds();
        await loadSavedGame();
        setupSocketConnection();
        
        if (TESTING_MODE) {
          setupPutterSimulatorConnection();
        } else {
          scanForPutter();
        }
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };
    initialize();
    return () => { 
      bleManager.destroy(); 
      if (socket) socket.disconnect(); 
      if (putterSimulatorSocket) putterSimulatorSocket.close();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-depsze = async () => {
      try {
        await loadSounds();
        await loadSavedGame();
        setupSocketConnection();
        
        if (TESTING_MODE) {
          setupPutterSimulatorConnection();
        } else {
          scanForPutter();
        }
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };
    initialize();
    return () => { 
      bleManager.destroy(); 
      if (socket) socket.disconnect(); 
      if (putterSimulatorSocket) putterSimulatorSocket.close();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps Text, StyleSheet, TouchableOpacity, Dimensions, Alert, Animated, Easing } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { Audio } from 'expo-av';
import { MotiView, MotiText } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';
import connectionAnimation from './assets/animations/connection.json';

const { width, height } = Dimensions.get('window');

// Testing mode configuration - set to true to use WebSocket simulator instead of BLE
const TESTING_MODE = true;
const SIMULATOR_URL = 'ws://localhost:8080';

const PUTTER_SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const PUTTER_CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

export default function App() {
  const [appState, setAppState] = useState({
    screen: 'connection',
    putterConnected: false,
    currentHole: 1,
    totalHoles: 18,
    strokes: 0,
    holeStrokes: [], // Array to track strokes per hole
    power: 0,
    angle: 0,
    ballPosition: { x: width * 0.2, y: height * 0.7 },
    holePosition: { x: width * 0.8, y: height * 0.3 },
    isSwinging: false,
    gameId: null,
    userId: null,
    tournamentId: null,
    courseType: 'standard', // standard, premium, desert, mountain
    tournamentScore: 0,
    parTotal: 54, // 3 par per hole
    gameStartTime: null,
    gameEndTime: null
  });

  const [playerStats, setPlayerStats] = useState({
    level: 1,
    xp: 0,
    coins: 100,
    totalPutts: 0,
    accuracy: 0,
    longestPutt: 0,
    gamesPlayed: 0,
    holesInOne: 0,
    achievements: [],
    currentStreak: 0,
    bestStreak: 0,
    totalTournaments: 0,
    parTournaments: 0,
    birdieTournaments: 0,
    eagleTournaments: 0
  });

  const [sounds, setSounds] = useState({});
  const [putterDevice, setPutterDevice] = useState(null);
  const [socket, setSocket] = useState(null);
  const [putterSimulatorSocket, setPutterSimulatorSocket] = useState(null);

  const bleManager = useRef(new BleManager()).current;
  const ballAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const initialize = async () => {
      try {
        await loadSounds();
        await loadSavedGame();
        setupSocketConnection();
        scanForPutter();
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };
    initialize();
    return () => { 
      bleManager.destroy(); 
      if (socket) socket.disconnect(); 
    };
  }, []); // Dependencies are handled inside the effect

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

  const setupSocketConnection = useCallback(() => {
    const url = 'http://localhost:3001';
    const s = io(url, { transports: ['websocket'] });
    s.on('connect', () => setSocket(s));
    s.on('game_joined', (data) => setAppState(prev => ({ ...prev, gameId: data.gameId })));
    s.on('ball_moved', (data) => animateBallMovement(data.newPosition, data.trajectory));
    s.on('error', (data) => Alert.alert('Game Error', data.message));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setupPutterSimulatorConnection = useCallback(() => {
    console.log('🔧 Setting up putter simulator connection...');
    const ws = new WebSocket(SIMULATOR_URL);
    
    ws.onopen = () => {
      console.log('📡 Connected to putter simulator');
      setPutterSimulatorSocket(ws);
      setAppState(prev => ({ ...prev, putterConnected: true, screen: 'home' }));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📨 Received from simulator:', data);
        
        // Handle data directly (no type wrapper for putter data)
        if (data.power !== undefined || data.angle !== undefined || data.swingComplete) {
          handlePutterData(data);
        } else if (data.type === 'putter_connected') {
          setAppState(prev => ({ ...prev, putterConnected: true }));
        } else if (data.type === 'putter_disconnected') {
          setAppState(prev => ({ ...prev, putterConnected: false }));
        }
      } catch (error) {
        console.warn('Error parsing simulator data:', error);
      }
    };
    
    ws.onclose = () => {
      console.log('📡 Disconnected from putter simulator');
      setPutterSimulatorSocket(null);
      setAppState(prev => ({ ...prev, putterConnected: false }));
      
      // Attempt to reconnect after a delay
      setTimeout(() => {
        if (!putterSimulatorSocket) {
          console.log('Attempting to reconnect to simulator...');
          setupPutterSimulatorConnection();
        }
      }, 3000);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const scanForPutter = useCallback(() => {
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) { return; }
      if (device?.name === 'PuttQuest-Putter-V1') {
        bleManager.stopDeviceScan();
        connectToPutter(device);
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const connectToPutter = async (device) => {
    try {
      const connected = await device.connect();
      setPutterDevice(connected);
      await connected.discoverAllServicesAndCharacteristics();
      await setupPutterNotifications(connected);
      setAppState(prev => ({ ...prev, putterConnected: true, screen: 'home' }));
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Monitor connection state
      connected.onDisconnected((error) => {
        console.log('Putter disconnected:', error?.message);
        setPutterDevice(null);
        setAppState(prev => ({ ...prev, putterConnected: false }));
        
        // Attempt to reconnect after a delay
        setTimeout(() => {
          if (!putterDevice) { // Only reconnect if not already connected
            console.log('Attempting to reconnect to putter...');
            scanForPutter();
          }
        }, 3000);
      });
      
    } catch (error) {
      console.error('Connection failed:', error);
      Alert.alert('Connection Failed', 'Could not connect to putter. Please try again.');
    }
  };

  const disconnectPutter = async () => {
    try {
      if (putterDevice) {
        await putterDevice.cancelConnection();
        setPutterDevice(null);
        setAppState(prev => ({ ...prev, putterConnected: false }));
      }
    } catch (error) {
      console.error('Error disconnecting putter:', error);
    }
  };

  const reconnectPutter = () => {
    if (putterDevice) {
      disconnectPutter().then(() => {
        setTimeout(() => scanForPutter(), 1000);
      });
    } else {
      scanForPutter();
    }
  };

  const setupPutterNotifications = async (device) => {
    try {
      await device.monitorCharacteristicForService(
        PUTTER_SERVICE_UUID,
        PUTTER_CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            console.warn('BLE notification error:', error);
            return;
          }
          const data = characteristic?.value;
          if (!data) return;
          handlePutterData(data);
        }
      );
    } catch (error) {
      console.error('Error setting up putter notifications:', error);
    }
  };

  const handlePutterData = (data) => {
    try {
      // Handle different data formats from the putter
      let power = 0;
      let angle = 0;
      let isSwingComplete = false;

      if (typeof data === 'string') {
        if (data.includes('SWING_COMPLETE')) {
          // Format: "SWING_COMPLETE,power,angle"
          const parts = data.split(',');
          if (parts.length >= 3) {
            power = parseFloat(parts[1]) || 0;
            angle = parseFloat(parts[2]) || 0;
            isSwingComplete = true;
          }
        } else if (data.includes(',')) {
          // Format: "power,angle" for real-time data
          const parts = data.split(',');
          power = parseFloat(parts[0]) || 0;
          angle = parseFloat(parts[1]) || 0;
        } else {
          // Try to parse as single number (power only)
          power = parseFloat(data) || 0;
        }
      } else if (typeof data === 'object') {
        // Handle object format if putter sends JSON
        power = data.power || 0;
        angle = data.angle || 0;
        isSwingComplete = data.swingComplete || false;
      }

      // Validate and clamp values
      power = Math.max(0, Math.min(100, power));
      angle = Math.max(-180, Math.min(180, angle));

      if (isSwingComplete) {
        handleSwingComplete(power, angle);
      } else {
        // Update real-time swing data
        setAppState(prev => ({
          ...prev,
          power,
          angle,
          isSwinging: power > 10 // Consider swinging if power > 10%
        }));
      }
    } catch (error) {
      console.warn('Error parsing putter data:', error, data);
    }
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
      
      const holeScore = appState.strokes;
      const newHoleStrokes = [...appState.holeStrokes, holeScore];
      const newTournamentScore = appState.tournamentScore + holeScore;
      
      const xpEarned = Math.max(20, 100 - (holeScore * 15));
      const coinsEarned = holeScore <= 3 ? 50 : 25;
      
      setPlayerStats(prev => ({
        ...prev,
        xp: prev.xp + xpEarned,
        coins: prev.coins + coinsEarned,
        totalPutts: prev.totalPutts + holeScore,
        holesInOne: holeScore === 1 ? prev.holesInOne + 1 : prev.holesInOne,
        gamesPlayed: appState.currentHole === appState.totalHoles ? prev.gamesPlayed + 1 : prev.gamesPlayed
      }));
      
      if (appState.currentHole >= appState.totalHoles) {
        // Tournament complete - update tournament stats
        const scoreDiff = newTournamentScore - appState.parTotal;
        const isPar = scoreDiff <= 2 && scoreDiff >= -2;
        const isBirdie = scoreDiff <= -2 && scoreDiff >= -5;
        const isEagle = scoreDiff <= -5;
        
        setPlayerStats(prev => {
          const newStats = {
            ...prev,
            totalTournaments: prev.totalTournaments + 1,
            parTournaments: isPar ? prev.parTournaments + 1 : prev.parTournaments,
            birdieTournaments: isBirdie ? prev.birdieTournaments + 1 : prev.birdieTournaments,
            eagleTournaments: isEagle ? prev.eagleTournaments + 1 : prev.eagleTournaments
          };
          
          // Check for new achievements
          const newAchievements = checkAchievements(prev, newStats);
          if (newAchievements.length > 0) {
            newStats.achievements = [...prev.achievements, ...newAchievements];
          }
          
          return newStats;
        });
        
        setAppState(prev => ({
          ...prev,
          holeStrokes: newHoleStrokes,
          tournamentScore: newTournamentScore,
          gameEndTime: Date.now(),
          screen: 'tournamentComplete'
        }));
      } else {
        // Next hole
        setAppState(prev => ({
          ...prev,
          holeStrokes: newHoleStrokes,
          tournamentScore: newTournamentScore,
          screen: 'results'
        }));
      }
      
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

  const checkAchievements = (stats, newStats) => {
    const newAchievements = [];
    
    // Hole in One Master
    if (newStats.holesInOne >= 1 && !stats.achievements.includes('hole_in_one')) {
      newAchievements.push('hole_in_one');
    }
    if (newStats.holesInOne >= 5 && !stats.achievements.includes('hole_in_one_master')) {
      newAchievements.push('hole_in_one_master');
    }
    
    // Tournament Achievements
    if (newStats.totalTournaments >= 1 && !stats.achievements.includes('first_tournament')) {
      newAchievements.push('first_tournament');
    }
    if (newStats.parTournaments >= 1 && !stats.achievements.includes('par_tournament')) {
      newAchievements.push('par_tournament');
    }
    if (newStats.birdieTournaments >= 1 && !stats.achievements.includes('birdie_tournament')) {
      newAchievements.push('birdie_tournament');
    }
    if (newStats.eagleTournaments >= 1 && !stats.achievements.includes('eagle_tournament')) {
      newAchievements.push('eagle_tournament');
    }
    
    // Streak Achievements
    if (newStats.bestStreak >= 3 && !stats.achievements.includes('streak_3')) {
      newAchievements.push('streak_3');
    }
    if (newStats.bestStreak >= 5 && !stats.achievements.includes('streak_5')) {
      newAchievements.push('streak_5');
    }
    
    // Level Achievements
    if (newStats.level >= 5 && !stats.achievements.includes('level_5')) {
      newAchievements.push('level_5');
    }
    if (newStats.level >= 10 && !stats.achievements.includes('level_10')) {
      newAchievements.push('level_10');
    }
    
    return newAchievements;
  };

  const startTournament = (courseType) => {
    setAppState(prev => ({
      ...prev,
      screen: 'playing',
      courseType,
      currentHole: 1,
      totalHoles: 18,
      strokes: 0,
      holeStrokes: [],
      power: 0,
      angle: 0,
      ballPosition: { x: width * 0.2, y: height * 0.7 },
      holePosition: { x: Math.random() * (width - 100) + 50, y: Math.random() * (height - 250) + 50 },
      isSwinging: false,
      tournamentScore: 0,
      parTotal: 54, // 3 par per hole
      gameStartTime: Date.now(),
      gameEndTime: null
    }));
    saveGame();
  };

  return (
    <View style={styles.container}>
      {appState.screen === 'connection' && (
        <ConnectionScreen 
          onRetry={TESTING_MODE ? setupPutterSimulatorConnection : scanForPutter} 
          isConnected={appState.putterConnected} 
        />
      )}
      {appState.screen === 'home' && (
        <HomeScreen onStartTournament={startTournament} playerStats={playerStats} putterConnected={appState.putterConnected} />
      )}
      {appState.screen === 'playing' && (
        <GameScreen appState={appState} playerStats={playerStats} ballAnimation={ballAnimation} />
      )}
      {appState.screen === 'results' && (
        <ResultsScreen appState={appState} playerStats={playerStats} onNextHole={startNewHole} onMenu={() => setAppState(prev => ({ ...prev, screen: 'home' }))} />
      )}
      {appState.screen === 'tournamentComplete' && (
        <TournamentCompleteScreen appState={appState} playerStats={playerStats} onMenu={() => setAppState(prev => ({ ...prev, screen: 'home' }))} onPlayAgain={() => startTournament(appState.courseType)} />
      )}
      {appState.screen === 'leaderboard' && (
        <LeaderboardScreen playerStats={playerStats} onMenu={() => setAppState(prev => ({ ...prev, screen: 'home' }))} />
      )}
    </View>
  );
}

const ConnectionScreen = ({ onRetry, isConnected }) => (
  <View style={styles.connectionContainer}>
    <MotiView from={{ rotate: '0deg' }} animate={{ rotate: isConnected ? '0deg' : '360deg' }} transition={{ type: 'timing', duration: 2000, loop: !isConnected }} style={styles.connectionIcon}>
      <Ionicons name={TESTING_MODE ? "desktop" : "bluetooth"} size={80} color={isConnected ? '#4CAF50' : '#007AFF'} />
    </MotiView>
    <MotiText from={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.connectionTitle}>
      {isConnected ? 'Simulator Connected! 🎯' : 'Connecting to Simulator...'}
    </MotiText>
    <Text style={styles.connectionSubtitle}>
      {isConnected ? "You're ready to start putting!" : 'Make sure the putter simulator is running on localhost:8080'}
    </Text>
    {!isConnected && (
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Ionicons name="refresh" size={20} color="#FFF" />
        <Text style={styles.retryButtonText}>Retry Connection</Text>
      </TouchableOpacity>
    )}
    <LottieView source={connectionAnimation} autoPlay loop={!isConnected} style={styles.connectionAnimation} />
  </View>
);

const HomeScreen = ({ onStartTournament, playerStats, putterConnected }) => (
  <View style={styles.homeContainer}>
    <MotiText from={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={styles.title}>PuttQuest</MotiText>
    <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} delay={300} style={[styles.connectionStatus, { backgroundColor: putterConnected ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)' }]}>
      <Ionicons name={putterConnected ? 'checkmark-circle' : 'close-circle'} size={24} color={putterConnected ? '#4CAF50' : '#F44336'} />
      <Text style={styles.connectionStatusText}>{putterConnected ? (TESTING_MODE ? 'Simulator Connected' : 'Putter Connected') : (TESTING_MODE ? 'Simulator Disconnected' : 'Putter Disconnected')}</Text>
    </MotiView>
    <View style={styles.statsGrid}>
      <StatCard icon="trophy" value={playerStats.level} label="Level" color="#FFD700" />
      <StatCard icon="star" value={playerStats.xp} label="XP" color="#4CAF50" />
      <StatCard icon="diamond" value={playerStats.coins} label="Coins" color="#2196F3" />
    </View>
    <View style={styles.courseSelection}>
      <Text style={styles.courseTitle}>Choose Course:</Text>
      <View style={styles.courseButtons}>
        <TouchableOpacity style={styles.courseButton} onPress={() => onStartTournament('standard')}>
          <Ionicons name="leaf" size={24} color="#4CAF50" />
          <Text style={styles.courseButtonText}>Standard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.courseButton} onPress={() => onStartTournament('premium')}>
          <Ionicons name="diamond" size={24} color="#FFD700" />
          <Text style={styles.courseButtonText}>Premium</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.courseButton} onPress={() => onStartTournament('desert')}>
          <Ionicons name="sunny" size={24} color="#FF9800" />
          <Text style={styles.courseButtonText}>Desert</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.courseButton} onPress={() => onStartTournament('mountain')}>
          <Ionicons name="snow" size={24} color="#2196F3" />
          <Text style={styles.courseButtonText}>Mountain</Text>
        </TouchableOpacity>
      </View>
    </View>
    <View style={styles.tutorial}>
      <Text style={styles.tutorialTitle}>How to Play:</Text>
      <Text style={styles.tutorialStep}>🏌️ Hold putter naturally and swing</Text>
      <Text style={styles.tutorialStep}>🎯 Watch ball physics in real-time</Text>
      <Text style={styles.tutorialStep}>⭐ Earn XP and coins for good shots</Text>
      <Text style={styles.tutorialStep}>🏆 Level up and unlock new courses</Text>
    </View>
    
    <TouchableOpacity style={styles.leaderboardButton} onPress={() => setAppState(prev => ({ ...prev, screen: 'leaderboard' }))}>
      <Ionicons name="trophy" size={20} color="#FFD700" />
      <Text style={styles.leaderboardButtonText}>View Leaderboard</Text>
    </TouchableOpacity>
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

const TournamentCompleteScreen = ({ appState, playerStats, onMenu, onPlayAgain }) => {
  const totalScore = appState.tournamentScore;
  const parScore = appState.parTotal;
  const scoreDiff = totalScore - parScore;
  const gameTime = appState.gameEndTime - appState.gameStartTime;
  const minutes = Math.floor(gameTime / 60000);
  const seconds = Math.floor((gameTime % 60000) / 1000);
  
  const getTournamentResult = () => {
    if (scoreDiff <= -5) return { text: 'EAGLE TOURNAMENT!', color: '#FFD700', icon: '🏆' };
    if (scoreDiff <= -2) return { text: 'BIRDIE TOURNAMENT!', color: '#4CAF50', icon: '🦅' };
    if (scoreDiff <= 2) return { text: 'PAR TOURNAMENT', color: '#2196F3', icon: '✅' };
    if (scoreDiff <= 5) return { text: 'BOGEY TOURNAMENT', color: '#FF9800', icon: '⛳' };
    return { text: `${scoreDiff} OVER PAR`, color: '#F44336', icon: '🎯' };
  };
  
  const result = getTournamentResult();
  const totalXpEarned = appState.holeStrokes.reduce((sum, strokes) => sum + Math.max(20, 100 - (strokes * 15)), 0);
  const totalCoinsEarned = appState.holeStrokes.reduce((sum, strokes) => sum + (strokes <= 3 ? 50 : 25), 0);
  
  // Get achievement names for display
  const getAchievementName = (achievementId) => {
    const achievementNames = {
      'hole_in_one': 'First Hole in One!',
      'hole_in_one_master': 'Hole in One Master!',
      'first_tournament': 'First Tournament!',
      'par_tournament': 'Par Tournament!',
      'birdie_tournament': 'Birdie Tournament!',
      'eagle_tournament': 'Eagle Tournament!',
      'streak_3': '3 Hole Streak!',
      'streak_5': '5 Hole Streak!',
      'level_5': 'Level 5 Reached!',
      'level_10': 'Level 10 Reached!'
    };
    return achievementNames[achievementId] || achievementId;
  };
  
  return (
    <View style={styles.tournamentCompleteContainer}>
      <MotiView from={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} style={styles.tournamentCompleteCard}>
        <Text style={styles.tournamentCompleteTitle}>Tournament Complete! {result.icon}</Text>
        
        <View style={styles.tournamentStats}>
          <View style={styles.tournamentStat}>
            <Text style={styles.tournamentStatLabel}>Final Score</Text>
            <Text style={styles.tournamentStatValue}>{totalScore}</Text>
          </View>
          <View style={styles.tournamentStat}>
            <Text style={styles.tournamentStatLabel}>Par</Text>
            <Text style={styles.tournamentStatValue}>{parScore}</Text>
          </View>
          <View style={styles.tournamentStat}>
            <Text style={styles.tournamentStatLabel}>Time</Text>
            <Text style={styles.tournamentStatValue}>{minutes}:{seconds.toString().padStart(2, '0')}</Text>
          </View>
        </View>
        
        <MotiText from={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} delay={300} style={[styles.tournamentResultText, { color: result.color }]}>
          {result.text}
        </MotiText>
        
        <View style={styles.holeBreakdown}>
          <Text style={styles.breakdownTitle}>Hole Scores:</Text>
          <View style={styles.holeScores}>
            {appState.holeStrokes.map((strokes, index) => (
              <View key={index} style={styles.holeScore}>
                <Text style={styles.holeNumber}>{index + 1}</Text>
                <Text style={styles.holeStrokes}>{strokes}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.tournamentRewards}>
          <Text style={styles.rewardsTitle}>Tournament Rewards</Text>
          <RewardItem icon="star" text={`+${totalXpEarned} XP`} color="#FFD700" />
          <RewardItem icon="diamond" text={`+${totalCoinsEarned} Coins`} color="#00BCD4" />
          {appState.holeStrokes.filter(s => s === 1).length > 0 && (
            <RewardItem icon="trophy" text={`${appState.holeStrokes.filter(s => s === 1).length} Hole(s) in One!`} color="#FFD700" />
          )}
        </View>
        
        {playerStats.achievements && playerStats.achievements.length > 0 && (
          <View style={styles.achievementsSection}>
            <Text style={styles.rewardsTitle}>Achievements Unlocked</Text>
            {playerStats.achievements.slice(-3).map((achievement, index) => (
              <RewardItem key={index} icon="trophy" text={getAchievementName(achievement)} color="#FFD700" />
            ))}
          </View>
        )}
        
        <View style={styles.tournamentActions}>
          <TouchableOpacity style={styles.secondaryButton} onPress={onMenu}>
            <Text style={styles.secondaryButtonText}>Main Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton} onPress={onPlayAgain}>
            <Ionicons name="refresh" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      </MotiView>
    </View>
  );
};

const LeaderboardScreen = ({ playerStats, onMenu }) => {
  // Mock leaderboard data - in a real app this would come from the server
  const leaderboardData = [
    { name: 'You', score: playerStats.totalTournaments > 0 ? Math.round(playerStats.totalTournaments * 54 / playerStats.totalTournaments) : 0, level: playerStats.level, rank: 1 },
    { name: 'Pro Golfer', score: 52, level: 15, rank: 2 },
    { name: 'Course Master', score: 55, level: 12, rank: 3 },
    { name: 'Putt Master', score: 58, level: 10, rank: 4 },
    { name: 'Beginner', score: 65, level: 5, rank: 5 }
  ].sort((a, b) => a.score - b.score);
  
  return (
    <View style={styles.leaderboardContainer}>
      <View style={styles.leaderboardHeader}>
        <Text style={styles.leaderboardTitle}>Leaderboard</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onMenu}>
          <Ionicons name="close" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.leaderboardStats}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{playerStats.totalTournaments}</Text>
          <Text style={styles.statLabel}>Tournaments</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{playerStats.holesInOne}</Text>
          <Text style={styles.statLabel}>Holes in One</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{playerStats.level}</Text>
          <Text style={styles.statLabel}>Level</Text>
        </View>
      </View>
      
      <View style={styles.leaderboardList}>
        {leaderboardData.map((player, index) => (
          <View key={index} style={[styles.leaderboardItem, player.name === 'You' && styles.currentPlayer]}>
            <Text style={styles.rank}>#{player.rank}</Text>
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.playerLevel}>Level {player.level}</Text>
            </View>
            <Text style={styles.playerScore}>{player.score}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.achievementsPreview}>
        <Text style={styles.achievementsTitle}>Your Achievements</Text>
        <View style={styles.achievementBadges}>
          {playerStats.achievements && playerStats.achievements.slice(0, 6).map((achievement, index) => (
            <View key={index} style={styles.achievementBadge}>
              <Ionicons name="trophy" size={20} color="#FFD700" />
            </View>
          ))}
        </View>
      </View>
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
  secondaryButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  courseSelection: { marginBottom: 30, alignItems: 'center', width: '100%' },
  courseTitle: { color: '#4CAF50', fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  courseButtons: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  courseButton: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 15, borderRadius: 15, alignItems: 'center', margin: 5, minWidth: 80, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  courseButtonText: { color: '#FFF', fontSize: 12, fontWeight: '600', marginTop: 5 },
  tournamentCompleteContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: 'rgba(0,0,0,0.8)' },
  tournamentCompleteCard: { backgroundColor: 'rgba(255,255,255,0.95)', padding: 30, borderRadius: 25, alignItems: 'center', width: '95%', maxHeight: '90%' },
  tournamentCompleteTitle: { fontSize: 32, fontWeight: 'bold', color: '#333', marginBottom: 30, textAlign: 'center' },
  tournamentStats: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 20 },
  tournamentStat: { alignItems: 'center' },
  tournamentStatLabel: { color: '#666', fontSize: 14, fontWeight: '600' },
  tournamentStatValue: { color: '#333', fontSize: 24, fontWeight: 'bold' },
  tournamentResultText: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  holeBreakdown: { marginBottom: 20, width: '100%' },
  breakdownTitle: { color: '#333', fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  holeScores: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  holeScore: { alignItems: 'center', margin: 5, padding: 8, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 8 },
  holeNumber: { color: '#666', fontSize: 12, fontWeight: 'bold' },
  holeStrokes: { color: '#333', fontSize: 16, fontWeight: 'bold' },
  tournamentRewards: { marginBottom: 30, alignItems: 'center', width: '100%' },
  achievementsSection: { marginBottom: 30, alignItems: 'center', width: '100%' },
  tournamentActions: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  leaderboardButton: { backgroundColor: 'rgba(255,215,0,0.2)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,215,0,0.3)' },
  leaderboardButtonText: { color: '#FFD700', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
  leaderboardContainer: { flex: 1, backgroundColor: '#0A1F35' },
  leaderboardHeader: { paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  leaderboardTitle: { color: '#4CAF50', fontSize: 28, fontWeight: 'bold' },
  closeButton: { padding: 10 },
  leaderboardStats: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 20, marginBottom: 30 },
  statBox: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 15, borderRadius: 15, alignItems: 'center', minWidth: 80, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  leaderboardList: { paddingHorizontal: 20 },
  leaderboardItem: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 15, borderRadius: 10, flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  currentPlayer: { backgroundColor: 'rgba(76, 175, 80, 0.2)', borderColor: 'rgba(76, 175, 80, 0.3)' },
  rank: { color: '#FFD700', fontSize: 18, fontWeight: 'bold', width: 40, textAlign: 'center' },
  playerInfo: { flex: 1 },
  playerName: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  playerLevel: { color: '#CCC', fontSize: 12 },
  playerScore: { color: '#4CAF50', fontSize: 18, fontWeight: 'bold', width: 50, textAlign: 'center' },
  achievementsPreview: { padding: 20, marginTop: 20 },
  achievementsTitle: { color: '#4CAF50', fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  achievementBadges: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' },
  achievementBadge: { backgroundColor: 'rgba(255,215,0,0.2)', padding: 10, borderRadius: 25, margin: 5, borderWidth: 1, borderColor: 'rgba(255,215,0,0.3)' }
});
