import { useState, useEffect } from "react";
import { Zap, TrendingUp, TrendingDown, Trophy, Crown, Target, Plus, Sparkles, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useScreenTimeTracking } from "@/hooks/useScreenTimeTracking";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Header from "@/components/Header";
import EfficiencyInfo from "@/components/EfficiencyInfo";
import IndividualInsights from "@/components/IndividualInsights";
import GoalSettingModal from "@/components/GoalSettingModal";
import { SavedGoals } from "@/components/SavedGoals";
import MemeBank from "@/components/MemeBank";
import { ManualTimeEntry } from "@/components/ManualTimeEntry";
import { useNavigate } from "react-router-dom";

const mockProfile = {
  stats: {
    currentStreak: 12,
    totalWins: 8,
    communities: 3,
    avgEfficiency: 64,
    bestWeek: "2h 14m"
  },
  achievements: [
    { icon: "🥇", name: "Champion", desc: "Won 5 weekly challenges" },
    { icon: "🔥", name: "Fire Streak", desc: "10 day winning streak" },
    { icon: "⚡", name: "Efficiency King", desc: "90+ efficiency score" }
  ],
  history: [
    { week: "Week 23", rank: 2, screenTime: "2h 14m", efficiency: 87 },
    { week: "Week 22", rank: 1, screenTime: "1h 58m", efficiency: 92 },
    { week: "Week 21", rank: 4, screenTime: "3h 42m", efficiency: 52 },
    { week: "Week 20", rank: 3, screenTime: "2h 45m", efficiency: 71 }
  ]
};

const Home = () => {
  const [period, setPeriod] = useState<'today' | 'week'>('today');
  const [viewMode, setViewMode] = useState<'impact' | 'actual'>('impact');
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();
      
      if (profileData) {
        setProfile(profileData);
      }
    };

    checkAuth();
  }, [navigate]);

  const { data: realData, loading } = useScreenTimeTracking(user?.id, period);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'productive': return 'text-success border-success/20 bg-success/5';
      case 'unproductive': return 'text-destructive border-destructive/20 bg-destructive/5';
      case 'utility': return 'text-muted-foreground border-border bg-muted/30';
      default: return 'text-muted-foreground border-border bg-muted/30';
    }
  };

  const clampedEfficiency = Math.max(0, realData?.efficiencyScore || 0);
  const efficiencyPercentage = Math.max(0, Math.min(100, ((clampedEfficiency + 100) / 2)));

  return (
    <div className="min-h-screen bg-background pb-24 pt-20">
      <Header />
      
      {/* Profile Header */}
      <div className="bg-card border-b border-border px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Home</h1>
          <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center text-4xl border-2 border-primary">
            {profile?.avatar_emoji || "😎"}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{profile?.display_name || user?.email?.split('@')[0] || "Player"}</h2>
            <p className="text-sm text-muted-foreground mb-2">@{profile?.username || user?.email?.split('@')[0] || "user"}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Period Toggle */}
        <Tabs value={period} onValueChange={(v) => setPeriod(v as 'today' | 'week')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Efficiency Overview Card */}
        <Card className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 border-primary/20">
          <CardContent className="px-6 py-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Efficiency Overview</h3>
              <EfficiencyInfo score={Math.round(clampedEfficiency)} />
            </div>
            
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-32 h-32">
                <CircularProgressbar
                  value={efficiencyPercentage}
                  text={''}
                  strokeWidth={10}
                  styles={buildStyles({
                    pathColor: clampedEfficiency >= 0 ? '#10B981' : '#EF4444',
                    trailColor: '#e0e0e0',
                    strokeLinecap: 'round',
                  })}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold text-primary">{Math.round(clampedEfficiency)}%</div>
                  <div className="text-sm text-muted-foreground">Efficiency</div>
                  {realData && realData.totalMinutes > 0 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {Math.round((realData.efficientMinutes / realData.totalMinutes) * 100)}% prod
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">Total Time</div>
                <div className="text-lg font-bold">{Math.floor((realData?.totalMinutes || 0) / 60)}h {(realData?.totalMinutes || 0) % 60}m</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">Productive</div>
                <div className="text-lg font-bold text-success">{Math.floor((realData?.efficientMinutes || 0) / 60)}h {(realData?.efficientMinutes || 0) % 60}m</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">Wasted</div>
                <div className="text-lg font-bold text-destructive">{Math.floor((realData?.inefficientMinutes || 0) / 60)}h {(realData?.inefficientMinutes || 0) % 60}m</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{mockProfile.stats.currentStreak}</div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-success mb-1">{mockProfile.stats.totalWins}</div>
            <div className="text-xs text-muted-foreground">Total Wins</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-accent mb-1">{mockProfile.stats.communities}</div>
            <div className="text-xs text-muted-foreground">Communities</div>
          </div>
        </div>

        {/* Your Insights */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Your Insights
          </h3>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="detailed">Detailed</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-primary/5 rounded-xl p-4 text-center border border-primary/20">
                  <div className="text-2xl font-bold text-primary">{Math.round(clampedEfficiency)}%</div>
                  <div className="text-xs text-muted-foreground">Efficiency</div>
                </div>
                <div className="bg-success/5 rounded-xl p-4 text-center border border-success/20">
                  <div className="text-2xl font-bold text-success">{mockProfile.stats.bestWeek}</div>
                  <div className="text-xs text-muted-foreground">Best Week</div>
                </div>
                <div className="bg-accent/5 rounded-xl p-4 text-center border border-accent/20">
                  <div className="text-2xl font-bold text-accent">{mockProfile.stats.currentStreak}</div>
                  <div className="text-xs text-muted-foreground">Day Streak</div>
                </div>
                <div className="bg-primary/5 rounded-xl p-4 text-center border border-primary/20">
                  <div className="text-2xl font-bold text-primary">{mockProfile.stats.totalWins}</div>
                  <div className="text-xs text-muted-foreground">Total Wins</div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="detailed">
              <IndividualInsights screenTimeData={mockProfile} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Your Goals */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Your Goals
            </h3>
            <Button onClick={() => setIsGoalModalOpen(true)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Set New Goal
            </Button>
          </div>
          <SavedGoals />
        </div>

        {/* Meme Bank */}
        <MemeBank />

        {/* Personal Bests */}
        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 rounded-2xl p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            Personal Bests
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Avg Efficiency</div>
              <div className="text-2xl font-bold text-primary">{mockProfile.stats.avgEfficiency}%</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Best Week</div>
              <div className="text-2xl font-bold text-success">{mockProfile.stats.bestWeek}</div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Achievements
          </h3>
          <div className="grid gap-3">
            {mockProfile.achievements.map((ach, idx) => (
              <div key={idx} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
                <div className="text-3xl">{ach.icon}</div>
                <div>
                  <div className="font-semibold">{ach.name}</div>
                  <div className="text-xs text-muted-foreground">{ach.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Manual Time Entry */}
        <ManualTimeEntry />
      </div>

      <GoalSettingModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onGoalCreated={() => setIsGoalModalOpen(false)}
        isPremium={false}
      />
    </div>
  );
};

export default Home;