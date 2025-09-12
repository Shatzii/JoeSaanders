'use client';
import { useEffect, useState } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface LeaderboardEntry {
  id: string;
  user_id: string;
  challenge_id: string;
  score: number;
  submitted_at: string;
  profiles: {
    username: string;
    avatar_url?: string;
  };
}

export function ChallengeLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data, error } = await supabase
          .from('challenge_entries')
          .select(`
            *,
            profiles:user_id (
              username,
              avatar_url
            )
          `)
          .order('score', { ascending: true })
          .limit(10);

        if (error) throw error;
        setLeaderboard(data || []);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-gray-400">#{rank}</span>;
    }
  };

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#d4af3740]">
      <h3 className="text-lg font-semibold text-[#d4af37] mb-4 flex items-center gap-2">
        <Trophy size={20} />
        Challenge Leaderboard
      </h3>

      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4af37] mx-auto"></div>
          <p className="text-sm text-gray-400 mt-2">Loading leaderboard...</p>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-sm text-gray-400">No challenges completed yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((entry, index) => (
            <div
              key={entry.id}
              className={`flex items-center justify-between p-3 rounded transition-colors ${
                index < 3 ? 'bg-[#d4af37]/10 border border-[#d4af37]/20' : 'bg-[#2a2a2a]'
              }`}
            >
              <div className="flex items-center gap-3">
                {getRankIcon(index + 1)}
                <div>
                  <p className="text-sm font-medium text-white">
                    {entry.profiles?.username || 'Anonymous'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(entry.submitted_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#d4af37]">{entry.score}</p>
                <p className="text-xs text-gray-400">strokes</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-[#d4af3740]">
        <p className="text-xs text-gray-400 text-center">
          Complete challenges to appear on the leaderboard
        </p>
      </div>
    </div>
  );
}