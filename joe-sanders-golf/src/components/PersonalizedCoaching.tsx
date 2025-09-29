'use client';
import { useState, useEffect } from 'react';
import { Target, TrendingUp, BookOpen, Clock, Star, CheckCircle } from 'lucide-react';

interface PersonalizedCoachingProps {
  stats: {
    totalShots: number;
    averageDistance: number;
    bestShot: number;
    accuracy: number;
  };
  shots: any[];
  userTier: 'free' | 'pro' | 'elite';
}

interface Drill {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  focus: string;
  equipment: string[];
  steps: string[];
  completed: boolean;
  recommended: boolean;
}

export function PersonalizedCoaching({ stats, shots, userTier }: PersonalizedCoachingProps) {
  const [drills, setDrills] = useState<Drill[]>([]);
  const [selectedDrill, setSelectedDrill] = useState<Drill | null>(null);
  const [completedDrills, setCompletedDrills] = useState<string[]>([]);

  useEffect(() => {
    // Generate personalized drills based on user stats
    const generateDrills = () => {
      const baseDrills: Drill[] = [
        {
          id: 'accuracy-basics',
          title: 'Accuracy Fundamentals',
          description: 'Master the basics of consistent ball striking',
          difficulty: 'beginner',
          duration: '15 mins',
          focus: 'Accuracy',
          equipment: ['7-iron', 'Practice balls'],
          steps: [
            'Set up with feet shoulder-width apart',
            'Focus on smooth takeaway',
            'Keep head steady through impact',
            'Follow through to balanced finish'
          ],
          completed: false,
          recommended: stats.accuracy < 70
        },
        {
          id: 'distance-control',
          title: 'Distance Control Mastery',
          description: 'Learn to hit consistent distances with any club',
          difficulty: 'intermediate',
          duration: '20 mins',
          focus: 'Distance Control',
          equipment: ['6-iron', '8-iron', 'PW', 'Range finder'],
          steps: [
            'Start with your most consistent club',
            'Take 5 shots at 100 yards',
            'Adjust swing speed for distance',
            'Record and analyze results'
          ],
          completed: false,
          recommended: stats.averageDistance < 140 || Math.abs(stats.averageDistance - 150) > 20
        },
        {
          id: 'power-development',
          title: 'Power Development',
          description: 'Build clubhead speed and distance',
          difficulty: 'advanced',
          duration: '25 mins',
          focus: 'Power',
          equipment: ['Driver', '5-iron', 'Medicine ball'],
          steps: [
            'Warm up with dynamic stretches',
            'Practice full swing with driver',
            'Focus on rotational power',
            'Incorporate strength exercises'
          ],
          completed: false,
          recommended: stats.bestShot < 250
        },
        {
          id: 'short-game-precision',
          title: 'Short Game Precision',
          description: 'Master chipping and putting for lower scores',
          difficulty: 'intermediate',
          duration: '30 mins',
          focus: 'Short Game',
          equipment: ['Wedges', 'Putter', 'Chipping green'],
          steps: [
            'Practice various lies around the green',
            'Focus on distance control with wedges',
            'Work on putting alignment',
            'Play short game games for fun'
          ],
          completed: false,
          recommended: true // Always recommended for score improvement
        },
        {
          id: 'mental-game',
          title: 'Mental Game Mastery',
          description: 'Develop focus and confidence under pressure',
          difficulty: 'advanced',
          duration: '10 mins',
          focus: 'Mental',
          equipment: ['Notebook', 'Timer'],
          steps: [
            'Practice visualization techniques',
            'Set process-oriented goals',
            'Learn breathing exercises',
            'Build positive self-talk'
          ],
          completed: false,
          recommended: stats.totalShots > 50 // For experienced players
        }
      ];

      // Filter and prioritize drills based on user performance
      const personalizedDrills = baseDrills
        .filter(drill => {
          if (userTier === 'free') return drill.difficulty === 'beginner';
          if (userTier === 'pro') return drill.difficulty !== 'advanced' || drill.recommended;
          return true; // Elite gets all drills
        })
        .map(drill => ({
          ...drill,
          completed: completedDrills.includes(drill.id)
        }))
        .sort((a, b) => {
          // Sort by recommendation, then by difficulty
          if (a.recommended && !b.recommended) return -1;
          if (!a.recommended && b.recommended) return 1;
          const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        });

      setDrills(personalizedDrills);
    };

    generateDrills();
  }, [stats, shots, userTier, completedDrills]);

  const handleCompleteDrill = (drillId: string) => {
    setCompletedDrills(prev => [...prev, drillId]);
    setDrills(prev => prev.map(drill =>
      drill.id === drillId ? { ...drill, completed: true } : drill
    ));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-400/10';
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/10';
      case 'advanced': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const recommendedDrills = drills.filter(d => d.recommended && !d.completed);
  const completedCount = drills.filter(d => d.completed).length;

  return (
    <div className="bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] border border-[#d4af3740] rounded-lg p-4 max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#d4af37] flex items-center gap-2">
          <Target size={20} />
          Personalized Coaching
        </h3>
        <div className="text-right">
          <div className="text-sm font-bold text-[#d4af37]">{completedCount}/{drills.length}</div>
          <div className="text-xs text-gray-400">Completed</div>
        </div>
      </div>

      {/* Recommended Drills Alert */}
      {recommendedDrills.length > 0 && (
        <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 text-blue-400 text-sm mb-2">
            <Star size={16} />
            <span>{recommendedDrills.length} Recommended Drill{recommendedDrills.length > 1 ? 's' : ''}</span>
          </div>
          <p className="text-xs text-gray-300">
            Based on your recent performance, these drills will help you improve the most.
          </p>
        </div>
      )}

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {drills.map((drill) => (
          <div
            key={drill.id}
            className={`relative p-3 rounded-lg border transition-all cursor-pointer ${
              drill.completed
                ? 'border-green-500 bg-green-500/10'
                : drill.recommended
                ? 'border-[#d4af37] bg-[#d4af37]/10'
                : 'border-gray-600 bg-gray-600/10 hover:border-gray-500'
            }`}
            onClick={() => setSelectedDrill(drill)}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`font-semibold text-sm ${
                    drill.completed ? 'text-green-400' : 'text-white'
                  }`}>
                    {drill.title}
                  </h4>
                  {drill.recommended && !drill.completed && (
                    <Star size={14} className="text-yellow-400 flex-shrink-0" />
                  )}
                  {drill.completed && (
                    <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
                  )}
                </div>

                <p className="text-xs text-gray-400 mb-2">{drill.description}</p>

                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className={`px-2 py-0.5 rounded ${getDifficultyColor(drill.difficulty)}`}>
                    {drill.difficulty}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {drill.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Target size={12} />
                    {drill.focus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Drill Detail Modal */}
      {selectedDrill && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#d4af3740]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#d4af37]">{selectedDrill.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded text-xs ${getDifficultyColor(selectedDrill.difficulty)}`}>
                      {selectedDrill.difficulty}
                    </span>
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <Clock size={14} />
                      {selectedDrill.duration}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDrill(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-300 mb-4">{selectedDrill.description}</p>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-[#d4af37] mb-2">Equipment Needed:</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  {selectedDrill.equipment.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-[#d4af37] rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-[#d4af37] mb-2">Steps:</h3>
                <ol className="text-sm text-gray-400 space-y-2">
                  {selectedDrill.steps.map((step, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="text-[#d4af37] font-semibold">{index + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {!selectedDrill.completed && (
                <button
                  onClick={() => {
                    handleCompleteDrill(selectedDrill.id);
                    setSelectedDrill(null);
                  }}
                  className="w-full bg-gradient-to-r from-[#d4af37] to-[#a2852c] text-[#0a0a0a] px-4 py-2 rounded font-semibold hover:from-[#b8942c] hover:to-[#8a6d23] transition-colors"
                >
                  Mark as Completed
                </button>
              )}

              {selectedDrill.completed && (
                <div className="text-center text-green-400 font-semibold">
                  ✓ Completed
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}