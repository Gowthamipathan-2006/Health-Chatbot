
import { useState } from "react";
import { Search, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import SignInDialog from "@/components/auth/SignInDialog";
import SignUpDialog from "@/components/auth/SignUpDialog";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [historySearchQuery, setHistorySearchQuery] = useState("");
  
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
      // This would integrate with your chatbot API
    }
  };

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
            <SignInDialog>
              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                Sign In
              </Button>
            </SignInDialog>
            <SignUpDialog>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Sign Up
              </Button>
            </SignUpDialog>
          </div>
        </div>
      </header>

      <div className="flex w-full">
        {/* History Sidebar */}
        <div className="w-80 bg-white border-r border-blue-100 min-h-screen shadow-sm">
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
            
            <ScrollArea className="h-[calc(100vh-200px)]">
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

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-4xl">
              <div className="text-center mb-12">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">
                  HEALTH <span className="text-blue-600">CHATBOT</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Your AI-powered health assistant. Ask questions about symptoms, treatments, 
                  wellness tips, and get reliable health information instantly.
                </p>
              </div>

              <div className="relative mb-8">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
                    <Input
                      placeholder="Ask me anything about your health..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleMainSearch()}
                      className="pl-12 pr-4 py-6 text-lg border-2 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-xl shadow-sm"
                    />
                  </div>
                  <Button
                    onClick={handleMainSearch}
                    className="px-8 py-6 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
                  >
                    Ask HealthBot
                  </Button>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-500 mb-4">Try asking about:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {[
                    "Common cold symptoms",
                    "Healthy diet tips",
                    "Exercise routines",
                    "Sleep improvement",
                    "Stress management",
                    "Preventive care"
                  ].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      onClick={() => setSearchQuery(suggestion)}
                      className="border-blue-200 text-blue-700 hover:bg-blue-50 rounded-full"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mt-12 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 text-center">
                  <strong>Disclaimer:</strong> This chatbot provides general health information and is not a substitute for professional medical advice. 
                  Always consult with a healthcare provider for medical concerns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
