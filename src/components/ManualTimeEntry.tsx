import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

interface AppEntry {
  id: string;
  app: string;
  minutes: string;
}

export const ManualTimeEntry = () => {
  const [open, setOpen] = useState(false);
  const [apps, setApps] = useState<AppEntry[]>([
    { id: "1", app: "", minutes: "" }
  ]);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const addAppEntry = () => {
    setApps([...apps, { id: Date.now().toString(), app: "", minutes: "" }]);
  };

  const removeAppEntry = (id: string) => {
    if (apps.length > 1) {
      setApps(apps.filter(entry => entry.id !== id));
    }
  };

  const updateAppEntry = (id: string, field: "app" | "minutes", value: string) => {
    setApps(apps.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate entries
    const validApps = apps.filter(entry => entry.app.trim() && entry.minutes.trim());
    
    if (validApps.length === 0) {
      toast.error("Please add at least one app with time spent");
      return;
    }

    trackEvent("manual_entry_started", { app_count: validApps.length });
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in");
        return;
      }

      // Get ingest token from environment or use default for manual entries
      const ingestToken = "manual-entry-token";
      
      // Format data for the ingest endpoint
      const appData = validApps.map(entry => ({
        app: entry.app.trim(),
        minutes: parseInt(entry.minutes) || 0,
        date: format(new Date(), "yyyy-MM-dd")
      }));

      console.log("Submitting app data:", appData);

      // Call the screentime-ingest endpoint
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/screentime-ingest`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-ingest-token": ingestToken,
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            user_id: user.id,
            data: appData,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Ingest error:", errorText);
        throw new Error("Failed to process screen time data");
      }

      const result = await response.json();
      console.log("Ingest result:", result);

      // Invalidate queries to refresh the UI
      await queryClient.invalidateQueries({ queryKey: ["daily-usage"] });
      await queryClient.invalidateQueries({ queryKey: ["weekly-usage"] });
      await queryClient.invalidateQueries({ queryKey: ["streak"] });

      toast.success(`${result.apps_processed} apps categorized and saved!`);
      trackEvent("manual_entry_completed", { 
        app_count: result.apps_processed,
        source: "manual"
      });
      
      // Reset form
      setApps([{ id: "1", app: "", minutes: "" }]);
      setOpen(false);
    } catch (error) {
      console.error("Manual entry error:", error);
      toast.error("Failed to save screen time. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Today's Time
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Today's Screen Time</DialogTitle>
          <DialogDescription>
            Enter apps and time spent - AI will automatically categorize them
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            {apps.map((entry, index) => (
              <div key={entry.id} className="flex gap-2 items-start">
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`app-${entry.id}`} className="text-xs">
                    App #{index + 1}
                  </Label>
                  <Input
                    id={`app-${entry.id}`}
                    type="text"
                    value={entry.app}
                    onChange={(e) => updateAppEntry(entry.id, "app", e.target.value)}
                    placeholder="e.g., Instagram, LinkedIn"
                    required
                  />
                </div>
                <div className="w-24 space-y-2">
                  <Label htmlFor={`minutes-${entry.id}`} className="text-xs">
                    Minutes
                  </Label>
                  <Input
                    id={`minutes-${entry.id}`}
                    type="number"
                    min="0"
                    value={entry.minutes}
                    onChange={(e) => updateAppEntry(entry.id, "minutes", e.target.value)}
                    placeholder="45"
                    required
                  />
                </div>
                {apps.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAppEntry(entry.id)}
                    className="mt-8"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addAppEntry}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another App
          </Button>

          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-3">
              💡 AI will categorize each app as Productive, Unproductive, or Utility
            </p>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing with AI...
                </>
              ) : (
                "Save & Categorize"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
