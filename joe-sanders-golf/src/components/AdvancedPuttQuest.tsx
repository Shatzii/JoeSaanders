'use client';
import React, { useRef, useState, useEffect, useCallback, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, usePlane, useSphere, useBox } from '@react-three/cannon';
import { OrbitControls, Text, Html, Sky } from '@react-three/drei';
import * as THREE from 'three';
import { Mesh, Vector3 } from 'three';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
// import * as handPose from '@tensorflow-models/handpose';

// Advanced Physics Ball Component
function Ball({ position, onBallStop }: { position: [number, number, number], onBallStop: () => void }) {
  const [ref, api] = useSphere<THREE.Mesh>(() => ({
    mass: 0.045, // Golf ball mass in kg
    position,
    material: {
      friction: 0.3,
      restitution: 0.8,
    },
  }));

  const [velocity, setVelocity] = useState([0, 0, 0]);

  useEffect(() => {
    const unsubscribe = api.velocity.subscribe((v) => setVelocity(v));
    return unsubscribe;
  }, [api]);

  useEffect(() => {
    const speed = Math.sqrt(velocity[0] ** 2 + velocity[1] ** 2 + velocity[2] ** 2);
    if (speed < 0.1) {
      onBallStop();
    }
  }, [velocity, onBallStop]);

  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[0.021, 32, 32]} /> {/* Golf ball radius */}
      <meshStandardMaterial color="white" />
    </mesh>
  );
}

// Advanced Physics Ground Component
function Ground() {
  const [ref] = usePlane<THREE.Mesh>(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.1, 0],
    material: {
      friction: 0.4,
      restitution: 0.3,
    },
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#4ade80" />
    </mesh>
  );
}

// Hole Component
function Hole({ position }: { position: [number, number, number] }) {
  const [ref] = useBox<THREE.Mesh>(() => ({
    position,
    args: [0.1, 0.05, 0.1], // Hole dimensions
    type: 'Static',
  }));

  return (
    <mesh ref={ref}>
      <boxGeometry args={[0.1, 0.05, 0.1]} />
      <meshStandardMaterial color="black" />
    </mesh>
  );
}

// Terrain with Hills and Rough
function Terrain() {
  const [ref] = usePlane<THREE.Mesh>(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.05, 0],
    material: {
      friction: 0.6,
      restitution: 0.2,
    },
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[50, 50, 32, 32]} />
      <meshStandardMaterial color="#22c55e" wireframe={false} />
    </mesh>
  );
}

// Wind Effect Component
function WindEffect({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <Html center>
      <div className="bg-blue-500/80 text-white px-4 py-2 rounded-lg">
        💨 Wind Active: 5 mph NW
      </div>
    </Html>
  );
}

// Advanced Physics PuttQuest Component
export default function AdvancedPuttQuest() {
  const [gameState, setGameState] = useState({
    ballPosition: [0, 0.5, 0] as [number, number, number],
    holePosition: [5, 0, 0] as [number, number, number],
    power: 0,
    angle: 0,
    ballStopped: true,
    windActive: false,
    spin: { x: 0, y: 0, z: 0 },
  });

  const [cameraEnabled, setCameraEnabled] = useState(false);
  // const [poseDetector, setPoseDetector] = useState<poseDetection.PoseDetector | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Initialize computer vision
  useEffect(() => {
    const initCV = async () => {
      await tf.ready();
      // const detector = await poseDetection.createDetector(
      //   poseDetection.SupportedModels.MoveNet,
      //   { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
      // );
      // setPoseDetector(detector);
    };
    initCV();
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
      }
    } catch (error) {
      console.error('Camera access failed:', error);
    }
  };

  // Handle putting with advanced physics
  const handlePutt = useCallback(() => {
    if (!gameState.ballStopped) return;

    // Calculate force based on power and angle
    const force = gameState.power * 10; // Scale power to force
    const radianAngle = (gameState.angle * Math.PI) / 180;

    // Apply force to ball
    // const impulse = [
    //   Math.cos(radianAngle) * force,
    //   0.5, // Slight upward force
    //   Math.sin(radianAngle) * force,
    // ];

    // Add spin based on putting technique
    // const spin = [
    //   gameState.spin.x * 0.1,
    //   gameState.spin.y * 0.1,
    //   gameState.spin.z * 0.1,
    // ];

    setGameState(prev => ({
      ...prev,
      ballStopped: false,
    }));

    // The ball component will handle the physics
  }, [gameState]);

  const onBallStop = useCallback(() => {
    setGameState(prev => ({ ...prev, ballStopped: true }));
  }, []);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-green-800 via-green-600 to-green-800">
      {/* Camera Feed for AR */}
      {cameraEnabled && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute top-4 right-4 w-48 h-36 object-cover rounded-lg border-2 border-white/50"
        />
      )}

      {/* Game UI Overlay */}
      <div className="absolute top-4 left-4 z-10 text-white">
        <div className="bg-black/50 backdrop-blur-sm p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Advanced PuttQuest</h2>
          <div className="space-y-2">
            <div>Power: {gameState.power.toFixed(1)}</div>
            <div>Angle: {gameState.angle.toFixed(1)}°</div>
            <div>Status: {gameState.ballStopped ? 'Ready' : 'Moving'}</div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-black/50 backdrop-blur-sm p-4 rounded-lg">
          <div className="flex space-x-4">
            <button
              onClick={initializeCamera}
              disabled={cameraEnabled}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded"
            >
              {cameraEnabled ? 'Camera ✓' : 'Enable AR'}
            </button>
            <button
              onClick={handlePutt}
              disabled={!gameState.ballStopped}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Putt!
            </button>
            <button
              onClick={() => setGameState(prev => ({ ...prev, windActive: !prev.windActive }))}
              className={`px-4 py-2 rounded ${gameState.windActive ? 'bg-blue-600' : 'bg-gray-600'} text-white`}
            >
              Wind {gameState.windActive ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Power and Angle Controls */}
          <div className="mt-4 space-y-2">
            <div>
              <label className="text-white text-sm">Power:</label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={gameState.power}
                onChange={(e) => setGameState(prev => ({ ...prev, power: parseFloat(e.target.value) }))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-white text-sm">Angle:</label>
              <input
                type="range"
                min="-90"
                max="90"
                step="1"
                value={gameState.angle}
                onChange={(e) => setGameState(prev => ({ ...prev, angle: parseFloat(e.target.value) }))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3D Physics Scene */}
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
        <Suspense fallback={null}>
          <Sky sunPosition={[100, 20, 100]} />
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />

          <Physics gravity={[0, -9.81, 0]} allowSleep={false}>
            <Ground />
            <Terrain />
            <Ball position={gameState.ballPosition} onBallStop={onBallStop} />
            <Hole position={gameState.holePosition} />
          </Physics>

          <WindEffect active={gameState.windActive} />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </Suspense>
      </Canvas>
    </div>
  );
}