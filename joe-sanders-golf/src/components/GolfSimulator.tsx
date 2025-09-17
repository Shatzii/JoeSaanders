'use client';
import { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Plane, Html } from '@react-three/drei';
import * as THREE from 'three';

interface GolfBallProps {
  position: [number, number, number];
  onPositionChange?: (position: THREE.Vector3) => void;
}

function GolfBall({ position, onPositionChange }: GolfBallProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      const currentPos = meshRef.current.position;
      if (onPositionChange) {
        onPositionChange(currentPos);
      }
    }
  });

  return (
    <Sphere ref={meshRef} args={[0.05, 16, 16]} position={position}>
      <meshStandardMaterial
        color="#ffffff"
        roughness={0.1}
        metalness={0.1}
        emissive="#ffffff"
        emissiveIntensity={0.1}
      />
    </Sphere>
  );
}

interface GolfClubProps {
  position: [number, number, number];
  visible: boolean;
}

function GolfClub({ position, visible }: GolfClubProps) {
  if (!visible) return null;

  return (
    <group position={position}>
      {/* Club shaft */}
      <Box args={[0.01, 1.5, 0.01]} position={[0, 0.75, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      {/* Club head */}
      <Box args={[0.05, 0.1, 0.02]} position={[0, -0.05, 0]}>
        <meshStandardMaterial color="#2F2F2F" metalness={0.8} roughness={0.2} />
      </Box>
    </group>
  );
}

interface GolfCourseProps {
  onHoleClick?: (position: THREE.Vector3) => void;
}

function GolfCourse({ onHoleClick }: GolfCourseProps) {
  const holeRef = useRef<THREE.Mesh>(null);

  const handleHoleClick = (event: any) => {
    event.stopPropagation();
    if (onHoleClick && holeRef.current) {
      onHoleClick(holeRef.current.position);
    }
  };

  return (
    <group>
      {/* Grass surface */}
      <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <meshStandardMaterial color="#228B22" roughness={0.8} />
      </Plane>

      {/* Tee box */}
      <Box args={[0.5, 0.02, 0.5]} position={[-8, -0.09, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>

      {/* Hole */}
      <Sphere
        ref={holeRef}
        args={[0.15, 16, 16]}
        position={[8, -0.08, 0]}
        onClick={handleHoleClick}
      >
        <meshStandardMaterial color="#000000" />
      </Sphere>

      {/* Hole flag */}
      <group position={[8, 0.5, 0]}>
        <Box args={[0.02, 1, 0.02]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#8B4513" />
        </Box>
        <Plane args={[0.3, 0.2]} position={[0, 0.8, 0]}>
          <meshStandardMaterial color="#FF0000" side={THREE.DoubleSide} />
        </Plane>
      </group>

      {/* Fairway markers */}
      <Box args={[0.1, 0.05, 0.1]} position={[0, -0.08, 0]}>
        <meshStandardMaterial color="#FFFF00" />
      </Box>
    </group>
  );
}

interface PowerBarProps {
  power: number;
  visible: boolean;
}

function PowerBar({ power, visible }: PowerBarProps) {
  if (!visible) return null;

  return (
    <Html position={[-6, 3, 0]} center>
      <div className="bg-black bg-opacity-75 p-2 rounded">
        <div className="text-white text-sm mb-1">Power</div>
        <div className="w-32 h-4 bg-gray-700 rounded">
          <div
            className="h-full bg-red-500 rounded transition-all duration-100"
            style={{ width: `${power}%` }}
          />
        </div>
      </div>
    </Html>
  );
}

interface AimLineProps {
  start: THREE.Vector3;
  end: THREE.Vector3;
  visible: boolean;
}

function AimLine({ start, end, visible }: AimLineProps) {
  if (!visible) return null;

  const points = [start, end];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: '#FFFF00' }))} />
  );
}

interface GameSceneProps {
  onShotTaken?: (shotData: any) => void;
  disabled?: boolean;
}

