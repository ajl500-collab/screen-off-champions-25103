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
    const { userId, userName, efficiency, rankDelta, triggerReason } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'userId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating roast for user ${userName} (${userId})`);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Generate roast using Lovable AI
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
            content: `You are a witty, playful friend who gives light-hearted roasts about screen time habits.
Your roasts should be:
- Short (under 15 words)
- Funny and playful, never mean or offensive
- Include exactly 1 emoji
- PG-rated and friendly
- Reference the user's stats creatively

Examples:
- "Bro, did TikTok sponsor your downfall? 📱"
- "You're putting the 'screen' in screen time 💀"
- "Your phone misses being in your pocket 📵"
- "Efficiency dropped harder than your New Year's resolutions 😅"`
          },
          {
            role: 'user',
            content: `Generate a roast for ${userName || 'this user'}.
Stats: Efficiency ${efficiency}%, Rank change: ${rankDelta || 'unknown'}, Reason: ${triggerReason || 'performance drop'}.
Give me just the roast text, nothing else.`
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        throw new Error('Rate limit exceeded');
      }
      if (aiResponse.status === 402) {
        throw new Error('Payment required');
      }
      
      throw new Error(`AI generation failed with status ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const roastContent = aiData.choices[0]?.message?.content?.trim();
    
    if (!roastContent) {
      throw new Error('No content in AI response');
    }

    console.log('Generated roast:', roastContent);

    // Store in database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error: insertError } = await supabase
      .from('roast_history')
      .insert({
        user_id: userId,
        content: roastContent,
        trigger_reason: triggerReason,
        efficiency_score: efficiency,
        rank_delta: rankDelta,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw insertError;
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        roast: roastContent,
        id: data.id
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in generate-roast:', error);
    
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
