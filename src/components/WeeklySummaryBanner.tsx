import { useLatestWeeklySummary } from "@/lib/ai/queries";
import { Card } from "./ui/card";
import { TrendingUp, Calendar } from "lucide-react";
import { format } from "date-fns";

export const WeeklySummaryBanner = () => {
  const { data: summary, isLoading } = useLatestWeeklySummary();

  if (isLoading || !summary) {
    return null;
  }

  // Only show if summary is from within last 7 days
  const summaryAge = Date.now() - new Date(summary.created_at).getTime();
  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
  
  if (summaryAge > sevenDaysInMs) {
    return null;
  }

  return (
    <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">Weekly Recap</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>
                {format(new Date(summary.week_start), "MMM d")} - {format(new Date(summary.week_end), "MMM d")}
              </span>
            </div>
          </div>
          <p className="text-sm text-foreground">{summary.summary}</p>
          {summary.efficiency_change !== null && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>
                Efficiency: {summary.efficiency_change > 0 ? '+' : ''}{summary.efficiency_change}%
              </span>
              {summary.top_productive_app && (
                <span>✅ Most productive: {summary.top_productive_app}</span>
              )}
              {summary.top_unproductive_app && (
                <span>⚠️ Most unproductive: {summary.top_unproductive_app}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
