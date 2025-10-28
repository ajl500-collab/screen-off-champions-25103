import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format, startOfWeek, subDays } from "date-fns";

export interface DailyUsage {
  id: string;
  user_id: string;
  usage_date: string;
  productive_mins: number;
  unproductive_mins: number;
  neutral_mins: number;
  source: string;
  inserted_at: string;
}

export interface Squad {
  id: string;
  name: string;
  emoji: string | null;
  created_by: string | null;
  created_at: string;
}

export interface Membership {
  user_id: string;
  squad_id: string;
  role: string;
}

export interface Settings {
  user_id: string;
  plan: string | null;
  sync_connected: boolean | null;
  sync_last_updated: string | null;
  bio: string | null;
  ingest_token_hash: string | null;
}

export const useDailyUsage = (date: Date = new Date()) => {
  const dateStr = format(date, "yyyy-MM-dd");
  
  return useQuery({
    queryKey: ["daily-usage", dateStr],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("daily_usage")
        .select("*")
        .eq("user_id", user.id)
        .eq("usage_date", dateStr)
        .maybeSingle();

      if (error) throw error;
      return data as DailyUsage | null;
    },
  });
};

export const useWeeklyUsage = (weekStart?: Date) => {
  const start = weekStart || startOfWeek(new Date(), { weekStartsOn: 1 });
  const startStr = format(start, "yyyy-MM-dd");

  return useQuery({
    queryKey: ["weekly-usage", startStr],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("daily_usage")
        .select("*")
        .eq("user_id", user.id)
        .gte("usage_date", startStr)
        .order("usage_date", { ascending: true })
        .limit(7);

      if (error) throw error;
      return (data || []) as DailyUsage[];
    },
  });
};

export const useSettings = () => {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;
      return data as Settings | null;
    },
  });
};

export const useSquads = () => {
  return useQuery({
    queryKey: ["squads"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get user's memberships
      const { data: memberships, error: memberError } = await supabase
        .from("memberships")
        .select("squad_id")
        .eq("user_id", user.id);

      if (memberError) throw memberError;

      if (!memberships || memberships.length === 0) {
        return [];
      }

      const squadIds = memberships.map(m => m.squad_id);

      // Get squad details
      const { data: squads, error: squadError } = await supabase
        .from("squads")
        .select("*")
        .in("id", squadIds);

      if (squadError) throw squadError;
      return (squads || []) as Squad[];
    },
  });
};

export const useStreak = () => {
  return useQuery({
    queryKey: ["streak"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("daily_usage")
        .select("usage_date, unproductive_mins")
        .eq("user_id", user.id)
        .order("usage_date", { ascending: false })
        .limit(30);

      if (error) throw error;
      if (!data || data.length === 0) return 0;

      let streak = 0;
      for (let i = 1; i < data.length; i++) {
        if (data[i].unproductive_mins >= data[i - 1].unproductive_mins) {
          break;
        }
        streak++;
      }

      return streak;
    },
  });
};

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_emoji: string | null;
  efficiency_score: number | null;
  total_screen_time_minutes: number | null;
  team_name: string | null;
}

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data as Profile;
    },
  });
};

export interface UserStats {
  bestStreak: number;
  bestWeekDrop: number;
  topCategory: string;
  squadsJoined: number;
}

export const useUserStats = () => {
  return useQuery({
    queryKey: ["user-stats"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Calculate best streak (consecutive days with decreasing unproductive time)
      const { data: usageData } = await supabase
        .from("daily_usage")
        .select("usage_date, unproductive_mins")
        .eq("user_id", user.id)
        .order("usage_date", { ascending: false })
        .limit(30);

      let bestStreak = 0;
      let currentStreak = 0;
      
      if (usageData && usageData.length > 1) {
        for (let i = 1; i < usageData.length; i++) {
          if (usageData[i].unproductive_mins >= usageData[i - 1].unproductive_mins) {
            currentStreak++;
            bestStreak = Math.max(bestStreak, currentStreak);
          } else {
            currentStreak = 0;
          }
        }
      }

      // Calculate best week drop (biggest reduction in unproductive time week-over-week)
      const { data: weeklyData } = await supabase
        .from("daily_usage")
        .select("usage_date, unproductive_mins")
        .eq("user_id", user.id)
        .order("usage_date", { ascending: false })
        .limit(14);

      let bestWeekDrop = 0;
      if (weeklyData && weeklyData.length >= 14) {
        const thisWeek = weeklyData.slice(0, 7).reduce((sum, day) => sum + day.unproductive_mins, 0);
        const lastWeek = weeklyData.slice(7, 14).reduce((sum, day) => sum + day.unproductive_mins, 0);
        if (lastWeek > 0) {
          bestWeekDrop = Math.round(((lastWeek - thisWeek) / lastWeek) * 100);
        }
      }

      // Get top productive category (mock for now - would need app-level data)
      const topCategory = "Productivity";

      // Count squads joined
      const { data: memberships } = await supabase
        .from("memberships")
        .select("squad_id")
        .eq("user_id", user.id);

      const squadsJoined = memberships?.length || 0;

      return {
        bestStreak,
        bestWeekDrop,
        topCategory,
        squadsJoined,
      } as UserStats;
    },
  });
};

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatarUrl: string;
  efficiency: number;
  rankDelta: number;
  tier: "Gold" | "Silver" | "Bronze";
  badges?: string[];
}

export const useLeaderboard = (squadId?: string) => {
  return useQuery({
    queryKey: ["leaderboard", squadId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get squad members
      let userIds: string[] = [];
      
      if (squadId) {
        const { data: memberships } = await supabase
          .from("memberships")
          .select("user_id")
          .eq("squad_id", squadId);
        
        userIds = memberships?.map(m => m.user_id) || [];
      } else {
        // Get all users in any of user's squads
        const { data: myMemberships } = await supabase
          .from("memberships")
          .select("squad_id")
          .eq("user_id", user.id);

        const squadIds = myMemberships?.map(m => m.squad_id) || [];
        
        if (squadIds.length > 0) {
          const { data: allMemberships } = await supabase
            .from("memberships")
            .select("user_id")
            .in("squad_id", squadIds);
          
          userIds = [...new Set(allMemberships?.map(m => m.user_id) || [])];
        }
      }

      if (userIds.length === 0) {
        return [] as LeaderboardEntry[];
      }

      // Get profiles with efficiency scores
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .in("id", userIds)
        .order("efficiency_score", { ascending: false });

      if (!profiles) return [];

      // Map to leaderboard entries
      const entries: LeaderboardEntry[] = profiles.map((profile, index) => {
        const efficiency = profile.efficiency_score || 0;
        return {
          rank: index + 1,
          userId: profile.id,
          name: profile.display_name || profile.username,
          avatarUrl: profile.avatar_emoji || "😎",
          efficiency,
          rankDelta: 0, // Would need historical data to calculate
          tier: efficiency >= 80 ? "Gold" : efficiency >= 60 ? "Silver" : "Bronze",
          badges: [], // No badges yet
        };
      });

      return entries;
    },
  });
};
