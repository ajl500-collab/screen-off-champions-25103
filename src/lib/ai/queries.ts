import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Interfaces
export interface RoastMessage {
  id: string;
  content: string;
  trigger_reason: string | null;
  efficiency_score: number | null;
  rank_delta: number | null;
  created_at: string;
}

export interface MotivationMessage {
  id: string;
  content: string;
  trigger_reason: string | null;
  efficiency_score: number | null;
  streak_days: number | null;
  created_at: string;
}

export interface WeeklySummary {
  id: string;
  summary: string;
  week_start: string;
  week_end: string;
  efficiency_change: number | null;
  top_productive_app: string | null;
  top_unproductive_app: string | null;
  created_at: string;
}

export interface SquadInsight {
  id: string;
  squad_id: string;
  content: string;
  week_start: string;
  week_end: string;
  created_at: string;
}

// Hook to fetch latest roast
export function useLatestRoast() {
  return useQuery({
    queryKey: ["latest-roast"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("roast_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as RoastMessage | null;
    },
  });
}

// Hook to fetch all roasts
export function useRoastHistory(limit: number = 10) {
  return useQuery({
    queryKey: ["roast-history", limit],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("roast_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as RoastMessage[];
    },
  });
}

// Hook to fetch latest motivation
export function useLatestMotivation() {
  return useQuery({
    queryKey: ["latest-motivation"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("motivation_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as MotivationMessage | null;
    },
  });
}

// Hook to fetch all motivations
export function useMotivationHistory(limit: number = 10) {
  return useQuery({
    queryKey: ["motivation-history", limit],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("motivation_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as MotivationMessage[];
    },
  });
}

// Hook to fetch latest weekly summary
export function useLatestWeeklySummary() {
  return useQuery({
    queryKey: ["latest-weekly-summary"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("weekly_summary")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as WeeklySummary | null;
    },
  });
}

// Hook to fetch all weekly summaries
export function useWeeklySummaryHistory(limit: number = 4) {
  return useQuery({
    queryKey: ["weekly-summary-history", limit],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("weekly_summary")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as WeeklySummary[];
    },
  });
}

// Hook to fetch squad insights
export function useSquadInsights(squadId: string) {
  return useQuery({
    queryKey: ["squad-insights", squadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("squad_insights")
        .select("*")
        .eq("squad_id", squadId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as SquadInsight | null;
    },
    enabled: !!squadId,
  });
}

// Mutation to generate roast
export function useGenerateRoast() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      userId: string;
      userName?: string;
      efficiency: number;
      rankDelta?: number;
      triggerReason?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke("generate-roast", {
        body: params,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["latest-roast"] });
      queryClient.invalidateQueries({ queryKey: ["roast-history"] });
    },
  });
}

// Mutation to generate motivation
export function useGenerateMotivation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      userId: string;
      userName?: string;
      efficiency: number;
      streakDays?: number;
      triggerReason?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke("generate-motivation", {
        body: params,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["latest-motivation"] });
      queryClient.invalidateQueries({ queryKey: ["motivation-history"] });
    },
  });
}

// Mutation to generate weekly summary
export function useGenerateWeeklySummary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      userId: string;
      userName?: string;
      weekStart: string;
      weekEnd: string;
      efficiencyChange: number;
      topProductiveApp?: string;
      topUnproductiveApp?: string;
      streakDays?: number;
      currentTier?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke("generate-weekly-summary", {
        body: params,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["latest-weekly-summary"] });
      queryClient.invalidateQueries({ queryKey: ["weekly-summary-history"] });
    },
  });
}

// Mutation to generate squad insights
export function useGenerateSquadInsights() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      squadId: string;
      squadName: string;
      weekStart: string;
      weekEnd: string;
      memberStats: any[];
    }) => {
      const { data, error } = await supabase.functions.invoke("generate-squad-insights", {
        body: params,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["squad-insights", variables.squadId] });
    },
  });
}
