'use client';
import { useState, useEffect } from 'react';
import { Trophy, Star, Target, Zap, Award, CheckCircle, Lock } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: string;
  reward: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementSystemProps {
  stats: {
    totalShots: number;
    averageDistance: number;
    bestShot: number;
    accuracy: number;
  };
  shots: any[];
  userTier: 'free' | 'pro' | 'elite';
}

const achievements: Achievement[] = [
  {
    id: 'first-shot',
    title: 'First Swing',
    description: 'Take your very first shot',
    icon: '🎯',
    requirement: 'Take 1 shot',
    reward: 'Welcome to the game!',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rarity: 'common'
  },
  {
    id: 'consistent-player',
    title: 'Consistent Player',
    description: 'Take 10 shots with good accuracy',
    icon: '📊',
    requirement: '10 accurate shots',
    reward: 'Accuracy badge',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    rarity: 'common'
  },
  {
    id: 'distance-king',
    title: 'Distance King',
    description: 'Hit a shot over 300 yards',
    icon: '⚡',
    requirement: '300+ yard drive',
    reward: 'Power player title',
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'precision-master',
    title: 'Precision Master',
    description: 'Achieve 90% accuracy over 20 shots',
    icon: '🎯',
    requirement: '90% accuracy',
    reward: 'Precision expert badge',
    unlocked: false,
    progress: 0,
    maxProgress: 20,
    rarity: 'epic'
  },
  {
    id: 'marathon-player',
    title: 'Marathon Player',
    description: 'Play for 100 shots in one session',
    icon: '🏃',
    requirement: '100 shots',
    reward: 'Endurance champion',
    unlocked: false,
    progress: 0,
    maxProgress: 100,
    rarity: 'rare'
  },
  {
    id: 'ai-coach-graduate',
    title: 'AI Coach Graduate',
    description: 'Complete 50 coaching sessions',
    icon: '🎓',
    requirement: '50 AI sessions',
    reward: 'Expert level access',
    unlocked: false,
    progress: 0,
    maxProgress: 50,
    rarity: 'epic'
  },
  {
    id: 'voice-caddie-master',
    title: 'Voice Caddie Master',
    description: 'Use voice commands 25 times',
    icon: '🎤',
    requirement: '25 voice interactions',
    reward: 'Voice pro badge',
    unlocked: false,
    progress: 0,
    maxProgress: 25,
    rarity: 'rare'
  },
  {
    id: 'tournament-champion',
    title: 'Tournament Champion',
    description: 'Win your first tournament',
    icon: '🏆',
    requirement: 'Tournament victory',
    reward: 'Champion title',
    unlocked: false,
    rarity: 'legendary'
  }
];

export function AchievementSystem({ stats, shots, userTier }: AchievementSystemProps) {
  const [userAchievements, setUserAchievements] = useState<Achievement[]>(achievements);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // Update achievement progress based on stats
    const updatedAchievements = achievements.map(achievement => {
      let unlocked = false;
      let progress = 0;

      switch (achievement.id) {
        case 'first-shot':
          progress = Math.min(stats.totalShots, 1);
          unlocked = stats.totalShots >= 1;
          break;
        case 'consistent-player':
          progress = Math.min(shots.filter(shot => shot.accuracy && shot.accuracy > 70).length, 10);
          unlocked = shots.filter(shot => shot.accuracy && shot.accuracy > 70).length >= 10;
          break;
        case 'distance-king':
          unlocked = stats.bestShot >= 300;
          break;
        case 'precision-master':
          const highAccuracyShots = shots.filter(shot => shot.accuracy && shot.accuracy >= 90).length;
          progress = Math.min(highAccuracyShots, 20);
          unlocked = highAccuracyShots >= 20;
          break;
        case 'marathon-player':
          progress = Math.min(stats.totalShots, 100);
          unlocked = stats.totalShots >= 100;
          break;
        case 'ai-coach-graduate':
          // This would be tracked separately in the AI coach component
          progress = Math.min(stats.totalShots, 50); // Placeholder
          unlocked = stats.totalShots >= 50;
          break;
        case 'voice-caddie-master':
          // This would be tracked separately in the voice caddie component
          progress = Math.min(stats.totalShots, 25); // Placeholder
          unlocked = stats.totalShots >= 25;
          break;
        case 'tournament-champion':
          // This would be tracked in tournament mode
          unlocked = false;
          break;
        default:
          unlocked = false;
      }

      return {
        ...achievement,
        unlocked,
        progress
      };
    });

    setUserAchievements(updatedAchievements);
  }, [stats, shots]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-500 bg-gray-500/10';
      case 'rare': return 'border-blue-500 bg-blue-500/10';
      case 'epic': return 'border-purple-500 bg-purple-500/10';
      case 'legendary': return 'border-yellow-500 bg-yellow-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getRarityTextColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const unlockedCount = userAchievements.filter(a => a.unlocked).length;
  const displayedAchievements = showAll ? userAchievements : userAchievements.slice(0, 6);

  return (
    <div className="bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] border border-[#d4af3740] rounded-lg p-4 max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#d4af37] flex items-center gap-2">
          <Trophy size={20} />
          Achievements
        </h3>
        <div className="text-right">
          <div className="text-sm font-bold text-[#d4af37]">{unlockedCount}/{userAchievements.length}</div>
          <div className="text-xs text-gray-400">Unlocked</div>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {displayedAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`relative p-3 rounded-lg border transition-all ${
              achievement.unlocked
                ? 'border-[#d4af37] bg-[#d4af37]/10'
                : getRarityColor(achievement.rarity)
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{achievement.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`font-semibold text-sm ${
                    achievement.unlocked ? 'text-[#d4af37]' : 'text-white'
                  }`}>
                    {achievement.title}
                  </h4>
                  <span className={`text-xs px-2 py-0.5 rounded ${getRarityTextColor(achievement.rarity)} bg-current/20`}>
                    {achievement.rarity}
                  </span>
                  {achievement.unlocked && (
                    <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
                  )}
                </div>

                <p className="text-xs text-gray-400 mb-2">{achievement.description}</p>

                {!achievement.unlocked && achievement.maxProgress && (
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{achievement.requirement}</span>
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1">
                      <div
                        className="bg-[#d4af37] h-1 rounded-full transition-all duration-300"
                        style={{ width: `${(achievement.progress! / achievement.maxProgress!) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{achievement.requirement}</span>
                  {achievement.unlocked && (
                    <span className="text-xs text-green-400 font-semibold">{achievement.reward}</span>
                  )}
                </div>
              </div>

              {!achievement.unlocked && (
                <Lock size={14} className="text-gray-500 flex-shrink-0 mt-1" />
              )}
            </div>
          </div>
        ))}
      </div>

      {userAchievements.length > 6 && (
        <div className="mt-4 pt-3 border-t border-gray-700 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-[#d4af37] hover:text-white transition-colors"
          >
            {showAll ? 'Show Less' : `Show All (${userAchievements.length})`}
          </button>
        </div>
      )}
    </div>
  );
}