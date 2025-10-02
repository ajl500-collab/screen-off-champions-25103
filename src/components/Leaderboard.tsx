import { Trophy, TrendingDown, TrendingUp, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface LeaderboardEntry {
  rank: number;
  name: string;
  team: string;
  screenTime: string;
  change: number;
  avatar: string;
  efficiencyScore: number;
  userId: string;
}

const mockLeaderboard = [
  { rank: 1, name: "Alex", team: "Squad Alpha", screenTime: "2h 14m", change: -47, avatar: "🏆", efficiencyScore: 87, userId: "mock1" },
  { rank: 2, name: "Jordan", team: "Duo Dynamic", screenTime: "3h 08m", change: -35, avatar: "🥈", efficiencyScore: 64, userId: "mock2" },
  { rank: 3, name: "Sam", team: "Squad Alpha", screenTime: "3h 42m", change: -28, avatar: "🥉", efficiencyScore: 52, userId: "mock3" },
  { rank: 4, name: "Casey", team: "Solo Warrior", screenTime: "4h 17m", change: -19, avatar: "😎", efficiencyScore: 38, userId: "mock4" },
  { rank: 5, name: "Taylor", team: "Duo Dynamic", screenTime: "5h 33m", change: -8, avatar: "😅", efficiencyScore: -15, userId: "mock5" },
  { rank: 6, name: "Morgan", team: "Squad Beta", screenTime: "6h 52m", change: 12, avatar: "🤡", efficiencyScore: -42, userId: "mock6" },
];

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(mockLeaderboard);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id || null);

        // Fetch profiles with screen time data
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('id, display_name, team_name, avatar_emoji, efficiency_score, total_screen_time_minutes')
          .order('efficiency_score', { ascending: false })
          .limit(20);

        if (error) throw error;

        if (profiles && profiles.length > 0) {
          const realLeaderboard: LeaderboardEntry[] = profiles.map((profile, index) => ({
            rank: index + 1,
            name: profile.display_name || 'Anonymous',
            team: profile.team_name || 'No Team',
            screenTime: `${Math.floor(profile.total_screen_time_minutes / 60)}h ${profile.total_screen_time_minutes % 60}m`,
            change: Math.floor(Math.random() * 100) - 50, // Mock change for now
            avatar: profile.avatar_emoji || '😎',
            efficiencyScore: profile.efficiency_score || 0,
            userId: profile.id
          }));

          setLeaderboard(realLeaderboard);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        // Keep mock data on error
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('leaderboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      {/* Leaderboard table */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-4 font-semibold">Rank</th>
                    <th className="text-left p-4 font-semibold">Player</th>
                    <th className="text-left p-4 font-semibold">Team</th>
                    <th className="text-right p-4 font-semibold">Efficiency</th>
                    <th className="text-right p-4 font-semibold">Screen Time</th>
                    <th className="text-right p-4 font-semibold">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((player) => (
                    <tr 
                      key={player.userId}
                      className={`border-b border-border last:border-0 hover:bg-muted/20 transition-colors ${
                        player.rank <= 3 ? 'bg-primary/5' : ''
                      } ${player.userId === currentUserId ? 'bg-success/5 border-l-4 border-l-success' : ''}`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${
                            player.rank === 1 ? 'text-success' :
                            player.rank === 2 ? 'text-primary' :
                            player.rank === 3 ? 'text-accent' :
                            'text-muted-foreground'
                          }`}>
                            #{player.rank}
                          </span>
                          {player.rank <= 3 && <Trophy className="w-4 h-4 text-primary" />}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{player.avatar}</span>
                          <span className="font-semibold">
                            {player.name}
                            {player.userId === currentUserId && (
                              <span className="ml-2 text-xs text-success">(You)</span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-muted-foreground">{player.team}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <div className={`px-3 py-1 rounded-lg font-bold ${
                            player.efficiencyScore > 50 
                              ? 'bg-success/10 text-success' 
                              : player.efficiencyScore > 0
                              ? 'bg-primary/10 text-primary'
                              : 'bg-destructive/10 text-destructive'
                          }`}>
                            {player.efficiencyScore > 0 ? '+' : ''}{Math.round(player.efficiencyScore)}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-mono font-semibold">{player.screenTime}</span>
                      </td>
                      <td className="p-4 text-right">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${
                          player.change < 0 
                            ? 'bg-success/10 text-success' 
                            : 'bg-destructive/10 text-destructive'
                        }`}>
                          {player.change < 0 ? (
                            <TrendingDown className="w-4 h-4" />
                          ) : (
                            <TrendingUp className="w-4 h-4" />
                          )}
                          <span className="font-semibold">{Math.abs(player.change)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
    </div>
  );
};

export default Leaderboard;
