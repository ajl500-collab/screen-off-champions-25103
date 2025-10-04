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
        throw error;
      }

      toast({
        title: "✅ Recategorization Complete",
        description: `Successfully categorized ${data.results.success} apps. ${data.results.failed > 0 ? `${data.results.failed} failed.` : ''}`,
      });
    } catch (error: any) {
      console.error('Error recategorizing apps:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to recategorize apps",
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
