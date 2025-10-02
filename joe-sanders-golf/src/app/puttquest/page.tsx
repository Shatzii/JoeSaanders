'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as handPose from '@tensorflow-models/handpose';

// Extend DeviceOrientationEvent for iOS permission API
declare global {
  interface DeviceOrientationEvent {
    requestPermission?: () => Promise<'granted' | 'denied'>;
  }
}

interface OrientationData {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Hole {
  x: number;
  y: number;
  radius: number;
}

const PuttQuest = () => {
  const [orientation, setOrientation] = useState<OrientationData>({
    alpha: null,
    beta: null,
    gamma: null,
  });
  const [isSupported, setIsSupported] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [ball, setBall] = useState<Ball>({ x: 100, y: 300, vx: 0, vy: 0 });
  const [hole] = useState<Hole>({ x: 300, y: 200, radius: 15 });
  const [score, setScore] = useState(0);
  const [putts, setPutts] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [vibrationSupported, setVibrationSupported] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [poseDetector, setPoseDetector] = useState<poseDetection.PoseDetector | null>(null);
  const [handDetector, setHandDetector] = useState<any>(null);
  const [puttingLine, setPuttingLine] = useState<{start: {x: number, y: number}, end: {x: number, y: number}} | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Haptic feedback functions
  const vibrateOnPutt = useCallback(() => {
    if (vibrationSupported && 'vibrate' in navigator) {
      navigator.vibrate(50); // Short vibration for putt
    }
  }, [vibrationSupported]);

  const vibrateOnHoleInOne = useCallback(() => {
    if (vibrationSupported && 'vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 200]); // Pattern for success
    }
  }, [vibrationSupported]);

  // Initialize Web Audio API
  useEffect(() => {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(ctx);
    }
  }, []);

  // Audio functions
  const playPuttSound = useCallback(() => {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }, [audioContext]);

