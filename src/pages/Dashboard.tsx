import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TrendingDown, TrendingUp, Zap, Trophy } from "lucide-react";
import Header from "@/components/Header";

const mockDashboardData = {
  today: {
    totalTime: "3h 42m",
    totalTimeMinutes: 222,
    efficientTime: "1h 15m",
    efficientTimeMinutes: 75,
    inefficientTime: "2h 10m",
    inefficientTimeMinutes: 130,
    utilityTime: "17m",
    utilityTimeMinutes: 17,
    efficiencyScore: 52,
    rank: 3,
    change: -12,
    apps: [
      { name: "LinkedIn", time: "45m", category: "productive", efficiency: "+68m" },
      { name: "Instagram", time: "1h 20m", category: "unproductive", efficiency: "-2h" },
      { name: "WSJ", time: "30m", category: "productive", efficiency: "+45m" },
      { name: "TikTok", time: "50m", category: "unproductive", efficiency: "-1h 15m" },
      { name: "Messages", time: "17m", category: "utility", efficiency: "0m" },
    ]
  },
  week: {
    totalTime: "28h 15m",
    totalTimeMinutes: 1695,
    efficientTime: "8h 45m",
    efficientTimeMinutes: 525,
    inefficientTime: "16h 30m",
    inefficientTimeMinutes: 990,
    utilityTime: "3h",
    utilityTimeMinutes: 180,
    efficiencyScore: 45,
    rank: 5,
    change: -8,
    apps: [
      { name: "LinkedIn", time: "5h 20m", category: "productive", efficiency: "+8h" },
      { name: "Instagram", time: "8h 45m", category: "unproductive", efficiency: "-13h 8m" },
      { name: "WSJ", time: "3h 25m", category: "productive", efficiency: "+5h 8m" },
      { name: "TikTok", time: "7h 45m", category: "unproductive", efficiency: "-11h 38m" },
      { name: "Messages", time: "3h", category: "utility", efficiency: "0m" },
    ]
  }
};

const Dashboard = () => {
  const [period, setPeriod] = useState<"today" | "week">("today");
  const data = mockDashboardData[period];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "productive": return "text-success border-success/20 bg-success/5";
      case "unproductive": return "text-destructive border-destructive/20 bg-destructive/5";
      default: return "text-muted-foreground border-border bg-muted/20";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">#{data.rank}</span>
          </div>
        </div>

        {/* Period Toggle */}
        <Tabs value={period} onValueChange={(v) => setPeriod(v as "today" | "week")} className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Stats */}
      <div className="px-4 py-6 space-y-4">
        {/* Efficiency Score Card */}
        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Efficiency Score</h3>
            </div>
            <div className={`flex items-center gap-1 text-sm ${data.change < 0 ? 'text-success' : 'text-destructive'}`}>
              {data.change < 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
              <span>{Math.abs(data.change)}%</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">{data.efficiencyScore}</div>
            <div className="text-sm text-muted-foreground">Your efficiency rating</div>
          </div>
        </div>

        {/* Time Breakdown */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-success/5 border border-success/20 rounded-xl p-4">
            <div className="text-xs text-success mb-1">Productive</div>
            <div className="text-xl font-bold font-mono">{data.efficientTime}</div>
          </div>
          <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4">
            <div className="text-xs text-destructive mb-1">Wasted</div>
            <div className="text-xl font-bold font-mono">{data.inefficientTime}</div>
          </div>
          <div className="bg-muted/20 border border-border rounded-xl p-4">
            <div className="text-xs text-muted-foreground mb-1">Utility</div>
            <div className="text-xl font-bold font-mono">{data.utilityTime}</div>
          </div>
        </div>

        {/* Apps Breakdown */}
        <div>
          <h3 className="font-semibold mb-3">App Usage</h3>
          <div className="space-y-2">
            {data.apps.map((app, idx) => (
              <div 
                key={idx}
                className={`border rounded-xl p-4 ${getCategoryColor(app.category)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{app.name}</span>
                  <span className="text-sm font-mono">{app.time}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="capitalize opacity-60">{app.category}</span>
                  <span className={`font-semibold ${
                    app.category === 'productive' ? 'text-success' :
                    app.category === 'unproductive' ? 'text-destructive' :
                    'text-muted-foreground'
                  }`}>
                    Efficiency: {app.efficiency}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Algorithm Explainer */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h4 className="font-semibold mb-2 text-sm">How It Works</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your efficiency score is calculated by weighting your app usage. Productive apps (LinkedIn, WSJ, Notion) add +150% to your score. Unproductive apps (TikTok, Instagram) subtract -150%. Utility apps (Messages, Clock) are neutral.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;