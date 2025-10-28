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
