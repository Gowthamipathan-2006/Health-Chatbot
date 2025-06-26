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
  apiKey: string | { key: string; bot: string };
}

const botConfigs = {
  health: {
    initial: "Hello! I'm your AI health assistant. Please describe your symptoms and I'll help provide general health information. Remember, this is not a substitute for professional medical advice.",
    prompt: (input: string, isTelugu: boolean) =>
      (isTelugu
        ? "You are a helpful medical AI assistant. Please analyze these symptoms and provide general health information including potential conditions, general care recommendations, and when to seek medical attention. Always emphasize that this is not a medical diagnosis and professional consultation is recommended. Respond in Telugu.\n\nSymptoms/Question: "
        : "You are a helpful medical AI assistant. Please analyze these symptoms and provide general health information including potential conditions, general care recommendations, and when to seek medical attention. Always emphasize that this is not a medical diagnosis and professional consultation is recommended.\n\nSymptoms/Question: ") +
      input +
      "\n\nPlease structure your response with:\n1. Possible conditions (general information)\n2. General care recommendations\n3. When to seek immediate medical attention\n4. Disclaimer about consulting healthcare professionals"
  },
  study: {
    initial: "Hi! I'm your Study Bot. Ask me any study-related question, and I'll help you learn and understand concepts.",
    prompt: (input: string) =>
      "You are a helpful AI study assistant. Please answer the following question with clear explanations, tips, and resources.\n\nQuestion: " +
      input +
      "\n\nPlease structure your response with:\n1. Explanation\n2. Key Points\n3. Study Tips\n4. Disclaimer about verifying with textbooks or teachers."
  },
  business: {
    initial: "Hello! I'm your Business Bot. Ask me about business, entrepreneurship, or market trends.",
    prompt: (input: string) =>
      "You are a helpful AI business assistant. Please answer the following business-related question with insights, strategies, and practical advice.\n\nQuestion: " +
      input +
      "\n\nPlease structure your response with:\n1. Insights/Analysis\n2. Strategies/Recommendations\n3. Cautions/Considerations\n4. Disclaimer about consulting professionals."
  },
  scripts: {
    initial: "Hi! I'm your Script Bot. Ask me to generate code, automation scripts, or creative writing.",
    prompt: (input: string) =>
      "You are a helpful AI script generator. Please generate a script or code for the following request, and explain the logic.\n\nRequest: " +
      input +
      "\n\nPlease structure your response with:\n1. Script/Code\n2. Explanation\n3. Usage Tips\n4. Disclaimer about reviewing and testing code."
  }
};

