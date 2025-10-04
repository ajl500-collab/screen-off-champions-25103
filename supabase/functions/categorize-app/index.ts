import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fallback categorization when AI is unavailable
function getFallbackCategory(appName: string): {
  category: 'productive' | 'unproductive' | 'utility';
  efficiency_multiplier: number;
} {
  const name = appName.toLowerCase();

  // Productive apps
  const productiveKeywords = [
    'linkedin', 'slack', 'notion', 'gmail', 'email', 'calendar',
    'bloomberg', 'wsj', 'wall street', 'journal', 'news', 'times',
    'coinbase', 'robinhood', 'paypal', 'venmo', 'bank',
    'duolingo', 'coursera', 'udemy', 'khan', 'kindle',
    'trello', 'asana', 'jira', 'github', 'vscode', 'figma',
    'google drive', 'dropbox', 'zoom', 'teams', 'meet'
  ];

  // Unproductive apps
  const unproductiveKeywords = [
    'instagram', 'tiktok', 'facebook', 'twitter', 'snapchat',
    'reddit', 'youtube', 'netflix', 'hulu', 'disney',
    'candy crush', 'clash', 'fortnite', 'call of duty', 'game',
    'twitch', 'spotify', 'soundcloud'
  ];

  // Check productive apps
  for (const keyword of productiveKeywords) {
    if (name.includes(keyword)) {
      // Finance apps get higher multiplier
      if (['coinbase', 'robinhood', 'paypal', 'venmo', 'bank', 'bloomberg', 'wsj'].some(k => name.includes(k))) {
        return { category: 'productive', efficiency_multiplier: 1.5 };
      }
      return { category: 'productive', efficiency_multiplier: 1.0 };
    }
  }

  // Check unproductive apps
  for (const keyword of unproductiveKeywords) {
    if (name.includes(keyword)) {
      // Social media and games get negative multiplier
      if (['tiktok', 'instagram', 'snapchat'].some(k => name.includes(k))) {
        return { category: 'unproductive', efficiency_multiplier: -1.5 };
      }
      return { category: 'unproductive', efficiency_multiplier: -1.0 };
    }
  }

  // Default to utility
  return { category: 'utility', efficiency_multiplier: 0 };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let appName = '';

  try {
    const body = await req.json();
    appName = body.appName;
    
    if (!appName) {
      return new Response(
        JSON.stringify({ error: 'App name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Categorizing app:', appName);

    // Call Lovable AI to categorize the app
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    console.log('LOVABLE_API_KEY configured:', !!LOVABLE_API_KEY);
    console.log('LOVABLE_API_KEY length:', LOVABLE_API_KEY?.length || 0);
    
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not set - using fallback categorization');
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Making request to Lovable AI Gateway...');

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
- Communication: Messages, Phone, FaceTime (personal use), WhatsApp (personal)
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
      console.error('Response headers:', JSON.stringify([...aiResponse.headers.entries()]));
      
      // Handle specific error cases
      if (aiResponse.status === 401) {
        console.error('Authentication failed - LOVABLE_API_KEY may be invalid');
        throw new Error('Authentication failed with Lovable AI');
      }
      if (aiResponse.status === 429) {
        throw new Error('Rate limit exceeded');
      }
      if (aiResponse.status === 402) {
        throw new Error('Payment required');
      }
      
      throw new Error(`AI categorization failed with status ${aiResponse.status}`);
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
        reasoning: categorization.reasoning,
        source: 'ai'
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in categorize-app:', error);
    
    // If we have an appName, try fallback categorization
    if (appName) {
      console.log('Attempting fallback categorization for:', appName);
      
      try {
        const fallbackResult = getFallbackCategory(appName);
        
        console.log(`Using fallback categorization for ${appName}:`, fallbackResult);
        
        // Store in database
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { error: insertError } = await supabase
          .from('app_categories')
          .upsert({
            app_name: appName,
            category: fallbackResult.category,
            efficiency_multiplier: fallbackResult.efficiency_multiplier,
          }, {
            onConflict: 'app_name'
          });

        if (insertError) {
          console.error('Database insert error:', insertError);
          throw insertError;
        }

        return new Response(
          JSON.stringify({ 
            category: fallbackResult.category,
            efficiency_multiplier: fallbackResult.efficiency_multiplier,
            reasoning: 'Categorized using fallback rules (AI unavailable)',
            source: 'fallback'
          }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      } catch (fallbackError) {
        console.error('Fallback categorization also failed:', fallbackError);
      }
    }
    
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
