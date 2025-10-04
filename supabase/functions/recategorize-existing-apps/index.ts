import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting recategorization of existing apps...');

    // Get all distinct app names from user_screen_time
    const { data: screenTimeApps, error: screenTimeError } = await supabase
      .from('user_screen_time')
      .select('app_name');

    if (screenTimeError) {
      console.error('Error fetching screen time apps:', screenTimeError);
      throw screenTimeError;
    }

    // Get unique app names
    const uniqueAppNames = [...new Set(screenTimeApps?.map(a => a.app_name) || [])];
    console.log(`Found ${uniqueAppNames.length} unique apps in screen time data`);

    // Get already categorized apps
    const { data: categorizedApps, error: categorizedError } = await supabase
      .from('app_categories')
      .select('app_name');

    if (categorizedError) {
      console.error('Error fetching categorized apps:', categorizedError);
      throw categorizedError;
    }

    const categorizedAppNames = new Set(categorizedApps?.map(a => a.app_name) || []);
    console.log(`Found ${categorizedAppNames.size} already categorized apps`);

    // Find apps that need categorization
    const uncategorizedApps = uniqueAppNames.filter(app => !categorizedAppNames.has(app));
    console.log(`Found ${uncategorizedApps.length} uncategorized apps:`, uncategorizedApps);

    const results = {
      total: uncategorizedApps.length,
      success: 0,
      failed: 0,
      errors: [] as any[]
    };

    // Categorize each app
    for (const appName of uncategorizedApps) {
      try {
        console.log(`Categorizing: ${appName}`);
        
        // Call the categorize-app function
        const { data, error } = await supabase.functions.invoke('categorize-app', {
          body: { appName }
        });

        if (error) {
          console.error(`Failed to categorize ${appName}:`, error);
          results.failed++;
          results.errors.push({ appName, error: error.message });
        } else {
          console.log(`Successfully categorized ${appName}:`, data);
          results.success++;
        }
      } catch (error: any) {
        console.error(`Exception categorizing ${appName}:`, error);
        results.failed++;
        results.errors.push({ appName, error: error.message });
      }
    }

    console.log('Recategorization complete:', results);

    return new Response(
      JSON.stringify({
        message: 'Recategorization complete',
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: any) {
    console.error('Error in recategorize-existing-apps:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to recategorize apps'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
