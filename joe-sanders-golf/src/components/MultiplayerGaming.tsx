'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Users,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  MessageCircle,
  Crown,
  Zap,
  Trophy,
  Target,
  Clock,
  Wifi,
  WifiOff,
  Settings,
  UserPlus,
  Send,
  Camera,
  Monitor,
  Gamepad2
} from 'lucide-react';

interface Player {
  id: string;
  name: string;
  avatar?: string;
  handicap: number;
  status: 'waiting' | 'ready' | 'playing' | 'finished';
  score: number;
  currentHole: number;
  totalHoles: number;
  isHost: boolean;
  isMuted: boolean;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected';
}

interface Match {
  id: string;
  type: 'casual' | 'ranked' | 'tournament';
  course: string;
  players: Player[];
  status: 'waiting' | 'in-progress' | 'finished';
  currentHole: number;
  totalHoles: number;
  timeRemaining?: number;
  prizePool?: number;
  spectators: number;
}

interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: number;
  type: 'message' | 'system' | 'achievement';
}

interface MultiplayerGamingProps {
  currentUser?: {
    id: string;
    name: string;
    handicap: number;
    avatar?: string;
  };
  onMatchJoin?: (matchId: string) => void;
  onMatchLeave?: () => void;
}

export default function MultiplayerGaming({
  currentUser,
  onMatchJoin,
  onMatchLeave
}: MultiplayerGamingProps) {
  const [activeView, setActiveView] = useState<'lobby' | 'matchmaking' | 'game' | 'spectator'>('lobby');
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [availableMatches, setAvailableMatches] = useState<Match[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [matchmakingStatus, setMatchmakingStatus] = useState<'idle' | 'searching' | 'found'>('idle');
  const [selectedGameMode, setSelectedGameMode] = useState<'casual' | 'ranked' | 'tournament'>('casual');
  const chatRef = useRef<HTMLDivElement>(null);

  // Mock data
  useEffect(() => {
    // Mock available matches
    const mockMatches: Match[] = [
      {
        id: 'match-1',
        type: 'casual',
        course: 'Stone Valley Championship',
        players: [
          {
            id: 'player-1',
            name: 'Sarah Johnson',
            handicap: 12,
            status: 'waiting',
            score: 0,
            currentHole: 1,
            totalHoles: 18,
            isHost: true,
            isMuted: false,
            connectionQuality: 'excellent'
          },
          {
            id: 'player-2',
            name: 'Mike Chen',
            handicap: 8,
            status: 'ready',
            score: 0,
            currentHole: 1,
            totalHoles: 18,
            isHost: false,
            isMuted: true,
            connectionQuality: 'good'
          }
        ],
        status: 'waiting',
        currentHole: 1,
        totalHoles: 18,
        spectators: 3
      },
      {
        id: 'match-2',
        type: 'ranked',
        course: 'Eagle Ridge Masters',
        players: [
          {
            id: 'player-3',
            name: 'Alex Rodriguez',
            handicap: 6,
            status: 'playing',
            score: -2,
            currentHole: 7,
            totalHoles: 18,
            isHost: true,
            isMuted: false,
            connectionQuality: 'excellent'
          },
          {
            id: 'player-4',
            name: 'Emma Davis',
            handicap: 15,
            status: 'playing',
            score: 1,
            currentHole: 7,
            totalHoles: 18,
            isHost: false,
            isMuted: false,
            connectionQuality: 'good'
          }
        ],
        status: 'in-progress',
        currentHole: 7,
        totalHoles: 18,
        spectators: 12
      },
      {
        id: 'match-3',
        type: 'tournament',
        course: 'Champions Circuit Final',
        players: [
          {
            id: 'player-5',
            name: 'David Wilson',
            handicap: 4,
            status: 'playing',
            score: -5,
            currentHole: 12,
            totalHoles: 18,
            isHost: false,
            isMuted: false,
            connectionQuality: 'excellent'
          },
          {
            id: 'player-6',
            name: 'Lisa Park',
            handicap: 10,
            status: 'playing',
            score: -3,
            currentHole: 12,
            totalHoles: 18,
            isHost: false,
            isMuted: true,
            connectionQuality: 'poor'
          }
        ],
        status: 'in-progress',
        currentHole: 12,
        totalHoles: 18,
        prizePool: 500,
        spectators: 45
      }
    ];

    // Mock chat messages
    const mockMessages: ChatMessage[] = [
      {
        id: 'msg-1',
        playerId: 'system',
        playerName: 'System',
        message: 'Welcome to multiplayer golf! 🎮',
        timestamp: Date.now() - 300000,
        type: 'system'
      },
      {
        id: 'msg-2',
        playerId: 'player-1',
        playerName: 'Sarah Johnson',
        message: 'Ready for some golf? Let\'s play! ⛳',
        timestamp: Date.now() - 240000,
        type: 'message'
      },
      {
        id: 'msg-3',
        playerId: 'player-2',
        playerName: 'Mike Chen',
        message: 'Great course selection! Looking forward to the challenge.',
        timestamp: Date.now() - 180000,
        type: 'message'
      },
      {
        id: 'msg-4',
        playerId: 'system',
        playerName: 'System',
        message: '🏆 Tournament bracket updated - Round 2 begins!',
        timestamp: Date.now() - 120000,
        type: 'achievement'
      }
    ];

    setAvailableMatches(mockMatches);
    setChatMessages(mockMessages);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Handle joining a match
  const handleJoinMatch = (matchId: string) => {
    const match = availableMatches.find(m => m.id === matchId);
    if (match) {
      setCurrentMatch(match);
      setActiveView('game');
      if (onMatchJoin) {
        onMatchJoin(matchId);
      }
    }
  };

  // Handle leaving match
  const handleLeaveMatch = () => {
    setCurrentMatch(null);
    setActiveView('lobby');
    if (onMatchLeave) {
      onMatchLeave();
    }
  };

  // Handle sending chat message
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: `msg-${Date.now()}`,
        playerId: currentUser?.id || 'user-1',
        playerName: currentUser?.name || 'You',
        message: newMessage.trim(),
        timestamp: Date.now(),
        type: 'message'
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  // Handle matchmaking
  const handleStartMatchmaking = () => {
    setMatchmakingStatus('searching');
    // Simulate matchmaking
    setTimeout(() => {
      setMatchmakingStatus('found');
      setTimeout(() => {
        const mockMatch: Match = {
          id: 'new-match',
          type: selectedGameMode,
          course: 'Random Course',
          players: [
            {
              id: currentUser?.id || 'user-1',
              name: currentUser?.name || 'You',
              handicap: currentUser?.handicap || 10,
              status: 'ready',
              score: 0,
              currentHole: 1,
              totalHoles: 18,
              isHost: false,
              isMuted: false,
              connectionQuality: 'excellent'
            },
            {
              id: 'opponent-1',
              name: 'Random Player',
              handicap: Math.floor(Math.random() * 20),
              status: 'ready',
              score: 0,
              currentHole: 1,
              totalHoles: 18,
              isHost: true,
              isMuted: false,
              connectionQuality: 'good'
            }
          ],
          status: 'waiting',
          currentHole: 1,
          totalHoles: 18,
          spectators: 0
        };
        setCurrentMatch(mockMatch);
        setActiveView('game');
        setMatchmakingStatus('idle');
      }, 2000);
    }, 3000);
  };

  // Get connection quality color
  const getConnectionColor = (quality: Player['connectionQuality']) => {
    switch (quality) {
      case 'excellent':
        return 'text-green-400';
      case 'good':
        return 'text-yellow-400';
      case 'poor':
        return 'text-orange-400';
      case 'disconnected':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  // Get game mode color
  const getGameModeColor = (type: Match['type']) => {
    switch (type) {
      case 'casual':
        return 'bg-green-900/20 border-green-500/20';
      case 'ranked':
        return 'bg-blue-900/20 border-blue-500/20';
      case 'tournament':
        return 'bg-purple-900/20 border-purple-500/20';
      default:
        return 'bg-gray-900/20 border-gray-500/20';
    }
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Gamepad2 className="w-6 h-6 text-purple-500" />
        <h3 className="text-xl font-semibold text-white">Multiplayer Gaming</h3>
        <div className="ml-auto flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${matchmakingStatus === 'searching' ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
          <span className="text-sm text-green-400">
            {matchmakingStatus === 'searching' ? 'Finding Match...' : 'Online'}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-1 backdrop-blur-sm">
          <div className="flex gap-1">
            {[
              { id: 'lobby', label: 'Lobby', icon: Users },
              { id: 'matchmaking', label: 'Quick Play', icon: Zap },
              { id: 'game', label: 'Current Game', icon: Play, disabled: !currentMatch },
              { id: 'spectator', label: 'Spectate', icon: Monitor }
            ].map((view) => {
              const Icon = view.icon;
              return (
                <button
                  key={view.id}
                  onClick={() => !view.disabled && setActiveView(view.id as any)}
                  disabled={view.disabled}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                    activeView === view.id
                      ? 'bg-purple-500 text-black font-semibold shadow-lg'
                      : view.disabled
                      ? 'text-gray-600 cursor-not-allowed'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{view.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lobby View */}
      {activeView === 'lobby' && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-2">Game Lobby</h3>
            <p className="text-gray-400">Join existing matches or create your own</p>
          </div>

          {/* Create Match */}
          <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Create New Match</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Game Mode</label>
                <select
                  value={selectedGameMode}
                  onChange={(e) => setSelectedGameMode(e.target.value as any)}
                  className="w-full bg-black/50 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="casual">Casual Match</option>
                  <option value="ranked">Ranked Match</option>
                  <option value="tournament">Tournament</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Course</label>
                <select className="w-full bg-black/50 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none">
                  <option>Stone Valley Championship</option>
                  <option>Eagle Ridge Masters</option>
                  <option>Champions Circuit</option>
                  <option>Random Course</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Max Players</label>
                <select className="w-full bg-black/50 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none">
                  <option>2 Players</option>
                  <option>4 Players</option>
                  <option>8 Players</option>
                </select>
              </div>
            </div>
            <button className="w-full bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-500 transition-colors font-semibold">
              <Play className="w-5 h-5 inline mr-2" />
              Create Match
            </button>
          </div>

          {/* Available Matches */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Available Matches</h4>
            {availableMatches.map((match) => (
              <div
                key={match.id}
                className={`border rounded-lg p-4 transition-all hover:scale-102 ${getGameModeColor(match.type)}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h5 className="text-lg font-semibold text-white">{match.course}</h5>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="capitalize">{match.type}</span>
                      <span>•</span>
                      <span>{match.players.length}/{match.players.length + 2} players</span>
                      {match.prizePool && (
                        <>
                          <span>•</span>
                          <span className="text-yellow-400">${match.prizePool} prize</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Status</div>
                    <div className={`text-sm font-semibold ${
                      match.status === 'waiting' ? 'text-green-400' :
                      match.status === 'in-progress' ? 'text-blue-400' : 'text-gray-400'
                    }`}>
                      {match.status === 'waiting' ? 'Waiting' :
                       match.status === 'in-progress' ? 'In Progress' : 'Finished'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Players</div>
                    <div className="space-y-1">
                      {match.players.map((player) => (
                        <div key={player.id} className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-xs">
                              {player.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="text-sm text-white">{player.name}</span>
                          <span className="text-xs text-gray-400">(HCP: {player.handicap})</span>
                          {player.isHost && <Crown className="w-3 h-3 text-yellow-500" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-2">Match Info</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Hole:</span>
                        <span className="text-white">{match.currentHole}/{match.totalHoles}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Spectators:</span>
                        <span className="text-white">{match.spectators}</span>
                      </div>
                      {match.timeRemaining && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Time Left:</span>
                          <span className="text-white">{formatTime(match.timeRemaining)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleJoinMatch(match.id)}
                    className="flex-1 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-500 transition-colors"
                  >
                    <UserPlus className="w-4 h-4 inline mr-2" />
                    Join Match
                  </button>
                  <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors">
                    <Monitor className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Matchmaking View */}
      {activeView === 'matchmaking' && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-2">Quick Play</h3>
            <p className="text-gray-400">Find a match instantly</p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20 rounded-lg p-6 text-center">
              {matchmakingStatus === 'idle' && (
                <>
                  <Zap className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-white mb-2">Ready to Play?</h4>
                  <p className="text-gray-400 mb-6">Find opponents at your skill level</p>
                  <button
                    onClick={handleStartMatchmaking}
                    className="w-full bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-500 transition-colors font-semibold"
                  >
                    <Zap className="w-5 h-5 inline mr-2" />
                    Find Match
                  </button>
                </>
              )}

              {matchmakingStatus === 'searching' && (
                <>
                  <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <h4 className="text-xl font-semibold text-white mb-2">Finding Match...</h4>
                  <p className="text-gray-400 mb-4">Searching for suitable opponents</p>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                  <button className="w-full mt-4 bg-gray-700 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors">
                    Cancel Search
                  </button>
                </>
              )}

              {matchmakingStatus === 'found' && (
                <>
                  <Trophy className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-white mb-2">Match Found!</h4>
                  <p className="text-gray-400 mb-6">Preparing your game...</p>
                  <div className="animate-pulse text-green-400 font-semibold">Starting in 3... 2... 1...</div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Game View */}
      {activeView === 'game' && currentMatch && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">{currentMatch.course}</h3>
              <p className="text-gray-400">Hole {currentMatch.currentHole} of {currentMatch.totalHoles}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                  className={`p-2 rounded ${isVoiceEnabled ? 'bg-green-600' : 'bg-gray-700'} hover:bg-opacity-80 transition-colors`}
                >
                  {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsMicMuted(!isMicMuted)}
                  className={`p-2 rounded ${isMicMuted ? 'bg-red-600' : 'bg-gray-700'} hover:bg-opacity-80 transition-colors`}
                >
                  {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>
              <button
                onClick={handleLeaveMatch}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition-colors"
              >
                Leave Match
              </button>
            </div>
          </div>

          {/* Players */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentMatch.players.map((player) => (
              <div
                key={player.id}
                className={`bg-gradient-to-r from-gray-800 to-gray-900 border rounded-lg p-4 ${
                  player.id === currentUser?.id ? 'border-purple-500/50' : 'border-blue-500/20'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {player.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">{player.name}</span>
                        {player.isHost && <Crown className="w-4 h-4 text-yellow-500" />}
                        {player.id === currentUser?.id && <span className="text-xs text-purple-400">(You)</span>}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>HCP: {player.handicap}</span>
                        <Wifi className={`w-3 h-3 ${getConnectionColor(player.connectionQuality)}`} />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-400">{player.score > 0 ? `+${player.score}` : player.score}</div>
                    <div className="text-sm text-gray-400">Score</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    player.status === 'ready' ? 'bg-green-900/20 text-green-400' :
                    player.status === 'playing' ? 'bg-blue-900/20 text-blue-400' :
                    player.status === 'finished' ? 'bg-purple-900/20 text-purple-400' :
                    'bg-gray-900/20 text-gray-400'
                  }`}>
                    {player.status}
                  </span>
                  <span className="text-gray-400">
                    Hole {player.currentHole}/{player.totalHoles}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Game Controls */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-blue-500/20 rounded-lg p-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <button className="bg-blue-600 text-white p-3 rounded hover:bg-blue-500 transition-colors">
                <Play className="w-6 h-6" />
              </button>
              <button className="bg-gray-700 text-white p-3 rounded hover:bg-gray-600 transition-colors">
                <Pause className="w-6 h-6" />
              </button>
              <button className="bg-gray-700 text-white p-3 rounded hover:bg-gray-600 transition-colors">
                <SkipForward className="w-6 h-6" />
              </button>
            </div>
            <div className="text-center">
              <p className="text-gray-400">Use your golf simulator controls to take shots</p>
            </div>
          </div>

          {/* Chat */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5 text-blue-500" />
              <h4 className="text-white font-semibold">Match Chat</h4>
            </div>

            <div ref={chatRef} className="h-40 overflow-y-auto mb-4 space-y-2">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex gap-2 ${
                  message.type === 'system' ? 'justify-center' : ''
                }`}>
                  {message.type !== 'system' && (
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-xs">
                        {message.playerName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                  <div className={`flex-1 ${
                    message.type === 'system' ? 'text-center' : ''
                  }`}>
                    {message.type === 'system' ? (
                      <div className="text-sm text-yellow-400 bg-yellow-900/20 rounded px-2 py-1 inline-block">
                        {message.message}
                      </div>
                    ) : message.type === 'achievement' ? (
                      <div className="text-sm text-purple-400 bg-purple-900/20 rounded px-2 py-1">
                        <Trophy className="w-3 h-3 inline mr-1" />
                        {message.message}
                      </div>
                    ) : (
                      <div>
                        <span className="text-sm font-semibold text-blue-400">{message.playerName}:</span>
                        <span className="text-sm text-white ml-2">{message.message}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-black/50 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spectator View */}
      {activeView === 'spectator' && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-2">Spectator Mode</h3>
            <p className="text-gray-400">Watch live matches and learn from pro players</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {availableMatches.filter(m => m.status === 'in-progress').map((match) => (
              <div
                key={match.id}
                className="bg-gradient-to-r from-gray-800 to-gray-900 border border-blue-500/20 rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white">{match.course}</h4>
                    <div className="text-sm text-gray-400">
                      {match.type} • {match.spectators} watching
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Hole</div>
                    <div className="text-lg font-semibold text-blue-400">
                      {match.currentHole}/{match.totalHoles}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {match.players.map((player) => (
                    <div key={player.id} className="flex items-center justify-between bg-black/30 rounded p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-xs">
                            {player.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="text-white font-semibold">{player.name}</div>
                          <div className="text-sm text-gray-400">HCP: {player.handicap}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-400">
                          {player.score > 0 ? `+${player.score}` : player.score}
                        </div>
                        <div className="text-sm text-gray-400">Score</div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full bg-purple-600 text-white px-4 py-3 rounded hover:bg-purple-500 transition-colors font-semibold">
                  <Monitor className="w-5 h-5 inline mr-2" />
                  Watch Match
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>🎮 <strong>Multiplayer Features:</strong> Real-time Matches • Voice Chat • Live Spectating</p>
        <p className="mt-1">🏆 <strong>Game Modes:</strong> Casual • Ranked • Tournament</p>
      </div>
    </div>
  );
}