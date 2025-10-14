'use client';
import React from 'react';

export default function AdvancedPuttQuest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Advanced PuttQuest</h1>
        <p className="text-xl mb-8">🚧 Temporarily disabled for production deployment</p>
        <p className="text-lg opacity-80">
          This advanced 3D putting simulator with AI pose detection will be available soon!
        </p>
        <div className="mt-8">
          <a href="/" className="bg-joe-gold text-joe-black px-6 py-3 rounded-lg font-semibold hover:bg-amber-400 transition-colors">
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
}
