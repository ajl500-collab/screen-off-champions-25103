import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Copy, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSettings } from "@/lib/data/queries";

export const SyncWebhook = () => {
  const { data: settings } = useSettings();
  const [copied, setCopied] = useState(false);
  const [ingestToken, setIngestToken] = useState("");

  const handleGenerateToken = () => {
    const token = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
    setIngestToken(token);
    toast.success("Token generated! Save this securely - it won't be shown again.");
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const getIngestUrl = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return "";
    
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    return `${supabaseUrl}/functions/v1/screentime-ingest`;
  };

  return (
    <Card className="p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Apple Shortcuts Webhook</h3>
        <p className="text-sm text-muted-foreground">
          Automatically sync screen time from your iPhone using Apple Shortcuts
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <Label>Webhook URL</Label>
          <div className="flex gap-2 mt-1">
            <Input 
              readOnly 
              value={`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/screentime-ingest`}
              className="flex-1"
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => handleCopy(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/screentime-ingest`)}
            >
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div>
          <Label>Ingest Token</Label>
          {!ingestToken ? (
            <Button 
              variant="outline" 
              onClick={handleGenerateToken}
              className="w-full mt-1"
            >
              Generate Token
            </Button>
          ) : (
            <div className="flex gap-2 mt-1">
              <Input 
                readOnly 
                value={ingestToken}
                type="password"
                className="flex-1"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => handleCopy(ingestToken)}
              >
                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Use this token as the "X-Ingest-Token" header in your Shortcut
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <h4 className="font-semibold text-sm mb-2">Setup Instructions:</h4>
        <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
          <li>Generate and copy your ingest token above</li>
          <li>Create a new Shortcut on your iPhone</li>
          <li>Add a "Get Contents of URL" action</li>
          <li>Set URL to the webhook URL above</li>
          <li>Set Method to POST</li>
          <li>Add Header: "X-Ingest-Token" with your token</li>
          <li>Add Header: "Content-Type" as "application/json"</li>
          <li>Set Request Body to JSON format with your user ID and screen time data</li>
        </ol>
      </div>
    </Card>
  );
};
