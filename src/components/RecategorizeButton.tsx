import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const RecategorizeButton = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRecategorize = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('recategorize-existing-apps');

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || "Failed to recategorize apps");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const results = data?.results;
      
      if (!results) {
        throw new Error("No results received");
      }

      if (results.failed > 0) {
        const errorMessages = results.errors?.slice(0, 3).map((e: any) => e.appName).join(", ") || "";
        toast({
          title: "⚠️ Partial Success",
          description: `Categorized ${results.success} apps successfully. ${results.failed} failed (${errorMessages}${results.failed > 3 ? '...' : ''})`,
          variant: "default",
        });
      } else {
        toast({
          title: "✅ Recategorization Complete",
          description: `Successfully categorized ${results.success} app${results.success !== 1 ? 's' : ''}!`,
        });
      }
    } catch (error: any) {
      console.error('Error recategorizing apps:', error);
      
      const errorMessage = error.message?.includes("Authentication failed") 
        ? "AI service is temporarily unavailable. Please try again later."
        : error.message?.includes("Rate limit")
        ? "Too many requests. Please wait a moment and try again."
        : error.message || "Failed to recategorize apps";
      
      toast({
        title: "Recategorization Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleRecategorize} 
      disabled={loading}
      size="sm"
      variant="outline"
      className="gap-2"
    >
      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
      {loading ? 'Recategorizing...' : 'Fix App Categories'}
    </Button>
  );
};
