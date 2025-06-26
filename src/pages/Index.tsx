import { useState, useEffect } from "react";
import { Search, History, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import SignInDialog from "@/components/auth/SignInDialog";
import SignUpDialog from "@/components/auth/SignUpDialog";
import ApiKeyManager from "@/components/ApiKeyManager";
import ChatInterface from "@/components/ChatInterface";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Doraemon SVG or PNG for login page
const doraemonUrl = "/images/doraemon.png";
const pikachuUrl = "https://unpkg.com/@iconify/icons-logos/pikachu.svg";
const spongebobUrl = "https://unpkg.com/@iconify/icons-logos/spongebob.svg";
const popeyeUrl = "https://unpkg.com/@iconify/icons-logos/popeye.svg";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [historySearchQuery, setHistorySearchQuery] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [user, setUser] = useState<any>(null);
  const [selectedBot, setSelectedBot] = useState<string | null>(null);
  
  // Mock history data
  const chatHistory = [
    { id: 1, title: "Headache symptoms", date: "2024-06-15", preview: "What could cause persistent headaches?" },
    { id: 2, title: "Flu prevention", date: "2024-06-14", preview: "How to prevent getting the flu during winter?" },
    { id: 3, title: "Exercise routine", date: "2024-06-13", preview: "Safe exercise routine for beginners" },
    { id: 4, title: "Healthy diet tips", date: "2024-06-12", preview: "What foods should I include in my daily diet?" },
    { id: 5, title: "Sleep disorders", date: "2024-06-11", preview: "Trouble sleeping at night, what can help?" },
  ];

  const filteredHistory = chatHistory.filter(item =>
    item.title.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
    item.preview.toLowerCase().includes(historySearchQuery.toLowerCase())
  );

  const handleMainSearch = () => {
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      setShowChat(true);
    }
  };

  const handleStartChat = () => {
    setShowChat(true);
  };

  useEffect(() => {
    // Get current user on mount
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => { listener?.subscription.unsubscribe(); };
  }, []);

  if (showChat && apiKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-blue-100">
          <div className="w-full px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">HealthBot</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowChat(false)}
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                Back to Home
              </Button>
              {user ? (
                <div className="relative group">
                  <Avatar className="w-9 h-9 cursor-pointer">
                    <AvatarFallback>{user.user_metadata?.name?.[0] || user.email[0]}</AvatarFallback>
                  </Avatar>
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    <div className="p-4 border-b">
                      <div className="font-semibold">{user.user_metadata?.name || user.email}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50"
                      onClick={async () => { await supabase.auth.signOut(); setUser(null); }}
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <SignInDialog onAuth={setUser}>
                    <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                      Sign In
                    </Button>
                  </SignInDialog>
                  <SignUpDialog onAuth={setUser}>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Sign Up
                    </Button>
                  </SignUpDialog>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="flex w-full h-[calc(100vh-80px)]">
          {/* History Sidebar */}
          <div className="w-80 bg-white border-r border-blue-100 shadow-sm">
            <div className="p-4 border-b border-blue-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search history..."
                  value={historySearchQuery}
                  onChange={(e) => setHistorySearchQuery(e.target.value)}
                  className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-4">
                <History className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Chat History</h3>
              </div>
              
              <ScrollArea className="h-[calc(100vh-250px)]">
                <div className="space-y-2">
                  {filteredHistory.map((item) => (
                    <Card key={item.id} className="cursor-pointer hover:shadow-md transition-all duration-200 border-blue-100 hover:border-blue-300">
                      <CardContent className="p-3">
                        <h4 className="font-medium text-gray-900 text-sm mb-1">{item.title}</h4>
                        <p className="text-xs text-gray-500 mb-2">{item.date}</p>
                        <p className="text-xs text-gray-600 line-clamp-2">{item.preview}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="flex-1">
            <ChatInterface apiKey={apiKey} />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-200 via-blue-100 to-yellow-100" style={{ fontFamily: 'Baloo 2, cursive' }}>
        <div className="flex flex-col items-center p-8 rounded-3xl shadow-2xl bg-white/80 border-4 border-blue-200 max-w-md w-full">
          <div className="w-32 h-32 mb-4 rounded-full border-4 border-pink-200 shadow-lg bg-pink-100 flex items-center justify-center overflow-hidden">
            <img src={doraemonUrl} alt="Doraemon" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-4xl font-extrabold text-blue-600 mb-2" style={{ fontFamily: 'Baloo 2, cursive' }}>Welcome to AI Arena!</h1>
          <p className="text-lg text-gray-600 mb-6 text-center">Your multi-purpose AI assistant. Please sign in or sign up to continue!</p>
          <div className="flex flex-col space-y-3 w-full">
            <SignInDialog onAuth={setUser}>
              <Button className="w-full py-3 rounded-full bg-yellow-300 hover:bg-yellow-400 text-blue-900 font-bold text-lg shadow-md transition-all duration-200">
                <span role="img" aria-label="pikachu">⚡</span> Sign In
              </Button>
            </SignInDialog>
            <SignUpDialog onAuth={setUser}>
              <Button className="w-full py-3 rounded-full bg-pink-300 hover:bg-pink-400 text-blue-900 font-bold text-lg shadow-md transition-all duration-200">
                <span role="img" aria-label="spongebob">🍍</span> Sign Up
              </Button>
            </SignUpDialog>
          </div>
        </div>
      </div>
    );
  }

  // Bot card data
  const botTypes = [
    {
      key: 'health',
      name: 'Health Bot',
      description: 'Ask about symptoms, treatments, wellness tips, and get reliable health information.',
      image: '/images/doraemon.png',
    },
    {
      key: 'study',
      name: 'Study Bot',
      description: 'Get help with study questions, explanations, and learning resources.',
      image: 'https://unpkg.com/@iconify/icons-logos/pikachu.svg',
    },
    {
      key: 'business',
      name: 'Business Bot',
      description: 'Ask about business strategies, market trends, and entrepreneurship.',
      image: 'https://unpkg.com/@iconify/icons-logos/spongebob.svg',
    },
    {
      key: 'scripts',
      name: 'Script Bot',
      description: 'Generate scripts for automation, coding, or creative writing.',
      image: 'https://unpkg.com/@iconify/icons-logos/popeye.svg',
    },
  ];

  if (selectedBot && apiKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <header className="bg-white shadow-sm border-b border-blue-100">
          <div className="w-full px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">AI Arena</span>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setSelectedBot(null)}
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                Back to Bots
              </Button>
              {user ? (
                <div className="relative group">
                  <Avatar className="w-9 h-9 cursor-pointer">
                    <AvatarFallback>{user.user_metadata?.name?.[0] || user.email[0]}</AvatarFallback>
                  </Avatar>
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    <div className="p-4 border-b">
                      <div className="font-semibold">{user.user_metadata?.name || user.email}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50"
                      onClick={async () => { await supabase.auth.signOut(); setUser(null); }}
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </header>
        <div className="flex w-full h-[calc(100vh-80px)]">
          {/* History Sidebar */}
          <div className="w-80 bg-white border-r border-blue-100 shadow-sm">
            <div className="p-4 border-b border-blue-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search history..."
                  value={historySearchQuery}
                  onChange={(e) => setHistorySearchQuery(e.target.value)}
                  className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-4">
                <History className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Chat History</h3>
              </div>
              <ScrollArea className="h-[calc(100vh-250px)]">
                <div className="space-y-2">
                  {filteredHistory.map((item) => (
                    <Card key={item.id} className="cursor-pointer hover:shadow-md transition-all duration-200 border-blue-100 hover:border-blue-300">
                      <CardContent className="p-3">
                        <h4 className="font-medium text-gray-900 text-sm mb-1">{item.title}</h4>
                        <p className="text-xs text-gray-500 mb-2">{item.date}</p>
                        <p className="text-xs text-gray-600 line-clamp-2">{item.preview}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          {/* Chat Interface */}
          <div className="flex-1">
            <ChatInterface apiKey={{ key: apiKey, bot: selectedBot }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-200 via-blue-100 to-yellow-100" style={{ fontFamily: 'Baloo 2, cursive' }}>
      <div className="w-full max-w-4xl mx-auto p-8 rounded-3xl shadow-2xl bg-white/80 border-4 border-blue-200 flex flex-col items-center">
        <h1 className="text-6xl font-extrabold text-blue-600 mb-4 text-center" style={{ fontFamily: 'Baloo 2, cursive' }}>
          AI <span className="text-pink-400">ARENA</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 text-center">
          Choose your AI assistant for health, study, business, scripts, and more!
        </p>
        <ApiKeyManager onApiKeySet={setApiKey} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-8">
          {botTypes.map(bot => (
            <Card key={bot.key} className="cursor-pointer hover:shadow-lg transition-all duration-200 border-blue-100 hover:border-blue-300" onClick={() => setSelectedBot(bot.key)}>
              <CardContent className="flex items-center space-x-4 p-6">
                <img src={bot.image} alt={bot.name} className="w-16 h-16 rounded-full border-2 border-blue-200 shadow bg-white object-cover" />
                <div>
                  <h2 className="text-2xl font-bold text-blue-700 mb-1">{bot.name}</h2>
                  <p className="text-gray-700 text-base">{bot.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
