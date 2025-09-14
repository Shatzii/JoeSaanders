'use client';
import { useState, useEffect, useMemo } from 'react';
import { BookOpen, Play, CheckCircle, Clock, Target, TrendingUp, Award, Star } from 'lucide-react';

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

interface ShotData {
  timestamp: number;
  club: string;
  outcome: string;
  distance: number;
  club_used: string;
  hole_number: number;
  shot_number: number;
  startPosition: { x: number; y: number; z: number };
  endPosition: { x: number; y: number; z: number };
  angle: number;
  force: number;
}

interface LearningModule {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  category: 'fundamentals' | 'technique' | 'strategy' | 'mental';
  prerequisites: string[];
  objectives: string[];
  videoUrl?: string;
  completed: boolean;
  progress: number; // 0-100
}

interface PersonalizedPlan {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // weeks
  modules: LearningModule[];
  focusAreas: string[];
  createdAt: number;
  progress: number;
  completedModules: number;
  totalModules: number;
}

interface PersonalizedLearningPathsProps {
  swingHistory: SwingAnalysis[];
  shotHistory: ShotData[];
}

export default function PersonalizedLearningPaths({
  swingHistory,
  shotHistory
}: PersonalizedLearningPathsProps) {
  const [selectedPlan, setSelectedPlan] = useState<PersonalizedPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate personalized learning plan based on player data
  const generatePersonalizedPlan = async (): Promise<PersonalizedPlan> => {
    setIsGenerating(true);

    // Analyze player performance
    const playerAnalysis = analyzePlayerPerformance();

    // Generate modules based on analysis
    const modules = generateModules(playerAnalysis);

    // Create personalized plan
    const plan: PersonalizedPlan = {
      id: `plan_${Date.now()}`,
      title: `${playerAnalysis.skillLevel} Golf Improvement Plan`,
      description: `AI-generated ${playerAnalysis.focusAreas.length}-week program tailored to your current skill level and performance data.`,
      difficulty: playerAnalysis.skillLevel,
      estimatedDuration: Math.max(4, Math.min(12, playerAnalysis.focusAreas.length * 2)),
      modules,
      focusAreas: playerAnalysis.focusAreas,
      createdAt: Date.now(),
      progress: 0,
      completedModules: 0,
      totalModules: modules.length
    };

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsGenerating(false);
    return plan;
  };

  // Analyze player performance to determine skill level and focus areas
  const analyzePlayerPerformance = () => {
    if (swingHistory.length === 0 && shotHistory.length === 0) {
      return {
        skillLevel: 'beginner' as const,
        focusAreas: ['fundamentals', 'grip', 'stance', 'swing basics'],
        strengths: [],
        weaknesses: ['swing consistency', 'club selection', 'course management']
      };
    }

    const avgSwingScore = swingHistory.length > 0
      ? swingHistory.reduce((sum, swing) => sum + swing.score, 0) / swingHistory.length
      : 70;

    const avgConsistency = swingHistory.length > 0
      ? swingHistory.reduce((sum, swing) => sum + swing.consistency, 0) / swingHistory.length
      : 70;

    const avgDistance = shotHistory.length > 0
      ? shotHistory.reduce((sum, shot) => sum + (shot.distance || 0), 0) / shotHistory.length
      : 180;

    // Determine skill level
    let skillLevel: 'beginner' | 'intermediate' | 'advanced';
    if (avgSwingScore < 75 || avgConsistency < 75) {
      skillLevel = 'beginner';
    } else if (avgSwingScore < 85 || avgConsistency < 85) {
      skillLevel = 'intermediate';
    } else {
      skillLevel = 'advanced';
    }

    // Identify focus areas based on performance
    const focusAreas: string[] = [];

    if (avgConsistency < 80) focusAreas.push('swing consistency');
    if (swingHistory.some(s => s.swingPath !== 'straight')) focusAreas.push('swing path');
    if (swingHistory.some(s => Math.abs(s.tempo - 1.0) > 0.2)) focusAreas.push('tempo');
    if (avgDistance < 200) focusAreas.push('power development');
    if (shotHistory.some(s => s.outcome.includes('Slice') || s.outcome.includes('Hook'))) focusAreas.push('shot shaping');
    if (shotHistory.length < 10) focusAreas.push('course management');

    // Ensure minimum focus areas
    if (focusAreas.length === 0) {
      focusAreas.push('advanced techniques', 'course strategy', 'mental game');
    }

    return {
      skillLevel,
      focusAreas,
      strengths: avgSwingScore > 85 ? ['good fundamentals'] : [],
      weaknesses: focusAreas
    };
  };

  // Generate learning modules based on player analysis
  const generateModules = (analysis: any): LearningModule[] => {
    const baseModules: LearningModule[] = [
      {
        id: 'grip_basics',
        title: 'Perfect Golf Grip',
        description: 'Master the fundamental grip that controls your shots',
        difficulty: 'beginner',
        estimatedTime: 15,
        category: 'fundamentals',
        prerequisites: [],
        objectives: ['Understand proper grip pressure', 'Learn neutral grip position', 'Practice grip consistency'],
        completed: false,
        progress: 0
      },
      {
        id: 'stance_posture',
        title: 'Proper Stance & Posture',
        description: 'Establish the foundation for consistent ball striking',
        difficulty: 'beginner',
        estimatedTime: 20,
        category: 'fundamentals',
        prerequisites: [],
        objectives: ['Learn correct stance width', 'Master posture alignment', 'Understand balance principles'],
        completed: false,
        progress: 0
      },
      {
        id: 'swing_plane',
        title: 'Swing Plane Fundamentals',
        description: 'Learn to swing on the correct plane for straighter shots',
        difficulty: 'intermediate',
        estimatedTime: 25,
        category: 'technique',
        prerequisites: ['grip_basics', 'stance_posture'],
        objectives: ['Understand swing plane concept', 'Practice inside-out swing path', 'Learn to avoid over-the-top moves'],
        completed: false,
        progress: 0
      },
      {
        id: 'tempo_rhythm',
        title: 'Swing Tempo & Rhythm',
        description: 'Develop smooth, consistent swing timing',
        difficulty: 'intermediate',
        estimatedTime: 18,
        category: 'technique',
        prerequisites: ['swing_plane'],
        objectives: ['Learn 3:1 backswing to downswing ratio', 'Practice smooth transitions', 'Develop consistent rhythm'],
        completed: false,
        progress: 0
      },
      {
        id: 'power_generation',
        title: 'Power Development',
        description: 'Learn to generate more club head speed and distance',
        difficulty: 'intermediate',
        estimatedTime: 22,
        category: 'technique',
        prerequisites: ['tempo_rhythm'],
        objectives: ['Master body rotation', 'Learn proper weight transfer', 'Develop lag in the downswing'],
        completed: false,
        progress: 0
      },
      {
        id: 'shot_shaping',
        title: 'Shot Shaping Techniques',
        description: 'Control ball flight for different situations',
        difficulty: 'advanced',
        estimatedTime: 30,
        category: 'technique',
        prerequisites: ['power_generation'],
        objectives: ['Learn to hit draws and fades', 'Master club face alignment', 'Understand swing path effects'],
        completed: false,
        progress: 0
      },
      {
        id: 'course_management',
        title: 'Smart Course Management',
        description: 'Make better decisions on the course',
        difficulty: 'intermediate',
        estimatedTime: 20,
        category: 'strategy',
        prerequisites: [],
        objectives: ['Learn club selection strategy', 'Understand risk-reward decisions', 'Master course positioning'],
        completed: false,
        progress: 0
      },
      {
        id: 'mental_game',
        title: 'Mental Game Mastery',
        description: 'Develop mental toughness and focus',
        difficulty: 'advanced',
        estimatedTime: 25,
        category: 'mental',
        prerequisites: [],
        objectives: ['Learn visualization techniques', 'Master pre-shot routine', 'Develop concentration skills'],
        completed: false,
        progress: 0
      }
    ];

    // Filter and prioritize modules based on player's focus areas
    const relevantModules = baseModules.filter(module => {
      return analysis.focusAreas.some((area: string) =>
        module.title.toLowerCase().includes(area.split(' ')[0]) ||
        module.description.toLowerCase().includes(area.split(' ')[0]) ||
        module.objectives.some(obj => obj.toLowerCase().includes(area.split(' ')[0]))
      );
    });

    // If no specific matches, include general improvement modules
    const finalModules = relevantModules.length > 0 ? relevantModules : baseModules.slice(0, 6);

    // Sort by difficulty and prerequisites
    return finalModules.sort((a, b) => {
      const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 };
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    });
  };

  // Handle plan generation
  const handleGeneratePlan = async () => {
    const plan = await generatePersonalizedPlan();
    setSelectedPlan(plan);
  };

  // Handle module completion
  const handleModuleComplete = (moduleId: string) => {
    if (!selectedPlan) return;

    const updatedModules = selectedPlan.modules.map(module =>
      module.id === moduleId
        ? { ...module, completed: true, progress: 100 }
        : module
    );

    const completedCount = updatedModules.filter(m => m.completed).length;
    const totalProgress = updatedModules.reduce((sum, m) => sum + m.progress, 0) / updatedModules.length;

    setSelectedPlan({
      ...selectedPlan,
      modules: updatedModules,
      completedModules: completedCount,
      progress: totalProgress
    });
  };

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    if (!selectedPlan) return 0;
    return selectedPlan.modules.reduce((sum, module) => sum + module.progress, 0) / selectedPlan.modules.length;
  }, [selectedPlan]);

  return (
    <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-6 h-6 text-indigo-500" />
        <h3 className="text-xl font-semibold text-white">Personalized Learning Paths</h3>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-400">AI-Powered</span>
        </div>
      </div>

      {/* Plan Generation */}
      {!selectedPlan && (
        <div className="text-center space-y-6">
          <div className="bg-black/30 rounded-lg p-6">
            <Target className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-white mb-2">Get Your Personalized Learning Plan</h4>
            <p className="text-gray-300 mb-4">
              Our AI will analyze your swing data and shot history to create a customized
              improvement plan tailored to your current skill level and goals.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-indigo-900/20 rounded p-4">
                <Brain className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                <h5 className="text-sm font-semibold text-white">AI Analysis</h5>
                <p className="text-xs text-gray-400">Analyzes your performance data</p>
              </div>
              <div className="bg-indigo-900/20 rounded p-4">
                <Target className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                <h5 className="text-sm font-semibold text-white">Custom Plan</h5>
                <p className="text-xs text-gray-400">Tailored to your skill level</p>
              </div>
              <div className="bg-indigo-900/20 rounded p-4">
                <TrendingUp className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                <h5 className="text-sm font-semibold text-white">Track Progress</h5>
                <p className="text-xs text-gray-400">Monitor your improvement</p>
              </div>
            </div>

            <button
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Generating Your Plan...
                </div>
              ) : (
                'Generate My Learning Plan'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Active Learning Plan */}
      {selectedPlan && (
        <div className="space-y-6">
          {/* Plan Overview */}
          <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-2xl font-bold text-white">{selectedPlan.title}</h4>
                <p className="text-gray-300">{selectedPlan.description}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-indigo-400">{Math.round(selectedPlan.progress)}%</div>
                <div className="text-sm text-gray-400">Complete</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-black/30 rounded p-3">
                <div className="text-sm text-gray-400">Difficulty</div>
                <div className="text-lg font-semibold text-indigo-400 capitalize">
                  {selectedPlan.difficulty}
                </div>
              </div>
              <div className="bg-black/30 rounded p-3">
                <div className="text-sm text-gray-400">Duration</div>
                <div className="text-lg font-semibold text-indigo-400">
                  {selectedPlan.estimatedDuration} weeks
                </div>
              </div>
              <div className="bg-black/30 rounded p-3">
                <div className="text-sm text-gray-400">Modules</div>
                <div className="text-lg font-semibold text-indigo-400">
                  {selectedPlan.completedModules}/{selectedPlan.totalModules}
                </div>
              </div>
              <div className="bg-black/30 rounded p-3">
                <div className="text-sm text-gray-400">Focus Areas</div>
                <div className="text-lg font-semibold text-indigo-400">
                  {selectedPlan.focusAreas.length}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${selectedPlan.progress}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-400 text-center">
              {selectedPlan.completedModules} of {selectedPlan.totalModules} modules completed
            </div>
          </div>

          {/* Focus Areas */}
          <div className="bg-black/20 rounded-lg p-4">
            <h5 className="text-lg font-semibold text-indigo-400 mb-3">Focus Areas</h5>
            <div className="flex flex-wrap gap-2">
              {selectedPlan.focusAreas.map((area, index) => (
                <span
                  key={index}
                  className="bg-indigo-900/30 text-indigo-300 px-3 py-1 rounded-full text-sm"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Learning Modules */}
          <div className="space-y-4">
            <h5 className="text-xl font-semibold text-white">Your Learning Modules</h5>

            {selectedPlan.modules.map((module, index) => (
              <div
                key={module.id}
                className={`bg-gradient-to-r from-gray-800 to-gray-900 border rounded-lg p-4 transition-all ${
                  module.completed
                    ? 'border-green-500/30 bg-green-900/10'
                    : 'border-gray-600 hover:border-indigo-500/30'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm bg-indigo-900/50 text-indigo-300 px-2 py-1 rounded">
                        Module {index + 1}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded capitalize ${
                        module.difficulty === 'beginner' ? 'bg-green-900/50 text-green-300' :
                        module.difficulty === 'intermediate' ? 'bg-yellow-900/50 text-yellow-300' :
                        'bg-red-900/50 text-red-300'
                      }`}>
                        {module.difficulty}
                      </span>
                      <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                        {module.estimatedTime} min
                      </span>
                    </div>
                    <h6 className="text-lg font-semibold text-white mb-1">{module.title}</h6>
                    <p className="text-gray-300 text-sm">{module.description}</p>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {module.completed ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <button
                        onClick={() => handleModuleComplete(module.id)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500 transition-colors"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>

                {/* Module Progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">{module.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${module.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Learning Objectives */}
                <div className="mb-3">
                  <h6 className="text-sm font-semibold text-indigo-400 mb-2">Learning Objectives:</h6>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {module.objectives.map((objective, objIndex) => (
                      <li key={objIndex} className="flex items-start gap-2">
                        <span className="text-indigo-500 mt-1">•</span>
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Video Placeholder */}
                <div className="bg-black/50 rounded p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Play className="w-5 h-5 text-indigo-400" />
                    <span className="text-sm text-gray-300">Video Lesson Available</span>
                  </div>
                  <button className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-500 transition-colors">
                    Watch Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Reset Plan Button */}
          <div className="text-center">
            <button
              onClick={() => setSelectedPlan(null)}
              className="bg-gray-700 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Generate New Plan
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>🎯 <strong>AI-Powered Learning:</strong> Personalized curriculum based on your performance data</p>
        <p className="mt-1">📚 <strong>Complete modules</strong> to track your golf improvement journey</p>
      </div>
    </div>
  );
}