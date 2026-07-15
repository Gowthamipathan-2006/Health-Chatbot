
import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  apiKey: string;
}

const SLOGANS = [
  "Doraemon is searching his 4D pocket for health secrets... 🎒✨",
  "Shin-chan is cheering you on! 📣💕",
  "Consulting the magic medical scroll... 📜🌸",
  "Brewing a soothing cup of health advice... 🍵🌟",
  "Sending happy health vibes your way... 💖✨",
  "Doraemon is calling Nobita for support... 📞🧸"
];

const ChatInterface = ({ apiKey }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I am Doraemon, your cute AI health assistant! 🌸 Please tell me how you are feeling or describe your symptoms, and I'll find the best health information for you from my 4D pocket! 🩺 Remember, this is not a substitute for professional medical advice. 💕",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlogan, setCurrentSlogan] = useState(SLOGANS[0]);

  useEffect(() => {
    if (!isLoading) return;
    
    // Pick a random starting slogan
    const startIndex = Math.floor(Math.random() * SLOGANS.length);
    setCurrentSlogan(SLOGANS[startIndex]);

    let index = startIndex;
    const interval = setInterval(() => {
      index = (index + 1) % SLOGANS.length;
      setCurrentSlogan(SLOGANS[index]);
    }, 2000);

    return () => clearInterval(interval);
  }, [isLoading]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      let aiResponse = "";

      if (apiKey) {
        console.log('Calling Gemini API directly from frontend...');
        const promptText = `You are a helpful, cute, and friendly medical AI assistant.
Your main job is to answer health, wellness, diet, exercise, medicine, and symptom-related questions.
You MUST strictly ONLY answer questions related to health and wellness. 

If the user's message is NOT related to physical or mental health, symptoms, medicine, nutrition, wellness, exercise, or health-related topics, you MUST refuse to answer. You should reply with a very cute and friendly response (with cute emojis like 🌸, 🧸, ✨), explaining that you are a specialized health assistant chatbot and can only help with health-related questions. Give them some examples of what they can ask you!

If the message IS health-related, analyze it and provide general information. Keep the tone warm, comforting, and cute (using emojis like 🩺, 💕, 🌟). Always emphasize that this is not a medical diagnosis.

User's Symptoms/Question: ${inputMessage}

For valid health queries, structure your response as:
1. 🩺 Possible conditions (general information)
2. 💕 General care recommendations
3. ⚠️ When to seek immediate medical attention
4. 🌸 Disclaimer about consulting healthcare professionals`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: promptText
              }]
            }]
          })
        });

        if (response.ok) {
          const data = await response.json();
          aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        } else {
          const errData = await response.json().catch(() => ({}));
          const errMsg = errData.error?.message || `API Error ${response.status}: ${response.statusText}`;
          throw new Error(`Google API Error: ${errMsg}`);
        }
      }

      if (!aiResponse) {
        console.log('Sending message to backend (fallback):', inputMessage);
        const { data, error } = await supabase.functions.invoke('health-chat', {
          body: { message: inputMessage }
        });

        if (error) {
          console.error('Supabase function error:', error);
          throw new Error(error.message || 'Failed to get response from health assistant');
        }

        aiResponse = data?.response || "I'm sorry, I couldn't process your request. Please try again.";
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error calling health chat function:', error);
      
      let errorMessage = "I'm sorry, there was an error processing your request.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: errorMessage,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent p-2 md:p-4">
      <ScrollArea className="flex-1 p-4 rounded-3xl cute-panel cute-shadow border-pink-100 bg-white/70 overflow-hidden mb-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-end gap-2 ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!message.isUser && (
                <div className="w-9 h-9 rounded-full border-2 border-blue-300 overflow-hidden bg-blue-50 flex-shrink-0 flex items-center justify-center shadow-sm">
                  <img src="/doraemon.png" alt="Doraemon" className="w-8 h-8 object-contain" />
                </div>
              )}
              <Card className={`max-w-[75%] border-none ${
                message.isUser 
                  ? 'bg-[#FFE4EC] text-pink-950 rounded-2xl rounded-br-none cute-bubble-shadow-user' 
                  : 'bg-[#E3F2FD] text-blue-950 rounded-2xl rounded-bl-none cute-bubble-shadow-bot'
              }`}>
                <CardContent className="p-3">
                  <div className="flex items-start space-x-1">
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap font-medium">{message.content}</p>
                      <p className={`text-[10px] mt-1 opacity-60 text-right`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {message.isUser && (
                <div className="w-9 h-9 rounded-full border-2 border-pink-300 overflow-hidden bg-pink-50 flex-shrink-0 flex items-center justify-center shadow-sm">
                  <img src="/shinchan.png" alt="Shinchan" className="w-8 h-8 object-contain" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-2 justify-start animate-pulse">
              <div className="w-9 h-9 rounded-full border-2 border-blue-300 overflow-hidden bg-blue-50 flex-shrink-0 flex items-center justify-center shadow-sm">
                <img src="/doraemon.png" alt="Doraemon" className="w-8 h-8 object-contain" />
              </div>
              <Card className="max-w-[75%] bg-[#E3F2FD] border-none rounded-2xl rounded-bl-none cute-bubble-shadow-bot">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2 text-xs font-bold text-blue-900 leading-snug">
                    <span>✨ {currentSlogan}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 bg-white/80 rounded-2xl border border-pink-200/50 cute-shadow flex items-center gap-2 backdrop-blur-md">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything about your health... 🌸"
          className="flex-1 border-pink-200 focus-visible:ring-pink-300 focus-visible:border-pink-300 rounded-xl bg-pink-50/20 text-gray-700 font-medium placeholder:text-pink-300 placeholder:font-normal"
          disabled={isLoading}
        />
        <Button
          onClick={sendMessage}
          disabled={isLoading || !inputMessage.trim()}
          className="bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500 text-white rounded-xl px-4 py-2 shadow-md border-0 transition-transform active:scale-95 flex items-center justify-center flex-shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInterface;
