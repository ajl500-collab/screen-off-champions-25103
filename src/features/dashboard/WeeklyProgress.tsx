import { useState, useEffect } from "react";
import { Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { DayData } from "./mockData";

interface WeeklyProgressProps {
  weeklyData: DayData[];
  streakDays: number;
}

export const WeeklyProgress = ({
  weeklyData,
  streakDays,
}: WeeklyProgressProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger slide-in animation
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const maxTotal = Math.max(...weeklyData.map((d) => d.total));

  const formatTime = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <Card className="p-6 bg-card border-border">
      <h3 className="text-lg font-semibold mb-4">This Week's Screen Time</h3>

      {/* Bar Chart */}
      <div className="flex items-end justify-between gap-2 h-48 mb-4">
        {weeklyData.map((day, index) => {
          const height = (day.total / maxTotal) * 100;
          const productiveHeight = (day.productive / day.total) * 100;
          const unproductiveHeight = (day.unproductive / day.total) * 100;
          const neutralHeight = (day.neutral / day.total) * 100;

          return (
            <TooltipProvider key={day.day}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex-1 flex flex-col justify-end h-full">
                    <div
                      className={`w-full rounded-t-lg overflow-hidden transition-all duration-500 ease-out`}
                      style={{
                        height: visible ? `${height}%` : "0%",
                        transitionDelay: `${index * 50}ms`,
                      }}
                    >
                      {/* Stacked segments */}
                      <div
                        className="bg-success"
                        style={{ height: `${productiveHeight}%` }}
                      />
                      <div
                        className="bg-destructive"
                        style={{ height: `${unproductiveHeight}%` }}
                      />
                      <div
                        className="bg-muted"
                        style={{ height: `${neutralHeight}%` }}
                      />
                    </div>
                    <div className="text-xs text-center mt-2 text-muted-foreground">
                      {day.day}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs space-y-1">
                    <div className="font-semibold">{day.day}</div>
                    <div>Total: {formatTime(day.total)}</div>
                    <div className="text-success">
                      Productive: {formatTime(day.productive)}
                    </div>
                    <div className="text-destructive">
                      Unproductive: {formatTime(day.unproductive)}
                    </div>
                    <div className="text-muted-foreground">
                      Neutral: {formatTime(day.neutral)}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>

      {/* Streak indicator */}
      {streakDays >= 3 ? (
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Flame className="w-5 h-5 animate-pulse" />
          <span>Streak: {streakDays} days of improvement</span>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          No active streak—start one today!
        </div>
      )}
    </Card>
  );
};
