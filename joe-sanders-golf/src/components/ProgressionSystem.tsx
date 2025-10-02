'use client';
import React, { useState, useEffect } from 'react';

interface PlayerStats {
  level: number;
  xp: number;
  xpToNext: number;
  totalXP: number;
  coins: number;
  gamesPlayed: number;
  gamesWon: number;
  bestScore: number;
  currentStreak: number;
  bestStreak: number;
  totalPutts: number;
  averagePutts: number;
  holesInOne: number;
  perfectRounds: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  reward: {
    xp: number;
    coins: number;
  };
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

interface SkillTreeNode {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  cost: number; // XP cost
  prerequisites: string[]; // IDs of required nodes
  effects: {
    powerBonus?: number;
    accuracyBonus?: number;
    spinBonus?: number;
    coinMultiplier?: number;
  };
}

export default function ProgressionSystem() {
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    level: 1,
    xp: 0,
    xpToNext: 100,
    totalXP: 0,
    coins: 100,
    gamesPlayed: 0,
    gamesWon: 0,
    bestScore: 0,
    currentStreak: 0,
    bestStreak: 0,
    totalPutts: 0,
    averagePutts: 0,
    holesInOne: 0,
    perfectRounds: 0
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first_putt',
      name: 'First Putt',
      description: 'Make your first putt in PuttQuest',
      icon: '🎯',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      reward: { xp: 10, coins: 5 },
      rarity: 'Common'
    },
    {
      id: 'hole_in_one',
      name: 'Hole in One!',
      description: 'Get a hole in one',
      icon: '🏆',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      reward: { xp: 100, coins: 50 },
      rarity: 'Rare'
    },
    {
      id: 'perfect_round',
      name: 'Perfect Round',
      description: 'Complete a round with par or better',
      icon: '⭐',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      reward: { xp: 200, coins: 100 },
      rarity: 'Epic'
    },
    {
      id: 'streak_master',
      name: 'Streak Master',
      description: 'Win 10 games in a row',
      icon: '🔥',
      unlocked: false,
      progress: 0,
      maxProgress: 10,
      reward: { xp: 500, coins: 250 },
      rarity: 'Legendary'
    },
    {
      id: 'putt_master',
      name: 'Putt Master',
      description: 'Make 1000 putts',
      icon: '⛳',
      unlocked: false,
      progress: 0,
      maxProgress: 1000,
      reward: { xp: 300, coins: 150 },
      rarity: 'Epic'
    },
    {
      id: 'level_up',
      name: 'Rising Star',
      description: 'Reach level 10',
      icon: '🚀',
      unlocked: false,
      progress: 1,
      maxProgress: 10,
      reward: { xp: 1000, coins: 500 },
      rarity: 'Legendary'
    }
  ]);

  const [skillTree, setSkillTree] = useState<SkillTreeNode[]>([
    {
      id: 'power_boost',
      name: 'Power Boost',
      description: 'Increase maximum putting power by 20%',
      icon: '💪',
      unlocked: false,
      cost: 200,
      prerequisites: [],
      effects: { powerBonus: 0.2 }
    },
    {
      id: 'accuracy_master',
      name: 'Accuracy Master',
      description: 'Improve putting accuracy by 15%',
      icon: '🎯',
      unlocked: false,
      cost: 300,
      prerequisites: ['power_boost'],
      effects: { accuracyBonus: 0.15 }
    },
    {
      id: 'spin_control',
      name: 'Spin Control',
      description: 'Add backspin to putts for better control',
      icon: '🌀',
      unlocked: false,
      cost: 400,
      prerequisites: ['accuracy_master'],
      effects: { spinBonus: 0.1 }
    },
    {
      id: 'coin_magnet',
      name: 'Coin Magnet',
      description: 'Earn 25% more coins from games',
      icon: '🪙',
      unlocked: false,
      cost: 500,
      prerequisites: ['power_boost'],
      effects: { coinMultiplier: 0.25 }
    },
    {
      id: 'lucky_charm',
      name: 'Lucky Charm',
      description: '5% chance for double rewards',
      icon: '🍀',
      unlocked: false,
      cost: 1000,
      prerequisites: ['coin_magnet', 'spin_control'],
      effects: {}
    }
  ]);

  const [activeTab, setActiveTab] = useState<'stats' | 'achievements' | 'skills'>('stats');

  // Load player data from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('puttquest_stats');
    const savedAchievements = localStorage.getItem('puttquest_achievements');
    const savedSkills = localStorage.getItem('puttquest_skills');

    if (savedStats) {
      setPlayerStats(JSON.parse(savedStats));
    }
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    }
    if (savedSkills) {
      setSkillTree(JSON.parse(savedSkills));
    }
  }, []);

  // Save player data
  useEffect(() => {
    localStorage.setItem('puttquest_stats', JSON.stringify(playerStats));
    localStorage.setItem('puttquest_achievements', JSON.stringify(achievements));
    localStorage.setItem('puttquest_skills', JSON.stringify(skillTree));
  }, [playerStats, achievements, skillTree]);

  // Gain XP and check level up
  const gainXP = (amount: number) => {
    setPlayerStats(prev => {
      const newTotalXP = prev.totalXP + amount;
      const newXP = prev.xp + amount;
      let newLevel = prev.level;
      let xpToNext = prev.xpToNext;

      // Level up logic
      while (newXP >= xpToNext) {
        newLevel++;
        xpToNext = newLevel * 100; // XP required doubles each level
      }

      return {
        ...prev,
        level: newLevel,
        xp: newXP >= xpToNext ? newXP - xpToNext : newXP,
        xpToNext,
        totalXP: newTotalXP
      };
    });
  };

  // Gain coins
  const gainCoins = (amount: number) => {
    setPlayerStats(prev => ({ ...prev, coins: prev.coins + amount }));
  };

  // Update achievement progress
  const updateAchievement = (achievementId: string, progress: number = 1) => {
    setAchievements(prev => prev.map(achievement => {
      if (achievement.id === achievementId && !achievement.unlocked) {
        const newProgress = Math.min(achievement.progress + progress, achievement.maxProgress);
        const unlocked = newProgress >= achievement.maxProgress;

        if (unlocked) {
          // Grant rewards
          gainXP(achievement.reward.xp);
          gainCoins(achievement.reward.coins);
        }

        return { ...achievement, progress: newProgress, unlocked };
      }
      return achievement;
    }));
  };

  // Unlock skill
  const unlockSkill = (skillId: string) => {
    setSkillTree(prev => prev.map(skill => {
      if (skill.id === skillId && !skill.unlocked) {
        // Check prerequisites
        const prerequisitesMet = skill.prerequisites.every(prereqId =>
          prev.find(s => s.id === prereqId)?.unlocked
        );

        if (prerequisitesMet && playerStats.xp >= skill.cost) {
          // Deduct XP cost
          setPlayerStats(prevStats => ({ ...prevStats, xp: prevStats.xp - skill.cost }));
          return { ...skill, unlocked: true };
        }
      }
      return skill;
    }));
  };

  // Simulate game completion (for testing)
  const simulateGame = (score: number, putts: number, won: boolean) => {
    setPlayerStats(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      gamesWon: won ? prev.gamesWon + 1 : prev.gamesWon,
      bestScore: Math.max(prev.bestScore, score),
      currentStreak: won ? prev.currentStreak + 1 : 0,
      bestStreak: won ? Math.max(prev.bestStreak, prev.currentStreak + 1) : prev.bestStreak,
      totalPutts: prev.totalPutts + putts,
      averagePutts: (prev.totalPutts + putts) / (prev.gamesPlayed + 1),
      holesInOne: score >= 10 ? prev.holesInOne + 1 : prev.holesInOne,
      perfectRounds: score >= 8 ? prev.perfectRounds + 1 : prev.perfectRounds
    }));

    // Grant XP based on performance
    const baseXP = 50;
    const performanceBonus = Math.max(0, score * 10);
    gainXP(baseXP + performanceBonus);

    // Grant coins
    const baseCoins = 25;
    const coinBonus = Math.max(0, score * 5);
    gainCoins(baseCoins + coinBonus);

    // Update achievements
    updateAchievement('first_putt');
    if (score >= 10) updateAchievement('hole_in_one');
    if (score >= 8) updateAchievement('perfect_round');
    if (playerStats.currentStreak >= 10) updateAchievement('streak_master');
    updateAchievement('putt_master', putts);
    updateAchievement('level_up', playerStats.level);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'text-gray-400';
      case 'Rare': return 'text-blue-400';
      case 'Epic': return 'text-purple-400';
      case 'Legendary': return 'text-yellow-400';
      default: return 'text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-800 via-indigo-600 to-indigo-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-300 mb-2">
            Player Progression
          </h1>
          <p className="text-white/90">
            Track your skills, unlock achievements, and level up your game
          </p>
        </div>

        {/* Level and XP Display */}
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl max-w-2xl mx-auto mb-8">
          <div className="text-center">
            <div className="text-6xl font-bold text-yellow-400 mb-2">
              Level {playerStats.level}
            </div>
            <div className="text-xl text-white/80 mb-4">
              {playerStats.xp} / {playerStats.xpToNext} XP
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
              <div
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${(playerStats.xp / playerStats.xpToNext) * 100}%` }}
              />
            </div>
            <div className="flex justify-center space-x-8 text-lg">
              <div>
                <div className="text-2xl font-bold text-green-400">{playerStats.coins}</div>
                <div className="text-sm text-white/60">Coins</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">{playerStats.totalXP.toLocaleString()}</div>
                <div className="text-sm text-white/60">Total XP</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === 'stats' ? 'bg-indigo-600 text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              Statistics
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === 'achievements' ? 'bg-indigo-600 text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              Achievements
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === 'skills' ? 'bg-indigo-600 text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              Skill Tree
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Game Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Games Played:</span>
                  <span className="font-bold">{playerStats.gamesPlayed}</span>
                </div>
                <div className="flex justify-between">
                  <span>Games Won:</span>
                  <span className="font-bold text-green-400">{playerStats.gamesWon}</span>
                </div>
                <div className="flex justify-between">
                  <span>Win Rate:</span>
                  <span className="font-bold">
                    {playerStats.gamesPlayed > 0 ? Math.round((playerStats.gamesWon / playerStats.gamesPlayed) * 100) : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Best Score:</span>
                  <span className="font-bold text-yellow-400">{playerStats.bestScore}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Putting Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Putts:</span>
                  <span className="font-bold">{playerStats.totalPutts}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Putts:</span>
                  <span className="font-bold">{playerStats.averagePutts.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Holes in One:</span>
                  <span className="font-bold text-red-400">{playerStats.holesInOne}</span>
                </div>
                <div className="flex justify-between">
                  <span>Perfect Rounds:</span>
                  <span className="font-bold text-purple-400">{playerStats.perfectRounds}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Streaks</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Current Streak:</span>
                  <span className="font-bold text-orange-400">{playerStats.currentStreak}</span>
                </div>
                <div className="flex justify-between">
                  <span>Best Streak:</span>
                  <span className="font-bold text-orange-400">{playerStats.bestStreak}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map(achievement => (
              <div
                key={achievement.id}
                className={`bg-white/10 backdrop-blur-sm p-6 rounded-xl border-2 ${
                  achievement.unlocked ? 'border-yellow-400' : 'border-white/20'
                }`}
              >
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{achievement.icon}</div>
                  <div>
                    <h3 className={`font-bold ${achievement.unlocked ? 'text-yellow-400' : 'text-white/70'}`}>
                      {achievement.name}
                    </h3>
                    <div className={`text-sm ${getRarityColor(achievement.rarity)}`}>
                      {achievement.rarity}
                    </div>
                  </div>
                </div>
                <p className="text-white/80 mb-4">{achievement.description}</p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{achievement.progress}/{achievement.maxProgress}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        achievement.unlocked ? 'bg-yellow-400' : 'bg-blue-400'
                      }`}
                      style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                    />
                  </div>
                </div>
                {achievement.unlocked && (
                  <div className="text-sm text-green-400">
                    ✅ Unlocked! +{achievement.reward.xp} XP, +{achievement.reward.coins} coins
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl mb-6">
              <h2 className="text-2xl font-bold mb-4">Skill Tree</h2>
              <p className="text-white/80">
                Unlock skills to improve your putting performance and earn more rewards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skillTree.map(skill => {
                const canUnlock = !skill.unlocked &&
                  skill.prerequisites.every(prereqId =>
                    skillTree.find(s => s.id === prereqId)?.unlocked
                  ) &&
                  playerStats.xp >= skill.cost;

                return (
                  <div
                    key={skill.id}
                    className={`bg-white/10 backdrop-blur-sm p-6 rounded-xl border-2 ${
                      skill.unlocked ? 'border-green-400' : 'border-white/20'
                    }`}
                  >
                    <div className="flex items-center mb-4">
                      <div className="text-3xl mr-3">{skill.icon}</div>
                      <div>
                        <h3 className={`font-bold ${skill.unlocked ? 'text-green-400' : 'text-white'}`}>
                          {skill.name}
                        </h3>
                        <div className="text-sm text-white/60">
                          {skill.cost} XP
                        </div>
                      </div>
                    </div>
                    <p className="text-white/80 mb-4">{skill.description}</p>

                    {skill.prerequisites.length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm text-white/60 mb-2">Requires:</div>
                        <div className="flex flex-wrap gap-1">
                          {skill.prerequisites.map(prereqId => {
                            const prereq = skillTree.find(s => s.id === prereqId);
                            return (
                              <span
                                key={prereqId}
                                className={`text-xs px-2 py-1 rounded ${
                                  prereq?.unlocked ? 'bg-green-600' : 'bg-red-600'
                                }`}
                              >
                                {prereq?.name}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {!skill.unlocked && (
                      <button
                        onClick={() => unlockSkill(skill.id)}
                        disabled={!canUnlock}
                        className={`w-full py-2 px-4 rounded transition-colors ${
                          canUnlock
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-600 text-white/50 cursor-not-allowed'
                        }`}
                      >
                        {canUnlock ? 'Unlock Skill' : 'Locked'}
                      </button>
                    )}

                    {skill.unlocked && (
                      <div className="text-green-400 font-bold text-center">
                        ✅ Unlocked
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Test Controls (for development) */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm p-6 rounded-xl max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Test Controls (Development)</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => simulateGame(5, 3, true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
            >
              Simulate Win (+50 XP)
            </button>
            <button
              onClick={() => gainXP(100)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
            >
              +100 XP
            </button>
            <button
              onClick={() => gainCoins(50)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded transition-colors"
            >
              +50 Coins
            </button>
            <button
              onClick={() => updateAchievement('hole_in_one')}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
            >
              Unlock Achievement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}