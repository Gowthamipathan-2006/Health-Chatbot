
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Key } from "lucide-react";

interface ApiKeyManagerProps {
  onApiKeySet: (apiKey: string) => void;
}

const ApiKeyManager = ({ onApiKeySet }: ApiKeyManagerProps) => {
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isStored, setIsStored] = useState(false);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('gemini_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setIsStored(true);
      onApiKeySet(storedApiKey);
    } else {
      // Use the provided API key as default
      const defaultApiKey = "AIzaSyDPa2sH5zVIsx4TSUYssbBEI93Wvjh3ERY";
      setApiKey(defaultApiKey);
      localStorage.setItem('gemini_api_key', defaultApiKey);
      setIsStored(true);
      onApiKeySet(defaultApiKey);
    }
  }, [onApiKeySet]);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey);
      setIsStored(true);
      onApiKeySet(apiKey);
    }
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey("");
    setIsStored(false);
  };

  if (isStored) {
    return (
      <Card className="mb-4 border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Key className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-800">API Key configured</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearApiKey}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Clear Key
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="h-5 w-5 text-blue-600" />
          <span>Configure Google Gemini API Key</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apikey">Google Gemini API Key</Label>
          <div className="relative">
            <Input
              id="apikey"
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Google Gemini API key"
              className="pr-10 border-blue-200 focus:border-blue-400"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </div>
        </div>
        <Button
          onClick={handleSaveApiKey}
          disabled={!apiKey.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Save API Key
        </Button>
        <div className="text-xs text-gray-600 bg-yellow-50 p-3 rounded border border-yellow-200">
          <strong>Note:</strong> Your API key will be stored locally in your browser for convenience. 
          For production applications, consider using a backend service for secure API key management.
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyManager;
