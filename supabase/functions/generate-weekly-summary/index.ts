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
    const { userId, userName, weekStart, weekEnd, efficiencyChange, topProductiveApp, topUnproductiveApp, streakDays, currentTier } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'userId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating weekly summary for user ${userName} (${userId})`);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Generate summary using Lovable AI
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
            content: `You are an energetic performance analyst who creates weekly screen time summaries.
Your summaries should be:
- 2-3 sentences max
- Energetic and friendly tone
- Mention key stats (efficiency change, top apps, streak, tier)
- Include 1-2 relevant emojis
- Celebratory if positive, encouraging if negative

Example positive:
"You crushed it this week! Screen time down 18%, led by fewer YouTube hours and a solid 5-day streak 🏅. Diamond tier is within reach!"

Example encouraging:
"Tough week, but that's okay! TikTok dominated your screen time, but you maintained a 3-day streak 💪. Next week, let's flip the script!"
`
          },
          {
            role: 'user',
            content: `Generate a weekly summary for ${userName || 'this user'}.
Week: ${weekStart} to ${weekEnd}
Efficiency change: ${efficiencyChange > 0 ? '+' : ''}${efficiencyChange}%
Top productive app: ${topProductiveApp || 'N/A'}
Top unproductive app: ${topUnproductiveApp || 'N/A'}
Streak: ${streakDays} days
Current tier: ${currentTier || 'Bronze'}

Give me just the summary text, nothing else.`
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
    const summaryContent = aiData.choices[0]?.message?.content?.trim();
    
    if (!summaryContent) {
      throw new Error('No content in AI response');
    }

    console.log('Generated summary:', summaryContent);

    // Store in database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error: insertError } = await supabase
      .from('weekly_summary')
      .insert({
        user_id: userId,
        summary: summaryContent,
        week_start: weekStart,
        week_end: weekEnd,
        efficiency_change: efficiencyChange,
        top_productive_app: topProductiveApp,
        top_unproductive_app: topUnproductiveApp,
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
        summary: summaryContent,
        id: data.id
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in generate-weekly-summary:', error);
    
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
