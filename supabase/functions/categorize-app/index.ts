import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { appName } = await req.json();
    
    if (!appName) {
      throw new Error("App name is required");
    }

    console.log('Categorizing app:', appName);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if app already exists in categories
    const { data: existing } = await supabase
      .from('app_categories')
      .select('*')
      .eq('app_name', appName)
      .single();

    if (existing) {
      return new Response(
        JSON.stringify({ 
          category: existing.category,
          efficiency_multiplier: existing.efficiency_multiplier 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use Lovable AI to categorize the app
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are an app categorization expert. Categorize apps as productive, unproductive, or utility based on their typical use case. Respond with ONLY one word: productive, unproductive, or utility.'
          },
          {
            role: 'user',
            content: `Categorize this app: ${appName}`
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      console.error('AI API error:', await aiResponse.text());
      throw new Error('Failed to categorize app with AI');
    }

    const aiData = await aiResponse.json();
    const categoryText = aiData.choices[0].message.content.toLowerCase().trim();
    
    let category: 'productive' | 'unproductive' | 'utility' = 'utility';
    let efficiency_multiplier = 0;

    if (categoryText.includes('productive')) {
      category = 'productive';
      efficiency_multiplier = 1;
    } else if (categoryText.includes('unproductive')) {
      category = 'unproductive';
      efficiency_multiplier = -1;
    }

    console.log('Categorized', appName, 'as', category);

    // Store the categorization
    const { error: insertError } = await supabase
      .from('app_categories')
      .insert({
        app_name: appName,
        category,
        efficiency_multiplier
      });

    if (insertError) {
      console.error('Error inserting category:', insertError);
      throw insertError;
    }

    return new Response(
      JSON.stringify({ category, efficiency_multiplier }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in categorize-app function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
