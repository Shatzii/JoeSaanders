'use client';
import { usePlane } from '@react-three/cannon';
import { Mesh } from 'three';

export default function GolfCourse() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }));

  return (
    <mesh ref={ref as React.RefObject<Mesh>} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
}