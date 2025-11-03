import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export interface DailyUsageInput {
  usage_date: string;
  productive_mins: number;
  unproductive_mins: number;
  neutral_mins: number;
  source?: string;
}

export const upsertDailyUsage = async (input: DailyUsageInput) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("daily_usage")
    .upsert({
      user_id: user.id,
      usage_date: input.usage_date,
      productive_mins: input.productive_mins,
      unproductive_mins: input.unproductive_mins,
      neutral_mins: input.neutral_mins,
      source: input.source || "manual",
      updated_at: new Date().toISOString(),
    }, {
      onConflict: "user_id,usage_date",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const bulkUpsertDailyUsage = async (inputs: DailyUsageInput[]) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const rows = inputs.map(input => ({
    user_id: user.id,
    usage_date: input.usage_date,
    productive_mins: input.productive_mins,
    unproductive_mins: input.unproductive_mins,
    neutral_mins: input.neutral_mins,
    source: input.source || "csv",
    updated_at: new Date().toISOString(),
  }));

  const { data, error } = await supabase
    .from("daily_usage")
    .upsert(rows, {
      onConflict: "user_id,usage_date",
    })
    .select();

  if (error) throw error;
  return data;
};

export const setSyncConnected = async (connected: boolean) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("settings")
    .upsert({
      user_id: user.id,
      sync_connected: connected,
      sync_last_updated: connected ? new Date().toISOString() : null,
    }, {
      onConflict: "user_id",
    });

  if (error) throw error;
};

export const updateSettings = async (updates: Partial<{
  plan: string;
  bio: string;
  sync_connected: boolean;
}>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("settings")
    .upsert({
      user_id: user.id,
      ...updates,
    }, {
      onConflict: "user_id",
    });

  if (error) throw error;
};

export const createSquad = async (name: string, emoji: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Generate invite code first
  const inviteCode = await generateInviteCode();

  // Insert squad WITHOUT selecting the row to avoid RLS SELECT on returning
  const { error: insertError } = await supabase
    .from("squads")
    .insert({
      name,
      emoji,
      created_by: user.id,
      invite_code: inviteCode,
    });

  if (insertError) throw insertError;

  // Fetch the created squad via secure RPC (bypasses RLS for SELECT)
  const { data: squad, error: fetchError } = await supabase
    .rpc("get_squad_by_invite_code", { p_code: inviteCode })
    .single();

  if (fetchError || !squad) {
    throw fetchError || new Error("Unable to fetch created squad");
  }

  // Add creator as member (will satisfy SELECT policies going forward)
  const { error: memberError } = await supabase
    .from("memberships")
    .insert({
      user_id: user.id,
      squad_id: squad.id,
      role: "admin",
    });

  if (memberError) throw memberError;

  return squad;
};

export const joinSquad = async (inviteCode: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Find squad by invite code via secure RPC (bypasses RLS safely)
  const { data: squad, error: squadError } = await supabase
    .rpc("get_squad_by_invite_code", { p_code: inviteCode })
    .single();

  if (squadError || !squad) throw new Error("Invalid invite code");

  // Add user as member
  const { error: memberError } = await supabase
    .from("memberships")
    .insert({
      user_id: user.id,
      squad_id: squad.id,
      role: "member",
    });

  if (memberError) {
    if (memberError.code === "23505") {
      throw new Error("Already a member of this squad");
    }
    throw memberError;
  }

  return squad;
};

async function generateInviteCode(): Promise<string> {
  const { data, error } = await supabase.rpc("generate_squad_invite_code");
  if (error) throw error;
  return data;
}

/**
 * Send a message to a squad chat
 */
export const sendMessage = async (squadId: string, content: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("messages")
    .insert({
      squad_id: squadId,
      user_id: user.id,
      content,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
