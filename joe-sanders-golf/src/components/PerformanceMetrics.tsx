'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, Target, Zap, Award } from 'lucide-react';

interface PerformanceMetricsProps {
  stats: {
    totalShots: number;
    averageDistance: number;
    bestShot: number;
    accuracy: number;
  };
  shots: any[];
}

export function PerformanceMetrics({ stats, shots }: PerformanceMetricsProps) {
  const [improvement, setImprovement] = useState(0);

  useEffect(() => {
    // Calculate improvement trend (simple moving average)
    if (shots.length >= 5) {
      const recent = shots.slice(-5);
      const older = shots.slice(-10, -5);

      if (older.length > 0) {
        const recentAvg = recent.reduce((sum, shot) => sum + shot.distance, 0) / recent.length;
        const olderAvg = older.reduce((sum, shot) => sum + shot.distance, 0) / older.length;
        const improvementPercent = ((recentAvg - olderAvg) / olderAvg) * 100;
        setImprovement(Math.round(improvementPercent * 10) / 10);
      }
    }
  }, [shots]);

  const getConsistencyScore = () => {
    if (shots.length < 3) return 0;

    const distances = shots.map(shot => shot.distance);
    const avg = distances.reduce((a, b) => a + b, 0) / distances.length;
    const variance = distances.reduce((sum, dist) => sum + Math.pow(dist - avg, 2), 0) / distances.length;
    const stdDev = Math.sqrt(variance);

    // Lower standard deviation = higher consistency (0-100 scale)
    const consistency = Math.max(0, 100 - (stdDev / avg) * 100);
    return Math.round(consistency);
  };

  const getAccuracyGrade = (accuracy: number) => {
    if (accuracy >= 90) return { grade: 'A+', color: 'text-green-400' };
    if (accuracy >= 80) return { grade: 'A', color: 'text-green-400' };
    if (accuracy >= 70) return { grade: 'B', color: 'text-yellow-400' };
    if (accuracy >= 60) return { grade: 'C', color: 'text-orange-400' };
    return { grade: 'D', color: 'text-red-400' };
  };

  const accuracyGrade = getAccuracyGrade(stats.accuracy);

  return (
    <div className="bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] border border-[#d4af3740] rounded-lg p-4 max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#d4af37] flex items-center gap-2">
          <TrendingUp size={20} />
          Performance Metrics
        </h3>
        <div className="text-right">
          <div className={`text-sm font-bold ${accuracyGrade.color}`}>
            {accuracyGrade.grade}
          </div>
          <div className="text-xs text-gray-400">Grade</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Total Shots */}
        <div className="bg-[#2a2a2a] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Target size={16} className="text-[#d4af37]" />
            <span className="text-sm text-gray-400">Total Shots</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalShots}</div>
        </div>

        {/* Average Distance */}
        <div className="bg-[#2a2a2a] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={16} className="text-[#d4af37]" />
            <span className="text-sm text-gray-400">Avg Distance</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.averageDistance}yd</div>
        </div>

        {/* Best Shot */}
        <div className="bg-[#2a2a2a] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Award size={16} className="text-[#d4af37]" />
            <span className="text-sm text-gray-400">Best Shot</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.bestShot}yd</div>
        </div>

        {/* Accuracy */}
        <div className="bg-[#2a2a2a] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Target size={16} className="text-[#d4af37]" />
            <span className="text-sm text-gray-400">Accuracy</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.accuracy}%</div>
        </div>
      </div>

      {/* Advanced Metrics */}
      {shots.length >= 3 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-[#d4af37]">{getConsistencyScore()}%</div>
              <div className="text-xs text-gray-400">Consistency</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${improvement >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {improvement >= 0 ? '+' : ''}{improvement}%
              </div>
              <div className="text-xs text-gray-400">Improvement</div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Insights */}
      {shots.length > 0 && (
        <div className="mt-4 p-3 bg-[#2a2a2a] rounded-lg">
          <h4 className="text-sm font-semibold text-[#d4af37] mb-2">Quick Insights</h4>
          <ul className="text-xs text-gray-300 space-y-1">
            {stats.accuracy < 70 && (
              <li>• Focus on alignment and setup</li>
            )}
            {getConsistencyScore() < 60 && (
              <li>• Work on tempo and rhythm</li>
            )}
            {improvement < 0 && shots.length >= 10 && (
              <li>• Review recent swing changes</li>
            )}
            {stats.averageDistance < 200 && (
              <li>• Consider club fitting or lessons</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}