const ChatInterface = ({ apiKey }: ChatInterfaceProps) => {
  // Determine bot type and key
  let botType = 'health';
  let apiKeyValue = typeof apiKey === 'string' ? apiKey : apiKey?.key;
  if (typeof apiKey === 'object' && apiKey.bot) {
    botType = apiKey.bot;
  }
  const botConfig = botConfigs[botType] || botConfigs['health'];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: botConfig.initial,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const GEMINI_API_KEY = apiKeyValue || "AIzaSyBxBEkNhILAJCKe28gZTnz7QKufYux1jME";
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

  const fieldKeywords = {
    health: [
      "symptom", "medicine", "health", "doctor", "pain", "fever", "cough", "cold", "flu", "injury", "treatment", "wellness", "diet", "exercise", "illness", "disease", "infection", "headache", "stomach", "body", "mental", "stress", "anxiety", "sleep", "nutrition", "fitness", "clinic", "hospital", "medical", "blood", "pressure", "diabetes", "asthma", "allergy", "skin", "rash", "wound", "fracture", "burn", "sick", "vomit", "nausea", "constipation", "diarrhea", "cancer", "therapy", "recovery", "healthcare", "nurse", "medication", "prescription", "pharmacy", "vaccine", "immunization", "checkup", "appointment", "surgery", "operation", "emergency", "ambulance", "first aid", "virus", "bacteria", "covid", "corona", "pandemic", "epidemic", "public health", "well-being", "prevention", "remedy", "disorder", "condition", "diagnosis", "prognosis", "rehabilitation", "support", "specialist", "cardiology", "dermatology", "neurology", "orthopedic", "pediatric", "gynecology", "obstetrics", "urology", "oncology", "psychiatry", "psychology", "dentist", "dental", "oral", "vision", "eye", "hearing", "ear", "nose", "throat", "lungs", "liver", "kidney", "heart", "brain", "muscle", "bone", "joint", "arthritis", "sprain", "strain", "bruise", "cut", "bleeding", "swelling", "inflammation", "immune", "system", "reaction", "hypertension", "cholesterol", "obesity", "weight", "malnutrition", "dehydration", "hydration", "workout", "yoga", "meditation", "depression", "counseling", "group", "addiction", "smoking", "alcohol", "substance", "abuse", "rehab", "pregnancy", "prenatal", "postnatal", "childbirth", "baby", "infant", "child", "adolescent", "adult", "elderly", "senior", "geriatric", "women's health", "men's health", "sexual health", "reproductive health", "family planning", "contraception", "fertility", "menstruation", "period", "menopause", "andrology", "prostate", "testosterone", "estrogen", "hormone", "thyroid", "metabolism", "vitamin", "mineral", "supplement", "food", "intolerance", "digestion", "digestive", "gastroenterology", "intestine", "colon", "rectum", "gallbladder", "pancreas", "spleen", "urinary", "bladder", "renal", "testicle", "ovary", "uterus", "cervix", "vagina", "penis", "scrotum", "breast", "chest", "respiratory", "bronchitis", "pneumonia", "tuberculosis", "sinus", "tonsil", "deaf", "blind", "cataract", "glaucoma", "retina", "cornea", "conjunctivitis", "pink eye", "eczema", "psoriasis", "acne", "pimple", "boil", "ulcer", "scar", "hair", "nail", "dandruff", "bald", "alopecia", "tumor", "lump", "ache", "sore", "cramp", "spasm", "stiff", "weak", "paralysis", "numb", "tingle", "faint", "dizzy", "vertigo", "seizure", "convulsion", "fit", "stroke", "heart attack", "cardiac", "arrhythmia", "palpitation", "shortness of breath", "breathless", "wheeze"
    ],
    study: [
      "study", "learn", "explain", "explanation", "homework", "assignment", "school", "college", "university", "exam", "test", "quiz", "syllabus", "subject", "topic", "math", "science", "physics", "chemistry", "biology", "history", "geography", "civics", "politics", "economics", "accounting", "business studies", "computer", "programming", "coding", "language", "grammar", "essay", "composition", "summary", "notes", "revision", "memorize", "understand", "explain", "definition", "theory", "concept", "formula", "problem", "solution", "practice", "question", "answer", "explain", "explanation", "tips", "tricks", "mnemonic", "flashcard", "resource", "reference", "book", "chapter", "page", "paragraph", "sentence", "word", "vocabulary", "spelling", "pronunciation", "lecture", "class", "teacher", "professor", "tutor", "guide", "help", "doubt", "clarify", "explain"
    ],
    business: [
      "business", "company", "startup", "entrepreneur", "market", "marketing", "sales", "strategy", "plan", "finance", "investment", "profit", "loss", "revenue", "cost", "expense", "accounting", "customer", "client", "deal", "negotiation", "pitch", "proposal", "project", "management", "team", "leadership", "growth", "scaling", "competition", "industry", "trend", "analysis", "insight", "recommendation", "risk", "opportunity", "innovation", "product", "service", "brand", "advertising", "promotion", "campaign", "digital", "online", "ecommerce", "supply", "demand", "logistics", "distribution", "retail", "wholesale", "B2B", "B2C", "partnership", "merger", "acquisition", "valuation", "funding", "venture", "capital", "angel", "investor", "share", "stock", "equity", "IPO", "regulation", "compliance", "legal", "contract", "agreement", "HR", "human resource", "hiring", "recruitment", "training", "employee", "salary", "bonus", "incentive", "motivation", "performance", "review", "goal", "objective", "KPI", "OKR", "report", "presentation", "meeting", "network", "connection", "mentor", "advice", "consultant", "consulting"
    ],
    scripts: [
      "script", "code", "automation", "program", "function", "class", "variable", "loop", "condition", "if", "else", "for", "while", "switch", "case", "break", "continue", "return", "input", "output", "print", "log", "debug", "error", "exception", "try", "catch", "finally", "import", "export", "require", "module", "package", "library", "framework", "API", "endpoint", "request", "response", "fetch", "axios", "http", "https", "json", "parse", "stringify", "object", "array", "list", "set", "map", "dictionary", "data", "database", "SQL", "query", "insert", "update", "delete", "select", "join", "index", "key", "value", "loop", "iteration", "recursion", "sort", "search", "algorithm", "DSA", "structure", "file", "read", "write", "open", "close", "save", "load", "path", "directory", "folder", "shell", "bash", "powershell", "terminal", "command", "run", "execute", "compile", "build", "test", "deploy", "CI", "CD", "pipeline", "github", "gitlab", "bitbucket", "commit", "push", "pull", "merge", "branch", "clone", "fork", "issue", "PR", "review", "lint", "format", "style", "doc", "comment", "annotation", "todo", "fixme", "bug", "feature", "release", "version", "npm", "yarn", "pnpm", "install", "uninstall", "update", "upgrade", "dependency", "devDependency", "env", "environment", "config", "settings", "option", "parameter", "argument", "flag", "boolean", "string", "number", "int", "float", "double", "char", "byte", "buffer", "stream", "event", "listener", "handler", "callback", "promise", "async", "await", "thread", "process", "worker", "concurrent", "parallel", "performance", "optimize", "refactor", "clean", "architecture", "pattern", "MVC", "MVVM", "singleton", "factory", "observer", "decorator", "proxy", "adapter", "bridge", "command", "strategy", "state", "template", "visitor", "chain", "responsibility", "solid", "oop", "functional", "react", "vue", "angular", "svelte", "next", "nuxt", "remix", "astro", "express", "koa", "fastify", "django", "flask", "spring", "rails", "laravel", "symfony", "dotnet", "csharp", "java", "python", "javascript", "typescript", "c++", "c", "go", "rust", "php", "ruby", "swift", "kotlin", "scala", "perl", "bash", "shell", "powershell", "sql", "html", "css", "json", "xml", "yaml", "toml", "ini", "md", "markdown"
    ]
  };

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

    // Restrict bot to its field
    const keywords = fieldKeywords[botType] || [];
    const inputLower = inputMessage.toLowerCase();
    const isRelevant = keywords.some(keyword => inputLower.includes(keyword));
    if (!isRelevant) {
      const politeMsg = {
        health: "I'm here to help with health-related questions only. Please ask me about health, symptoms, wellness, or medical topics.",
        study: "I'm here to help with study-related questions only. Please ask me about study topics, learning, or academic questions.",
        business: "I'm here to help with business-related questions only. Please ask me about business, entrepreneurship, or market topics.",
        scripts: "I'm here to help with scripts, code, and automation only. Please ask me about programming, code, or automation tasks."
      };
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: politeMsg[botType] || "I'm here to help with questions relevant to my field only.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
      return;
    }

    try {
      let promptText = "";
      if (botType === 'health') {
        const isTeluguInput = isTelugu(inputMessage);
        promptText = botConfig.prompt(inputMessage, isTeluguInput);
      } else {
        promptText = botConfig.prompt(inputMessage);
      }
      const requestBody = {
        contents: [{
          parts: [{
            text: promptText
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

  // Helper to parse AI response into sections for each bot type
  function parseAIResponse(response: string, botType: string) {
    if (botType === 'health') {
      const sections = { conditions: '', care: '', attention: '', disclaimer: '' };
      const regex = /1\.[\s\S]*?2\.|2\.[\s\S]*?3\.|3\.[\s\S]*?4\.|4\.[\s\S]*/g;
      const matches = response.match(regex);
      if (matches) {
        if (matches[0]) sections.conditions = matches[0].replace(/1\./, '').replace(/2\.$/, '').trim();
        if (matches[1]) sections.care = matches[1].replace(/2\./, '').replace(/3\.$/, '').trim();
        if (matches[2]) sections.attention = matches[2].replace(/3\./, '').replace(/4\.$/, '').trim();
        if (matches[3]) sections.disclaimer = matches[3].replace(/4\./, '').trim();
      } else {
        sections.disclaimer = response;
      }
      return { type: 'health', ...sections };
    } else if (botType === 'study') {
      const sections = { explanation: '', keyPoints: '', tips: '', disclaimer: '' };
      const regex = /1\.[\s\S]*?2\.|2\.[\s\S]*?3\.|3\.[\s\S]*?4\.|4\.[\s\S]*/g;
      const matches = response.match(regex);
      if (matches) {
        if (matches[0]) sections.explanation = matches[0].replace(/1\./, '').replace(/2\.$/, '').trim();
        if (matches[1]) sections.keyPoints = matches[1].replace(/2\./, '').replace(/3\.$/, '').trim();
        if (matches[2]) sections.tips = matches[2].replace(/3\./, '').replace(/4\.$/, '').trim();
        if (matches[3]) sections.disclaimer = matches[3].replace(/4\./, '').trim();
      } else {
        sections.disclaimer = response;
      }
      return { type: 'study', ...sections };
    } else if (botType === 'business') {
      const sections = { insights: '', strategies: '', cautions: '', disclaimer: '' };
      const regex = /1\.[\s\S]*?2\.|2\.[\s\S]*?3\.|3\.[\s\S]*?4\.|4\.[\s\S]*/g;
      const matches = response.match(regex);
      if (matches) {
        if (matches[0]) sections.insights = matches[0].replace(/1\./, '').replace(/2\.$/, '').trim();
        if (matches[1]) sections.strategies = matches[1].replace(/2\./, '').replace(/3\.$/, '').trim();
        if (matches[2]) sections.cautions = matches[2].replace(/3\./, '').replace(/4\.$/, '').trim();
        if (matches[3]) sections.disclaimer = matches[3].replace(/4\./, '').trim();
      } else {
        sections.disclaimer = response;
      }
      return { type: 'business', ...sections };
    } else if (botType === 'scripts') {
      const sections = { code: '', explanation: '', tips: '', disclaimer: '' };
      const regex = /1\.[\s\S]*?2\.|2\.[\s\S]*?3\.|3\.[\s\S]*?4\.|4\.[\s\S]*/g;
      const matches = response.match(regex);
      if (matches) {
        if (matches[0]) sections.code = matches[0].replace(/1\./, '').replace(/2\.$/, '').trim();
        if (matches[1]) sections.explanation = matches[1].replace(/2\./, '').replace(/3\.$/, '').trim();
        if (matches[2]) sections.tips = matches[2].replace(/3\./, '').replace(/4\.$/, '').trim();
        if (matches[3]) sections.disclaimer = matches[3].replace(/4\./, '').trim();
      } else {
        sections.disclaimer = response;
      }
      return { type: 'scripts', ...sections };
    }
    return { type: 'default', disclaimer: response };
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

  // Helper to determine user avatar
  let userGender = 'male';
  if (typeof apiKey === 'string') {
    // legacy: if apiKey is a string, try to extract gender if present (not used in new flow)
    // userGender = ...
  } else if (typeof apiKey === 'object' && 'gender' in apiKey) {
    userGender = (apiKey as any).gender || 'male';
  }
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
              const sections = parseAIResponse(message.content, botType);
              if (sections.type === 'health') {
                structured = (
                  <div className="space-y-3">
                    {sections.conditions && <div className="bg-blue-100 rounded-xl p-3"><span className="font-bold text-blue-700">Possible Conditions:</span> {renderSectionAsList(sections.conditions)}</div>}
                    {sections.care && <div className="bg-yellow-100 rounded-xl p-3"><span className="font-bold text-yellow-700">Care Recommendations:</span> {renderSectionAsList(sections.care)}</div>}
                    {sections.attention && <div className="bg-pink-100 rounded-xl p-3"><span className="font-bold text-pink-700">When to Seek Medical Attention:</span> {renderSectionAsList(sections.attention)}</div>}
                    {sections.disclaimer && <div className="bg-gray-100 rounded-xl p-3"><span className="font-bold text-gray-700">Disclaimer:</span> {renderSectionAsList(sections.disclaimer)}</div>}
                  </div>
                );
              } else if (sections.type === 'study') {
                structured = (
                  <div className="space-y-3">
                    {sections.explanation && <div className="bg-blue-100 rounded-xl p-3"><span className="font-bold text-blue-700">Explanation:</span> {renderSectionAsList(sections.explanation)}</div>}
                    {sections.keyPoints && <div className="bg-yellow-100 rounded-xl p-3"><span className="font-bold text-yellow-700">Key Points:</span> {renderSectionAsList(sections.keyPoints)}</div>}
                    {sections.tips && <div className="bg-pink-100 rounded-xl p-3"><span className="font-bold text-pink-700">Study Tips:</span> {renderSectionAsList(sections.tips)}</div>}
                    {sections.disclaimer && <div className="bg-gray-100 rounded-xl p-3"><span className="font-bold text-gray-700">Disclaimer:</span> {renderSectionAsList(sections.disclaimer)}</div>}
                  </div>
                );
              } else if (sections.type === 'business') {
                structured = (
                  <div className="space-y-3">
                    {sections.insights && <div className="bg-blue-100 rounded-xl p-3"><span className="font-bold text-blue-700">Insights/Analysis:</span> {renderSectionAsList(sections.insights)}</div>}
                    {sections.strategies && <div className="bg-yellow-100 rounded-xl p-3"><span className="font-bold text-yellow-700">Strategies/Recommendations:</span> {renderSectionAsList(sections.strategies)}</div>}
                    {sections.cautions && <div className="bg-pink-100 rounded-xl p-3"><span className="font-bold text-pink-700">Cautions/Considerations:</span> {renderSectionAsList(sections.cautions)}</div>}
                    {sections.disclaimer && <div className="bg-gray-100 rounded-xl p-3"><span className="font-bold text-gray-700">Disclaimer:</span> {renderSectionAsList(sections.disclaimer)}</div>}
                  </div>
                );
              } else if (sections.type === 'scripts') {
                structured = (
                  <div className="space-y-3">
                    {sections.code && <div className="bg-blue-100 rounded-xl p-3"><span className="font-bold text-blue-700">Script/Code:</span> <pre className="whitespace-pre-wrap break-words">{sections.code}</pre></div>}
                    {sections.explanation && <div className="bg-yellow-100 rounded-xl p-3"><span className="font-bold text-yellow-700">Explanation:</span> {renderSectionAsList(sections.explanation)}</div>}
                    {sections.tips && <div className="bg-pink-100 rounded-xl p-3"><span className="font-bold text-pink-700">Usage Tips:</span> {renderSectionAsList(sections.tips)}</div>}
                    {sections.disclaimer && <div className="bg-gray-100 rounded-xl p-3"><span className="font-bold text-gray-700">Disclaimer:</span> {renderSectionAsList(sections.disclaimer)}</div>}
                  </div>
                );
              } else {
                structured = <p className="text-base whitespace-pre-wrap">{renderBold(message.content)}</p>;
              }
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
