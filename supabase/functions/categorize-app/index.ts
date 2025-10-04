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
            content: `You are an expert app categorization system. Categorize apps into exactly one category:

PRODUCTIVE - Apps that create value, build skills, manage finances, or support professional/personal growth:
- Work & Productivity: LinkedIn, Slack, Notion, Gmail, Microsoft Office, Google Workspace, Asana, Trello
- Finance & Investment: Coinbase, Robinhood, PayPal, Venmo, banking apps, budgeting apps, investment platforms
- Learning & Education: Duolingo, Khan Academy, Coursera, Udemy, language learning, skill development
- News & Information: Bloomberg, Wall Street Journal, New York Times, Reuters, quality journalism apps
- Health & Fitness (goal-oriented): Fitness tracking, meal planning, meditation apps, health monitoring
- Creative Tools: Adobe apps, design software, music production, video editing for work

UNPRODUCTIVE - Apps primarily for entertainment, passive consumption, or time-wasting:
- Social Media: Instagram, TikTok, Facebook, Twitter/X, Reddit, Snapchat (when used recreationally)
- Entertainment: Netflix, YouTube (casual viewing), gaming apps, streaming services
- Games: Mobile games, casual gaming, time-killer games
- Viral Content: Meme apps, short-form video platforms

UTILITY - Neutral tools for daily tasks, no inherent productivity value:
- Communication: Messages, Phone, FaceTime (personal use)
- System Tools: Settings, Clock, Calculator, Calendar, Files
- Navigation: Maps, GPS, Weather
- Basic Services: Camera, Photos (unless for work)

IMPORTANT RULES:
1. Finance/investment/banking apps are ALWAYS productive
2. News and journalism apps are productive unless purely entertainment news
3. E-commerce apps can be productive if for business, otherwise utility
4. Consider the app's PRIMARY purpose and typical use case
5. When in doubt between productive and utility, choose productive if it involves money, learning, or career

Respond with ONLY a JSON object: {"category": "productive|unproductive|utility", "confidence": "high|medium|low", "reasoning": "brief explanation"}`
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

    let categorization = JSON.parse(jsonMatch[0]);
    let category = categorization.category;

    // If confidence is low or medium, try web search for better context
    if (categorization.confidence === 'low' || categorization.confidence === 'medium') {
      console.log(`Low/medium confidence for ${appName}, searching web for context...`);
      
      try {
        // Search for app information
        const searchQuery = `${appName} app what is it used for purpose`;
        const searchResponse = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(searchQuery)}`, {
          headers: {
            'Accept': 'application/json',
            'X-Subscription-Token': 'BSAjL4BGOucMvVkm9lB8PcXJqvZ3ySQ'
          }
        });

        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          const searchContext = searchData.web?.results?.slice(0, 3)
            .map((r: any) => `${r.title}: ${r.description}`)
            .join('\n') || 'No results found';

          console.log('Search context:', searchContext);

          // Re-categorize with search context
          const recategorizeResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
                  content: `You are an expert app categorization system. Based on the search results about the app, categorize it into productive, unproductive, or utility. Use the same rules as before.

Respond with ONLY a JSON object: {"category": "productive|unproductive|utility", "reasoning": "brief explanation"}`
                },
                {
                  role: 'user',
                  content: `Categorize "${appName}" based on this information:\n\n${searchContext}`
                }
              ],
            }),
          });

          if (recategorizeResponse.ok) {
            const recategorizeData = await recategorizeResponse.json();
            const recategorizeContent = recategorizeData.choices[0]?.message?.content;
            const recategorizeMatch = recategorizeContent.match(/\{[^}]+\}/);
            
            if (recategorizeMatch) {
              categorization = JSON.parse(recategorizeMatch[0]);
              category = categorization.category;
              console.log(`Re-categorized ${appName} as ${category} with search context`);
            }
          }
        }
      } catch (searchError) {
        console.error('Search/recategorization error:', searchError);
        // Continue with original categorization
      }
    }

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