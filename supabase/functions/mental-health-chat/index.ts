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
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // System prompt for empathetic mental health support
    const systemPrompt = `You are a compassionate and empathetic AI mental health companion. Your role is to:
1. Provide emotional support and understanding
2. Listen actively without judgment
3. Offer coping strategies and mindfulness techniques when appropriate
4. Detect and respond to the user's emotional state
5. Encourage professional help for serious concerns
6. Keep responses warm, supportive, and concise

IMPORTANT: You are NOT a replacement for professional mental health care. If someone mentions self-harm, suicide, or severe distress, encourage them to seek immediate professional help.

Analyze the emotional tone of each message and respond accordingly:
- If sad: Offer comfort and validation
- If anxious: Provide grounding techniques
- If happy: Share their joy and encourage positive momentum
- If angry: Acknowledge feelings and suggest healthy outlets

Always be kind, patient, and understanding.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add more credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to get AI response");
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    // Simple emotion detection based on keywords
    const detectEmotion = (text: string): string => {
      const lowerText = text.toLowerCase();
      
      if (lowerText.match(/sad|depressed|down|hopeless|lonely|empty/)) return "sad";
      if (lowerText.match(/anxious|worried|nervous|scared|afraid|panic/)) return "anxious";
      if (lowerText.match(/angry|frustrated|mad|irritated|annoyed/)) return "angry";
      if (lowerText.match(/happy|joy|excited|great|wonderful|amazing/)) return "happy";
      if (lowerText.match(/stressed|overwhelmed|pressure|burden/)) return "stressed";
      if (lowerText.match(/calm|peaceful|relaxed|content|serene/)) return "calm";
      
      return "neutral";
    };

    const userEmotion = detectEmotion(messages[messages.length - 1]?.content || "");

    return new Response(
      JSON.stringify({ 
        message: assistantMessage,
        emotion: userEmotion,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});