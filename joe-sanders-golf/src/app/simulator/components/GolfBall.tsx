'use client';
import { useRef } from 'react';
import { useSphere } from '@react-three/cannon';
import { Mesh } from 'three';

export default function GolfBall({ position }: { position: [number, number, number] }) {
  const [ref] = useSphere(() => ({
    mass: 1,
    position,
    restitution: 0.8,
  }));

  return (
    <mesh ref={ref as React.RefObject<Mesh>} castShadow>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial color="white" roughness={0.2} metalness={0.1} />
    </mesh>
  );
}