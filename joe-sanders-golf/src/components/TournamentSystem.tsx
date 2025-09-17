'use client';
import { useState, useEffect, useMemo } from 'react';
import {
  Trophy,
  Users,
  Calendar,
  Target,
  Award,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Crown,
  Medal,
  Star,
  Zap,
  TrendingUp,
  UserPlus,
  Settings
} from 'lucide-react';

interface TournamentPlayer {
  id: string;
  name: string;
  avatar?: string;
  handicap: number;
  totalScore: number;
  roundsPlayed: number;
  position: number;
  status: 'registered' | 'playing' | 'completed' | 'eliminated';
  scores: number[];
  earnings: number;
}

interface TournamentRound {
  id: string;
  name: string;
  holes: number;
  par: number;
  status: 'registration' | 'active' | 'completed' | 'cancelled';
  startTime: number;
  endTime?: number;
  leaderboard: TournamentPlayer[];
}

interface Tournament {
  id: string;
  name: string;
  description: string;
  type: 'stroke-play' | 'match-play' | 'stableford';
  format: 'single-elimination' | 'round-robin' | 'leaderboard';
  status: 'registration' | 'active' | 'completed' | 'cancelled';
  maxPlayers: number;
  currentPlayers: number;
  entryFee: number;
  prizePool: number;
  rounds: TournamentRound[];
  players: TournamentPlayer[];
  startDate: number;
  endDate?: number;
  winner?: TournamentPlayer;
  createdBy: string;
  rules: string[];
}

interface TournamentSystemProps {
  currentUser?: {
    id: string;
    name: string;
    handicap: number;
  };
  onTournamentJoin?: (tournamentId: string) => void;
  onTournamentLeave?: (tournamentId: string) => void;
}

