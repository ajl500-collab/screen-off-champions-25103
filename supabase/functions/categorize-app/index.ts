import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

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

    if (!appName || typeof appName !== 'string') {
      return new Response(
        JSON.stringify({ error: 'App name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are an app categorization expert. Given an app name, categorize it as one of the following:

PRODUCTIVE (efficiency_multiplier: 1):
- Work and productivity tools (Slack, Notion, Google Docs, Microsoft Office)
- Educational apps (Coursera, Khan Academy, Duolingo)
- Professional development (LinkedIn Learning)
- Coding and development tools (VS Code, GitHub)
- Business tools (Zoom for work, Google Meet)

UNPRODUCTIVE (efficiency_multiplier: -1):
- Social media for entertainment (Instagram, TikTok, Facebook, Twitter, Snapchat)
- Gaming apps (any games)
- Video streaming for entertainment (YouTube, Netflix, Hulu, Disney+)
- Dating apps (Tinder, Bumble)
- Shopping apps (Amazon, eBay - when used recreationally)

UTILITY (efficiency_multiplier: 0):
- System apps (Settings, Phone, Messages)
- Utilities (Calendar, Clock, Calculator, Weather)
- Maps and navigation (Google Maps, Waze)
- Banking and finance (Banking apps, PayPal)
- Health and fitness tracking (Apple Health, Fitbit)
- Communication essentials (Email, basic messaging)

Respond with ONLY a JSON object in this exact format:
{
  "category": "productive" | "unproductive" | "utility",
  "efficiency_multiplier": 1 | -1 | 0
}`;

    console.log('Categorizing app:', appName);

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Categorize this app: ${appName}` }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API Error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service requires payment. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI API request failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in AI response');
    }

    console.log('AI response:', content);

    // Parse the JSON response
    const result = JSON.parse(content.trim());

    // Validate the response
    if (!result.category || !['productive', 'unproductive', 'utility'].includes(result.category)) {
      throw new Error('Invalid category in AI response');
    }

    if (![1, -1, 0].includes(result.efficiency_multiplier)) {
      throw new Error('Invalid efficiency_multiplier in AI response');
    }

    // Store the categorization in the database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: insertError } = await supabase
      .from('app_categories')
      .upsert({
        app_name: appName,
        category: result.category,
        efficiency_multiplier: result.efficiency_multiplier
      }, {
        onConflict: 'app_name'
      });

    if (insertError) {
      console.error('Error storing category:', insertError);
      throw insertError;
    }

    console.log('Successfully categorized and stored:', appName, result);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in categorize-app function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        // Default to utility if categorization fails
        category: 'utility',
        efficiency_multiplier: 0
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
