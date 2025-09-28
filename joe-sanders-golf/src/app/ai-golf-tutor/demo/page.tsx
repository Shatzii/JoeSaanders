'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Target,
  Volume2,
  TrendingUp,
  Play,
  CheckCircle,
  Star,
  ArrowRight,
  MessageCircle,
  Zap,
  Award,
  RotateCcw
} from 'lucide-react';

interface DemoShot {
  id: string;
  club: string;
  distance: number;
  accuracy: number;
  outcome: string;
  aiFeedback: string;
  voiceTip: string;
  timestamp: Date;
  improvement: string;
}

const demoScenarios: DemoShot[] = [
  {
    id: '1',
    club: 'Driver',
    distance: 285,
    accuracy: 92,
    outcome: 'Excellent',
    aiFeedback: 'Perfect launch angle of 13.2°, and optimal spin rate of 2,650 RPM. Your swing path was ideal with minimal slice/draw tendencies.',
    voiceTip: 'Outstanding driver! That\'s exactly how you want to start every hole. Keep that smooth tempo and you\'ll be in the fairway all day.',
    timestamp: new Date(),
    improvement: 'Club head speed increased by 8% from last swing'
  },
  {
    id: '2',
    club: '7 Iron',
    distance: 152,
    accuracy: 78,
    outcome: 'Good',
    aiFeedback: 'Solid contact with slight inside-out swing path causing a controlled draw. Work on keeping your hands slightly ahead at impact for straighter shots.',
    voiceTip: 'Nice iron shot! You\'re hitting it well, but let\'s work on keeping your weight forward through impact for even better control.',
    timestamp: new Date(),
    improvement: 'Accuracy improved by 15% with proper alignment'
  },
  {
    id: '3',
    club: 'Pitching Wedge',
    distance: 98,
    accuracy: 96,
    outcome: 'Perfect',
    aiFeedback: 'Tour-level wedge play! Your acceleration through impact was flawless, clubface remained square, and you maintained perfect tempo throughout.',
    voiceTip: 'Perfect wedge shot! That\'s championship golf right there. Keep that smooth rhythm and you\'ll be draining putts from everywhere.',
    timestamp: new Date(),
    improvement: 'Distance control within 2 yards of target'
  }
];