  const playHoleInOneSound = useCallback(() => {
    if (!audioContext) return;

    // Create a celebratory sound with multiple tones
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C (C major chord)

    notes.forEach((frequency, index) => {
      setTimeout(() => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      }, index * 100);
    });
  }, [audioContext]);

  // Initialize TensorFlow.js and computer vision models
  useEffect(() => {
    const initComputerVision = async () => {
      try {
        await tf.ready();
        
        // Initialize pose detector for body tracking
        const detector = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
        );
        setPoseDetector(detector);

        // Initialize hand detector for grip analysis
        const handDetectorInstance = await handPose.load();
        setHandDetector(handDetectorInstance);
      } catch (error) {
        console.error('Failed to initialize computer vision:', error);
      }
    };

    initComputerVision();
  }, []);

  // Initialize camera
  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 640, height: 480 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraEnabled(true);
        startPoseDetection();
      }
    } catch (error) {
      console.error('Failed to access camera:', error);
      alert('Camera access is required for computer vision features');
    }
  };

  // Start pose detection for putting analysis
  const startPoseDetection = useCallback(() => {
    if (!poseDetector || !videoRef.current) return;

    const detectPoses = async () => {
      if (!videoRef.current || !poseDetector) return;

      try {
        const poses = await poseDetector.estimatePoses(videoRef.current);
        
        if (poses.length > 0) {
          const pose = poses[0];
          analyzePuttingStance(pose);
        }
      } catch (error) {
        console.error('Pose detection error:', error);
      }

      requestAnimationFrame(detectPoses);
    };

    detectPoses();
  }, [poseDetector]);

  // Analyze putting stance and predict putting line
  const analyzePuttingStance = (pose: poseDetection.Pose) => {
    // Extract key points for putting analysis
    const leftShoulder = pose.keypoints.find(kp => kp.name === 'left_shoulder');
    const rightShoulder = pose.keypoints.find(kp => kp.name === 'right_shoulder');
    const leftHip = pose.keypoints.find(kp => kp.name === 'left_hip');
    const rightHip = pose.keypoints.find(kp => kp.name === 'right_hip');
    const nose = pose.keypoints.find(kp => kp.name === 'nose');

    if (leftShoulder && rightShoulder && leftHip && rightHip && nose) {
      // Calculate shoulder alignment (aiming direction)
      const shoulderCenter = {
        x: (leftShoulder.x + rightShoulder.x) / 2,
        y: (leftShoulder.y + rightShoulder.y) / 2
      };

      // Calculate hip alignment
      const hipCenter = {
        x: (leftHip.x + rightHip.x) / 2,
        y: (leftHip.y + rightHip.y) / 2
      };

      // Predict putting line based on body alignment
      const puttingDirection = {
        x: shoulderCenter.x - hipCenter.x,
        y: shoulderCenter.y - hipCenter.y
      };

      // Normalize and extend the line
      const length = Math.sqrt(puttingDirection.x ** 2 + puttingDirection.y ** 2);
      const normalizedDir = {
        x: puttingDirection.x / length,
        y: puttingDirection.y / length
      };

      setPuttingLine({
        start: { x: nose.x, y: nose.y },
        end: {
          x: nose.x + normalizedDir.x * 200,
          y: nose.y + normalizedDir.y * 200
        }
      });
    }
  };

  // Check if Device Orientation API is supported
  useEffect(() => {
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      setIsSupported(true);
    }
  }, []);

  // Handle device orientation changes
  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    setOrientation({
      alpha: event.alpha,
      beta: event.beta,
      gamma: event.gamma,
    });
  }, []);

  // Request permission for iOS devices
  const requestPermission = async () => {
    // TypeScript doesn't include requestPermission in DeviceOrientationEvent interface
    // but it's available on iOS Safari for requesting motion sensor permission
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const eventCtor = DeviceOrientationEvent as any;
    if (typeof eventCtor.requestPermission === 'function') {
      try {
        const permission = await eventCtor.requestPermission();
        if (permission === 'granted') {
          setPermissionGranted(true);
          window.addEventListener('deviceorientation', handleOrientation);
        }
      } catch (error) {
        console.error('Error requesting device orientation permission:', error);
      }
    } else {
      // For non-iOS devices, permission is automatic
      setPermissionGranted(true);
      window.addEventListener('deviceorientation', handleOrientation);
    }
  };

  // Start game
  const startGame = () => {
    setGameStarted(true);
    setBall({ x: 100, y: 300, vx: 0, vy: 0 });
    setScore(0);
    setPutts(0);
    setGameWon(false);
  };

  // Handle putting (detect swing motion)
  const handlePutt = useCallback(() => {
    if (!orientation.beta || !orientation.gamma) return;

    // Use gamma (left-right tilt) and beta (front-back tilt) for putting direction and power
    const power = Math.abs(orientation.beta) * 0.5; // Front-back tilt for power
    const angle = (orientation.gamma * Math.PI) / 180; // Left-right tilt for direction

    setBall(prev => ({
      ...prev,
      vx: Math.sin(angle) * power,
      vy: -Math.cos(angle) * power, // Negative because canvas y increases downward
    }));

    setPutts(prev => prev + 1);
    playPuttSound();
    vibrateOnPutt();
  }, [orientation, playPuttSound, vibrateOnPutt]);

  // Game physics and collision detection
  useEffect(() => {
    if (!gameStarted || gameWon) return;

    const gameLoop = setInterval(() => {
      setBall(prev => {
        const newBall = { ...prev };

        // Apply physics
        newBall.x += newBall.vx;
        newBall.y += newBall.vy;

        // Friction
        newBall.vx *= 0.98;
        newBall.vy *= 0.98;

        // Boundary collision
        if (newBall.x < 10 || newBall.x > 390) {
          newBall.vx *= -0.8;
          newBall.x = Math.max(10, Math.min(390, newBall.x));
        }
        if (newBall.y < 10 || newBall.y > 390) {
          newBall.vy *= -0.8;
          newBall.y = Math.max(10, Math.min(390, newBall.y));
        }

        // Hole detection
        const distance = Math.sqrt(
          Math.pow(newBall.x - hole.x, 2) + Math.pow(newBall.y - hole.y, 2)
        );

        if (distance < hole.radius) {
          setGameWon(true);
          setScore(prev => prev + (10 - putts)); // Bonus points for fewer putts
          playHoleInOneSound();
          vibrateOnHoleInOne();
        }

        return newBall;
      });
    }, 16); // ~60 FPS

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameWon, hole, putts, playHoleInOneSound, vibrateOnHoleInOne]);

  // Cleanup event listener
  useEffect(() => {
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [handleOrientation]);

  if (!isSupported) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-800 via-red-600 to-red-800 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-red-300 mb-4">
            PuttQuest
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Device Orientation Not Supported
          </p>
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
            <p className="text-white/80">
              Sorry, your device doesn&apos;t support the motion sensors needed for PuttQuest.
              Try using a mobile device with gyroscope support.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!permissionGranted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-800 via-blue-600 to-blue-800 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-blue-300 mb-4">
            PuttQuest
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Motion-Controlled Mini Golf
          </p>
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
            <p className="text-white/80 mb-4">
              PuttQuest uses your phone&apos;s motion sensors for an immersive golf experience.
            </p>
            <button
              onClick={requestPermission}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              Enable Motion Controls
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-600 to-green-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-300 mb-2">
            PuttQuest
          </h1>
          <p className="text-white/90">
            Tilt your phone to aim and putt!
          </p>
        </div>

        {!gameStarted ? (
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl max-w-md mx-auto">
              <h2 className="text-2xl font-bold mb-4">How to Play</h2>
              <ul className="text-left text-white/80 space-y-2 mb-6">
                <li>• Enable camera for AI putting line prediction</li>
                <li>• Tilt your phone left/right to aim</li>
                <li>• Tilt forward/backward for power</li>
                <li>• Tap &quot;Putt!&quot; when ready</li>
                <li>• Get the ball in the hole with fewest putts</li>
              </ul>
              <div className="space-y-4">
                <button
                  onClick={initializeCamera}
                  disabled={cameraEnabled}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 w-full"
                >
                  {cameraEnabled ? 'Camera Enabled ✓' : 'Enable AI Camera'}
                </button>
                <button
                  onClick={startGame}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 w-full"
                >
                  Start Game
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {/* Game Stats */}
            <div className="flex justify-between mb-4 text-white/90">
              <span>Putts: {putts}</span>
              <span>Score: {score}</span>
            </div>

            {/* Game Canvas */}
            <div className="bg-green-400 rounded-lg p-4 shadow-lg relative">
              {/* Camera Video Background */}
              {cameraEnabled && (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover rounded"
                />
              )}
              
              {/* AR Overlay */}
              <svg width="400" height="400" className="absolute inset-0 border-2 border-green-600 rounded">
                {/* Grass texture overlay when no camera */}
                {!cameraEnabled && (
                  <>
                    <defs>
                      <pattern id="grass" patternUnits="userSpaceOnUse" width="20" height="20">
                        <rect width="20" height="20" fill="#22c55e"/>
                        <circle cx="5" cy="5" r="1" fill="#16a34a"/>
                        <circle cx="15" cy="15" r="1" fill="#16a34a"/>
                      </pattern>
                    </defs>
                    <rect width="400" height="400" fill="url(#grass)"/>
                  </>
                )}

                {/* AR Putting Line Prediction */}
                {puttingLine && cameraEnabled && (
                  <line
                    x1={puttingLine.start.x}
                    y1={puttingLine.start.y}
                    x2={puttingLine.end.x}
                    y2={puttingLine.end.y}
                    stroke="yellow"
                    strokeWidth="3"
                    strokeDasharray="10,5"
                    opacity="0.8"
                  />
                )}

                {/* Hole */}
                <circle
                  cx={hole.x}
                  cy={hole.y}
                  r={hole.radius}
                  fill="black"
                  stroke="white"
                  strokeWidth="2"
                />

                {/* Ball */}
                <circle
                  cx={ball.x}
                  cy={ball.y}
                  r="8"
                  fill="white"
                  stroke="#374151"
                  strokeWidth="1"
                />

                {/* AI Status Indicator */}
                {cameraEnabled && (
                  <text x="10" y="30" fill="white" fontSize="12" fontWeight="bold">
                    🤖 AI Vision Active
                  </text>
                )}
              </svg>
            </div>

            {/* Controls */}
            <div className="mt-4 text-center">
              <button
                onClick={handlePutt}
                disabled={Math.abs(ball.vx) > 0.1 || Math.abs(ball.vy) > 0.1}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 mr-4"
              >
                Putt!
              </button>
              <button
                onClick={startGame}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
              >
                Reset
              </button>
            </div>

            {/* Orientation Debug */}
            <div className="mt-4 text-center text-xs text-white/60">
              Beta: {orientation.beta?.toFixed(1)}° | Gamma: {orientation.gamma?.toFixed(1)}°
            </div>

            {gameWon && (
              <div className="mt-4 text-center">
                <div className="bg-yellow-600 text-white p-4 rounded-lg">
                  <h3 className="text-xl font-bold">Hole in One!</h3>
                  <p>Score: {score} | Putts: {putts}</p>
                  <button
                    onClick={startGame}
                    className="mt-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                  >
                    Play Again
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PuttQuest;
