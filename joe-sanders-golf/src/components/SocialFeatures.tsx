'use client';
import { useState, useEffect, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Trophy,
  Share2,
  MessageCircle,
  Crown,
  Star,
  TrendingUp,
  Target,
  Award,
  Zap,
  Heart,
  Send,
  Search,
  Filter,
  Calendar,
  MapPin,
  Clock
} from 'lucide-react';

interface Friend {
  id: string;
  name: string;
  avatar?: string;
  handicap: number;
  status: 'online' | 'offline' | 'playing';
  lastActive: number;
  totalScore: number;
  achievements: number;
  isMutual: boolean;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'accuracy' | 'distance' | 'speed' | 'putting' | 'course';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  targetScore: number;
  timeLimit?: number; // minutes
  course?: string;
  createdBy: string;
  participants: string[];
  status: 'open' | 'active' | 'completed';
  prize?: string;
  deadline?: number;
}

interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string;
  avatar?: string;
  score: number;
  handicap: number;
  trend: 'up' | 'down' | 'same';
  achievements: number;
  lastPlayed: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: number;
  progress?: number;
  maxProgress?: number;
}

interface SocialFeaturesProps {
  currentUser?: {
    id: string;
    name: string;
    handicap: number;
    avatar?: string;
  };
  onChallengeAccept?: (challengeId: string) => void;
  onFriendAdd?: (friendId: string) => void;
}

