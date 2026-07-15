import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import ApiKeyManager from "@/components/ApiKeyManager";
import ChatInterface from "@/components/ChatInterface";

const Index = () => {
  const [apiKey, setApiKey] = useState("");
  
  // Local Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(isSignUp ? "Signing up..." : "Signing in...", { name, email });
    setIsLoggedIn(true); // Mock successful login
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setName("");
    setEmail("");
    setPassword("");
  };

  // Auth Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen cute-gradient flex items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-pink-200/40 blur-xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-blue-200/40 blur-xl pointer-events-none"></div>

        <Card className="w-full max-w-md cute-panel border border-pink-100/60 cute-shadow p-6 md:p-8 rounded-[2.5rem] relative z-10">
          <CardContent className="p-0">
            {/* Mascot Avatars decoration */}
            <div className="flex justify-center items-center gap-6 mb-6">
              <div className="bg-blue-50/80 p-2.5 rounded-2xl border border-blue-200/40 shadow-sm hover:scale-105 transition-transform relative group">
                <img src="/doraemon.png" alt="Doraemon" className="h-16 w-16 object-contain drop-shadow-md" />
                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-400 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold">Bot Mascot</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-pink-100 border border-pink-200 flex items-center justify-center text-pink-500 font-bold text-sm animate-pulse">
                🌸
              </div>
              <div className="bg-pink-50/80 p-2.5 rounded-2xl border border-pink-200/40 shadow-sm hover:scale-105 transition-transform relative group">
                <img src="/shinchan.png" alt="Shinchan" className="h-16 w-16 object-contain drop-shadow-md" />
                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-pink-400 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold">User Mascot</span>
              </div>
            </div>

            <div className="text-center mb-6">
              <h1 className="text-3xl font-extrabold text-pink-950 mb-2 tracking-tight">
                CUTE <span className="bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">HEALTHBOT</span> 🩺🌸
              </h1>
              <p className="text-xs text-pink-900/70 font-semibold">
                {isSignUp ? "Create a cute account to get started!" : "Welcome back! Sign in to chat with Doraemon!"}
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-pink-950/80 pl-1">Name</label>
                  <Input
                    type="text"
                    placeholder="Your cute name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={isSignUp}
                    className="border-pink-200 focus-visible:ring-pink-300 focus-visible:border-pink-300 rounded-xl bg-white/70 text-pink-950 font-medium placeholder:text-pink-200"
                  />
                </div>
              )}

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-pink-950/80 pl-1">Email</label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-pink-200 focus-visible:ring-pink-300 focus-visible:border-pink-300 rounded-xl bg-white/70 text-pink-950 font-medium placeholder:text-pink-200"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-pink-950/80 pl-1">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-pink-200 focus-visible:ring-pink-300 focus-visible:border-pink-300 rounded-xl bg-white/70 text-pink-950 font-medium placeholder:text-pink-200"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500 text-white rounded-xl font-bold py-5 shadow-md border-0 transition-transform active:scale-95 mt-2"
              >
                {isSignUp ? "Sign Up ✨" : "Sign In 🌸"}
              </Button>
            </form>

            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-pink-600 hover:text-pink-800 font-semibold underline underline-offset-2"
              >
                {isSignUp ? "Already have an account? Sign In" : "Don't have an account yet? Sign Up"}
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-pink-100/50">
              <p className="text-[10px] text-pink-400 font-bold leading-relaxed">
                🌸 Note: You can enter any username and password to log in. This is a secure health demonstration.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Chat Screen (IsLoggedIn === true)
  return (
    <div className="min-h-screen cute-gradient flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="cute-panel shadow-sm border-b border-pink-100/50 backdrop-blur-md sticky top-0 z-50">
        <div className="w-full max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center border border-pink-200 shadow-sm animate-pulse">
              <span className="text-lg">🩺</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">Cute HealthBot</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="border-pink-200 text-pink-600 hover:bg-pink-50 rounded-xl hover:text-pink-700 font-bold px-4 py-2"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 md:py-8 flex flex-col relative z-10 h-[calc(100vh-68px)]">
        
        {/* Hide ApiKeyManager display, but still let it mount to configure the key */}
        <div className="hidden">
          <ApiKeyManager onApiKeySet={setApiKey} />
        </div>

        <div className="flex-1 h-full flex flex-col">
          <ChatInterface apiKey={apiKey} />
        </div>
      </main>
    </div>
  );
};

export default Index;
