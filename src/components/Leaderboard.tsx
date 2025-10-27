import { Trophy, TrendingDown, TrendingUp, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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


interface LeaderboardProps {
  period?: 'today' | 'week';
  sortBy?: 'efficiency' | 'screentime';
}

const Leaderboard = ({ period = 'today', sortBy = 'efficiency' }: LeaderboardProps = {}) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [localPeriod, setLocalPeriod] = useState<'today' | 'week'>(period);
  const [localSortBy, setLocalSortBy] = useState<'efficiency' | 'screentime'>(sortBy);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id || null);

        const today = new Date().toISOString().split('T')[0];
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const startDate = localPeriod === 'today' ? today : weekAgo.toISOString().split('T')[0];

        // Fetch screen time data for the period
        const { data: screenTimeData, error: stError } = await supabase
          .from('user_screen_time')
          .select('user_id, time_spent_minutes, app_name')
          .gte('date', startDate);

        if (stError) throw stError;

        // Fetch app categories
        const { data: categories } = await supabase
          .from('app_categories')
          .select('*');

        const categoryMap = new Map(categories?.map(cat => [cat.app_name, cat]) || []);

        // Aggregate by user
        const userStats = new Map<string, { totalMinutes: number; efficientMinutes: number; inefficientMinutes: number }>();
        
        screenTimeData?.forEach(entry => {
          if (!userStats.has(entry.user_id)) {
            userStats.set(entry.user_id, { totalMinutes: 0, efficientMinutes: 0, inefficientMinutes: 0 });
          }
          const stats = userStats.get(entry.user_id)!;
          const cat = categoryMap.get(entry.app_name);
          const multiplier = cat?.efficiency_multiplier || 0;
          
          stats.totalMinutes += entry.time_spent_minutes;
          if (multiplier > 0) stats.efficientMinutes += entry.time_spent_minutes;
          else if (multiplier < 0) stats.inefficientMinutes += entry.time_spent_minutes;
        });

        // Fetch profiles
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('id, display_name, team_name, avatar_emoji')
          .in('id', Array.from(userStats.keys()));

        if (error) throw error;

        if (profiles && profiles.length > 0) {
          let leaderboardData: LeaderboardEntry[] = profiles.map(profile => {
            const stats = userStats.get(profile.id) || { totalMinutes: 0, efficientMinutes: 0, inefficientMinutes: 0 };
            const productivePercentage = stats.totalMinutes > 0 ? (stats.efficientMinutes / stats.totalMinutes) * 100 : 0;
            const unproductivePercentage = stats.totalMinutes > 0 ? (stats.inefficientMinutes / stats.totalMinutes) * 100 : 0;
            const efficiencyScore = Math.max(0, productivePercentage - unproductivePercentage);

            return {
              rank: 0,
              name: profile.display_name || 'Anonymous',
              team: profile.team_name || 'No Team',
              screenTime: `${Math.floor(stats.totalMinutes / 60)}h ${stats.totalMinutes % 60}m`,
              change: Math.floor(Math.random() * 100) - 50,
              avatar: profile.avatar_emoji || '😎',
              efficiencyScore: Math.round(efficiencyScore),
              userId: profile.id
            };
          });

          // Sort based on criteria
          if (localSortBy === 'efficiency') {
            leaderboardData.sort((a, b) => b.efficiencyScore - a.efficiencyScore);
          } else {
            leaderboardData.sort((a, b) => {
              const aMinutes = userStats.get(a.userId)?.totalMinutes || 0;
              const bMinutes = userStats.get(b.userId)?.totalMinutes || 0;
              return bMinutes - aMinutes;
            });
          }

          // Assign ranks
          leaderboardData.forEach((entry, index) => {
            entry.rank = index + 1;
          });

          setLeaderboard(leaderboardData);
        } else {
          setLeaderboard([]);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setLeaderboard([]);
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
  }, [localPeriod, localSortBy]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <Tabs value={localPeriod} onValueChange={(v) => setLocalPeriod(v as 'today' | 'week')} className="mb-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
        </TabsList>
      </Tabs>

      <Tabs value={localSortBy} onValueChange={(v) => setLocalSortBy(v as 'efficiency' | 'screentime')} className="mb-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="efficiency">By Efficiency</TabsTrigger>
          <TabsTrigger value="screentime">By Screen Time</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Leaderboard table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              {leaderboard.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="mb-2">No leaderboard data yet</p>
                  <p className="text-sm">Add screen time data to appear on the leaderboard</p>
                </div>
              ) : (
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
                              : 'bg-primary/10 text-primary'
                          }`}>
                            {Math.max(0, Math.round(player.efficiencyScore))}%
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
              )}
            </div>
          </div>
          
    </div>
  );
};

export default Leaderboard;
