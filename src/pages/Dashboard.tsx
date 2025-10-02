import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TrendingDown, TrendingUp, Zap, Trophy } from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
    efficiencyPercentage: 68,
    productivityPercentage: 34,
    rank: 3,
    change: -12,
    apps: [
      { name: "LinkedIn", time: "45m", category: "productive", efficiency: "+68m", actualMinutes: 45 },
      { name: "Instagram", time: "1h 20m", category: "unproductive", efficiency: "-2h", actualMinutes: 80 },
      { name: "WSJ", time: "30m", category: "productive", efficiency: "+45m", actualMinutes: 30 },
      { name: "TikTok", time: "50m", category: "unproductive", efficiency: "-1h 15m", actualMinutes: 50 },
      { name: "Messages", time: "17m", category: "utility", efficiency: "0m", actualMinutes: 17 },
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
    efficiencyPercentage: 62,
    productivityPercentage: 31,
    rank: 5,
    change: -8,
    apps: [
      { name: "LinkedIn", time: "5h 20m", category: "productive", efficiency: "+8h", actualMinutes: 320 },
      { name: "Instagram", time: "8h 45m", category: "unproductive", efficiency: "-13h 8m", actualMinutes: 525 },
      { name: "WSJ", time: "3h 25m", category: "productive", efficiency: "+5h 8m", actualMinutes: 205 },
      { name: "TikTok", time: "7h 45m", category: "unproductive", efficiency: "-11h 38m", actualMinutes: 465 },
      { name: "Messages", time: "3h", category: "utility", efficiency: "0m", actualMinutes: 180 },
    ]
  }
};

const Dashboard = () => {
  const [period, setPeriod] = useState<"today" | "week">("today");
  const [viewMode, setViewMode] = useState<"impact" | "actual">("impact");
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const data = mockDashboardData[period];

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "productive": return "text-success border-success/20 bg-success/5";
      case "unproductive": return "text-destructive border-destructive/20 bg-destructive/5";
      default: return "text-muted-foreground border-border bg-muted/20";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 pt-20">
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
        {/* Efficiency Score Card with Circular Graph */}
        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Efficiency Overview</h3>
            </div>
            <div className={`flex items-center gap-1 text-sm ${data.change < 0 ? 'text-success' : 'text-destructive'}`}>
              {data.change < 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
              <span>{Math.abs(data.change)}%</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Circular Progress */}
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted/20"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - data.efficiencyPercentage / 100)}`}
                  className="text-primary transition-all duration-1000"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-primary">{data.efficiencyPercentage}%</div>
                <div className="text-xs text-muted-foreground">Efficiency</div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex-1 space-y-2">
              <div>
                <div className="text-sm text-muted-foreground">Productivity Rate</div>
                <div className="text-2xl font-bold text-success">{data.productivityPercentage}%</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Screen Time</div>
                <div className="text-2xl font-bold font-mono">{data.totalTime}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Efficient Hours</div>
                <div className="text-2xl font-bold font-mono text-primary">{data.efficientTime}</div>
              </div>
            </div>
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
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">App Usage</h3>
          </div>
          
          {/* Toggle between views */}
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "impact" | "actual")} className="mb-3">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="impact">Screen Time by Impact</TabsTrigger>
              <TabsTrigger value="actual">Actual Screen Time</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-2">
            {viewMode === "impact" ? (
              // Screen Time by Impact - sorted by efficiency impact
              data.apps
                .sort((a, b) => {
                  const getImpactValue = (app: any) => {
                    if (app.category === 'productive') return parseInt(app.efficiency) || 100;
                    if (app.category === 'unproductive') return parseInt(app.efficiency) || -100;
                    return 0;
                  };
                  return getImpactValue(b) - getImpactValue(a);
                })
                .map((app, idx) => (
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
                        Weighted: {app.efficiency}
                      </span>
                    </div>
                  </div>
                ))
            ) : (
              // Actual Screen Time - sorted by actual usage time
              data.apps
                .sort((a, b) => b.actualMinutes - a.actualMinutes)
                .map((app, idx) => (
                  <div 
                    key={idx}
                    className="border border-border rounded-xl p-4 bg-card"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{app.name}</span>
                      <span className="text-sm font-mono">{app.time}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Actual usage time</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        app.category === 'productive' ? 'bg-success/20 text-success' :
                        app.category === 'unproductive' ? 'bg-destructive/20 text-destructive' :
                        'bg-muted/40 text-muted-foreground'
                      }`}>
                        {app.category}
                      </span>
                    </div>
                  </div>
                ))
            )}
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
