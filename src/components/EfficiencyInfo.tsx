import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EfficiencyInfoProps {
  score: number;
}

const EfficiencyInfo = ({ score }: EfficiencyInfoProps) => {
  // Clamp score at 0 minimum
  const clampedScore = Math.max(0, score);
  
  const getScoreDescription = (score: number) => {
    if (score >= 60) return {
      level: "Excellent",
      description: "Outstanding! Your productive time significantly exceeds unproductive time. You're using your phone efficiently.",
      color: "text-success"
    };
    if (score >= 40) return {
      level: "Good",
      description: "Solid productivity! You're maintaining a healthy balance with more productive than unproductive screen time.",
      color: "text-primary"
    };
    if (score >= 20) return {
      level: "Fair",
      description: "Room for improvement. Your productive and unproductive time are relatively balanced.",
      color: "text-accent"
    };
    return {
      level: "Needs Work",
      description: "Your unproductive screen time is close to or exceeds productive time. Consider setting goals to improve.",
      color: "text-destructive"
    };
  };

  const scoreInfo = getScoreDescription(clampedScore);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your Efficiency Score Explained</DialogTitle>
          <DialogDescription>
            Understanding what your {clampedScore}% means
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl font-bold">{clampedScore}%</div>
            <div>
              <div className={`text-lg font-bold ${scoreInfo.color}`}>{scoreInfo.level}</div>
              <div className="text-sm text-muted-foreground">Efficiency Level</div>
            </div>
          </div>

          <p className="text-muted-foreground">{scoreInfo.description}</p>

          <div className="bg-card border border-border rounded-lg p-4 space-y-2">
            <h4 className="font-semibold">How It's Calculated:</h4>
            <div className="bg-primary/5 border border-primary/20 rounded p-3 mb-2">
              <p className="text-sm font-mono">
                Efficiency = (Productive% - Unproductive%)
              </p>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Calculate percentage of productive time from total screen time</li>
              <li>Calculate percentage of unproductive time from total screen time</li>
              <li>Subtract unproductive% from productive% to get your score</li>
              <li>Utility apps (Messages, Maps, etc.) don't affect your score</li>
              <li>Score ranges from 0% (inefficient) to 100% (all productive)</li>
              <li>Negative scores are displayed as 0%</li>
            </ul>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-sm">
              <strong>Tip:</strong> Focus on increasing productive screen time and reducing unproductive time to climb the leaderboard!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EfficiencyInfo;
