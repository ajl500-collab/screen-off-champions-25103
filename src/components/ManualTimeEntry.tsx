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
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { trackAppUsage } from "@/hooks/useScreenTimeTracking";
import { supabase } from "@/integrations/supabase/client";

export const ManualTimeEntry = () => {
  const [open, setOpen] = useState(false);
  const [appName, setAppName] = useState("");
  const [minutes, setMinutes] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!appName || !minutes || parseInt(minutes) <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid app name and time in minutes",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      await trackAppUsage(user.id, appName, parseInt(minutes));

      toast({
        title: "Success",
        description: `Added ${minutes} minutes for ${appName}`
      });

      setAppName("");
      setMinutes("");
      setOpen(false);
    } catch (error) {
      console.error("Error tracking app usage:", error);
      toast({
        title: "Error",
        description: "Failed to track app usage",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add App Time
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Track App Usage</DialogTitle>
          <DialogDescription>
            Manually add time spent on an app today
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="appName">App Name</Label>
            <Input
              id="appName"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              placeholder="e.g., Instagram, LinkedIn"
            />
          </div>
          <div>
            <Label htmlFor="minutes">Time (minutes)</Label>
            <Input
              id="minutes"
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              placeholder="30"
              min="1"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Time"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
