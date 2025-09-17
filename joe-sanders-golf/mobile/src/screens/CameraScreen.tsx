import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { analyticsBridge } from '../services/AnalyticsBridge';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(CameraType.back);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const toggleCameraType = () => {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  };

  const startRecording = async () => {
    if (!cameraRef.current || isRecording) return;

    try {
      setIsRecording(true);
      analyticsBridge.trackEvent('swing_recording_started', {
        camera_type: type,
        timestamp: new Date().toISOString(),
      });

      const video = await cameraRef.current.recordAsync({
        quality: '720p',
        maxDuration: 10, // 10 seconds max
      });

      setIsRecording(false);
      await analyzeSwing(video.uri);
    } catch (error) {
      console.error('Recording error:', error);
      setIsRecording(false);
      Alert.alert('Recording Error', 'Failed to record video. Please try again.');
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };

  const analyzeSwing = async (videoUri: string) => {
    setIsAnalyzing(true);
    
    try {
      // Track analysis start
      analyticsBridge.trackEvent('swing_analysis_started', {
        video_duration: 10, // placeholder
        timestamp: new Date().toISOString(),
      });

      // Simulate AI analysis (in real app, this would upload to your API)
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock analysis results
      const analysisResults = {
        swing_speed: Math.floor(Math.random() * 50) + 80, // 80-130 mph
        accuracy: Math.floor(Math.random() * 30) + 70, // 70-100%
        tempo: Math.floor(Math.random() * 20) + 80, // 80-100%
        recommendations: [
          'Keep your head steady throughout the swing',
          'Focus on follow-through',
          'Maintain consistent tempo'
        ]
      };

      setIsAnalyzing(false);

      // Track successful analysis
      analyticsBridge.trackEvent('swing_analysis_completed', {
        swing_speed: analysisResults.swing_speed,
        accuracy: analysisResults.accuracy,
        tempo: analysisResults.tempo,
        timestamp: new Date().toISOString(),
      });

      // Show results
      Alert.alert(
        'Swing Analysis Complete',
        `Swing Speed: ${analysisResults.swing_speed} mph\n` +
        `Accuracy: ${analysisResults.accuracy}%\n` +
        `Tempo: ${analysisResults.tempo}%\n\n` +
        `Recommendations:\n• ${analysisResults.recommendations.join('\n• ')}`,
        [
          { text: 'View in Full Platform', onPress: () => navigateToResults() },
          { text: 'Record Another', style: 'cancel' }
        ]
      );
    } catch (error) {
      console.error('Analysis error:', error);
      setIsAnalyzing(false);
      Alert.alert('Analysis Error', 'Failed to analyze swing. Please try again.');
    }
  };

  const navigateToResults = () => {
    // In a real app, this would navigate to the web platform results page
    analyticsBridge.trackEvent('swing_results_viewed', {
      source: 'mobile_camera',
      timestamp: new Date().toISOString(),
    });
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Ionicons name="camera-off" size={64} color="#666" />
        <Text style={styles.errorText}>No access to camera</Text>
        <Text style={styles.errorSubtext}>
          Please enable camera permissions in your device settings to use swing analysis.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.overlay}>
          {/* Instructions */}
          <View style={styles.instructions}>
            <Text style={styles.instructionText}>
              Position yourself in the frame and record your golf swing
            </Text>
          </View>

          {/* Recording Indicator */}
          {isRecording && (
            <View style={styles.recordingIndicator}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingText}>Recording...</Text>
            </View>
          )}

          {/* Analysis Overlay */}
          {isAnalyzing && (
            <View style={styles.analysisOverlay}>
              <ActivityIndicator size="large" color="#FFD700" />
              <Text style={styles.analysisText}>Analyzing your swing...</Text>
            </View>
          )}

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlButton} onPress={toggleCameraType}>
              <Ionicons name="camera-reverse" size={24} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.recordButton,
                isRecording && styles.recordButtonActive,
                isAnalyzing && styles.recordButtonDisabled
              ]}
              onPress={isRecording ? stopRecording : startRecording}
              disabled={isAnalyzing}
            >
              <Ionicons 
                name={isRecording ? "stop" : "radio-button-on"} 
                size={32} 
                color={isRecording ? "#FF0000" : "#FFD700"} 
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="help-circle" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  instructions: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
    margin: 20,
    borderRadius: 8,
    marginTop: 60,
  },
  instructionText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
  },
  recordingIndicator: {
    position: 'absolute',
    top: 120,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
    marginRight: 8,
  },
  recordingText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  analysisOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  analysisText: {
    color: '#FFF',
    fontSize: 18,
    marginTop: 16,
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 60,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFD700',
  },
  recordButtonActive: {
    borderColor: '#FF0000',
  },
  recordButtonDisabled: {
    opacity: 0.5,
  },
  loadingText: {
    color: '#FFF',
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  errorSubtext: {
    color: '#CCC',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});