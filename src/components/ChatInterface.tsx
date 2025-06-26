import { useState, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  apiKey: string;
}

const ChatInterface = ({ apiKey }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI health assistant. Please describe your symptoms and I'll help provide general health information. Remember, this is not a substitute for professional medical advice.",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const GEMINI_API_KEY = "AIzaSyBxBEkNhILAJCKe28gZTnz7QKufYux1jME";
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`);
        const data = await response.json();
        console.log("Available Gemini models:", data);
      } catch (err) {
        console.error("Error fetching Gemini models:", err);
      }
    };
    fetchModels();
  }, []);

  // Helper to detect Telugu input
  function isTelugu(text: string) {
    return /[\u0C00-\u0C7F]/.test(text);
  }

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

    // Simple health-related keyword check
    const healthKeywords = [
      "symptom", "medicine", "health", "doctor", "pain", "fever", "cough", "cold", "flu", "injury", "treatment", "wellness", "diet", "exercise", "illness", "disease", "infection", "headache", "stomach", "body", "mental", "stress", "anxiety", "sleep", "nutrition", "fitness", "clinic", "hospital", "medical", "blood", "pressure", "diabetes", "asthma", "allergy", "skin", "rash", "wound", "fracture", "burn", "sick", "vomit", "nausea", "constipation", "diarrhea", "cancer", "therapy", "injury", "recovery", "healthcare", "doctor", "nurse", "medicine", "medication", "prescription", "pharmacy", "vaccine", "immunization", "checkup", "appointment", "surgery", "operation", "emergency", "ambulance", "first aid", "infection", "virus", "bacteria", "covid", "corona", "pandemic", "epidemic", "public health", "well-being", "wellbeing", "wellness", "prevention", "treatment", "remedy", "remedies", "disease", "disorder", "condition", "diagnosis", "prognosis", "therapy", "rehabilitation", "recovery", "symptoms", "signs", "risk", "factors", "complications", "side effects", "advice", "consultation", "specialist", "cardiology", "dermatology", "neurology", "orthopedic", "pediatric", "gynecology", "obstetrics", "urology", "oncology", "psychiatry", "psychology", "dentist", "dental", "oral", "vision", "eye", "hearing", "ear", "nose", "throat", "ENT", "lungs", "liver", "kidney", "heart", "brain", "muscle", "bone", "joint", "arthritis", "injury", "sprain", "strain", "bruise", "cut", "bleeding", "swelling", "infection", "inflammation", "immune", "system", "allergy", "allergic", "reaction", "asthma", "diabetes", "hypertension", "cholesterol", "obesity", "weight", "loss", "gain", "malnutrition", "dehydration", "hydration", "exercise", "workout", "fitness", "yoga", "meditation", "stress", "anxiety", "depression", "mental health", "counseling", "therapy", "support", "group", "addiction", "smoking", "alcohol", "substance", "abuse", "recovery", "rehab", "pregnancy", "prenatal", "postnatal", "childbirth", "baby", "infant", "child", "adolescent", "adult", "elderly", "senior", "geriatric", "women's health", "men's health", "sexual health", "reproductive health", "family planning", "contraception", "fertility", "menstruation", "period", "menopause", "andrology", "prostate", "testosterone", "estrogen", "hormone", "thyroid", "metabolism", "nutrition", "diet", "vitamin", "mineral", "supplement", "food", "allergy", "intolerance", "digestion", "digestive", "gastroenterology", "stomach", "intestine", "colon", "rectum", "liver", "gallbladder", "pancreas", "spleen", "urinary", "bladder", "kidney", "renal", "prostate", "testicle", "ovary", "uterus", "cervix", "vagina", "penis", "scrotum", "breast", "chest", "lung", "respiratory", "asthma", "bronchitis", "pneumonia", "tuberculosis", "covid", "corona", "flu", "cold", "allergy", "sinus", "throat", "tonsil", "ear", "hearing", "deaf", "blind", "vision", "eye", "cataract", "glaucoma", "retina", "cornea", "conjunctivitis", "pink eye", "skin", "rash", "eczema", "psoriasis", "acne", "pimple", "boil", "ulcer", "wound", "cut", "bruise", "burn", "scar", "hair", "nail", "dandruff", "bald", "alopecia", "cancer", "tumor", "lump", "swelling", "pain", "ache", "sore", "cramp", "spasm", "stiff", "weak", "paralysis", "numb", "tingle", "faint", "dizzy", "vertigo", "seizure", "convulsion", "fit", "stroke", "heart attack", "cardiac", "arrhythmia", "palpitation", "chest pain", "shortness of breath", "breathless", "cough", "wheeze"];
    const inputLower = inputMessage.toLowerCase();
    const isHealthRelated = healthKeywords.some(keyword => inputLower.includes(keyword));

    if (!isHealthRelated) {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm here to help with health-related questions only. Please ask me about health, symptoms, wellness, or medical topics. Thank you for understanding!",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
      return;
    }

    try {
      const isTeluguInput = isTelugu(inputMessage);
      let promptInstruction =
        "You are a helpful medical AI assistant. Please analyze these symptoms and provide general health information including potential conditions, general care recommendations, and when to seek medical attention. Always emphasize that this is not a medical diagnosis and professional consultation is recommended.\n\nSymptoms/Question: ";
      if (isTeluguInput) {
        promptInstruction =
          "You are a helpful medical AI assistant. Please analyze these symptoms and provide general health information including potential conditions, general care recommendations, and when to seek medical attention. Always emphasize that this is not a medical diagnosis and professional consultation is recommended. Respond in Telugu.\n\nSymptoms/Question: ";
      }
      const requestBody = {
        contents: [{
          parts: [{
            text: `${promptInstruction}${inputMessage}\n\nPlease structure your response with:\n1. Possible conditions (general information)\n2. General care recommendations\n3. When to seek immediate medical attention\n4. Disclaimer about consulting healthcare professionals`
          }]
        }]
      };

      console.log('Sending message to Gemini API:', inputMessage);

      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || data?.error?.message || "I'm sorry, I couldn't process your request. Please try again.";

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
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

  // Helper to render bold text between **
  function renderBold(text: string) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-extrabold text-blue-700">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  }

  // Helper to parse AI response into sections
  function parseAIResponse(response: string) {
    // Try to split by numbered sections
    const sections = {
      conditions: '',
      care: '',
      attention: '',
      disclaimer: ''
    };
    const regex = /1\.[\s\S]*?2\.|2\.[\s\S]*?3\.|3\.[\s\S]*?4\.|4\.[\s\S]*/g;
    const matches = response.match(regex);
    if (matches) {
      if (matches[0]) sections.conditions = matches[0].replace(/1\./, '').replace(/2\.$/, '').trim();
      if (matches[1]) sections.care = matches[1].replace(/2\./, '').replace(/3\.$/, '').trim();
      if (matches[2]) sections.attention = matches[2].replace(/3\./, '').replace(/4\.$/, '').trim();
      if (matches[3]) sections.disclaimer = matches[3].replace(/4\./, '').trim();
    } else {
      // fallback: return all as disclaimer
      sections.disclaimer = response;
    }
    return sections;
  }

  // Helper to render a section as a bulleted list if it contains lines starting with * or -
  function renderSectionAsList(sectionText: string) {
    const lines = sectionText.split(/\n|\r/).filter(line => line.trim() !== '');
    const bulletLines = lines.filter(line => /^\s*([*-])\s+/.test(line));
    if (bulletLines.length > 0) {
      return (
        <ul className="list-disc pl-6 space-y-1">
          {lines.map((line, idx) =>
            /^\s*([*-])\s+/.test(line)
              ? <li key={idx}>{renderBold(line.replace(/^\s*([*-])\s+/, ''))}</li>
              : <li key={idx} className="list-none">{renderBold(line)}</li>
          )}
        </ul>
      );
    } else {
      return <p>{renderBold(sectionText)}</p>;
    }
  }

  const userGender = (typeof apiKey === 'object' && apiKey.gender) ? apiKey.gender : 'male';
  const userAvatar = userGender === 'female' ? '/images/female.png' : '/images/male.png';
  const botAvatar = '/images/doraemon.png';
  const mascotAvatar = '/images/shinchan.png';
  const robotAvatar = '/images/robot.png';

  // For Shinchan thinking messages
  const shinchanThinkingMessages = [
    "Wait karo, answer aah raha hai ",
    "Mai hu naa, answer bejatha hu"
  ];
  function getRandomThinkingMessage() {
    return shinchanThinkingMessages[Math.floor(Math.random() * shinchanThinkingMessages.length)];
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50 relative">
      <ScrollArea className="flex-1 p-4 relative z-10">
        <div className="space-y-4">
          {messages.map((message) => {
            // If bot, try to parse and structure the response
            const isBot = !message.isUser;
            let structured = null;
            if (isBot) {
              const sections = parseAIResponse(message.content);
              structured = (
                <div className="space-y-3">
                  {sections.conditions && <div className="bg-blue-100 rounded-xl p-3"><span className="font-bold text-blue-700">Possible Conditions:</span> {renderSectionAsList(sections.conditions)}</div>}
                  {sections.care && <div className="bg-yellow-100 rounded-xl p-3"><span className="font-bold text-yellow-700">Care Recommendations:</span> {renderSectionAsList(sections.care)}</div>}
                  {sections.attention && <div className="bg-pink-100 rounded-xl p-3"><span className="font-bold text-pink-700">When to Seek Medical Attention:</span> {renderSectionAsList(sections.attention)}</div>}
                  {sections.disclaimer && <div className="bg-gray-100 rounded-xl p-3"><span className="font-bold text-gray-700">Disclaimer:</span> {renderSectionAsList(sections.disclaimer)}</div>}
                </div>
              );
            }
            return (
              <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className="flex items-end space-x-2">
                  {!message.isUser && (
                    <img src={botAvatar} alt="Bot" className="w-10 h-10 rounded-full border-2 border-blue-300 shadow bg-white object-cover" />
                  )}
                  <div className={`max-w-[80%] rounded-3xl shadow-md ${message.isUser ? 'bg-yellow-200 text-blue-900 border-yellow-300' : 'bg-white border-blue-200'}`}>
                    <div className="p-4">
                      {isBot && structured ? structured : <p className="text-base whitespace-pre-wrap">{renderBold(message.content)}</p>}
                      <p className="text-xs mt-1 opacity-70 text-right">{message.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </div>
                  {message.isUser && (
                    <img src={userAvatar} alt="User" className="w-10 h-10 rounded-full border-2 border-yellow-300 shadow bg-white object-cover" />
                  )}
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="flex justify-start items-center space-x-4">
              <img src={mascotAvatar} alt="Shinchan" className="w-14 h-14 rounded-full border-2 border-pink-300 shadow bg-white object-cover" />
              <div className="bg-pink-100 rounded-xl p-4 font-bold text-pink-700 text-lg animate-pulse">
                {getRandomThinkingMessage()}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t border-blue-200 p-4 bg-white/80 rounded-b-3xl shadow-inner z-10">
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your symptoms..."
            className="flex-1 border-blue-200 focus:border-blue-400 rounded-full px-6 py-3 text-lg bg-yellow-50 shadow"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-yellow-300 hover:bg-yellow-400 text-blue-900 rounded-full px-6 py-3 text-lg font-bold shadow-md flex items-center justify-center"
          >
            <img src={userAvatar} alt="Send" className="w-6 h-6 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
