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
    const { userId, userName, efficiency, streakDays, triggerReason } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'userId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating motivation for user ${userName} (${userId})`);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Generate motivation using Lovable AI
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
            content: `You are an encouraging coach who celebrates screen time improvements.
Your messages should be:
- Short (under 15 words)
- Motivating and energetic
- Include exactly 1 emoji
- Playful but genuine
- Reference specific achievements

Examples:
- "🔥 Three days straight? That's discipline."
- "Efficiency up 14%. Keep flexing that focus 💪"
- "You're absolutely crushing it! 🏆"
- "Diamond tier incoming at this rate 💎"`
          },
          {
            role: 'user',
            content: `Generate motivation for ${userName || 'this user'}.
Stats: Efficiency ${efficiency}%, Streak: ${streakDays} days, Achievement: ${triggerReason || 'improvement'}.
Give me just the motivational message, nothing else.`
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
    const motivationContent = aiData.choices[0]?.message?.content?.trim();
    
    if (!motivationContent) {
      throw new Error('No content in AI response');
    }

    console.log('Generated motivation:', motivationContent);

    // Store in database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error: insertError } = await supabase
      .from('motivation_history')
      .insert({
        user_id: userId,
        content: motivationContent,
        trigger_reason: triggerReason,
        efficiency_score: efficiency,
        streak_days: streakDays,
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
        motivation: motivationContent,
        id: data.id
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in generate-motivation:', error);
    
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
