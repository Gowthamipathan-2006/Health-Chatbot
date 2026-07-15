
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GOOGLE_API_KEY = "AQ.Ab8RN6J6-nZTGfFdwOSidDnp8H8WFhYrnvPfjsP0uWMVhbIYkw";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    
    if (!message) {
      throw new Error('Message is required');
    }

    console.log('Processing health query:', message);

    const requestBody = {
      contents: [{
        parts: [{
          text: `You are a helpful, cute, and friendly medical AI assistant.
Your main job is to answer health, wellness, diet, exercise, medicine, and symptom-related questions.
You MUST strictly ONLY answer questions related to health and wellness. 

If the user's message is NOT related to physical or mental health, symptoms, medicine, nutrition, wellness, exercise, or health-related topics, you MUST refuse to answer. You should reply with a very cute and friendly response (with cute emojis like 🌸, 🧸, ✨), explaining that you are a specialized health assistant chatbot and can only help with health-related questions. Give them some examples of what they can ask you!

If the message IS health-related, analyze it and provide general information. Keep the tone warm, comforting, and cute (using emojis like 🩺, 💕, 🌟). Always emphasize that this is not a medical diagnosis.

User's Symptoms/Question: ${message}

For valid health queries, structure your response as:
1. 🩺 Possible conditions (general information)
2. 💕 General care recommendations
3. ⚠️ When to seek immediate medical attention
4. 🌸 Disclaimer about consulting healthcare professionals`
        }]
      }]
    };

    console.log('Making API call to Gemini');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response received');

    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process your request. Please try again.";

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in health-chat function:', error);
    
    let errorMessage = "I'm sorry, there was an error processing your request.";
    
    if (error instanceof Error) {
      if (error.message.includes('400')) {
        errorMessage = "Invalid request. Please check your message and try again.";
      } else if (error.message.includes('401') || error.message.includes('403')) {
        errorMessage = "API authentication failed. Please try again later.";
      } else if (error.message.includes('429')) {
        errorMessage = "Rate limit exceeded. Please wait a moment and try again.";
      } else if (error.message.includes('500')) {
        errorMessage = "Server error. Please try again later.";
      }
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
