'use client';
import React from 'react';
import { ShotData } from '@/types';

interface GolfSimulatorProps {
  onShotTaken?: (shotData: ShotData) => void;
  disabled?: boolean;
}

export default function GolfSimulator({ onShotTaken, disabled }: GolfSimulatorProps) {
  return (
    <div className="w-full h-96 bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg flex items-center justify-center border border-blue-600">
      <div className="text-center text-white">
        <div className="text-6xl mb-4">🏌️‍♂️</div>
        <h3 className="text-xl font-bold mb-2">Golf Simulator</h3>
        <p className="text-blue-200">🚧 Temporarily disabled for production build</p>
        <p className="text-sm text-blue-300 mt-2">Interactive golf simulation coming soon!</p>
      </div>
    </div>
  );
}
