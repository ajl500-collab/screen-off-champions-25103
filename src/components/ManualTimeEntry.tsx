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
import { format } from "date-fns";
import { upsertDailyUsage } from "@/lib/data/mutations";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const ManualTimeEntry = () => {
  const [open, setOpen] = useState(false);
  const [productive, setProductive] = useState("");
  const [unproductive, setUnproductive] = useState("");
  const [neutral, setNeutral] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await upsertDailyUsage({
        usage_date: format(new Date(), "yyyy-MM-dd"),
        productive_mins: parseInt(productive) || 0,
        unproductive_mins: parseInt(unproductive) || 0,
        neutral_mins: parseInt(neutral) || 0,
        source: "manual",
      });

      await queryClient.invalidateQueries({ queryKey: ["daily-usage"] });
      await queryClient.invalidateQueries({ queryKey: ["weekly-usage"] });
      await queryClient.invalidateQueries({ queryKey: ["streak"] });

      toast.success("Today's screen time saved!");
      setProductive("");
      setUnproductive("");
      setNeutral("");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to save screen time");
      console.error(error);
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Track Today's Screen Time</DialogTitle>
          <DialogDescription>
            Enter your daily totals in minutes
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="productive">Productive (minutes)</Label>
            <Input
              id="productive"
              type="number"
              min="0"
              value={productive}
              onChange={(e) => setProductive(e.target.value)}
              placeholder="e.g., 120"
            />
          </div>
          <div>
            <Label htmlFor="unproductive">Unproductive (minutes)</Label>
            <Input
              id="unproductive"
              type="number"
              min="0"
              value={unproductive}
              onChange={(e) => setUnproductive(e.target.value)}
              placeholder="e.g., 90"
            />
          </div>
          <div>
            <Label htmlFor="neutral">Neutral (minutes)</Label>
            <Input
              id="neutral"
              type="number"
              min="0"
              value={neutral}
              onChange={(e) => setNeutral(e.target.value)}
              placeholder="e.g., 30"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Save Today's Time"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
