import { useEffect, useState } from "react";
import { Activity, TrendingUp, Zap, Target, Award, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useScreenTimeTracking } from "@/hooks/useScreenTimeTracking";

interface InsightData {
  title: string;
  value: string;
  change: number;
  trend: "up" | "down" | "neutral";
  icon: any;
  description: string;
  progress?: number;
}

const IndividualInsights = ({ screenTimeData }: { screenTimeData?: any }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
      setLoading(false);
    };
    getUser();
  }, []);

  // Fetch real screen time data for "today" and "week"
  const { data: todayData } = useScreenTimeTracking(userId, 'today');
  const { data: weekData } = useScreenTimeTracking(userId, 'week');

  // Calculate real metrics
  const dailyAverage = weekData ? Math.round(weekData.totalMinutes / 7) : 0;
  const dailyAverageHours = Math.floor(dailyAverage / 60);
  const dailyAverageMinutes = dailyAverage % 60;

  const efficiencyScore = todayData?.efficiencyScore || 0;
  const totalTimeToday = todayData?.totalMinutes || 0;
  const productiveTimeToday = todayData?.efficientMinutes || 0;

  // Calculate streak (simplified - would need historical data for real streak)
  const currentStreak = totalTimeToday > 0 ? 1 : 0;

  // Real insights based on actual data
  const insights: InsightData[] = [
    {
      title: "Daily Average",
      value: dailyAverage > 0 ? `${dailyAverageHours}h ${dailyAverageMinutes}m` : "0m",
      change: 0,
      trend: "neutral",
      icon: Calendar,
      description: "Last 7 days"
    },
    {
      title: "Efficiency Score",
      value: Math.round(efficiencyScore).toString(),
      change: 0,
      trend: efficiencyScore > 50 ? "up" : "down",
      icon: Zap,
      description: "Today's performance",
      progress: Math.max(0, Math.min(100, efficiencyScore))
    },
    {
      title: "Active Days",
      value: currentStreak.toString(),
      change: 0,
      trend: "neutral",
      icon: Activity,
      description: "Current streak"
    },
    {
      title: "Best Week",
      value: weekData ? `${Math.floor(weekData.totalMinutes / 60)}h ${weekData.totalMinutes % 60}m` : "0m",
      change: 0,
      trend: "neutral",
      icon: Award,
      description: "This week's total"
    },
    {
      title: "Productive Time",
      value: productiveTimeToday > 0 ? `${Math.floor(productiveTimeToday / 60)}h ${productiveTimeToday % 60}m` : "0m",
      change: 0,
      trend: productiveTimeToday > 0 ? "up" : "neutral",
      icon: Target,
      description: "Today's focus time"
    },
    {
      title: "Productivity Rate",
      value: totalTimeToday > 0 ? `${Math.round((productiveTimeToday / totalTimeToday) * 100)}%` : "0%",
      change: 0,
      trend: (productiveTimeToday / Math.max(totalTimeToday, 1)) > 0.5 ? "up" : "down",
      icon: TrendingUp,
      description: "Productive vs total",
      progress: totalTimeToday > 0 ? Math.round((productiveTimeToday / totalTimeToday) * 100) : 0
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-4 bg-muted rounded mb-2" />
            <div className="h-6 bg-muted rounded mb-1" />
            <div className="h-3 bg-muted rounded" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {insights.map((insight, idx) => {
        const Icon = insight.icon;
        return (
          <Card key={idx} className="p-4 border border-border bg-card">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-medium text-muted-foreground">{insight.title}</h3>
            </div>
            <div className="text-xl font-bold mb-1">{insight.value}</div>
            <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
            {insight.progress !== undefined && (
              <Progress value={insight.progress} className="h-1.5" />
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default IndividualInsights;
