import { useState } from "react";
import { User, Trophy, Crown, Settings, Sparkles, TrendingDown, Plus, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import IndividualInsights from "@/components/IndividualInsights";
import GoalSettingModal from "@/components/GoalSettingModal";

const mockProfile = {
  name: "Alex Chen",
  username: "@alex_chen",
  avatar: "🏆",
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

const Profile = () => {
  const [memeSwapEnabled, setMemeSwapEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isPremium] = useState(false); // Set to true for premium users

  return (
    <div className="min-h-screen bg-background pb-20 pt-20">
      <Header />
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Profile</h1>
          <Button variant="ghost" size="icon" onClick={() => window.location.href = '/settings'}>
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center text-4xl border-2 border-primary">
            {mockProfile.avatar}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{mockProfile.name}</h2>
            <p className="text-sm text-muted-foreground mb-2">{mockProfile.username}</p>
            <Button variant="outline" size="sm">Edit Profile</Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-3 gap-3 mb-6">
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

        {/* Personal Bests */}
        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 rounded-2xl p-6 mb-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            Personal Bests
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Avg Efficiency</div>
              <div className="text-2xl font-bold text-primary">{mockProfile.stats.avgEfficiency}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Best Week</div>
              <div className="text-2xl font-bold text-success">{mockProfile.stats.bestWeek}</div>
            </div>
          </div>
        </div>

        {/* Your Goals Section */}
        <div className="mb-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Your Goals
              </h3>
              <Button onClick={() => setIsGoalModalOpen(true)} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Set Goal
              </Button>
            </div>
            <p className="text-muted-foreground text-sm">
              Set personal goals and get AI-powered structured plans to achieve them.
              {!isPremium && " (AI features available for premium users)"}
            </p>
          </div>
        </div>

        {/* Your Insights Section */}
        <div className="mb-6">
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
                    <div className="text-2xl font-bold text-primary">{mockProfile.stats.avgEfficiency}%</div>
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
        </div>

        {/* Achievements */}
        <div className="mb-6">
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

        {/* History */}
        <div className="mb-6">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Weekly History
          </h3>
          <div className="space-y-2">
            {mockProfile.history.map((week, idx) => (
              <div key={idx} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{week.week}</span>
                  <div className="flex items-center gap-2">
                    <Trophy className={`w-4 h-4 ${week.rank <= 3 ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="font-bold text-primary">#{week.rank}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{week.screenTime}</span>
                  <span className={`font-semibold ${week.efficiency > 70 ? 'text-success' : week.efficiency > 50 ? 'text-primary' : 'text-destructive'}`}>
                    {week.efficiency} efficiency
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold mb-4">Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">Meme Punishments</div>
                <div className="text-xs text-muted-foreground">Auto-swap profile pic when losing</div>
              </div>
              <Switch checked={memeSwapEnabled} onCheckedChange={setMemeSwapEnabled} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">Push Notifications</div>
                <div className="text-xs text-muted-foreground">Daily reminders & rank updates</div>
              </div>
              <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
            </div>
            <Button variant="outline" className="w-full">
              Manage Meme Bank
            </Button>
            <Button variant="outline" className="w-full text-destructive border-destructive/20">
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Goal Setting Modal */}
      <GoalSettingModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onGoalCreated={() => {
          setIsGoalModalOpen(false);
        }}
        isPremium={isPremium}
      />
    </div>
  );
};

export default Profile;
