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
  const getScoreDescription = (score: number) => {
    if (score >= 80) return {
      level: "Excellent",
      description: "You're using your phone incredibly efficiently! Your productive app usage far outweighs time-wasting activities.",
      color: "text-success"
    };
    if (score >= 60) return {
      level: "Good",
      description: "Solid productivity! You're maintaining a healthy balance between productive and leisure screen time.",
      color: "text-primary"
    };
    if (score >= 40) return {
      level: "Fair",
      description: "Room for improvement. Try reducing time on unproductive apps and focus more on productive activities.",
      color: "text-accent"
    };
    return {
      level: "Needs Work",
      description: "Your screen time is heavily weighted toward unproductive apps. Consider setting goals to improve your efficiency.",
      color: "text-destructive"
    };
  };

  const scoreInfo = getScoreDescription(score);

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
            Understanding what your {score}% means
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl font-bold">{score}%</div>
            <div>
              <div className={`text-lg font-bold ${scoreInfo.color}`}>{scoreInfo.level}</div>
              <div className="text-sm text-muted-foreground">Efficiency Level</div>
            </div>
          </div>

          <p className="text-muted-foreground">{scoreInfo.description}</p>

          <div className="bg-card border border-border rounded-lg p-4 space-y-2">
            <h4 className="font-semibold">How It's Calculated:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Productive apps (LinkedIn, Notion, etc.) boost your score</li>
              <li>Unproductive apps (TikTok, Instagram, etc.) lower your score</li>
              <li>Utility apps (Messages, Maps, etc.) are neutral</li>
              <li>The algorithm weighs productive time vs. unproductive time</li>
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
