import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
      return new Response(
        JSON.stringify({ error: 'App name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Categorizing app:', appName);

    // Call Lovable AI to categorize the app
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an app categorization expert. Categorize apps into exactly one of these categories:
- productive: Apps that help with work, learning, productivity (e.g., LinkedIn, Notion, Gmail, Slack, GitHub, VS Code, Google Docs)
- unproductive: Apps that are primarily for entertainment or distraction (e.g., Instagram, TikTok, YouTube, Netflix, Twitter/X, Facebook, Reddit, Snapchat)
- utility: Apps that are neutral tools (e.g., Messages, Phone, Clock, Settings, Maps, Weather, Calculator)

Respond with ONLY a JSON object in this exact format: {"category": "productive|unproductive|utility", "reasoning": "brief explanation"}`
          },
          {
            role: 'user',
            content: `Categorize this app: "${appName}"`
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI categorization failed: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in AI response');
    }

    console.log('AI response:', content);

    // Parse the AI response
    const jsonMatch = content.match(/\{[^}]+\}/);
    if (!jsonMatch) {
      throw new Error('Invalid AI response format');
    }

    const categorization = JSON.parse(jsonMatch[0]);
    const category = categorization.category;

    // Map category to efficiency multiplier
    let efficiency_multiplier = 0;
    if (category === 'productive') {
      efficiency_multiplier = 1;
    } else if (category === 'unproductive') {
      efficiency_multiplier = -1;
    } else {
      efficiency_multiplier = 0;
    }

    console.log(`Categorized ${appName} as ${category} (multiplier: ${efficiency_multiplier})`);

    // Store in database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: insertError } = await supabase
      .from('app_categories')
      .upsert({
        app_name: appName,
        category,
        efficiency_multiplier,
      }, {
        onConflict: 'app_name'
      });

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw insertError;
    }

    return new Response(
      JSON.stringify({ 
        category,
        efficiency_multiplier,
        reasoning: categorization.reasoning
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in categorize-app:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});