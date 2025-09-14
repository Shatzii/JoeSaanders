'use client';
import { useState, useEffect, useMemo } from 'react';
import { Brain, TrendingUp, Target, Zap, Award, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';

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

interface PredictionResult {
  shotOutcome: string;
  confidence: number;
  recommendedClub: string;
  expectedDistance: number;
  riskFactors: string[];
  improvementTips: string[];
}

interface PredictivePerformanceAIProps {
  swingHistory: SwingAnalysis[];
  shotHistory: ShotData[];
  currentConditions?: {
    windSpeed: number;
    windDirection: number;
    temperature: number;
    humidity: number;
  };
}

export default function PredictivePerformanceAI({
  swingHistory,
  shotHistory,
  currentConditions = { windSpeed: 5, windDirection: 0, temperature: 72, humidity: 60 }
}: PredictivePerformanceAIProps) {
  const [selectedClub, setSelectedClub] = useState('Driver');
  const [targetDistance, setTargetDistance] = useState(250);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const clubs = [
    'Driver', '3-Wood', '5-Wood', '3-Iron', '4-Iron', '5-Iron',
    '6-Iron', '7-Iron', '8-Iron', '9-Iron', 'PW', 'GW', 'SW', 'LW'
  ];

  // Calculate player statistics
  const playerStats = useMemo(() => {
    if (swingHistory.length === 0 && shotHistory.length === 0) {
      return null;
    }

    const avgSwingScore = swingHistory.length > 0
      ? swingHistory.reduce((sum, swing) => sum + swing.score, 0) / swingHistory.length
      : 75;

    const avgSwingSpeed = swingHistory.length > 0
      ? swingHistory.reduce((sum, swing) => sum + swing.swingSpeed, 0) / swingHistory.length
      : 85;

    const avgDistance = shotHistory.length > 0
      ? shotHistory.reduce((sum, shot) => sum + (shot.distance || 0), 0) / shotHistory.length
      : 200;

    const consistency = swingHistory.length > 0
      ? swingHistory.reduce((sum, swing) => sum + swing.consistency, 0) / swingHistory.length
      : 75;

    // Calculate improvement trends
    const recentSwings = swingHistory.slice(0, 5);
    const olderSwings = swingHistory.slice(5, 10);
    const improvementTrend = recentSwings.length > 0 && olderSwings.length > 0
      ? (recentSwings.reduce((sum, s) => sum + s.score, 0) / recentSwings.length) -
        (olderSwings.reduce((sum, s) => sum + s.score, 0) / olderSwings.length)
      : 0;

    return {
      avgSwingScore,
      avgSwingSpeed,
      avgDistance,
      consistency,
      improvementTrend,
      totalSwings: swingHistory.length,
      totalShots: shotHistory.length
    };
  }, [swingHistory, shotHistory]);

  // Generate AI prediction
  const generatePrediction = async () => {
    setIsAnalyzing(true);

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (!playerStats) {
      setPrediction(null);
      setIsAnalyzing(false);
      return;
    }

    // AI prediction logic based on player stats and conditions
    const baseDistance = getClubDistance(selectedClub, playerStats.avgSwingSpeed);
    const windEffect = calculateWindEffect(baseDistance, currentConditions.windSpeed, currentConditions.windDirection);
    const conditionEffect = calculateConditionEffect(currentConditions.temperature, currentConditions.humidity);
    const consistencyFactor = playerStats.consistency / 100;

    const predictedDistance = Math.round(baseDistance * (1 + windEffect) * (1 + conditionEffect) * consistencyFactor);
    const confidence = Math.min(95, Math.max(60, 70 + (playerStats.consistency - 70) * 0.5 + (playerStats.totalShots > 10 ? 10 : 0)));

    // Determine shot outcome based on player skill and conditions
    let shotOutcome = 'Straight';
    const randomFactor = Math.random();

    if (playerStats.consistency > 85) {
      shotOutcome = randomFactor > 0.9 ? 'Slight Draw' : 'Straight';
    } else if (playerStats.consistency > 70) {
      if (randomFactor > 0.8) shotOutcome = 'Slight Fade';
      else if (randomFactor > 0.6) shotOutcome = 'Straight';
      else shotOutcome = 'Slight Draw';
    } else {
      const outcomes = ['Straight', 'Slight Draw', 'Slight Fade', 'Hook', 'Slice'];
      shotOutcome = outcomes[Math.floor(randomFactor * outcomes.length)];
    }

    // Generate risk factors
    const riskFactors = [];
    if (currentConditions.windSpeed > 15) riskFactors.push('High wind may affect ball flight');
    if (playerStats.consistency < 70) riskFactors.push('Inconsistent swing may cause dispersion');
    if (Math.abs(predictedDistance - targetDistance) > 30) riskFactors.push('Club selection may not match target distance');
    if (playerStats.totalShots < 5) riskFactors.push('Limited data - predictions less accurate');

    // Generate improvement tips
    const improvementTips = [];
    if (playerStats.consistency < 80) improvementTips.push('Focus on consistent tempo and swing path');
    if (playerStats.avgSwingScore < 80) improvementTips.push('Practice with swing analyzer for technique improvement');
    if (playerStats.totalShots < 10) improvementTips.push('Play more rounds to improve AI predictions');
    improvementTips.push('Consider course conditions when selecting clubs');

    // Recommend optimal club
    const recommendedClub = recommendClub(targetDistance, playerStats.avgDistance, playerStats.consistency);

    setPrediction({
      shotOutcome,
      confidence,
      recommendedClub,
      expectedDistance: predictedDistance,
      riskFactors,
      improvementTips
    });

    setIsAnalyzing(false);
  };

  // Helper functions
  const getClubDistance = (club: string, swingSpeed: number): number => {
    const baseDistances: { [key: string]: number } = {
      'Driver': 250,
      '3-Wood': 220,
      '5-Wood': 200,
      '3-Iron': 180,
      '4-Iron': 170,
      '5-Iron': 160,
      '6-Iron': 150,
      '7-Iron': 140,
      '8-Iron': 130,
      '9-Iron': 120,
      'PW': 110,
      'GW': 100,
      'SW': 80,
      'LW': 60
    };

    const baseDistance = baseDistances[club] || 150;
    const speedFactor = swingSpeed / 85; // Normalize to average swing speed
    return baseDistance * speedFactor;
  };

  const calculateWindEffect = (distance: number, windSpeed: number, windDirection: number): number => {
    // Simplified wind calculation - headwind reduces distance, tailwind increases
    const windEffect = (windSpeed / 10) * 0.02; // 2% per 10 mph
    return windDirection > 90 && windDirection < 270 ? -windEffect : windEffect;
  };

  const calculateConditionEffect = (temperature: number, humidity: number): number => {
    // Hot, humid conditions can reduce distance slightly
    const tempEffect = temperature > 80 ? -0.02 : temperature < 60 ? 0.01 : 0;
    const humidityEffect = humidity > 70 ? -0.01 : 0;
    return tempEffect + humidityEffect;
  };

  const recommendClub = (targetDistance: number, avgDistance: number, consistency: number): string => {
    const distanceRatio = targetDistance / avgDistance;
    const clubs = ['Driver', '3-Wood', '5-Wood', '3-Iron', '4-Iron', '5-Iron', '6-Iron', '7-Iron', '8-Iron', '9-Iron', 'PW'];

    if (distanceRatio > 1.3) return 'Driver';
    if (distanceRatio > 1.1) return clubs[Math.floor(clubs.length * 0.8)];
    if (distanceRatio > 0.9) return clubs[Math.floor(clubs.length * 0.6)];
    if (distanceRatio > 0.7) return clubs[Math.floor(clubs.length * 0.4)];
    return clubs[Math.floor(clubs.length * 0.2)];
  };

  // Auto-generate prediction when inputs change
  useEffect(() => {
    if (playerStats && playerStats.totalShots > 0) {
      generatePrediction();
    }
  }, [selectedClub, targetDistance, playerStats]);

  if (!playerStats) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-lg p-6 text-center">
        <Brain className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400">Not enough data for AI predictions</p>
        <p className="text-sm text-gray-500">Play some shots and analyze swings to unlock AI insights</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-6 h-6 text-purple-500" />
        <h3 className="text-xl font-semibold text-white">AI Performance Predictor</h3>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-400">AI Active</span>
        </div>
      </div>

      {/* Player Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-black/30 rounded p-3">
          <div className="text-sm text-gray-400">Swing Score</div>
          <div className="text-lg font-semibold text-purple-400">
            {playerStats.avgSwingScore.toFixed(1)}
          </div>
        </div>
        <div className="bg-black/30 rounded p-3">
          <div className="text-sm text-gray-400">Avg Distance</div>
          <div className="text-lg font-semibold text-purple-400">
            {playerStats.avgDistance.toFixed(0)} yd
          </div>
        </div>
        <div className="bg-black/30 rounded p-3">
          <div className="text-sm text-gray-400">Consistency</div>
          <div className="text-lg font-semibold text-purple-400">
            {playerStats.consistency.toFixed(1)}%
          </div>
        </div>
        <div className="bg-black/30 rounded p-3">
          <div className="text-sm text-gray-400">Total Shots</div>
          <div className="text-lg font-semibold text-purple-400">
            {playerStats.totalShots}
          </div>
        </div>
      </div>

      {/* Prediction Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            Select Club
          </label>
          <select
            value={selectedClub}
            onChange={(e) => setSelectedClub(e.target.value)}
            className="w-full bg-black/50 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
          >
            {clubs.map(club => (
              <option key={club} value={club}>{club}</option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            Target Distance (yards)
          </label>
          <input
            type="number"
            value={targetDistance}
            onChange={(e) => setTargetDistance(Number(e.target.value))}
            min="50"
            max="350"
            className="w-full bg-black/50 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Current Conditions */}
      <div className="bg-black/20 rounded p-4 mb-6">
        <h4 className="text-sm font-semibold text-purple-400 mb-2">Current Conditions</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Wind:</span>
            <span className="text-white ml-1">{currentConditions.windSpeed} mph</span>
          </div>
          <div>
            <span className="text-gray-400">Temp:</span>
            <span className="text-white ml-1">{currentConditions.temperature}°F</span>
          </div>
          <div>
            <span className="text-gray-400">Humidity:</span>
            <span className="text-white ml-1">{currentConditions.humidity}%</span>
          </div>
          <div>
            <span className="text-gray-400">Direction:</span>
            <span className="text-white ml-1">{currentConditions.windDirection}°</span>
          </div>
        </div>
      </div>

      {/* AI Prediction Results */}
      {isAnalyzing ? (
        <div className="bg-black/30 rounded p-6 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-white font-semibold">AI Analyzing...</p>
          <p className="text-sm text-gray-400">Processing your performance data</p>
        </div>
      ) : prediction ? (
        <div className="space-y-4">
          {/* Main Prediction */}
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-white">AI Prediction</h4>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Confidence:</span>
                <span className="text-sm font-semibold text-purple-400">{prediction.confidence}%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  {prediction.expectedDistance} yd
                </div>
                <div className="text-sm text-gray-400">Expected Distance</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-white mb-1">
                  {prediction.shotOutcome}
                </div>
                <div className="text-sm text-gray-400">Shot Shape</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-yellow-400 mb-1">
                  {prediction.recommendedClub}
                </div>
                <div className="text-sm text-gray-400">Recommended Club</div>
              </div>
            </div>
          </div>

          {/* Risk Factors */}
          {prediction.riskFactors.length > 0 && (
            <div className="bg-yellow-900/20 border border-yellow-500/20 rounded p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <h4 className="text-sm font-semibold text-yellow-400">Risk Factors</h4>
              </div>
              <div className="space-y-1">
                {prediction.riskFactors.map((risk, index) => (
                  <div key={index} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span>{risk}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Improvement Tips */}
          <div className="bg-green-900/20 border border-green-500/20 rounded p-4">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-green-500" />
              <h4 className="text-sm font-semibold text-green-400">AI Improvement Tips</h4>
            </div>
            <div className="space-y-1">
              {prediction.improvementTips.map((tip, index) => (
                <div key={index} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-black/30 rounded p-6 text-center">
          <Target className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Select a club and target distance to get AI predictions</p>
        </div>
      )}

      {/* Performance Insights */}
      <div className="mt-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          <h4 className="text-sm font-semibold text-blue-400">Performance Insights</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Improvement Trend:</span>
            <span className={`ml-1 font-semibold ${
              playerStats.improvementTrend > 2 ? 'text-green-400' :
              playerStats.improvementTrend < -2 ? 'text-red-400' : 'text-yellow-400'
            }`}>
              {playerStats.improvementTrend > 0 ? '+' : ''}{playerStats.improvementTrend.toFixed(1)} pts
            </span>
          </div>
          <div>
            <span className="text-gray-400">Data Points:</span>
            <span className="ml-1 text-white font-semibold">
              {playerStats.totalSwings} swings, {playerStats.totalShots} shots
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}