'use client';
import { Canvas } from '@react-three/fiber';
import { Sky, OrbitControls, Stats } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import GolfCourse from './components/GolfCourse';
import GolfBall from './components/GolfBall';

export default function AdvancedGame() {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 5, 10], fov: 50 }}
        className="bg-blue-300"
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* Environment */}
        <Sky sunPosition={[10, 10, 5]} />
        <fog attach="fog" args={['lightblue', 10, 50]} />

        {/* Physics & Game Elements */}
        <Physics gravity={[0, -9.81, 0]}>
          <GolfCourse />
          <GolfBall position={[0, 2, 0]} />
        </Physics>

        <OrbitControls />
        <Stats />
      </Canvas>
    </div>
  );
}