function GameScene({ onShotTaken, disabled = false }: GameSceneProps) {
  const { camera, gl } = useThree();
  const [ballPosition, setBallPosition] = useState<[number, number, number]>([-8, 0, 0]);
  const [clubVisible, setClubVisible] = useState(false);
  const [power, setPower] = useState(0);
  const [isAiming, setIsAiming] = useState(false);
  const [powerIncreasing, setPowerIncreasing] = useState(true);
  const [aimStart, setAimStart] = useState(new THREE.Vector3(-8, 0, 0));
  const [aimEnd, setAimEnd] = useState(new THREE.Vector3(-6, 0, 0));
  const [shotHistory, setShotHistory] = useState<any[]>([]);

  // Set up camera
  useEffect(() => {
    camera.position.set(-5, 5, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  // Handle mouse interactions
  useEffect(() => {
    if (disabled) return;

    const handleMouseDown = (_event: MouseEvent) => {
      if (!isAiming) {
        setIsAiming(true);
        setPower(0);
        setPowerIncreasing(true);
        setClubVisible(true);
      }
    };

    const handleMouseUp = (_event: MouseEvent) => {
      if (isAiming) {
        setIsAiming(false);
        setClubVisible(false);

        // Calculate shot
        const direction = new THREE.Vector3()
          .subVectors(aimEnd, aimStart)
          .normalize();

        const force = (power / 100) * 10; // Max force of 10 units
        const newPosition: [number, number, number] = [
          ballPosition[0] + direction.x * force,
          ballPosition[1],
          ballPosition[2] + direction.z * force
        ];

        setBallPosition(newPosition);

        // Determine shot outcome
        let outcome = 'Straight';
        const angle = Math.atan2(direction.z, direction.x);

        if (Math.abs(angle) < 0.1) outcome = 'Straight';
        else if (angle < 0) outcome = 'Draw';
        else outcome = 'Fade';

        // Randomize outcome slightly
        const random = Math.random();
        if (random < 0.1) outcome = 'Hook';
        else if (random < 0.2) outcome = 'Slice';

        const shotData = {
          club: 'Driver',
          outcome,
          distance: Math.floor(force * 10),
          club_used: 'Driver',
          hole_number: 1,
          shot_number: shotHistory.length + 1,
          timestamp: Date.now(),
          startPosition: { x: ballPosition[0], y: ballPosition[1], z: ballPosition[2] },
          endPosition: { x: newPosition[0], y: newPosition[1], z: newPosition[2] },
          angle,
          force
        };

        setShotHistory(prev => [...prev, shotData]);

        if (onShotTaken) {
          onShotTaken(shotData);
        }

        // Dispatch to window for other components
        window.dispatchEvent(new CustomEvent('shotTaken', { detail: shotData }));
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isAiming) {
        const rect = gl.domElement.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        const vector = new THREE.Vector3(x, y, 0.5);
        vector.unproject(camera);
        const dir = vector.sub(camera.position).normalize();
        const distance = -camera.position.y / dir.y;
        const pos = camera.position.clone().add(dir.multiplyScalar(distance));

        setAimEnd(pos);
      }
    };

    gl.domElement.addEventListener('mousedown', handleMouseDown);
    gl.domElement.addEventListener('mouseup', handleMouseUp);
    gl.domElement.addEventListener('mousemove', handleMouseMove);

    return () => {
      gl.domElement.removeEventListener('mousedown', handleMouseDown);
      gl.domElement.removeEventListener('mouseup', handleMouseUp);
      gl.domElement.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isAiming, power, aimStart, aimEnd, ballPosition, shotHistory, onShotTaken, camera, gl, disabled]);

  // Power bar animation
  useEffect(() => {
    if (!isAiming) return;

    const interval = setInterval(() => {
      setPower(prev => {
        if (powerIncreasing) {
          const newPower = prev + 2;
          if (newPower >= 100) {
            setPowerIncreasing(false);
            return 100;
          }
          return newPower;
        } else {
          const newPower = prev - 2;
          if (newPower <= 0) {
            setPowerIncreasing(true);
            return 0;
          }
          return newPower;
        }
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isAiming, powerIncreasing]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-8, 5, 0]} intensity={0.5} />

      {/* Course */}
      <GolfCourse />

      {/* Golf Ball */}
      <GolfBall
        position={ballPosition}
        onPositionChange={(pos) => setAimStart(pos)}
      />

      {/* Golf Club */}
      <GolfClub position={ballPosition} visible={clubVisible} />

      {/* Power Bar */}
      <PowerBar power={power} visible={isAiming} />

      {/* Aim Line */}
      <AimLine start={aimStart} end={aimEnd} visible={isAiming} />

      {/* Instructions */}
      <Html position={[0, 4, 0]} center>
        <div className="bg-black bg-opacity-75 text-white p-3 rounded text-center max-w-xs">
          <p className="text-sm font-bold mb-2">
            {disabled ? 'Upgrade to Pro for unlimited shots!' : '3D Golf Simulator'}
          </p>
          {!disabled && (
            <div className="text-xs space-y-1">
              <p>🎯 Click and hold to aim</p>
              <p>🎯 Move mouse to adjust direction</p>
              <p>🎯 Release to take shot</p>
              <p>🎯 Get AI coaching on your swing!</p>
            </div>
          )}
        </div>
      </Html>

      {/* Camera Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}

interface GolfSimulatorProps {
  onShotTaken?: (shotData: any) => void;
  disabled?: boolean;
}

export default function GolfSimulator({ onShotTaken, disabled = false }: GolfSimulatorProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="border-2 border-[#d4af37] rounded-lg shadow-lg bg-black"
        style={{ width: '800px', height: '600px' }}
      >
        <Canvas
          shadows
          camera={{ position: [-5, 5, 5], fov: 60 }}
          gl={{ antialias: true }}
        >
          <Suspense fallback={
            <Html center>
              <div className="text-white text-xl">Loading 3D Golf Simulator...</div>
            </Html>
          }>
            <GameScene onShotTaken={onShotTaken} disabled={disabled} />
          </Suspense>
        </Canvas>
      </div>
      <div className="mt-4 text-center text-sm text-gray-600 max-w-md">
        <p>🚀 <strong>Enhanced 3D Experience:</strong></p>
        <p>• Realistic 3D graphics and lighting</p>
        <p>• Interactive camera controls</p>
        <p>• Immersive golf environment</p>
        <p>• Advanced shot physics (coming soon)</p>
      </div>
    </div>
  );
}