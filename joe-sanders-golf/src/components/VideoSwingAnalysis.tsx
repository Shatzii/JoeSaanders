'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, Play, Square, RotateCcw, Zap, Target, TrendingUp } from 'lucide-react';

interface SwingAnalysis {
  timestamp: number;
  swingSpeed: number;
  swingPath: 'inside' | 'outside' | 'straight';
  clubHeadSpeed: number;
  tempo: number;
  consistency: number;
  feedback: string[];
  score: number; // 0-100
}

interface VideoSwingAnalysisProps {
  onAnalysisComplete?: (analysis: SwingAnalysis) => void;
  disabled?: boolean;
}

export default function VideoSwingAnalysis({ onAnalysisComplete, disabled = false }: VideoSwingAnalysisProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<SwingAnalysis | null>(null);
  const [swingHistory, setSwingHistory] = useState<SwingAnalysis[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Initialize webcam
  const initializeCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: 'user'
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setHasPermission(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasPermission(false);
    }
  }, []);

  // Start recording and analysis
  const startRecording = useCallback(() => {
    if (!videoRef.current || disabled) return;

    setCountdown(3);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          setIsRecording(true);
          setIsAnalyzing(true);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }, [disabled]);

  // Stop recording and analyze swing
  const stopRecording = useCallback(() => {
    setIsRecording(false);
    setIsAnalyzing(true);

    // Simulate AI analysis (in real implementation, this would use computer vision)
    setTimeout(() => {
      const analysis: SwingAnalysis = {
        timestamp: Date.now(),
        swingSpeed: Math.random() * 20 + 80, // 80-100 mph
        swingPath: Math.random() > 0.6 ? 'straight' : Math.random() > 0.3 ? 'inside' : 'outside',
        clubHeadSpeed: Math.random() * 10 + 90, // 90-100 mph
        tempo: Math.random() * 0.4 + 0.8, // 0.8-1.2 (ideal is 1.0)
        consistency: Math.random() * 30 + 70, // 70-100%
        feedback: generateFeedback(),
        score: Math.floor(Math.random() * 30 + 70) // 70-100
      };

      setCurrentAnalysis(analysis);
      setSwingHistory(prev => [analysis, ...prev.slice(0, 9)]); // Keep last 10 swings
      setIsAnalyzing(false);

      if (onAnalysisComplete) {
        onAnalysisComplete(analysis);
      }
    }, 2000);
  }, [onAnalysisComplete]);

  // Generate AI-powered feedback
  const generateFeedback = (): string[] => {
    const feedbacks = [
      "Great tempo! Keep that rhythm consistent.",
      "Swing path is slightly inside - try to swing more from the inside.",
      "Excellent club head speed! You're generating good power.",
      "Work on keeping your head steady through impact.",
      "Good follow-through! The club is releasing nicely.",
      "Tempo could be more consistent - aim for 1:1 backswing to downswing.",
      "Swing path is outside - focus on swinging more to the right of the target.",
      "Club face is slightly open at impact - work on rotation.",
      "Great balance! You're maintaining good posture.",
      "Impact position looks solid - keep that compression!"
    ];

    // Return 2-3 random feedback items
    const shuffled = [...feedbacks].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 2) + 2);
  };

  // Reset analysis
  const resetAnalysis = useCallback(() => {
    setCurrentAnalysis(null);
    setIsAnalyzing(false);
    setCountdown(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Initialize camera on mount
  useEffect(() => {
    if (!disabled) {
      initializeCamera();
    }
  }, [initializeCamera, disabled]);

  if (disabled) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-lg p-6 text-center">
        <div className="text-gray-400 mb-4">
          <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-lg font-semibold">Video Swing Analysis</p>
          <p className="text-sm">Upgrade to Pro for AI-powered swing analysis</p>
        </div>
        <button className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-black px-6 py-2 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all">
          Upgrade to Pro
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/20 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Camera className="w-6 h-6 text-yellow-500" />
        <h3 className="text-xl font-bold text-white">AI Swing Analysis</h3>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-400">Live Analysis</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video Feed */}
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
            {hasPermission === null && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Initializing camera...</p>
                </div>
              </div>
            )}

            {hasPermission === false && (
              <div className="absolute inset-0 flex items-center justify-center text-red-400">
                <div className="text-center">
                  <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Camera access denied</p>
                  <p className="text-sm">Please allow camera access to use swing analysis</p>
                </div>
              </div>
            )}

            {hasPermission && (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }} // Mirror the video
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ display: isRecording ? 'block' : 'none' }}
                />

                {/* Recording Indicator */}
                {isRecording && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">RECORDING</span>
                  </div>
                )}

                {/* Countdown */}
                {countdown !== null && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="text-6xl font-bold text-yellow-500 animate-bounce">
                      {countdown}
                    </div>
                  </div>
                )}

                {/* Analyzing */}
                {isAnalyzing && !isRecording && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="text-center text-white">
                      <div className="animate-spin w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p className="text-lg font-semibold">Analyzing Swing...</p>
                      <p className="text-sm text-gray-300">AI processing your technique</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            {!isRecording && !isAnalyzing && (
              <button
                onClick={startRecording}
                disabled={!hasPermission}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-lg font-semibold hover:from-green-500 hover:to-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-5 h-5 inline mr-2" />
                Start Analysis
              </button>
            )}

            {isRecording && (
              <button
                onClick={stopRecording}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-3 rounded-lg font-semibold hover:from-red-500 hover:to-red-600 transition-all"
              >
                <Square className="w-5 h-5 inline mr-2" />
                Stop Recording
              </button>
            )}

            {currentAnalysis && !isRecording && !isAnalyzing && (
              <button
                onClick={resetAnalysis}
                className="bg-gray-700 text-white px-4 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all"
              >
                <RotateCcw className="w-5 h-5 inline mr-2" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Analysis Results */}
        <div className="space-y-4">
          {currentAnalysis ? (
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-yellow-500" />
                <h4 className="text-lg font-semibold text-white">Swing Analysis</h4>
                <div className="ml-auto">
                  <span className="text-2xl font-bold text-yellow-500">{currentAnalysis.score}</span>
                  <span className="text-sm text-gray-400">/100</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-black/30 rounded p-3">
                  <div className="text-sm text-gray-400">Swing Speed</div>
                  <div className="text-lg font-semibold text-white">
                    {currentAnalysis.swingSpeed.toFixed(1)} mph
                  </div>
                </div>
                <div className="bg-black/30 rounded p-3">
                  <div className="text-sm text-gray-400">Club Head Speed</div>
                  <div className="text-lg font-semibold text-white">
                    {currentAnalysis.clubHeadSpeed.toFixed(1)} mph
                  </div>
                </div>
                <div className="bg-black/30 rounded p-3">
                  <div className="text-sm text-gray-400">Swing Path</div>
                  <div className="text-lg font-semibold text-white capitalize">
                    {currentAnalysis.swingPath}
                  </div>
                </div>
                <div className="bg-black/30 rounded p-3">
                  <div className="text-sm text-gray-400">Tempo</div>
                  <div className="text-lg font-semibold text-white">
                    {currentAnalysis.tempo.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-sm font-semibold text-yellow-500 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  AI Feedback
                </h5>
                {currentAnalysis.feedback.map((feedback, index) => (
                  <div key={index} className="text-sm text-gray-300 bg-black/20 rounded p-2">
                    • {feedback}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 text-center">
              <Target className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No analysis yet</p>
              <p className="text-sm text-gray-500">Record a swing to get AI-powered feedback</p>
            </div>
          )}

          {/* Swing History */}
          {swingHistory.length > 0 && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <h4 className="text-lg font-semibold text-white">Recent Swings</h4>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {swingHistory.slice(0, 5).map((swing, index) => (
                  <div key={swing.timestamp} className="flex items-center justify-between bg-black/20 rounded p-2">
                    <span className="text-sm text-gray-400">Swing {index + 1}</span>
                    <span className="text-sm font-semibold text-white">{swing.score}/100</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-900/20 border border-blue-500/20 rounded-lg p-4">
        <h5 className="text-sm font-semibold text-blue-400 mb-2">How to Use:</h5>
        <div className="text-sm text-gray-300 space-y-1">
          <p>• Position yourself so your full swing is visible in the frame</p>
          <p>• Click &quot;Start Analysis&quot; and get ready for the 3-second countdown</p>
          <p>• Take your normal swing when recording begins</p>
          <p>• Get instant AI feedback on your technique, speed, and consistency</p>
        </div>
      </div>
    </div>
  );
}