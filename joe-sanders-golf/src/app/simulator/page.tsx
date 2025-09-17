'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AICoachWidget } from '@/components/AICoachWidget';
import { ConvaiCaddie } from '@/components/ConvaiCaddie';
import { ShotHistory } from '@/components/ShotHistory';
import { PerformanceMetrics } from '@/components/PerformanceMetrics';
import { PersonalizedCoaching } from '@/components/PersonalizedCoaching';
import { MobileOptimization } from '@/components/MobileOptimization';
import { BroadcastUI } from '@/components/BroadcastUI';
import { ChallengeLeaderboard } from '@/components/ChallengeLeaderboard';

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic';
import {
  Target,
  MessageCircle,
  Settings,
  Trophy,
  Crown,
  Zap,
  Star,
  Lock,
  CheckCircle,
  X
} from 'lucide-react';

// Pricing tiers for AI Simulator
const simulatorTiers = {
  free: {
    name: 'Practice Range',
    price: '$0',
    period: 'Free',
    features: [
      'Basic golf simulation',
      '5 shots per session',
      'Basic swing analysis',
      'Limited voice coaching',
      'Session statistics'
    ],
    limitations: [
      'No advanced AI features',
      'Limited shot analysis',
      'No voice caddie',
      'Basic courses only'
    ],
    maxShots: 5,
    color: 'gray'
  },
  pro: {
    name: 'Pro Simulator',
    price: '$9.99',
    period: 'month',
    features: [
      'Unlimited shots',
      'Advanced AI swing analysis',
      'Voice caddie (ElevenLabs)',
      'Multiple courses',
      'Detailed performance metrics',
      'Shot replay & analysis',
      'Personal improvement tracking',
      'Tournament mode'
    ],
    limitations: [],
    maxShots: -1, // unlimited
    color: 'gold'
  },
  elite: {
    name: 'Elite Coach',
    price: '$19.99',
    period: 'month',
    features: [
      'Everything in Pro',
      '1-on-1 AI coaching sessions',
      'Video swing analysis',
      'Custom drill recommendations',
      'Performance predictions',
      'Tournament strategy planning',
      'Priority support',
      'Exclusive content access'
    ],
    limitations: [],
    maxShots: -1, // unlimited
    color: 'platinum'
  }
};

