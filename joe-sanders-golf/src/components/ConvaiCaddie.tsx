'use client';
import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, MessageCircle, Volume2, VolumeX } from 'lucide-react';

interface ConvaiCaddieProps {
  agentId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ConvaiCaddie({ agentId = "your-convai-agent-id", isOpen, onClose }: ConvaiCaddieProps) {
  const convaiRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!isOpen || isLoaded) return;

    // Load ElevenLabs Convai script
    const script = document.createElement('script');
    script.src = 'https://elevenlabs.io/convai-widget/index.js';
    script.async = true;
    script.onload = () => {
      setIsLoaded(true);
      initializeConvai();
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src*="convai-widget"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [isOpen, isLoaded]);

  const initializeConvai = () => {
    if (!convaiRef.current) return;

    // Create the Convai widget
    const convaiWidget = document.createElement('elevenlabs-convai');
    convaiWidget.setAttribute('agent-id', agentId);

    // Configure widget settings
    convaiWidget.style.width = '100%';
    convaiWidget.style.height = '400px';
    convaiWidget.style.border = 'none';
    convaiWidget.style.borderRadius = '8px';

    convaiRef.current.appendChild(convaiWidget);

    // Listen for convai events
    convaiWidget.addEventListener('convai-start', () => setIsListening(true));
    convaiWidget.addEventListener('convai-end', () => setIsListening(false));
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // This would interact with the Convai widget's mute functionality
    const convaiWidget = convaiRef.current?.querySelector('elevenlabs-convai') as any;
    if (convaiWidget) {
      convaiWidget.muted = !isMuted;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] border border-[#d4af37] rounded-lg p-4 shadow-2xl max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#d4af37] flex items-center gap-2">
          <MessageCircle size={20} />
          Uncle Joe&apos;s Caddie
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className={`p-2 rounded-full transition-colors ${
              isMuted ? 'bg-red-600 text-white' : 'bg-[#d4af37] text-[#0a0a0a] hover:bg-[#b8942c]'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button
            onClick={onClose}
            className="text-[#d4af37] hover:text-white transition-colors p-1"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          {isListening ? (
            <Mic className="text-red-500 animate-pulse" size={16} />
          ) : (
            <MicOff className="text-gray-500" size={16} />
          )}
          <span className="text-sm text-gray-300">
            {isListening ? 'Listening...' : 'Tap to speak'}
          </span>
        </div>

        <div className="bg-[#2a2a2a] rounded-lg p-3 min-h-[100px]">
          {!isLoaded ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#d4af37]"></div>
              <span className="ml-2 text-[#d4af37]">Loading Uncle Joe...</span>
            </div>
          ) : (
            <div ref={convaiRef} className="w-full h-full">
              {/* Convai widget will be inserted here */}
            </div>
          )}
        </div>
      </div>

      <div className="text-xs text-gray-500 space-y-2">
        <div>
          <p>💬 <strong>Voice Commands:</strong></p>
          <div className="grid grid-cols-1 gap-1 mt-1">
            <div className="text-xs">
              <span className="text-[#d4af37] font-semibold">Club Selection:</span>
              <span className="ml-1">&quot;What club for 150 yards?&quot;, &quot;Driver or 3-wood?&quot;</span>
            </div>
            <div className="text-xs">
              <span className="text-[#d4af37] font-semibold">Swing Analysis:</span>
              <span className="ml-1">&quot;How&apos;s my swing?&quot;, &quot;Fix my slice&quot;, &quot;Improve distance&quot;</span>
            </div>
            <div className="text-xs">
              <span className="text-[#d4af37] font-semibold">Course Strategy:</span>
              <span className="ml-1">&quot;How to play this hole?&quot;, &quot;Wind direction?&quot;, &quot;Green speed?&quot;</span>
            </div>
            <div className="text-xs">
              <span className="text-[#d4af37] font-semibold">Mental Game:</span>
              <span className="ml-1">&quot;Help me focus&quot;, &quot;Pressure shot tips&quot;, &quot;Stay confident&quot;</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-2">
          <p className="text-xs text-[#d4af37] font-semibold mb-1">Quick Actions:</p>
          <div className="flex flex-wrap gap-1">
            <button className="px-2 py-1 bg-[#2a2a2a] text-xs text-gray-300 rounded hover:bg-[#3a3a3a] transition-colors">
              Club Advice
            </button>
            <button className="px-2 py-1 bg-[#2a2a2a] text-xs text-gray-300 rounded hover:bg-[#3a3a3a] transition-colors">
              Swing Tips
            </button>
            <button className="px-2 py-1 bg-[#2a2a2a] text-xs text-gray-300 rounded hover:bg-[#3a3a3a] transition-colors">
              Course Help
            </button>
            <button className="px-2 py-1 bg-[#2a2a2a] text-xs text-gray-300 rounded hover:bg-[#3a3a3a] transition-colors">
              Motivation
            </button>
          </div>
        </div>
      </div>

      {!isLoaded && (
        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500 rounded-lg">
          <p className="text-blue-400 text-sm">
            🔧 <strong>Setup Required:</strong> Configure your ElevenLabs Convai Agent ID in the environment variables to enable voice chat.
          </p>
        </div>
      )}
    </div>
  );
}