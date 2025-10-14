'use client';
import React from 'react';
import { ShotData } from '@/types';

interface GolfSimulator3DProps {
  onShotTaken?: (shotData: ShotData) => void;
  disabled?: boolean;
}

export default function GolfSimulator3D({ onShotTaken, disabled }: GolfSimulator3DProps) {
  return (
    <div className="w-full h-96 bg-gradient-to-br from-green-800 to-green-900 rounded-lg flex items-center justify-center border border-green-600">
      <div className="text-center text-white">
        <div className="text-6xl mb-4">⛳</div>
        <h3 className="text-xl font-bold mb-2">3D Golf Simulator</h3>
        <p className="text-green-200">🚧 Temporarily disabled for production build</p>
        <p className="text-sm text-green-300 mt-2">Advanced 3D simulation coming soon!</p>
      </div>
    </div>
  );
}
