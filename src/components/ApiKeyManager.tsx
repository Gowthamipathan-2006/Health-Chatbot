
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Key } from "lucide-react";

interface ApiKeyManagerProps {
  onApiKeySet: (apiKey: string) => void;
}

const ApiKeyManager = ({ onApiKeySet }: ApiKeyManagerProps) => {
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Automatically set the provided API key
    const apiKey = "AIpzSSayDpa2sH5zVIsx4TSUSssbBEI93Wvjh3ERG";
    setIsConfigured(true);
    onApiKeySet(apiKey);
    console.log('API key configured automatically');
  }, [onApiKeySet]);

  if (isConfigured) {
    return (
      <Card className="mb-4 border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Key className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-800">API Key configured and ready</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default ApiKeyManager;
