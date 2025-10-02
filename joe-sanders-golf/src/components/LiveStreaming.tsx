'use client';
import React, { useState } from 'react';

const LiveStreaming: React.FC = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [channelName, setChannelName] = useState('golf-stream');
  const [isHost, setIsHost] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [chatMessages, setChatMessages] = useState<Array<{user: string, message: string, timestamp: Date}>>([]);
  const [newMessage, setNewMessage] = useState('');

  const startStream = async () => {
    // Mock streaming start - in production this would integrate with Agora/WebRTC
    setIsStreaming(true);
    setIsHost(true);
    setViewerCount(1);
  };

  const joinStream = async () => {
    // Mock joining stream
    setIsStreaming(true);
    setViewerCount(prev => prev + 1);
  };

  const leaveStream = async () => {
    setIsStreaming(false);
    setIsHost(false);
    setViewerCount(0);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages(prev => [...prev, {
        user: isHost ? 'Host' : 'Viewer',
        message: newMessage,
        timestamp: new Date()
      }]);
      setNewMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Live Golf Streaming</h1>

        {/* Stream Controls */}
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            {!isStreaming ? (
              <>
                <input
                  type="text"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  placeholder="Stream Channel Name"
                  className="px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60"
                />
                <button
                  onClick={startStream}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                >
                  🎥 Start Stream
                </button>
                <button
                  onClick={joinStream}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                >
                  👁️ Join Stream
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-green-400 font-bold">🔴 LIVE</span>
                <span className="text-white/60">{viewerCount} viewers</span>
                <button
                  onClick={leaveStream}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  Leave Stream
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Video Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video */}
          <div className="lg:col-span-2">
            <div className="bg-black/50 backdrop-blur-sm p-4 rounded-xl">
              <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                {isStreaming ? (
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎥</div>
                    <p className="text-white/60">
                      {isHost ? 'You are streaming live!' : 'Watching live stream...'}
                    </p>
                    <p className="text-sm text-white/40 mt-2">
                      Video integration would go here with Agora/WebRTC
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-6xl mb-4">📺</div>
                    <p className="text-white/60">No active stream</p>
                    <p className="text-sm text-white/40 mt-2">
                      Start or join a stream to begin
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chat and Info */}
          <div className="space-y-6">
            {/* Stream Info */}
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Stream Info</h3>
              <div className="space-y-2">
                <p><strong>Channel:</strong> {channelName}</p>
                <p><strong>Status:</strong> {isStreaming ? 'Live' : 'Offline'}</p>
                <p><strong>Viewers:</strong> {viewerCount}</p>
                <p><strong>Role:</strong> {isHost ? 'Host' : 'Viewer'}</p>
              </div>
            </div>

            {/* Chat */}
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Live Chat</h3>
              <div className="h-64 overflow-y-auto mb-4 space-y-2">
                {chatMessages.map((msg, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-bold text-blue-400">{msg.user}:</span> {msg.message}
                  </div>
                ))}
                {chatMessages.length === 0 && (
                  <p className="text-white/40 text-sm">No messages yet...</p>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 rounded bg-white/20 text-white placeholder-white/60 text-sm"
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors duration-300"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStreaming;