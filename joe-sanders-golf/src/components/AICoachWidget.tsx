'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, X } from 'lucide-react';

interface AICoachWidgetProps {
  sessionId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onAnalysisComplete?: (analysis: any) => void;
}

interface AnalysisResult {
  analysis: string;
  tip: string;
  confidence: string;
}

export function AICoachWidget({ sessionId, isOpen, onClose, onAnalysisComplete }: AICoachWidgetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [lastShot, setLastShot] = useState<any>(null);

  const handleAnalyzeShot = useCallback(async (shotData?: any) => {
    const dataToAnalyze = shotData || lastShot;
    if (!dataToAnalyze || !sessionId) return;

    setIsLoading(true);

    try {
      // 1. Call our AI Coach API
      const analysisResponse = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shotData: dataToAnalyze,
          chatHistory: chatHistory
        })
      });

      if (!analysisResponse.ok) {
        throw new Error('Analysis failed');
      }

      const analysisData = await analysisResponse.json();

      // 2. Generate speech from the analysis
      const speechResponse = await fetch('/api/ai/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `${analysisData.analysis} ${analysisData.tip}`
        })
      });

      if (speechResponse.ok && speechResponse.status !== 204) {
        // 4. Handle the audio response (only if we got actual audio)
        const audioBlob = await speechResponse.blob();
        if (audioBlob.size > 0) {
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
        }
      }

      setAnalysis(analysisData);

      // 3. Save to chat history
      if (supabase) {
        await supabase.from('coach_chats').insert({
        session_id: sessionId,
        user_message: `Analyze my shot: ${dataToAnalyze.club_used || dataToAnalyze.club}, ${dataToAnalyze.outcome}, ${dataToAnalyze.distance}yd`,
        ai_response: `${analysisData.analysis} ${analysisData.tip}`,
        audio_url: audioUrl // This would be a permanent URL in production
      });
      }

      // Update chat history
      setChatHistory(prev => [...prev, {
        role: 'user',
        content: `Shot analysis: ${dataToAnalyze.club_used || dataToAnalyze.club}, ${dataToAnalyze.outcome}, ${dataToAnalyze.distance}yd`
      }, {
        role: 'assistant',
        content: `${analysisData.analysis} ${analysisData.tip}`
      }]);

      // Notify parent component
      if (onAnalysisComplete) {
        onAnalysisComplete(analysisData);
      }

    } catch (error) {
      console.error('Error analyzing shot:', error);
    } finally {
      setIsLoading(false);
    }
  }, [lastShot, sessionId, chatHistory, audioUrl, onAnalysisComplete]);

  // Listen for shot events from the simulator
  useEffect(() => {
    const handleShotTaken = (event: CustomEvent) => {
      const { detail: shotData } = event;
      setLastShot(shotData);
      // Auto-analyze after a shot
      if (sessionId) {
        // We'll handle analysis in a separate effect
      }
    };

    // Only add event listener on client side
    if (typeof window !== 'undefined') {
      window.addEventListener('shotTaken', handleShotTaken as EventListener);
      return () => {
        window.removeEventListener('shotTaken', handleShotTaken as EventListener);
      };
    }
  }, [sessionId]);

  // Auto-analyze when a new shot is taken
  useEffect(() => {
    if (lastShot && sessionId && !isLoading) {
      handleAnalyzeShot(lastShot);
    }
  }, [lastShot, sessionId, isLoading, handleAnalyzeShot]);

  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
      setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
    }
  };

  const toggleVoiceRecording = () => {
    setIsRecording(!isRecording);
    // This would integrate with Web Speech API for voice input
    // For now, it's a placeholder
  };

  if (!isOpen) return null;

  return (
    <div className="bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] border border-[#d4af37] rounded-lg p-4 shadow-2xl max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#d4af37] flex items-center gap-2">
          <MessageCircle size={20} />
          Uncle Joe&apos;s AI Coach
        </h3>
        <button
          onClick={onClose}
          className="text-[#d4af37] hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4af37]"></div>
          <span className="ml-2 text-[#d4af37]">Analyzing your shot...</span>
        </div>
      ) : analysis ? (
        <div className="space-y-4">
          <div className="bg-[#2a2a2a] rounded-lg p-3">
            <p className="text-sm text-gray-300 mb-2">{analysis.analysis}</p>
            <p className="text-sm font-semibold text-[#d4af37]">💡 {analysis.tip}</p>
            <p className="text-xs text-gray-500 mt-2">Confidence: {analysis.confidence}</p>
          </div>

          <div className="flex gap-2">
            {audioUrl && (
              <button
                onClick={playAudio}
                disabled={isPlaying}
                className="flex items-center gap-2 bg-[#d4af37] text-[#0a0a0a] px-3 py-2 rounded font-semibold hover:bg-[#b8942c] transition-colors disabled:opacity-50"
              >
                {isPlaying ? <VolumeX size={16} /> : <Volume2 size={16} />}
                {isPlaying ? 'Playing...' : 'Hear Advice'}
              </button>
            )}

            <button
              onClick={toggleVoiceRecording}
              className={`flex items-center gap-2 px-3 py-2 rounded font-semibold transition-colors ${
                isRecording
                  ? 'bg-red-600 text-white'
                  : 'bg-[#d4af37] text-[#0a0a0a] hover:bg-[#b8942c]'
              }`}
            >
              {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
              {isRecording ? 'Stop' : 'Voice Chat'}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">Take a shot to get AI coaching!</p>
          {lastShot && (
            <button
              onClick={() => handleAnalyzeShot()}
              className="bg-gradient-to-r from-[#d4af37] to-[#a2852c] text-[#0a0a0a] px-4 py-2 rounded font-semibold hover:from-[#b8942c] hover:to-[#8a6d23] transition-colors"
            >
              Analyze Last Shot
            </button>
          )}
        </div>
      )}

      {isRecording && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-500 rounded-lg">
          <p className="text-red-400 text-sm">🎤 Listening... Speak your question to Uncle Joe!</p>
        </div>
      )}
    </div>
  );
}