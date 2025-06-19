
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GOOGLE_API_KEY = "AIzaSyDP6Lk43FJNVoMEIRW1TH7jn03lYaTFNLA";

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
          text: `You are a helpful medical AI assistant. Please analyze these symptoms and provide general health information including potential conditions, general care recommendations, and when to seek medical attention. Always emphasize that this is not a medical diagnosis and professional consultation is recommended.

Symptoms/Question: ${message}

Please structure your response with:
1. Possible conditions (general information)
2. General care recommendations
3. When to seek immediate medical attention
4. Disclaimer about consulting healthcare professionals`
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