export default function TournamentSystem({
  currentUser,
  onTournamentJoin,
  onTournamentLeave
}: TournamentSystemProps) {
  const [activeTab, setActiveTab] = useState<'browse' | 'my-tournaments' | 'create' | 'leaderboard'>('browse');
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'registration' | 'completed'>('all');

  // Mock data for demonstration
  useEffect(() => {
    const mockTournaments: Tournament[] = [
      {
        id: 'tournament-1',
        name: 'Uncle Joe Memorial Classic',
        description: 'Annual tournament honoring the legend himself',
        type: 'stroke-play',
        format: 'leaderboard',
        status: 'active',
        maxPlayers: 64,
        currentPlayers: 42,
        entryFee: 50,
        prizePool: 2100,
        startDate: Date.now() - 86400000, // Started yesterday
        createdBy: 'admin',
        rules: [
          '18 holes, stroke play',
          'Handicap allowance: Full',
          'Ties broken by scorecard playoff',
          'Prizes for top 3 finishers'
        ],
        players: Array.from({ length: 42 }, (_, i) => ({
          id: `player-${i + 1}`,
          name: `Golfer ${i + 1}`,
          handicap: Math.floor(Math.random() * 20),
          totalScore: Math.floor(Math.random() * 20) - 10, // -10 to +10
          roundsPlayed: 1,
          position: i + 1,
          status: 'playing' as const,
          scores: [Math.floor(Math.random() * 20) - 10],
          earnings: 0
        })),
        rounds: [
          {
            id: 'round-1',
            name: 'Round 1',
            holes: 18,
            par: 72,
            status: 'active',
            startTime: Date.now() - 86400000,
            leaderboard: []
          }
        ]
      },
      {
        id: 'tournament-2',
        name: 'Stones Golf Invitational',
        description: 'Elite tournament for serious players',
        type: 'match-play',
        format: 'single-elimination',
        status: 'registration',
        maxPlayers: 32,
        currentPlayers: 28,
        entryFee: 100,
        prizePool: 2800,
        startDate: Date.now() + 86400000 * 3, // Starts in 3 days
        createdBy: 'admin',
        rules: [
          'Match play format',
          'Single elimination bracket',
          '18 holes per match',
          'Extra holes for ties'
        ],
        players: [],
        rounds: []
      },
      {
        id: 'tournament-3',
        name: 'Weekend Warrior Challenge',
        description: 'Fun tournament for all skill levels',
        type: 'stableford',
        format: 'leaderboard',
        status: 'registration',
        maxPlayers: 100,
        currentPlayers: 67,
        entryFee: 25,
        prizePool: 1675,
        startDate: Date.now() + 86400000 * 7, // Starts in 1 week
        createdBy: 'admin',
        rules: [
          'Stableford scoring system',
          'Points for each hole',
          'Handicap allowance: 95%',
          'Weekly prizes'
        ],
        players: [],
        rounds: []
      }
    ];

    setTournaments(mockTournaments);
  }, []);

  // Filter tournaments
  const filteredTournaments = useMemo(() => {
    return tournaments.filter(tournament => {
      switch (filter) {
        case 'active':
          return tournament.status === 'active';
        case 'registration':
          return tournament.status === 'registration';
        case 'completed':
          return tournament.status === 'completed';
        default:
          return true;
      }
    });
  }, [tournaments, filter]);

  // Create new tournament
  const handleCreateTournament = (tournamentData: Partial<Tournament>) => {
    const newTournament: Tournament = {
      id: `tournament-${Date.now()}`,
      name: tournamentData.name || 'New Tournament',
      description: tournamentData.description || '',
      type: tournamentData.type || 'stroke-play',
      format: tournamentData.format || 'leaderboard',
      status: 'registration',
      maxPlayers: tournamentData.maxPlayers || 32,
      currentPlayers: 0,
      entryFee: tournamentData.entryFee || 0,
      prizePool: 0,
      rounds: [],
      players: [],
      startDate: tournamentData.startDate || Date.now() + 86400000 * 7,
      createdBy: currentUser?.id || 'anonymous',
      rules: tournamentData.rules || []
    };

    setTournaments(prev => [...prev, newTournament]);
    setIsCreating(false);
    setActiveTab('browse');
  };

  // Join tournament
  const handleJoinTournament = (tournamentId: string) => {
    setTournaments(prev => prev.map(tournament => {
      if (tournament.id === tournamentId && tournament.currentPlayers < tournament.maxPlayers) {
        const newPlayer: TournamentPlayer = {
          id: currentUser?.id || `player-${Date.now()}`,
          name: currentUser?.name || 'Anonymous Player',
          handicap: currentUser?.handicap || 0,
          totalScore: 0,
          roundsPlayed: 0,
          position: tournament.currentPlayers + 1,
          status: 'registered',
          scores: [],
          earnings: 0
        };

        return {
          ...tournament,
          currentPlayers: tournament.currentPlayers + 1,
          players: [...tournament.players, newPlayer],
          prizePool: tournament.prizePool + tournament.entryFee
        };
      }
      return tournament;
    }));

    if (onTournamentJoin) {
      onTournamentJoin(tournamentId);
    }
  };

  // Get tournament status color
  const getStatusColor = (status: Tournament['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-900/20';
      case 'registration':
        return 'text-blue-400 bg-blue-900/20';
      case 'registration':
        return 'text-yellow-400 bg-yellow-900/20';
      case 'completed':
        return 'text-gray-400 bg-gray-900/20';
      case 'cancelled':
        return 'text-red-400 bg-red-900/20';
      default:
        return 'text-gray-400 bg-gray-900/20';
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border border-emerald-500/20 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-6 h-6 text-emerald-500" />
        <h3 className="text-xl font-semibold text-white">Tournament System</h3>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-400">Live Tournaments</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-900/50 border border-emerald-500/20 rounded-lg p-1 backdrop-blur-sm">
          <div className="flex gap-1">
            {[
              { id: 'browse', label: 'Browse', icon: Trophy },
              { id: 'my-tournaments', label: 'My Tournaments', icon: Users },
              { id: 'create', label: 'Create', icon: Settings },
              { id: 'leaderboard', label: 'Leaderboard', icon: Crown }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                    activeTab === tab.id
                      ? 'bg-emerald-500 text-black font-semibold shadow-lg'
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

      {/* Filter */}
      {activeTab === 'browse' && (
        <div className="flex justify-center mb-6">
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'active', label: 'Active' },
              { id: 'registration', label: 'Registration' },
              { id: 'completed', label: 'Completed' }
            ].map((filterOption) => (
              <button
                key={filterOption.id}
                onClick={() => setFilter(filterOption.id as any)}
                className={`px-4 py-2 rounded-md transition-all ${
                  filter === filterOption.id
                    ? 'bg-emerald-500 text-black font-semibold'
                    : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Browse Tournaments */}
      {activeTab === 'browse' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => (
            <div
              key={tournament.id}
              className="bg-gradient-to-br from-gray-800 to-gray-900 border border-emerald-500/20 rounded-lg p-6 hover:border-emerald-500/40 transition-all cursor-pointer"
              onClick={() => setSelectedTournament(tournament)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">{tournament.name}</h4>
                  <p className="text-sm text-gray-400 line-clamp-2">{tournament.description}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(tournament.status)}`}>
                  {tournament.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-black/30 rounded p-3">
                  <div className="text-sm text-gray-400">Players</div>
                  <div className="text-lg font-semibold text-emerald-400">
                    {tournament.currentPlayers}/{tournament.maxPlayers}
                  </div>
                </div>
                <div className="bg-black/30 rounded p-3">
                  <div className="text-sm text-gray-400">Entry Fee</div>
                  <div className="text-lg font-semibold text-white">
                    {formatCurrency(tournament.entryFee)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  {formatDate(tournament.startDate)}
                </div>
                <div className="flex items-center gap-1 text-emerald-400">
                  <Award className="w-4 h-4" />
                  {formatCurrency(tournament.prizePool)}
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoinTournament(tournament.id);
                  }}
                  disabled={tournament.currentPlayers >= tournament.maxPlayers || tournament.status !== 'registration'}
                  className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {tournament.currentPlayers >= tournament.maxPlayers ? 'Full' : 'Join Tournament'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTournament(tournament);
                  }}
                  className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tournament Details Modal */}
      {selectedTournament && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-emerald-500/20 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedTournament.name}</h2>
                  <p className="text-gray-400">{selectedTournament.description}</p>
                </div>
                <button
                  onClick={() => setSelectedTournament(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Tournament Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-black/30 rounded p-4 text-center">
                  <Users className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{selectedTournament.currentPlayers}</div>
                  <div className="text-sm text-gray-400">Players</div>
                </div>
                <div className="bg-black/30 rounded p-4 text-center">
                  <Award className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{formatCurrency(selectedTournament.prizePool)}</div>
                  <div className="text-sm text-gray-400">Prize Pool</div>
                </div>
                <div className="bg-black/30 rounded p-4 text-center">
                  <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{selectedTournament.type}</div>
                  <div className="text-sm text-gray-400">Format</div>
                </div>
                <div className="bg-black/30 rounded p-4 text-center">
                  <Calendar className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">{formatDate(selectedTournament.startDate)}</div>
                  <div className="text-sm text-gray-400">Start Date</div>
                </div>
              </div>

              {/* Rules */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Tournament Rules</h3>
                <div className="bg-black/20 rounded p-4">
                  <ul className="space-y-2">
                    {selectedTournament.rules.map((rule, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <span className="text-emerald-400 mt-1">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Leaderboard */}
              {selectedTournament.players.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Current Leaderboard</h3>
                  <div className="bg-black/20 rounded overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-emerald-900/20">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-400">Pos</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-400">Player</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-400">Score</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-400">Rounds</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-400">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedTournament.players
                            .sort((a, b) => a.totalScore - b.totalScore)
                            .slice(0, 10)
                            .map((player, index) => (
                            <tr key={player.id} className="border-t border-gray-700/50">
                              <td className="px-4 py-3 text-sm text-white font-semibold">
                                {index + 1}
                                {index < 3 && (
                                  <Crown className={`w-4 h-4 inline ml-1 ${
                                    index === 0 ? 'text-yellow-500' :
                                    index === 1 ? 'text-gray-400' : 'text-amber-600'
                                  }`} />
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm text-white">{player.name}</td>
                              <td className="px-4 py-3 text-sm text-white">
                                {player.totalScore > 0 ? `+${player.totalScore}` : player.totalScore}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-400">{player.roundsPlayed}</td>
                              <td className="px-4 py-3 text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  player.status === 'playing' ? 'bg-green-900/50 text-green-400' :
                                  player.status === 'completed' ? 'bg-blue-900/50 text-blue-400' :
                                  'bg-gray-900/50 text-gray-400'
                                }`}>
                                  {player.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => handleJoinTournament(selectedTournament.id)}
                  disabled={selectedTournament.currentPlayers >= selectedTournament.maxPlayers || selectedTournament.status !== 'registration'}
                  className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {selectedTournament.currentPlayers >= selectedTournament.maxPlayers ? 'Tournament Full' : 'Join Tournament'}
                </button>
                <button
                  onClick={() => setSelectedTournament(null)}
                  className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Tournament */}
      {activeTab === 'create' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-emerald-500/20 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-emerald-500" />
              <h3 className="text-xl font-semibold text-white">Create Tournament</h3>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleCreateTournament({
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                type: formData.get('type') as Tournament['type'],
                format: formData.get('format') as Tournament['format'],
                maxPlayers: parseInt(formData.get('maxPlayers') as string),
                entryFee: parseFloat(formData.get('entryFee') as string),
                startDate: new Date(formData.get('startDate') as string).getTime(),
                rules: (formData.get('rules') as string).split('\n').filter(rule => rule.trim())
              });
            }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tournament Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full bg-black/50 border border-gray-600 rounded px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                    placeholder="Enter tournament name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tournament Type
                  </label>
                  <select
                    name="type"
                    required
                    className="w-full bg-black/50 border border-gray-600 rounded px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="stroke-play">Stroke Play</option>
                    <option value="match-play">Match Play</option>
                    <option value="stableford">Stableford</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Format
                  </label>
                  <select
                    name="format"
                    required
                    className="w-full bg-black/50 border border-gray-600 rounded px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="leaderboard">Leaderboard</option>
                    <option value="single-elimination">Single Elimination</option>
                    <option value="round-robin">Round Robin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Max Players
                  </label>
                  <input
                    name="maxPlayers"
                    type="number"
                    min="2"
                    max="128"
                    defaultValue="32"
                    required
                    className="w-full bg-black/50 border border-gray-600 rounded px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Entry Fee ($)
                  </label>
                  <input
                    name="entryFee"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue="25"
                    required
                    className="w-full bg-black/50 border border-gray-600 rounded px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    name="startDate"
                    type="datetime-local"
                    required
                    className="w-full bg-black/50 border border-gray-600 rounded px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full bg-black/50 border border-gray-600 rounded px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="Describe your tournament"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tournament Rules (one per line)
                </label>
                <textarea
                  name="rules"
                  rows={4}
                  defaultValue="18 holes, stroke play
Handicap allowance: Full
Ties broken by scorecard playoff
Prizes for top 3 finishers"
                  className="w-full bg-black/50 border border-gray-600 rounded px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="Enter tournament rules"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-500 transition-colors"
                >
                  Create Tournament
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('browse')}
                  className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* My Tournaments */}
      {activeTab === 'my-tournaments' && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">My Tournaments</h3>
          <p className="text-gray-400">Tournaments you&apos;ve joined will appear here</p>
          <button
            onClick={() => setActiveTab('browse')}
            className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-500 transition-colors"
          >
            Browse Tournaments
          </button>
        </div>
      )}

      {/* Global Leaderboard */}
      {activeTab === 'leaderboard' && (
        <div className="text-center py-12">
          <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Global Leaderboard</h3>
          <p className="text-gray-400">Coming soon - Track your ranking across all tournaments</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>🏆 <strong>Phase 3 Features:</strong> Tournament System • Social Features • Multiplayer Gaming</p>
        <p className="mt-1">🎯 <strong>Next:</strong> Friend Challenges • Global Leaderboards • Real-time Multiplayer</p>
      </div>
    </div>
  );
}