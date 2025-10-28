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
    const { user_id, payload, data: appData } = body;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Support both formats: pre-aggregated (payload) or app-level (data)
    if (appData && Array.isArray(appData)) {
      // New format: app-level data with AI categorization
      console.log(`Processing ${appData.length} apps with AI categorization`);
      
      const today = new Date().toISOString().split('T')[0];
      const dailyTotals: Record<string, { productive: number; unproductive: number; neutral: number }> = {};

      for (const item of appData) {
        const appName = item.app;
        const minutes = item.minutes || 0;
        const date = item.date || today;

        if (!minutes || !appName) continue;

        // Get or create category for this app
        let category = 'neutral';
        try {
          // Check if app is already categorized
          const { data: existing } = await supabase
            .from('app_categories')
            .select('category')
            .eq('app_name', appName)
            .single();

          if (existing) {
            category = existing.category;
          } else {
            // Call categorize-app function
            const { data: catResult, error: catError } = await supabase.functions.invoke('categorize-app', {
              body: { appName }
            });

            if (!catError && catResult) {
              category = catResult.category;
            }
          }
        } catch (error) {
          console.error(`Error categorizing ${appName}:`, error);
        }

        // Initialize date entry if needed
        if (!dailyTotals[date]) {
          dailyTotals[date] = { productive: 0, unproductive: 0, neutral: 0 };
        }

        // Map category to field name
        if (category === 'productive') {
          dailyTotals[date].productive += minutes;
        } else if (category === 'unproductive') {
          dailyTotals[date].unproductive += minutes;
        } else {
          dailyTotals[date].neutral += minutes;
        }

        // Store per-app screen time
        await supabase.from("user_screen_time").upsert({
          user_id,
          app_name: appName,
          time_spent_minutes: minutes,
          date,
        });
      }

      // Upsert aggregated daily usage
      const rows = Object.entries(dailyTotals).map(([date, totals]) => ({
        user_id,
        usage_date: date,
        productive_mins: totals.productive,
        unproductive_mins: totals.unproductive,
        neutral_mins: totals.neutral,
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
        JSON.stringify({ 
          ok: true, 
          apps_processed: appData.length,
          daily_entries: data.length 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } else if (payload && Array.isArray(payload)) {
      // Old format: pre-aggregated data (backward compatibility)
      console.log(`Processing ${payload.length} pre-aggregated entries`);
      
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
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid request: 'data' (app array) or 'payload' (aggregated) required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

  } catch (error: any) {
    console.error('Error in screentime-ingest:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
