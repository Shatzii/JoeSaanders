'use client';
import { useEffect, useState } from 'react';
import { Heart, Settings, Volume2 } from 'lucide-react';

export function BroadcastUI({ score }: { score: number }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 3000);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="absolute top-0 left-0 right-0 z-40 pointer-events-none">
      {/* Score Banner */}
      <div className={`bg-black/70 border-b border-[#d4af37] p-4 transition-opacity ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-[#d4af37] rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-black" />
            </div>
            <div>
              <h2 className="gold-gradient-text font-['Cormorant_Garamond'] text-xl">Uncle Joe&apos;s Challenge</h2>
              <p className="text-sm text-gray-300">Par 72 - Stones Golf Club</p>
            </div>
          </div>
          <div className="text-right">
            <div className="gold-gradient-text text-2xl font-bold">Score: {score}</div>
            <div className="text-sm text-gray-300">+2 Through 15</div>
          </div>
        </div>
      </div>

      {/* Quick Access Icons */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <button className="p-2 bg-black/50 rounded-full hover:bg-[#d4af37]/20 transition-colors pointer-events-auto">
          <Volume2 className="w-5 h-5" />
        </button>
        <button className="p-2 bg-black/50 rounded-full hover:bg-[#d4af37]/20 transition-colors pointer-events-auto">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}