export default function SimulatorPage() {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [userTier, setUserTier] = useState<'free' | 'pro' | 'elite'>('free');
  const [showCoach, setShowCoach] = useState(false);
  const [showCaddie, setShowCaddie] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    totalShots: 0,
    averageDistance: 0,
    bestShot: 0,
    accuracy: 0
  });
  const [shotHistory, setShotHistory] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('Practice Range');
  const [gameMode, setGameMode] = useState<'practice' | 'tournament'>('practice');

  // Initialize user and session
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
        setUser(user);

        if (user && supabase) {
          // Authenticated user - check subscription tier
          const { data: profile } = await supabase
            .from('profiles')
            .select('subscription_tier, is_fan_club_member')
            .eq('id', user.id)
            .single();

          // Determine tier based on subscription
          if (profile?.subscription_tier === 'elite' || profile?.subscription_tier === 'pro') {
            setUserTier(profile.subscription_tier);
          } else if (profile?.is_fan_club_member) {
            setUserTier('pro');
          } else {
            setUserTier('free');
          }

          // Initialize game session for authenticated users
          const { data: session } = await supabase
            .from('game_sessions')
            .insert({
              user_id: user.id,
              course_name: selectedCourse,
              total_score: 0,
              game_mode: gameMode
            })
            .select('id')
            .single();

          if (session) {
            setCurrentSessionId(session.id);
          }
        } else {
          // Guest user - set demo mode
          setIsGuestMode(true);
          setUserTier('free'); // Demo users get free tier experience
          setCurrentSessionId('demo-session-' + Date.now()); // Create a demo session ID
        }
      } catch (error) {
        console.error('Failed to initialize:', error);
        // Fallback to guest mode on error
        setIsGuestMode(true);
        setUserTier('free');
        setCurrentSessionId('demo-session-' + Date.now());
      }
    };

    initializeUser();
  }, [selectedCourse, gameMode]);

    const handleShotTaken = async (shotData: { club_used?: string; club?: string; outcome: string; distance: number; accuracy?: number }) => {
    if (!currentSessionId) return;

    // Check shot limits for free tier (including demo users)
    if (userTier === 'free' && sessionStats.totalShots >= simulatorTiers.free.maxShots) {
      if (isGuestMode) {
        alert('Demo limit reached! Sign up for a free account to continue, or upgrade to Pro for unlimited shots.');
      } else {
        alert('Free tier limit reached! Upgrade to Pro for unlimited shots.');
      }
      return;
    }

    try {
      // Save shot to database only for authenticated users
      if (supabase && user && !isGuestMode) {
        await supabase.from('shots').insert({
          session_id: currentSessionId,
          hole_number: 1,
          shot_number: sessionStats.totalShots + 1,
          club_used: shotData.club_used || shotData.club,
          outcome: shotData.outcome,
          distance: shotData.distance,
          accuracy: shotData.accuracy || 0,
          notes: `AI Coach will analyze this shot`
        });
      }

      // Update session stats (works for both authenticated and guest users)
      setSessionStats(prev => ({
        totalShots: prev.totalShots + 1,
        averageDistance: Math.round((prev.averageDistance * prev.totalShots + shotData.distance) / (prev.totalShots + 1)),
        bestShot: Math.max(prev.bestShot, shotData.distance),
        accuracy: Math.round((prev.accuracy * prev.totalShots + (shotData.accuracy || 75)) / (prev.totalShots + 1))
      }));

      // Add to shot history (works for both authenticated and guest users)
      setShotHistory(prev => [...prev, {
        ...shotData,
        shot_number: sessionStats.totalShots + 1,
        timestamp: Date.now()
      }]);

      // Auto-show AI coach for Pro/Elite users, or for demo users to showcase the feature
      if (userTier !== 'free' || isGuestMode) {
        setShowCoach(true);
      }

    } catch (error) {
      console.error('Failed to save shot:', error);
    }
  };

  const handleUpgrade = async (tier: 'pro' | 'elite') => {
    if (!user) {
      // Redirect to auth
      if (typeof window !== 'undefined') {
        window.location.href = '/auth';
      }
      return;
    }

    try {
      const response = await fetch('/api/create-simulator-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, tier }),
      });

      if (response.ok) {
        const { url } = await response.json();
        if (typeof window !== 'undefined') {
          window.location.href = url;
        }
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
    }
  };

  const currentTier = simulatorTiers[userTier];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] text-white" role="application" aria-label="Golf Simulator Application">
      {/* Demo Banner for Guest Users */}
      {isGuestMode && (
        <div className="bg-gradient-to-r from-[#d4af37] to-[#f4e87c] text-[#0a0a0a] p-4 text-center border-b border-[#d4af3740]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-lg font-bold mb-2">🤖 Try Uncle Joe&apos;s AI Golf Tutor - FREE Demo!</h2>
            <p className="text-sm">
              Take up to {simulatorTiers.free.maxShots} shots and experience AI-powered swing analysis and voice coaching.
              <span className="ml-2">
                <a href="/auth" className="underline font-semibold hover:no-underline">
                  Sign up for free
                </a>
                {" "}to continue playing!
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="p-6 border-b border-[#d4af3740]" role="banner">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#d4af37] to-[#f4e87c] bg-clip-text text-transparent">
              Uncle Joe&apos;s AI Golf Simulator
            </h1>
            <p className="text-gray-400 mt-1" aria-live="polite">
              {isGuestMode ? `Demo Mode • ${simulatorTiers.free.maxShots - sessionStats.totalShots} shots remaining` :
               currentTier.name + " Plan • " + (userTier === 'free' ? `${simulatorTiers.free.maxShots - sessionStats.totalShots} shots remaining` : 'Unlimited')}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Tier Badge */}
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
              userTier === 'free' ? 'bg-gray-600 text-gray-300' :
              userTier === 'pro' ? 'bg-[#d4af37] text-[#0a0a0a]' :
              'bg-gradient-to-r from-[#d4af37] to-[#f4e87c] text-[#0a0a0a]'
            }`}>
              {userTier === 'free' ? 'FREE' : userTier === 'pro' ? 'PRO' : 'ELITE'}
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-400">Session Stats</p>
              <div className="flex items-center gap-4 text-sm">
                <span>Shots: {sessionStats.totalShots}</span>
                <span>Avg: {sessionStats.averageDistance}yd</span>
                <span>Best: {sessionStats.bestShot}yd</span>
                <span>Acc: {sessionStats.accuracy}%</span>
              </div>
            </div>

            <div className="flex gap-2">
              {(userTier !== 'free' || isGuestMode) && (
                <button
                  onClick={() => setShowCoach(!showCoach)}
                  className={`p-3 rounded-full transition-colors ${
                    showCoach
                      ? 'bg-[#d4af37] text-[#0a0a0a]'
                      : 'bg-[#2a2a2a] text-[#d4af37] hover:bg-[#3a3a3a]'
                  }`}
                  title={isGuestMode ? "Try AI Golf Coach (Demo)" : "AI Golf Coach"}
                >
                  <Target size={20} />
                </button>
              )}

              {userTier === 'elite' && (
                <button
                  onClick={() => setShowCaddie(!showCaddie)}
                  className={`p-3 rounded-full transition-colors ${
                    showCaddie
                      ? 'bg-[#d4af37] text-[#0a0a0a]'
                      : 'bg-[#2a2a2a] text-[#d4af37] hover:bg-[#3a3a3a]'
                  }`}
                  title="Voice Caddie"
                >
                  <MessageCircle size={20} />
                </button>
              )}

              <button
                onClick={() => setShowPricing(!showPricing)}
                className="p-3 rounded-full bg-[#2a2a2a] text-[#d4af37] hover:bg-[#3a3a3a] transition-colors"
                title="Upgrade Plans"
              >
                <Crown size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Pricing Modal */}
      {showPricing && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#d4af3740]">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#d4af37]">AI Simulator Plans</h2>
                <button
                  onClick={() => setShowPricing(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(simulatorTiers).map(([tierKey, tier]) => (
                  <div
                    key={tierKey}
                    className={`relative bg-[#0a0a0a] rounded-lg p-6 border ${
                      userTier === tierKey ? 'border-[#d4af37]' : 'border-[#2a2a2a]'
                    }`}
                  >
                    {userTier === tierKey && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-[#d4af37] text-[#0a0a0a] px-3 py-1 rounded-full text-sm font-semibold">
                          Current Plan
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-[#d4af37] mb-2">{tier.name}</h3>
                      <div className="text-3xl font-bold text-white mb-1">
                        {tier.price}
                        <span className="text-lg text-gray-400">/{tier.period}</span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      {tier.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-300">{feature}</span>
                        </div>
                      ))}

                      {tier.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <X size={16} className="text-red-500 flex-shrink-0" />
                          <span className="text-sm text-gray-500">{limitation}</span>
                        </div>
                      ))}
                    </div>

                    {tierKey === 'free' ? (
                      <button className="w-full bg-gray-600 text-gray-300 px-4 py-2 rounded font-semibold cursor-not-allowed">
                        Current Plan
                      </button>
                    ) : userTier === tierKey ? (
                      <button className="w-full bg-[#d4af37] text-[#0a0a0a] px-4 py-2 rounded font-semibold">
                        Current Plan
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpgrade(tierKey as 'pro' | 'elite')}
                        className="w-full bg-gradient-to-r from-[#d4af37] to-[#a2852c] text-[#0a0a0a] px-4 py-2 rounded font-semibold hover:from-[#b8942c] hover:to-[#8a6d23] transition-colors"
                      >
                        Upgrade to {tier.name}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Game Area */}
          <section className="lg:col-span-3" aria-labelledby="game-area-heading">
            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#d4af3740]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 id="game-area-heading" className="text-xl font-semibold text-[#d4af37] mb-1">Course: {selectedCourse}</h2>
                  <p className="text-sm text-gray-400">Mode: {gameMode === 'practice' ? 'Practice' : 'Tournament'}</p>
                </div>

                {userTier === 'free' && sessionStats.totalShots >= simulatorTiers.free.maxShots && (
                  <div className="bg-red-900/20 border border-red-500 rounded-lg p-3" role="alert" aria-live="assertive">
                    <p className="text-red-400 text-sm flex items-center gap-2">
                      <Lock size={16} aria-hidden="true" />
                      Shot limit reached! Upgrade for unlimited access.
                    </p>
                  </div>
                )}
              </div>

              <div className="relative">
                {/* Broadcast-Style Overlay */}
                <BroadcastUI score={sessionStats.totalShots} />

                {/* 3D Game Canvas */}
                <div className="w-full h-[600px] bg-blue-300 flex items-center justify-center" role="img" aria-label="3D Golf Course Simulation">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">3D Golf Simulator</h3>
                    <p className="text-gray-300">Loading advanced 3D experience...</p>
                    {/* TODO: Replace with AdvancedGame component */}
                    {/* <AdvancedGame /> */}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Coach Widget - For Pro/Elite and Demo Users */}
            {(userTier !== 'free' || isGuestMode) && (
              <AICoachWidget
                sessionId={currentSessionId}
                isOpen={showCoach}
                onClose={() => setShowCoach(false)}
              />
            )}

            {/* Performance Metrics */}
            <PerformanceMetrics
              stats={sessionStats}
              shots={shotHistory}
            />

            {/* Shot History */}
            <ShotHistory
              shots={shotHistory}
              onReplayShot={(index) => {
                // Add replay functionality - we'll need to access the game instance
                console.log('Replay shot:', index);
                // This will be implemented when we add replay to the GolfSimulator
              }}
              onClearHistory={() => {
                setShotHistory([]);
                setSessionStats({
                  totalShots: 0,
                  averageDistance: 0,
                  bestShot: 0,
                  accuracy: 0
                });
              }}
            />

            {/* Challenge Leaderboard */}
            <ChallengeLeaderboard />
            <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#d4af3740]">
              <h3 className="text-lg font-semibold text-[#d4af37] mb-4 flex items-center gap-2">
                <Settings size={20} />
                Course Select
              </h3>

              <div className="space-y-2">
                {['Practice Range', 'Augusta National', 'Pebble Beach', 'St. Andrews'].map((course) => (
                  <button
                    key={course}
                    onClick={() => setSelectedCourse(course)}
                    disabled={userTier === 'free' && course !== 'Practice Range'}
                    className={`w-full text-left px-3 py-2 rounded transition-colors ${
                      selectedCourse === course
                        ? 'bg-[#d4af37] text-[#0a0a0a]'
                        : userTier === 'free' && course !== 'Practice Range'
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{course}</span>
                      {userTier === 'free' && course !== 'Practice Range' && <Lock size={14} />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Game Mode */}
            <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#d4af3740]">
              <h3 className="text-lg font-semibold text-[#d4af37] mb-4 flex items-center gap-2">
                <Trophy size={20} />
                Game Mode
              </h3>

              <div className="space-y-2">
                <button
                  onClick={() => setGameMode('practice')}
                  className={`w-full text-left px-3 py-2 rounded transition-colors ${
                    gameMode === 'practice'
                      ? 'bg-[#d4af37] text-[#0a0a0a]'
                      : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]'
                  }`}
                >
                  Practice Mode
                </button>
                <button
                  onClick={() => setGameMode('tournament')}
                  disabled={userTier === 'free'}
                  className={`w-full text-left px-3 py-2 rounded transition-colors ${
                    gameMode === 'tournament'
                      ? 'bg-[#d4af37] text-[#0a0a0a]'
                      : userTier === 'free'
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Tournament Mode</span>
                    {userTier === 'free' && <Lock size={14} />}
                  </div>
                </button>
              </div>
            </div>

            {/* Mobile Optimization */}
            <MobileOptimization
              isMobile={typeof window !== 'undefined' && window.innerWidth <= 1024}
            />

            {/* Simple Golf Simulator Interface */}
            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#d4af3740]">
              <h3 className="text-lg font-semibold text-[#d4af37] mb-4">Golf Simulator</h3>
              <div className="text-center">
                <div className="bg-green-900 rounded-lg p-8 mb-4 relative">
                  <div className="text-4xl mb-4">🏌️‍♂️</div>
                  <p className="text-gray-300 mb-4">Take your shot at {selectedCourse}</p>
                  
                  {/* Simple shot interface */}
                  <div className="space-y-4">
                    <select 
                      className="bg-[#2a2a2a] text-white px-4 py-2 rounded w-full"
                      onChange={(e) => {
                        const club = e.target.value;
                        // Simulate a shot with random outcome
                        const outcomes = ['Perfect', 'Good', 'Fair', 'Poor'];
                        const distances = {
                          'Driver': { min: 200, max: 280 },
                          '7 Iron': { min: 130, max: 160 },
                          'Pitching Wedge': { min: 80, max: 110 },
                          'Putter': { min: 5, max: 20 }
                        };
                        
                        if (club && club !== 'Select Club') {
                          const clubData = distances[club as keyof typeof distances];
                          const distance = Math.floor(Math.random() * (clubData.max - clubData.min + 1)) + clubData.min;
                          const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
                          const accuracy = Math.floor(Math.random() * 41) + 60; // 60-100%
                          
                          handleShotTaken({
                            club_used: club,
                            outcome,
                            distance,
                            accuracy
                          });
                        }
                      }}
                    >
                      <option>Select Club</option>
                      <option>Driver</option>
                      <option>7 Iron</option>
                      <option>Pitching Wedge</option>
                      <option>Putter</option>
                    </select>
                    
                    <p className="text-sm text-gray-400">
                      {isGuestMode ? 
                        `Demo shots remaining: ${simulatorTiers.free.maxShots - sessionStats.totalShots}` :
                        userTier === 'free' ? 
                          `Shots remaining: ${simulatorTiers.free.maxShots - sessionStats.totalShots}` :
                          'Unlimited shots available'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upgrade Prompt for Free Users */}
            {userTier === 'free' && (
              <div className="bg-gradient-to-r from-[#d4af37]/20 to-[#a2852c]/20 rounded-lg p-4 border border-[#d4af37]/40">
                <h3 className="text-lg font-semibold text-[#d4af37] mb-2 flex items-center gap-2">
                  <Zap size={20} />
                  Unlock Pro Features
                </h3>
                <p className="text-sm text-gray-300 mb-4">
                  Get unlimited shots, AI coaching, and premium courses for just $9.99/month.
                </p>
                <button
                  onClick={() => setShowPricing(true)}
                  className="w-full bg-gradient-to-r from-[#d4af37] to-[#a2852c] text-[#0a0a0a] px-4 py-2 rounded font-semibold hover:from-[#b8942c] hover:to-[#8a6d23] transition-colors"
                >
                  Upgrade Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Note: metadata export removed since this is a client component