export default function SocialFeatures({
  currentUser,
  onChallengeAccept,
  onFriendAdd
}: SocialFeaturesProps) {
  const [activeTab, setActiveTab] = useState<'friends' | 'challenges' | 'leaderboard' | 'achievements'>('friends');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'online' | 'playing'>('all');

  // Mock data
  useEffect(() => {
    // Mock friends
    const mockFriends: Friend[] = [
      {
        id: 'friend-1',
        name: 'Sarah Johnson',
        handicap: 12,
        status: 'online',
        lastActive: Date.now() - 300000, // 5 minutes ago
        totalScore: 2450,
        achievements: 15,
        isMutual: true
      },
      {
        id: 'friend-2',
        name: 'Mike Chen',
        handicap: 8,
        status: 'playing',
        lastActive: Date.now() - 120000, // 2 minutes ago
        totalScore: 3120,
        achievements: 22,
        isMutual: true
      },
      {
        id: 'friend-3',
        name: 'Emma Davis',
        handicap: 15,
        status: 'offline',
        lastActive: Date.now() - 3600000, // 1 hour ago
        totalScore: 1890,
        achievements: 8,
        isMutual: true
      },
      {
        id: 'friend-4',
        name: 'Alex Rodriguez',
        handicap: 6,
        status: 'online',
        lastActive: Date.now() - 60000, // 1 minute ago
        totalScore: 3450,
        achievements: 28,
        isMutual: false
      }
    ];

    // Mock challenges
    const mockChallenges: Challenge[] = [
      {
        id: 'challenge-1',
        title: 'Accuracy Master',
        description: 'Hit 10 fairway targets within 5 yards',
        type: 'accuracy',
        difficulty: 'medium',
        targetScore: 10,
        timeLimit: 30,
        createdBy: 'Sarah Johnson',
        participants: ['user-1', 'friend-2'],
        status: 'active',
        prize: '🏆 Accuracy Champion Badge'
      },
      {
        id: 'challenge-2',
        title: 'Distance King',
        description: 'Drive the ball over 300 yards',
        type: 'distance',
        difficulty: 'hard',
        targetScore: 300,
        createdBy: 'Mike Chen',
        participants: ['user-1'],
        status: 'open',
        prize: '💪 Power Hitter Trophy'
      },
      {
        id: 'challenge-3',
        title: 'Putting Perfection',
        description: 'Make 20 consecutive putts from 3 feet',
        type: 'putting',
        difficulty: 'expert',
        targetScore: 20,
        timeLimit: 45,
        createdBy: 'Emma Davis',
        participants: [],
        status: 'open',
        prize: '🎯 Putting Master Certificate'
      },
      {
        id: 'challenge-4',
        title: 'Course Conqueror',
        description: 'Complete 18 holes under par',
        type: 'course',
        difficulty: 'expert',
        targetScore: -1,
        createdBy: 'Alex Rodriguez',
        participants: ['friend-1', 'friend-3'],
        status: 'completed',
        prize: '👑 Course Champion Crown'
      }
    ];

    // Mock leaderboard
    const mockLeaderboard: LeaderboardEntry[] = Array.from({ length: 20 }, (_, i) => ({
      rank: i + 1,
      playerId: `player-${i + 1}`,
      playerName: `Golfer ${i + 1}`,
      score: Math.floor(Math.random() * 1000) + 2000,
      handicap: Math.floor(Math.random() * 20),
      trend: Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'down' : 'same',
      achievements: Math.floor(Math.random() * 30),
      lastPlayed: Date.now() - Math.random() * 86400000 // Within last 24 hours
    }));

    // Mock achievements
    const mockAchievements: Achievement[] = [
      {
        id: 'ach-1',
        title: 'First Drive',
        description: 'Complete your first golf shot',
        icon: '🎯',
        rarity: 'common',
        unlockedAt: Date.now() - 86400000
      },
      {
        id: 'ach-2',
        title: 'Accuracy Expert',
        description: 'Hit 50 fairway targets',
        icon: '🎯',
        rarity: 'rare',
        unlockedAt: Date.now() - 43200000,
        progress: 47,
        maxProgress: 50
      },
      {
        id: 'ach-3',
        title: 'Distance Demon',
        description: 'Drive over 350 yards',
        icon: '💪',
        rarity: 'epic',
        unlockedAt: Date.now() - 21600000
      },
      {
        id: 'ach-4',
        title: 'Perfect Round',
        description: 'Complete 18 holes without missing a shot',
        icon: '👑',
        rarity: 'legendary',
        unlockedAt: Date.now() - 8640000
      }
    ];

    setFriends(mockFriends);
    setChallenges(mockChallenges);
    setLeaderboard(mockLeaderboard);
    setAchievements(mockAchievements);
  }, []);

  // Filter friends based on search and status
  const filteredFriends = useMemo(() => {
    return friends.filter(friend => {
      const matchesSearch = friend.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'all' ||
        (filterType === 'online' && friend.status === 'online') ||
        (filterType === 'playing' && friend.status === 'playing');
      return matchesSearch && matchesFilter;
    });
  }, [friends, searchQuery, filterType]);

  // Handle friend request
  const handleFriendRequest = (friendId: string) => {
    setFriends(prev => prev.map(friend =>
      friend.id === friendId
        ? { ...friend, isMutual: true }
        : friend
    ));
    if (onFriendAdd) {
      onFriendAdd(friendId);
    }
  };

  // Handle challenge acceptance
  const handleChallengeAccept = (challengeId: string) => {
    setChallenges(prev => prev.map(challenge =>
      challenge.id === challengeId
        ? { ...challenge, participants: [...challenge.participants, currentUser?.id || 'user-1'] }
        : challenge
    ));
    if (onChallengeAccept) {
      onChallengeAccept(challengeId);
    }
  };

  // Get status color
  const getStatusColor = (status: Friend['status']) => {
    switch (status) {
      case 'online':
        return 'text-green-400 bg-green-900/20';
      case 'playing':
        return 'text-blue-400 bg-blue-900/20';
      case 'offline':
        return 'text-gray-400 bg-gray-900/20';
      default:
        return 'text-gray-400 bg-gray-900/20';
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-400 bg-green-900/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-900/20';
      case 'hard':
        return 'text-orange-400 bg-orange-900/20';
      case 'expert':
        return 'text-red-400 bg-red-900/20';
      default:
        return 'text-gray-400 bg-gray-900/20';
    }
  };

  // Get rarity color
  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common':
        return 'border-gray-500 bg-gray-900/20';
      case 'rare':
        return 'border-blue-500 bg-blue-900/20';
      case 'epic':
        return 'border-purple-500 bg-purple-900/20';
      case 'legendary':
        return 'border-yellow-500 bg-yellow-900/20';
      default:
        return 'border-gray-500 bg-gray-900/20';
    }
  };

  // Format time ago
  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-500/20 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-6 h-6 text-blue-500" />
        <h3 className="text-xl font-semibold text-white">Social Features</h3>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-400">Social Hub</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-900/50 border border-blue-500/20 rounded-lg p-1 backdrop-blur-sm">
          <div className="flex gap-1">
            {[
              { id: 'friends', label: 'Friends', icon: Users },
              { id: 'challenges', label: 'Challenges', icon: Target },
              { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
              { id: 'achievements', label: 'Achievements', icon: Award }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-black font-semibold shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Friends Tab */}
      {activeTab === 'friends' && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              {[
                { id: 'all', label: 'All' },
                { id: 'online', label: 'Online' },
                { id: 'playing', label: 'Playing' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setFilterType(filter.id as any)}
                  className={`px-4 py-2 rounded-md transition-all ${
                    filterType === filter.id
                      ? 'bg-blue-500 text-black font-semibold'
                      : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Friends List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFriends.map((friend) => (
              <div
                key={friend.id}
                className="bg-gradient-to-r from-gray-800 to-gray-900 border border-blue-500/20 rounded-lg p-4 hover:border-blue-500/40 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {friend.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{friend.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(friend.status)}`}>
                          {friend.status}
                        </span>
                        <span className="text-gray-400 text-xs">
                          HCP: {friend.handicap}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Score</div>
                    <div className="text-lg font-semibold text-blue-400">
                      {friend.totalScore.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                  <span>Last active: {formatTimeAgo(friend.lastActive)}</span>
                  <span>{friend.achievements} achievements</span>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-500 transition-colors text-sm">
                    <MessageCircle className="w-4 h-4 inline mr-1" />
                    Message
                  </button>
                  <button className="flex-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-500 transition-colors text-sm">
                    <Target className="w-4 h-4 inline mr-1" />
                    Challenge
                  </button>
                  {!friend.isMutual && (
                    <button
                      onClick={() => handleFriendRequest(friend.id)}
                      className="bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-500 transition-colors text-sm"
                    >
                      <UserPlus className="w-4 h-4 inline mr-1" />
                      Add
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredFriends.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No friends found</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      )}

      {/* Challenges Tab */}
      {activeTab === 'challenges' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Active Challenges</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition-colors">
              <Target className="w-4 h-4 inline mr-2" />
              Create Challenge
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className="bg-gradient-to-r from-gray-800 to-gray-900 border border-blue-500/20 rounded-lg p-6 hover:border-blue-500/40 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">{challenge.title}</h4>
                    <p className="text-gray-400 text-sm mb-2">{challenge.description}</p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </span>
                      <span className="text-gray-400 text-xs">
                        by {challenge.createdBy}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Target</div>
                    <div className="text-lg font-semibold text-blue-400">
                      {challenge.targetScore}
                      {challenge.type === 'distance' && ' yd'}
                      {challenge.type === 'putting' && ' putts'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-black/30 rounded p-3">
                    <div className="text-sm text-gray-400">Type</div>
                    <div className="text-white font-semibold capitalize">{challenge.type}</div>
                  </div>
                  <div className="bg-black/30 rounded p-3">
                    <div className="text-sm text-gray-400">Participants</div>
                    <div className="text-white font-semibold">{challenge.participants.length}</div>
                  </div>
                </div>

                {challenge.timeLimit && (
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                    <Clock className="w-4 h-4" />
                    <span>{challenge.timeLimit} minutes</span>
                  </div>
                )}

                {challenge.prize && (
                  <div className="bg-yellow-900/20 border border-yellow-500/20 rounded p-3 mb-4">
                    <div className="flex items-center gap-2 text-yellow-400">
                      <Award className="w-4 h-4" />
                      <span className="text-sm font-semibold">Prize: {challenge.prize}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  {challenge.participants.includes(currentUser?.id || 'user-1') ? (
                    <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition-colors">
                      <CheckCircle className="w-4 h-4 inline mr-2" />
                      Joined
                    </button>
                  ) : (
                    <button
                      onClick={() => handleChallengeAccept(challenge.id)}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition-colors"
                    >
                      <Target className="w-4 h-4 inline mr-2" />
                      Accept Challenge
                    </button>
                  )}
                  <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-2">Global Leaderboard</h3>
            <p className="text-gray-400">See how you rank against golfers worldwide</p>
          </div>

          <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Crown className="w-6 h-6 text-yellow-500" />
                <h4 className="text-lg font-semibold text-white">Top Players</h4>
              </div>
              <div className="text-sm text-gray-400">
                Updated {formatTimeAgo(Date.now() - 3600000)}
              </div>
            </div>

            <div className="space-y-2">
              {leaderboard.slice(0, 10).map((entry, index) => (
                <div
                  key={entry.playerId}
                  className={`flex items-center justify-between p-3 rounded ${
                    index < 3 ? 'bg-yellow-900/20 border border-yellow-500/20' : 'bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${
                        index === 0 ? 'text-yellow-500' :
                        index === 1 ? 'text-gray-400' :
                        index === 2 ? 'text-amber-600' :
                        'text-white'
                      }`}>
                        #{entry.rank}
                      </span>
                      {index < 3 && <Crown className={`w-4 h-4 ${
                        index === 0 ? 'text-yellow-500' :
                        index === 1 ? 'text-gray-400' : 'text-amber-600'
                      }`} />}
                    </div>

                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-xs">
                        {entry.playerName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>

                    <div>
                      <div className="text-white font-semibold">{entry.playerName}</div>
                      <div className="text-sm text-gray-400">HCP: {entry.handicap}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-white font-semibold">
                        {entry.score.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">points</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <TrendingUp className={`w-4 h-4 ${
                        entry.trend === 'up' ? 'text-green-500' :
                        entry.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                      }`} />
                      <span className="text-sm text-gray-400">
                        {entry.achievements} 🏆
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-2">Achievements</h3>
            <p className="text-gray-400">Track your progress and unlock rewards</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`border-2 rounded-lg p-6 transition-all hover:scale-105 ${
                  getRarityColor(achievement.rarity)
                }`}
              >
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <h4 className="text-lg font-semibold text-white mb-1">
                    {achievement.title}
                  </h4>
                  <p className="text-gray-400 text-sm">{achievement.description}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Rarity</span>
                    <span className={`font-semibold capitalize ${
                      achievement.rarity === 'legendary' ? 'text-yellow-400' :
                      achievement.rarity === 'epic' ? 'text-purple-400' :
                      achievement.rarity === 'rare' ? 'text-blue-400' :
                      'text-gray-400'
                    }`}>
                      {achievement.rarity}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Unlocked</span>
                    <span className="text-white">{formatTimeAgo(achievement.unlockedAt)}</span>
                  </div>

                  {achievement.progress !== undefined && achievement.maxProgress && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white">
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${(achievement.progress / achievement.maxProgress) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Achievement Stats */}
          <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20 rounded-lg p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  {achievements.length}
                </div>
                <div className="text-sm text-gray-400">Total Achievements</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400 mb-1">
                  {achievements.filter(a => a.rarity === 'legendary').length}
                </div>
                <div className="text-sm text-gray-400">Legendary</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {achievements.filter(a => a.progress !== undefined).length}
                </div>
                <div className="text-sm text-gray-400">In Progress</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {Math.round(achievements.reduce((sum, a) => {
                    if (a.progress && a.maxProgress) {
                      return sum + (a.progress / a.maxProgress);
                    }
                    return sum + 1;
                  }, 0) / achievements.length * 100)}
                </div>
                <div className="text-sm text-gray-400">Completion %</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>👥 <strong>Phase 3 Features:</strong> Friend Challenges • Global Leaderboards • Achievement System</p>
        <p className="mt-1">🎮 <strong>Next:</strong> Multiplayer Gaming • Real-time Competition</p>
      </div>
    </div>
  );
}