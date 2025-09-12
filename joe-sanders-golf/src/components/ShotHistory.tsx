'use client';
import { useState, useEffect } from 'react';
import { Play, RotateCcw, History, Target } from 'lucide-react';

interface ShotHistoryProps {
  shots: any[];
  onReplayShot: (shotIndex: number) => void;
  onClearHistory: () => void;
}

export function ShotHistory({ shots, onReplayShot, onClearHistory }: ShotHistoryProps) {
  const [selectedShot, setSelectedShot] = useState<number | null>(null);

  const getOutcomeColor = (outcome: string) => {
    switch (outcome.toLowerCase()) {
      case 'straight': return 'text-green-400';
      case 'draw': return 'text-blue-400';
      case 'fade': return 'text-yellow-400';
      case 'hook': return 'text-red-400';
      case 'slice': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome.toLowerCase()) {
      case 'straight': return '→';
      case 'draw': return '↙';
      case 'fade': return '↘';
      case 'hook': return '↺';
      case 'slice': return '↻';
      default: return '○';
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] border border-[#d4af3740] rounded-lg p-4 max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#d4af37] flex items-center gap-2">
          <History size={20} />
          Shot History
        </h3>
        {shots.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-gray-400 hover:text-red-400 transition-colors"
            title="Clear history"
          >
            <RotateCcw size={16} />
          </button>
        )}
      </div>

      {shots.length === 0 ? (
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-gray-600 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Take your first shot to see history!</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {shots.map((shot, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                selectedShot === index
                  ? 'border-[#d4af37] bg-[#d4af37]/10'
                  : 'border-gray-700 bg-[#2a2a2a] hover:border-gray-600'
              }`}
              onClick={() => setSelectedShot(index)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#d4af37]">#{shot.shot_number}</span>
                  <span className={`text-sm font-bold ${getOutcomeColor(shot.outcome)}`}>
                    {getOutcomeIcon(shot.outcome)} {shot.outcome}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReplayShot(index);
                  }}
                  className="p-1 rounded bg-[#d4af37] text-[#0a0a0a] hover:bg-[#b8942c] transition-colors"
                  title="Replay this shot"
                >
                  <Play size={12} />
                </button>
              </div>

              <div className="flex justify-between text-xs text-gray-400">
                <span>Club: {shot.club_used}</span>
                <span>Distance: {shot.distance}yd</span>
              </div>

              {selectedShot === index && (
                <div className="mt-2 pt-2 border-t border-gray-600">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Angle:</span>
                      <span className="text-white ml-1">{shot.angle?.toFixed(2)}°</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Force:</span>
                      <span className="text-white ml-1">{shot.force?.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {shots.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-700">
          <div className="text-center text-sm text-gray-400">
            {shots.length} shot{shots.length !== 1 ? 's' : ''} recorded
          </div>
        </div>
      )}
    </div>
  );
}