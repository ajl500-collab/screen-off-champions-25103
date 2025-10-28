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
    const { squadId, squadName, weekStart, weekEnd, memberStats } = await req.json();

    if (!squadId) {
      return new Response(
        JSON.stringify({ error: 'squadId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating squad insights for squad ${squadName} (${squadId})`);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Generate squad insights using Lovable AI
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
            content: `You are a competitive sports analyst covering squad performance in a screen time reduction competition.
Your insights should be:
- 2-3 sentences max
- Energetic and competitive tone
- Include humor where appropriate
- Mention top performer, biggest improvement, and who needs support
- Include 1-2 relevant emojis

Example:
"🏆 Sarah absolutely dominated this week with a 25% efficiency boost! Meanwhile, Jake's TikTok addiction hit new highs 😅. The squad's collective efficiency rose 8% - keep that momentum!"
`
          },
          {
            role: 'user',
            content: `Generate squad insights for "${squadName}".
Week: ${weekStart} to ${weekEnd}
Member performances:
${JSON.stringify(memberStats, null, 2)}

Give me just the insight text, nothing else.`
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
    const insightContent = aiData.choices[0]?.message?.content?.trim();
    
    if (!insightContent) {
      throw new Error('No content in AI response');
    }

    console.log('Generated insight:', insightContent);

    // Store in database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error: insertError } = await supabase
      .from('squad_insights')
      .insert({
        squad_id: squadId,
        content: insightContent,
        week_start: weekStart,
        week_end: weekEnd,
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
        insight: insightContent,
        id: data.id
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in generate-squad-insights:', error);
    
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
