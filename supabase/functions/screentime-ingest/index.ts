import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.10";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-ingest-token",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const ingestToken = req.headers.get("x-ingest-token");
    const expectedToken = Deno.env.get("INGEST_SHARED_SECRET") || "test-secret-key-change-in-production";

    if (!ingestToken || ingestToken !== expectedToken) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { user_id, payload } = body;

    if (!user_id || !Array.isArray(payload)) {
      return new Response(
        JSON.stringify({ error: "Invalid request: user_id and payload array required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const rows = payload.map((entry: any) => ({
      user_id,
      usage_date: entry.date,
      productive_mins: entry.productive_mins || 0,
      unproductive_mins: entry.unproductive_mins || 0,
      neutral_mins: entry.neutral_mins || 0,
      source: "webhook",
      updated_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from("daily_usage")
      .upsert(rows)
      .select();

    if (error) throw error;

    // Update sync status
    await supabase
      .from("settings")
      .upsert({
        user_id,
        sync_connected: true,
        sync_last_updated: new Date().toISOString(),
      });

    return new Response(
      JSON.stringify({ ok: true, inserted: data.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
