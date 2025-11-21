'use client';
import { useState } from 'react';
import { Camera, Gamepad2, BarChart3, Cpu, Zap, BookOpen, Trophy, Users, TrendingUp, Smartphone } from 'lucide-react';
import GolfSimulator3D from './GolfSimulator3D';
import VideoSwingAnalysis from './VideoSwingAnalysis';
import PredictivePerformanceAI from './PredictivePerformanceAI';
import PersonalizedLearningPaths from './PersonalizedLearningPaths';
import TournamentSystem from './TournamentSystem';
import SocialFeatures from './SocialFeatures';
import MultiplayerGaming from './MultiplayerGaming';
import AdvancedAnalytics from './AdvancedAnalytics';
import MobileApp from './MobileApp';

interface SwingAnalysis {
  timestamp: number;
  swingSpeed: number;
  swingPath: 'inside' | 'outside' | 'straight';
  clubHeadSpeed: number;
  tempo: number;
  consistency: number;
  feedback: string[];
  score: number;
}

interface GolfSimulatorWithAnalysisProps {
  disabled?: boolean;
  onShotTakenExternal?: (shot: any) => void;
}

export default function GolfSimulatorWithAnalysis({ disabled = false, onShotTakenExternal }: GolfSimulatorWithAnalysisProps) {
  const [activeTab, setActiveTab] = useState<'simulator' | 'analysis' | 'performance' | 'predictive' | 'learning' | 'tournaments' | 'social' | 'multiplayer' | 'analytics' | 'mobile'>('simulator');
  const [swingHistory, setSwingHistory] = useState<SwingAnalysis[]>([]);
  const [shotHistory, setShotHistory] = useState<any[]>([]);
  const [aiCoachFeedback, setAiCoachFeedback] = useState<string | null>(null);
  const [loadingCoachFeedback, setLoadingCoachFeedback] = useState(false);

  const handleSwingAnalysis = (analysis: SwingAnalysis) => {
    setSwingHistory(prev => [analysis, ...prev.slice(0, 19)]); // Keep last 20 analyses
  };

  const handleShotTaken = async (shotData: any) => {
    setShotHistory(prev => [shotData, ...prev.slice(0, 19)]); // Keep last 20 shots
    if (typeof onShotTakenExternal === 'function') {
      try { onShotTakenExternal(shotData) } catch {}
    }
    
    // Get real-time AI coaching feedback
    setLoadingCoachFeedback(true);
    try {
      const response = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shots: [shotData, ...shotHistory.slice(0, 4)], // Last 5 shots for context
          messages: [{
            role: 'user',
            content: `I just hit a shot with ${shotData.club || '7-iron'}. Distance: ${Math.round(shotData.distance || 0)} yards, outcome: ${shotData.outcome || 'straight'}. What's your immediate feedback?`
          }],
          skill: 'intermediate',
          goal: 'consistency'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setAiCoachFeedback(data.response);
        
        // Auto-play voice if available
        if (data.audio) {
          const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`);
          audio.play().catch(console.error);
        }
      }
    } catch (error) {
      console.error('AI coach feedback error:', error);
    } finally {
      setLoadingCoachFeedback(false);
    }
  };

  const tabs = [
    {
      id: 'simulator' as const,
      label: '3D Simulator',
      icon: Gamepad2,
      description: 'Practice shots in immersive 3D'
    },
    {
      id: 'analysis' as const,
      label: 'Swing Analysis',
      icon: Camera,
      description: 'AI-powered swing feedback'
    },
    {
      id: 'predictive' as const,
      label: 'AI Predictor',
      icon: Cpu,
      description: 'Predict shot outcomes'
    },
    {
      id: 'learning' as const,
      label: 'Learning Path',
      icon: BookOpen,
      description: 'Personalized coaching plan'
    },
    {
      id: 'tournaments' as const,
      label: 'Tournaments',
      icon: Trophy,
      description: 'Compete in tournaments'
    },
    {
      id: 'social' as const,
      label: 'Social Hub',
      icon: Users,
      description: 'Friends, challenges & leaderboards'
    },
    {
      id: 'multiplayer' as const,
      label: 'Multiplayer',
      icon: Gamepad2,
      description: 'Real-time competitive gaming'
    },
    {
      id: 'performance' as const,
      label: 'Performance',
      icon: BarChart3,
      description: 'Track your progress'
    },
    {
      id: 'analytics' as const,
      label: 'Analytics',
      icon: TrendingUp,
      description: 'Advanced analytics & insights'
    },
    {
      id: 'mobile' as const,
      label: 'Mobile App',
      icon: Smartphone,
      description: 'Cross-platform mobile development'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Zap className="w-8 h-8 text-yellow-500" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            Advanced Golf Simulator
          </h1>
          <Zap className="w-8 h-8 text-yellow-500" />
        </div>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Experience professional-grade golf simulation with AI-powered swing analysis,
          3D graphics, and comprehensive performance tracking.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="bg-gray-900/50 border border-yellow-500/20 rounded-lg p-1 backdrop-blur-sm">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                    activeTab === tab.id
                      ? 'bg-yellow-500 text-black font-semibold shadow-lg'
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

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">3D Golf Simulator</h2>
              <p className="text-gray-400">Practice your shots in a realistic 3D environment</p>
            </div>
            
            {/* Real-time AI Coach Feedback */}
            {(aiCoachFeedback || loadingCoachFeedback) && (
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                    <Camera className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-yellow-500 mb-2">Uncle Joe&apos;s Real-Time Feedback</h3>
                    {loadingCoachFeedback ? (
                      <p className="text-gray-300 italic">Analyzing your shot...</p>
                    ) : (
                      <p className="text-gray-300 leading-relaxed">{aiCoachFeedback}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-center">
              <GolfSimulator3D
                onShotTaken={handleShotTaken}
                disabled={disabled}
              />
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">AI Swing Analysis</h2>
              <p className="text-gray-400">Get instant feedback on your golf swing technique</p>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-4xl">
                <VideoSwingAnalysis
                  onAnalysisComplete={handleSwingAnalysis}
                  disabled={disabled}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'predictive' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">AI Performance Predictor</h2>
              <p className="text-gray-400">Get AI-powered predictions for shot outcomes and course management</p>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-5xl">
                <PredictivePerformanceAI
                  swingHistory={swingHistory}
                  shotHistory={shotHistory}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'learning' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Personalized Learning Paths</h2>
              <p className="text-gray-400">AI-generated coaching plans tailored to your skill level and goals</p>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-6xl">
                <PersonalizedLearningPaths
                  swingHistory={swingHistory}
                  shotHistory={shotHistory}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tournaments' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Tournament System</h2>
              <p className="text-gray-400">Compete in professional tournaments with prizes and leaderboards</p>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-7xl">
                <TournamentSystem />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Social Features</h2>
              <p className="text-gray-400">Connect with friends, compete in challenges, and climb the leaderboards</p>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-7xl">
                <SocialFeatures
                  currentUser={{
                    id: 'user-1',
                    name: 'Joe Sanders',
                    handicap: 8,
                    avatar: undefined
                  }}
                  onChallengeAccept={(challengeId) => {
                    console.log('Challenge accepted:', challengeId);
                  }}
                  onFriendAdd={(friendId) => {
                    console.log('Friend added:', friendId);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'multiplayer' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Multiplayer Gaming</h2>
              <p className="text-gray-400">Compete in real-time matches with voice chat and live spectating</p>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-7xl">
                <MultiplayerGaming
                  currentUser={{
                    id: 'user-1',
                    name: 'Joe Sanders',
                    handicap: 8,
                    avatar: undefined
                  }}
                  onMatchJoin={(matchId) => {
                    console.log('Joined match:', matchId);
                  }}
                  onMatchLeave={() => {
                    console.log('Left match');
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Performance Dashboard</h2>
              <p className="text-gray-400">Track your improvement and analyze your game</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Swing Analysis Stats */}
              <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Camera className="w-6 h-6 text-blue-500" />
                  <h3 className="text-xl font-semibold text-white">Swing Analysis</h3>
                </div>

                {swingHistory.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/30 rounded p-3">
                        <div className="text-sm text-gray-400">Avg Score</div>
                        <div className="text-2xl font-bold text-blue-400">
                          {Math.round(swingHistory.reduce((sum, swing) => sum + swing.score, 0) / swingHistory.length)}
                        </div>
                      </div>
                      <div className="bg-black/30 rounded p-3">
                        <div className="text-sm text-gray-400">Total Swings</div>
                        <div className="text-2xl font-bold text-blue-400">
                          {swingHistory.length}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-blue-400">Recent Swings</h4>
                      <div className="max-h-40 overflow-y-auto space-y-1">
                        {swingHistory.slice(0, 5).map((swing, index) => (
                          <div key={swing.timestamp} className="flex items-center justify-between bg-black/20 rounded p-2">
                            <span className="text-sm text-gray-400">
                              Swing {swingHistory.length - index}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-white">
                                {swing.swingSpeed.toFixed(1)} mph
                              </span>
                              <span className="text-sm font-semibold text-blue-400">
                                {swing.score}/100
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No swing analyses yet</p>
                    <p className="text-sm">Use the Swing Analysis tab to get started</p>
                  </div>
                )}
              </div>

              {/* Shot Performance Stats */}
              <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/20 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Gamepad2 className="w-6 h-6 text-green-500" />
                  <h3 className="text-xl font-semibold text-white">Shot Performance</h3>
                </div>

                {shotHistory.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/30 rounded p-3">
                        <div className="text-sm text-gray-400">Total Shots</div>
                        <div className="text-2xl font-bold text-green-400">
                          {shotHistory.length}
                        </div>
                      </div>
                      <div className="bg-black/30 rounded p-3">
                        <div className="text-sm text-gray-400">Avg Distance</div>
                        <div className="text-2xl font-bold text-green-400">
                          {Math.round(shotHistory.reduce((sum, shot) => sum + (shot.distance || 0), 0) / shotHistory.length)} yd
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-green-400">Recent Shots</h4>
                      <div className="max-h-40 overflow-y-auto space-y-1">
                        {shotHistory.slice(0, 5).map((shot, index) => (
                          <div key={shot.timestamp || index} className="flex items-center justify-between bg-black/20 rounded p-2">
                            <span className="text-sm text-gray-400">
                              Shot {shotHistory.length - index}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-white">
                                {shot.distance || 0} yd
                              </span>
                              <span className="text-sm font-semibold text-green-400">
                                {shot.outcome || 'N/A'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <Gamepad2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No shots recorded yet</p>
                    <p className="text-sm">Use the 3D Simulator tab to practice</p>
                  </div>
                )}
              </div>
            </div>

            {/* Improvement Insights */}
            {(swingHistory.length > 0 || shotHistory.length > 0) && (
              <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-500/20 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="w-6 h-6 text-yellow-500" />
                  <h3 className="text-xl font-semibold text-white">AI Insights</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-yellow-400">Swing Improvement</h4>
                    <div className="text-sm text-gray-300 space-y-1">
                      {swingHistory.length > 1 && (
                        <>
                          <p>• Your average swing score has {swingHistory[0].score > swingHistory[swingHistory.length - 1].score ? 'improved' : 'stayed consistent'}</p>
                          <p>• Focus on maintaining consistent tempo for better results</p>
                        </>
                      )}
                      <p>• Practice with the swing analyzer to improve your technique</p>
                      <p>• Consider working on your swing path for straighter shots</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-yellow-400">Shot Performance</h4>
                    <div className="text-sm text-gray-300 space-y-1">
                      {shotHistory.length > 1 && (
                        <p>• Your average distance is {Math.round(shotHistory.reduce((sum, shot) => sum + (shot.distance || 0), 0) / shotHistory.length)} yards</p>
                      )}
                      <p>• Work on shot consistency to improve your overall game</p>
                      <p>• Practice different clubs to understand distance control</p>
                      <p>• Use the simulator to experiment with shot shapes</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Advanced Analytics</h2>
              <p className="text-gray-400">Comprehensive data insights, automated reporting, and performance monitoring</p>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-7xl">
                <AdvancedAnalytics />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mobile' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Mobile App Development</h2>
              <p className="text-gray-400">Cross-platform React Native app with native features and app store deployment</p>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-7xl">
                <MobileApp />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="text-center text-sm text-gray-500">
        <p>🎯 <strong>All Phases Complete:</strong> ✅ 3D Graphics • ✅ AI Analysis • ✅ Tournament System • ✅ Social Features • ✅ Multiplayer Gaming • ✅ Advanced Analytics • ✅ Mobile App</p>
        <p className="mt-1">🚀 <strong>Ready for Production:</strong> Enterprise-grade golf simulator platform with comprehensive features</p>
      </div>
    </div>
  );
}