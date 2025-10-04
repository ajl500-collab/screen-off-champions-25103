import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { goal } = await req.json();
    
    if (!goal) {
      return new Response(
        JSON.stringify({ error: 'Goal text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ 
          error: 'AI service configuration error',
          details: 'API key not found. Please contact support.'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('LOVABLE_API_KEY configured, length:', LOVABLE_API_KEY.length);
    console.log('Generating plan for goal:', goal);

    const systemPrompt = `You are a screen time management expert helping users achieve better digital wellness. Create a personalized, actionable plan based on the user's goal.

The plan should:
- Be specific and practical with 3-5 concrete steps
- Focus on sustainable habits and realistic changes
- Be encouraging and motivating
- Consider the psychology of phone usage and behavior change
- Include specific time management strategies

Format the response as a clear, numbered list with brief explanations for each step. Keep it concise but actionable.`;

    console.log('Making request to Lovable AI Gateway...');
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Help me achieve this screen time goal: ${goal}\n\nProvide a concrete action plan.` }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    console.log('AI API Response status:', response.status);
    console.log('Response headers:', JSON.stringify(Array.from(response.headers.entries())));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API Error:', response.status, errorText);
      
      if (response.status === 401) {
        console.error('Authentication failed - API key may be invalid or expired');
        return new Response(
          JSON.stringify({ 
            error: 'Authentication failed',
            details: 'Unable to connect to AI service. Please try again later.'
          }), 
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: 'Rate limit exceeded',
            details: 'Too many requests. Please try again in a moment.'
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: 'Payment required',
            details: 'AI service requires payment. Please contact support.'
          }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('AI Response structure:', JSON.stringify(data, null, 2));
    
    const plan = data.choices?.[0]?.message?.content;

    if (!plan) {
      console.error('No plan content in response:', data);
      throw new Error('AI returned empty response');
    }

    console.log('Plan generated successfully, length:', plan.length);

    return new Response(
      JSON.stringify({ plan }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error generating plan:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate plan';
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: 'An unexpected error occurred while generating your plan. Please try again.'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