export default function AIGolfTutorDemoPage() {
  const [currentScenario, setCurrentScenario] = useState<DemoShot | null>(null);
  const [shotHistory, setShotHistory] = useState<DemoShot[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showVoiceTip, setShowVoiceTip] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [selectedClub, setSelectedClub] = useState('Driver');

  const clubs = ['Driver', '3 Wood', '5 Iron', '7 Iron', '9 Iron', 'Pitching Wedge', 'Sand Wedge', 'Putter'];

  const simulateShot = async () => {
    setIsAnalyzing(true);
    setShowVoiceTip(false);
    setCurrentScenario(null);

    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Cycle through demo scenarios
    const scenarioIndex = demoStep % demoScenarios.length;
    const scenario = { ...demoScenarios[scenarioIndex], club: selectedClub };

    setCurrentScenario(scenario);
    setShotHistory(prev => [scenario, ...prev.slice(0, 4)]); // Keep last 5 shots
    setIsAnalyzing(false);

    // Show voice tip after analysis
    setTimeout(() => {
      setShowVoiceTip(true);
    }, 1500);

    setDemoStep(prev => Math.min(prev + 1, 5));
  };

  const resetDemo = () => {
    setCurrentScenario(null);
    setShotHistory([]);
    setIsAnalyzing(false);
    setShowVoiceTip(false);
    setDemoStep(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-joe-black via-joe-stone to-joe-black text-white">
      {/* Header */}
      <header className="border-b border-joe-gold/20 bg-joe-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-joe-gold rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-joe-black" />
              </div>
              <div>
                <h1 className="text-xl font-joe-heading font-bold text-joe-gold">
                  AI Golf Tutor Demo
                </h1>
                <p className="text-sm text-joe-white/70">
                  Experience Uncle Joe&apos;s revolutionary golf coaching
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-joe-white/70">
                Demo Progress: {demoStep}/5 shots
              </div>
              <Link
                href="/ai-golf-tutor"
                className="px-4 py-2 bg-joe-gold text-joe-black rounded-lg font-semibold hover:bg-amber-400 transition-colors"
              >
                Back to Info
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Demo Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Golf Course Visualization */}
            <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-2xl p-8 border border-joe-gold/20">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-joe-heading font-bold text-joe-gold mb-2">
                  Virtual Golf Course
                </h2>
                <p className="text-joe-white/80">
                  Take shots and get instant AI analysis
                </p>
              </div>

              {/* Course Preview */}
              <div className="relative h-64 bg-gradient-to-br from-green-600 to-green-800 rounded-lg mb-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">⛳</div>
                  <p className="text-white/80">Practice Range - Par 3</p>
                  <p className="text-white/60 text-sm">150 yards to the green</p>
                </div>
                {/* Golf Ball Indicator */}
                {currentScenario && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-4 h-4 bg-white rounded-full shadow-lg animate-bounce"></div>
                  </div>
                )}
              </div>

              {/* Shot Interface */}
              <div className="bg-joe-black/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-joe-gold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Take Your Shot
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-joe-white/80 mb-2">
                      Select Club
                    </label>
                    <select
                      value={selectedClub}
                      onChange={(e) => setSelectedClub(e.target.value)}
                      className="w-full bg-joe-stone border border-joe-gold/30 rounded-lg px-3 py-2 text-white focus:border-joe-gold focus:outline-none"
                    >
                      {clubs.map(club => (
                        <option key={club} value={club}>{club}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={simulateShot}
                      disabled={isAnalyzing || demoStep >= 5}
                      className="w-full bg-gradient-to-r from-joe-gold to-amber-400 text-joe-black px-6 py-2 rounded-lg font-bold hover:from-amber-400 hover:to-joe-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAnalyzing ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-joe-black border-t-transparent rounded-full animate-spin"></div>
                          Analyzing...
                        </div>
                      ) : demoStep >= 5 ? (
                        'Demo Complete!'
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Play className="w-4 h-4" />
                          Take Shot
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {demoStep >= 5 && (
                  <div className="text-center p-4 bg-joe-gold/10 rounded-lg border border-joe-gold/30">
                    <Award className="w-8 h-8 text-joe-gold mx-auto mb-2" />
                    <p className="text-joe-gold font-semibold">Demo Complete!</p>
                    <p className="text-joe-white/70 text-sm">Sign up to continue your AI coaching journey</p>
                  </div>
                )}
              </div>
            </div>

            {/* AI Analysis Results */}
            {currentScenario && (
              <div className="bg-gradient-to-br from-joe-black to-joe-stone rounded-2xl p-6 border border-joe-gold/20">
                <h3 className="text-xl font-joe-heading font-bold text-joe-gold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  AI Swing Analysis
                </h3>

                {/* Shot Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-joe-black/60 to-joe-stone/60 rounded-xl p-6 text-center border border-joe-gold/20">
                    <div className="text-3xl font-bold text-joe-gold mb-2">{currentScenario.distance}yd</div>
                    <div className="text-sm text-joe-white/70 uppercase tracking-wide">Distance</div>
                    <div className="text-xs text-joe-white/50 mt-1">{currentScenario.club}</div>
                  </div>

                  <div className="bg-gradient-to-br from-joe-black/60 to-joe-stone/60 rounded-xl p-6 text-center border border-joe-gold/20">
                    <div className="text-3xl font-bold text-joe-gold mb-2">{currentScenario.accuracy}%</div>
                    <div className="text-sm text-joe-white/70 uppercase tracking-wide">Accuracy</div>
                    <div className="text-xs text-joe-white/50 mt-1">Target precision</div>
                  </div>

                  <div className="bg-gradient-to-br from-joe-black/60 to-joe-stone/60 rounded-xl p-6 text-center border border-joe-gold/20">
                    <div className={`text-3xl font-bold mb-2 ${
                      currentScenario.outcome === 'Excellent' ? 'text-green-400' :
                      currentScenario.outcome === 'Perfect' ? 'text-blue-400' : 'text-yellow-400'
                    }`}>
                      {currentScenario.outcome}
                    </div>
                    <div className="text-sm text-joe-white/70 uppercase tracking-wide">Result</div>
                    <div className="text-xs text-joe-white/50 mt-1">Shot quality</div>
                  </div>
                </div>

                {/* AI Feedback */}
                <div className="bg-gradient-to-r from-joe-black/40 to-joe-stone/40 rounded-xl p-6 mb-6 border border-joe-gold/20">
                  <div className="flex items-start gap-3">
                    <MessageCircle className="w-6 h-6 text-joe-gold mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-joe-heading font-bold text-joe-gold mb-2">AI Analysis:</h4>
                      <p className="text-joe-white/95 leading-relaxed text-base">
                        {currentScenario.aiFeedback}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Improvement Metric */}
                <div className="bg-gradient-to-r from-green-900/40 to-green-800/40 rounded-xl p-4 mb-6 border border-green-400/30">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-medium">{currentScenario.improvement}</span>
                  </div>
                </div>

                {/* Voice Coaching */}
                {showVoiceTip && (
                  <div className="bg-gradient-to-r from-joe-gold/15 to-amber-400/15 rounded-xl p-6 border border-joe-gold/40">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-joe-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Volume2 className="w-6 h-6 text-joe-gold" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-joe-heading font-bold text-joe-gold mb-2 flex items-center gap-2">
                          Uncle Joe&apos;s Voice Coaching
                          <span className="text-xs bg-joe-gold/20 text-joe-gold px-2 py-1 rounded-full">ElevenLabs AI</span>
                        </h4>
                        <p className="text-joe-white/95 text-lg italic leading-relaxed">
                          &quot;{currentScenario.voiceTip}&quot;
                        </p>
                        <div className="mt-3 text-sm text-joe-white/60">
                          🎵 Natural voice synthesis with Uncle Joe&apos;s authentic coaching style
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Demo Progress */}
            <div className="bg-gradient-to-br from-joe-black to-joe-stone rounded-2xl p-6 border border-joe-gold/20">
              <h3 className="text-lg font-joe-heading font-bold text-joe-gold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Demo Progress
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-joe-white/80">Shots Taken</span>
                  <span className="font-semibold text-joe-gold">{demoStep}/5</span>
                </div>
                <div className="w-full bg-joe-stone rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-joe-gold to-amber-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(demoStep / 5) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-joe-white/80">AI Swing Analysis</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-joe-white/80">Voice Coaching</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-joe-white/80">Performance Tracking</span>
                </div>
                {demoStep >= 5 && (
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-joe-white/80">Demo Complete!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="bg-gradient-to-br from-joe-black to-joe-stone rounded-2xl p-6 border border-joe-gold/20">
              <h3 className="text-lg font-joe-heading font-bold text-joe-gold mb-4">
                What You&apos;ll Get
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-joe-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-joe-white">Real-Time Analysis</div>
                    <div className="text-sm text-joe-white/70">GPT-4 powered swing evaluation</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Volume2 className="w-5 h-5 text-joe-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-joe-white">Voice Coaching</div>
                    <div className="text-sm text-joe-white/70">Uncle Joe&apos;s personalized tips</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-joe-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-joe-white">Progress Tracking</div>
                    <div className="text-sm text-joe-white/70">Detailed performance analytics</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-joe-gold/10 via-amber-400/10 to-joe-gold/10 rounded-2xl p-6 border border-joe-gold/30 shadow-xl">
              <h3 className="text-xl font-joe-heading font-bold text-joe-gold mb-3">
                Ready to Transform Your Game?
              </h3>
              <p className="text-joe-white/80 text-sm mb-6">
                Sign up now and get your first month free. Join thousands of golfers improving with AI.
              </p>

              <div className="space-y-3">
                <Link
                  href="/auth"
                  className="block w-full bg-gradient-to-r from-joe-gold to-amber-400 text-joe-black px-6 py-4 rounded-lg font-joe-heading font-bold text-center hover:from-amber-400 hover:to-joe-gold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 inline ml-2" />
                </Link>

                <Link
                  href="/ai-golf-tutor"
                  className="block w-full border-2 border-joe-gold text-joe-gold px-6 py-4 rounded-lg font-semibold text-center hover:bg-joe-gold hover:text-joe-black transition-all duration-300"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
