import { useEffect, useState } from "react";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMotivationalCopy } from "./copy";

interface TodayAtAGlanceProps {
  productiveMins: number;
  unproductiveMins: number;
  neutralMins: number;
  deltaVsYesterday: number;
}

export const TodayAtAGlance = ({
  productiveMins,
  unproductiveMins,
  neutralMins,
  deltaVsYesterday,
}: TodayAtAGlanceProps) => {
  const [animatedUnproductive, setAnimatedUnproductive] = useState(0);
  const [animatedProductive, setAnimatedProductive] = useState(0);
  const [animatedNeutral, setAnimatedNeutral] = useState(0);

  const formatTime = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return `${hours}h ${minutes}m`;
  };

  useEffect(() => {
    const duration = 800;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setAnimatedUnproductive(Math.floor(unproductiveMins * progress));
      setAnimatedProductive(Math.floor(productiveMins * progress));
      setAnimatedNeutral(Math.floor(neutralMins * progress));

      if (step >= steps) {
        clearInterval(timer);
        setAnimatedUnproductive(unproductiveMins);
        setAnimatedProductive(productiveMins);
        setAnimatedNeutral(neutralMins);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [unproductiveMins, productiveMins, neutralMins]);

  const isImprovement = deltaVsYesterday < 0;
  const deltaColor = isImprovement
    ? "text-success"
    : deltaVsYesterday > 0
    ? "text-destructive"
    : "text-muted-foreground";

  const deltaIcon = isImprovement ? (
    <TrendingDown className="w-4 h-4" />
  ) : deltaVsYesterday > 0 ? (
    <TrendingUp className="w-4 h-4" />
  ) : (
    <Minus className="w-4 h-4" />
  );

  return (
    <Card className="p-6 bg-card border-border animate-scale-in">
      <div className="space-y-4">
        {/* Main stat */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Unproductive Time
          </h3>
          <div className="text-5xl font-bold font-mono text-destructive animate-count-up">
            {formatTime(animatedUnproductive)}
          </div>
          <div
            className={`flex items-center gap-2 mt-2 text-sm font-semibold ${deltaColor} animate-slide-up`}
          >
            {deltaIcon}
            <span>{Math.abs(deltaVsYesterday)}% from yesterday</span>
          </div>
        </div>

        {/* Chips */}
        <div className="flex gap-2 flex-wrap">
          <Badge
            variant="outline"
            className="px-3 py-1 text-sm border-success/20 bg-success/5 text-success"
          >
            Productive: {formatTime(animatedProductive)}
          </Badge>
          <Badge
            variant="outline"
            className="px-3 py-1 text-sm border-border bg-muted/20 text-muted-foreground"
          >
            Neutral: {formatTime(animatedNeutral)}
          </Badge>
        </div>

        {/* Motivational copy */}
        <p className="text-sm text-muted-foreground italic">
          {getMotivationalCopy(deltaVsYesterday)}
        </p>
      </div>
    </Card>
  );
};
