import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingDown, TrendingUp, Clock, Zap, Target, Award } from "lucide-react";

interface InsightData {
  title: string;
  value: string;
  change: number;
  trend: "up" | "down";
  icon: React.ReactNode;
  description: string;
  progress?: number;
}

const IndividualInsights = ({ screenTimeData }: { screenTimeData: any }) => {
  const insights: InsightData[] = [
    {
      title: "Daily Average",
      value: "3h 24m",
      change: -12,
      trend: "down",
      icon: <Clock className="w-5 h-5" />,
      description: "12% less than last week",
      progress: 68,
    },
    {
      title: "Efficiency Score",
      value: "78%",
      change: 5,
      trend: "up",
      icon: <Zap className="w-5 h-5" />,
      description: "5% improvement",
      progress: 78,
    },
    {
      title: "Productive Hours",
      value: "2h 15m",
      change: 18,
      trend: "up",
      icon: <Target className="w-5 h-5" />,
      description: "18% more productive time",
      progress: 45,
    },
    {
      title: "Weekly Rank",
      value: "#3",
      change: 2,
      trend: "up",
      icon: <Award className="w-5 h-5" />,
      description: "Moved up 2 positions",
    },
    {
      title: "Longest Streak",
      value: "5 days",
      change: 1,
      trend: "up",
      icon: <TrendingUp className="w-5 h-5" />,
      description: "Current active streak",
    },
    {
      title: "Phone Pickups",
      value: "45/day",
      change: -8,
      trend: "down",
      icon: <TrendingDown className="w-5 h-5" />,
      description: "8% reduction",
      progress: 55,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {insights.map((insight, index) => (
        <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {insight.icon}
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  {insight.title}
                </h3>
                <p className="text-2xl font-bold mt-1">{insight.value}</p>
              </div>
            </div>
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                insight.trend === "up"
                  ? insight.title.includes("Rank") || insight.title.includes("Streak")
                    ? "text-success"
                    : insight.title.includes("Pickups")
                    ? "text-destructive"
                    : "text-success"
                  : "text-success"
              }`}
            >
              {insight.trend === "up" ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {Math.abs(insight.change)}%
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {insight.description}
          </p>
          {insight.progress !== undefined && (
            <Progress value={insight.progress} className="h-2" />
          )}
        </Card>
      ))}
    </div>
  );
};

export default IndividualInsights;
