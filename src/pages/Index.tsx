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
          <h1 className="text-4xl font-extrabold text-blue-600 mb-2" style={{ fontFamily: 'Baloo 2, cursive' }}>Welcome to HealthBot!</h1>
          <p className="text-lg text-gray-600 mb-6 text-center">Your cute AI health assistant. Please sign in or sign up to continue!</p>
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-200 via-blue-100 to-yellow-100" style={{ fontFamily: 'Baloo 2, cursive' }}>
      <div className="absolute top-6 right-8 z-50">
        <div className="relative group">
          <Avatar className="w-12 h-12 cursor-pointer border-2 border-blue-400 shadow-lg">
            <AvatarFallback>{user.user_metadata?.name?.[0] || user.email[0]}</AvatarFallback>
          </Avatar>
          <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
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
      </div>
      <div className="w-full max-w-4xl mx-auto p-8 rounded-3xl shadow-2xl bg-white/80 border-4 border-blue-200 flex flex-col items-center">
        <h1 className="text-6xl font-extrabold text-blue-600 mb-4 text-center" style={{ fontFamily: 'Baloo 2, cursive' }}>
          HEALTH <span className="text-pink-400">CHATBOT</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 text-center">
          Your AI-powered health assistant. Ask questions about symptoms, treatments, wellness tips, and get reliable health information instantly.
        </p>
        <ApiKeyManager onApiKeySet={setApiKey} />
        <div className="relative mb-8 w-full flex flex-col items-center">
          <Button
            onClick={handleMainSearch}
            disabled={!apiKey}
            className="px-8 py-6 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm mt-4"
          >
            Start Chat with HealthBot
          </Button>
        </div>
        <div className="flex-1 w-full">
          <ChatInterface apiKey={apiKey} />
        </div>
      </div>
    </div>
  );
};

export default Index;
