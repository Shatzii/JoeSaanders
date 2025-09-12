'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Send, MessageSquare, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface CoSMessage {
  id: string;
  task_type: string;
  user_input: string;
  gpt_output: string;
  created_at: string;
}

export default function ChiefOfStaffPage() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [taskType, setTaskType] = useState('general');
  const [messageHistory, setMessageHistory] = useState<CoSMessage[]>([]);
  const [stats, setStats] = useState({
    totalMessages: 0,
    todayMessages: 0,
    avgResponseTime: 0
  });

  // Load message history
  useEffect(() => {
    loadMessageHistory();
    loadStats();
  }, []);

  const loadMessageHistory = async () => {
    try {
      const { data } = await supabase
        .from('cos_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (data) {
        setMessageHistory(data);
      }
    } catch (error) {
      console.error('Failed to load message history:', error);
    }
  };

  const loadStats = async () => {
    try {
      const { data } = await supabase
        .from('cos_logs')
        .select('created_at');

      if (data) {
        const total = data.length;
        const today = data.filter(log => {
          const logDate = new Date(log.created_at);
          const today = new Date();
          return logDate.toDateString() === today.toDateString();
        }).length;

        setStats({
          totalMessages: total,
          todayMessages: today,
          avgResponseTime: 2.3 // Mock data - would calculate from actual response times
        });
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    setResponse('');

    try {
      const response = await fetch('/api/ai/chief-of-staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message.trim(),
          context: `Task type: ${taskType}`,
          taskType
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setResponse(data.reply);

      // Reload history to show the new message
      await loadMessageHistory();
      await loadStats();

    } catch (error) {
      console.error('Chief of Staff error:', error);
      setResponse('Sorry, I\'m having trouble connecting right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const taskTypes = [
    { value: 'general', label: 'General Inquiry', icon: '💬' },
    { value: 'email_draft', label: 'Email Draft', icon: '📧' },
    { value: 'social_plan', label: 'Social Media Plan', icon: '📱' },
    { value: 'content_strategy', label: 'Content Strategy', icon: '📝' },
    { value: 'business_plan', label: 'Business Planning', icon: '💼' },
    { value: 'fan_engagement', label: 'Fan Engagement', icon: '👥' },
    { value: 'sponsorship', label: 'Sponsorship Deals', icon: '🤝' },
    { value: 'tournament_prep', label: 'Tournament Prep', icon: '🏆' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] text-white">
      {/* Header */}
      <header className="p-6 border-b border-[#d4af3740]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#d4af37] to-[#f4e87c] bg-clip-text text-transparent">
            Chief of Staff AI
          </h1>
          <p className="text-gray-400 mt-1">Strategic guidance and operational support</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chat Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#d4af3740]">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="text-[#d4af37]" size={20} />
                  <span className="text-sm text-gray-400">Total Messages</span>
                </div>
                <p className="text-2xl font-bold text-[#d4af37]">{stats.totalMessages}</p>
              </div>

              <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#d4af3740]">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="text-[#d4af37]" size={20} />
                  <span className="text-sm text-gray-400">Today</span>
                </div>
                <p className="text-2xl font-bold text-[#d4af37]">{stats.todayMessages}</p>
              </div>

              <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#d4af3740]">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="text-[#d4af37]" size={20} />
                  <span className="text-sm text-gray-400">Avg Response</span>
                </div>
                <p className="text-2xl font-bold text-[#d4af37]">{stats.avgResponseTime}s</p>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="bg-[#1a1a1a] rounded-lg border border-[#d4af3740]">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-[#d4af37] mb-4">Ask Your Chief of Staff</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Task Type
                    </label>
                    <select
                      value={taskType}
                      onChange={(e) => setTaskType(e.target.value)}
                      className="w-full bg-[#2a2a2a] border border-[#d4af3740] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#d4af37]"
                    >
                      {taskTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Your Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ask me anything about strategy, content, business development, or operations..."
                      className="w-full bg-[#2a2a2a] border border-[#d4af3740] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#d4af37] resize-none"
                      rows={4}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !message.trim()}
                    className="w-full bg-gradient-to-r from-[#d4af37] to-[#a2852c] text-[#0a0a0a] px-6 py-3 rounded-lg font-semibold hover:from-[#b8942c] hover:to-[#8a6d23] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0a0a0a]"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Send to Chief of Staff
                      </>
                    )}
                  </button>
                </form>

                {/* Response */}
                {response && (
                  <div className="mt-6 p-4 bg-[#2a2a2a] rounded-lg border border-[#d4af3740]">
                    <h3 className="text-lg font-semibold text-[#d4af37] mb-2">Chief of Staff Response</h3>
                    <div className="text-gray-300 whitespace-pre-wrap">{response}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#d4af3740]">
              <h3 className="text-lg font-semibold text-[#d4af37] mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {taskTypes.slice(1).map(type => (
                  <button
                    key={type.value}
                    onClick={() => setTaskType(type.value)}
                    className="w-full text-left p-3 rounded-lg bg-[#2a2a2a] hover:bg-[#3a3a3a] transition-colors border border-[#d4af3740] flex items-center gap-3"
                  >
                    <span className="text-lg">{type.icon}</span>
                    <span className="text-sm">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Messages */}
            <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#d4af3740]">
              <h3 className="text-lg font-semibold text-[#d4af37] mb-4">Recent Conversations</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {messageHistory.map(msg => (
                  <div key={msg.id} className="p-3 bg-[#2a2a2a] rounded-lg border border-[#d4af3740]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-[#d4af37] text-[#0a0a0a] px-2 py-1 rounded">
                        {msg.task_type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2">{msg.user_input}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}