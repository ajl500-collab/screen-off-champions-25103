import { useState } from "react";
import { User, Trophy, Target, Calendar, Sparkles, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";

const Profile = () => {
  const [goalText, setGoalText] = useState("");
  const [targetEfficiency, setTargetEfficiency] = useState("");
  const [showAIPlan, setShowAIPlan] = useState(false);

  // Mock profile data
  const profile = {
    name: "Alex Chen",
    username: "@alex_chen",
    avatar: "🏆",
    efficiency: 68,
    rank: 3,
    streak: 12,
    totalTime: "4h 30m"
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-b border-border px-4 py-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-full bg-card border-2 border-primary flex items-center justify-center text-4xl">
            {profile.avatar}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-muted-foreground">{profile.username}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card/50 rounded-xl p-3 text-center border border-border/50">
            <div className="text-xs text-muted-foreground mb-1">Rank</div>
            <div className="text-lg font-bold text-primary">#{profile.rank}</div>
          </div>
          <div className="bg-card/50 rounded-xl p-3 text-center border border-border/50">
            <div className="text-xs text-muted-foreground mb-1">Efficiency</div>
            <div className="text-lg font-bold text-success">{profile.efficiency}%</div>
          </div>
          <div className="bg-card/50 rounded-xl p-3 text-center border border-border/50">
            <div className="text-xs text-muted-foreground mb-1">Streak</div>
            <div className="text-lg font-bold text-accent">{profile.streak}d</div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Individual Insights */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Your Insights
          </h3>
          
          <div className="space-y-4">
            <div className="bg-success/5 border border-success/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-success">Best Day</span>
                <Badge variant="secondary">Monday</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Your efficiency peaks at 82% on Mondays</p>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-primary">Peak Hours</span>
                <Badge variant="secondary">9AM - 12PM</Badge>
              </div>
              <p className="text-xs text-muted-foreground">You're most productive in the morning</p>
            </div>

            <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-destructive">Watch Out</span>
                <Badge variant="secondary">Evenings</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Screen time spikes after 8PM</p>
            </div>
          </div>
        </div>

        {/* Goals & AI Plans */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Set Your Goals
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-2 block">What's your goal?</label>
              <Textarea
                placeholder="E.g., Reduce social media time by 50%"
                value={goalText}
                onChange={(e) => setGoalText(e.target.value)}
                className="mb-2"
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Target Efficiency Score</label>
              <Input
                type="number"
                placeholder="E.g., 75"
                value={targetEfficiency}
                onChange={(e) => setTargetEfficiency(e.target.value)}
              />
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-primary to-accent"
              onClick={() => setShowAIPlan(true)}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Get AI-Powered Plan (Premium)
            </Button>

            {showAIPlan && (
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-4 mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="font-bold text-primary">Your Personalized Plan</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-2">
                    <Clock className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                      <div className="font-semibold">Week 1: Foundation</div>
                      <div className="text-muted-foreground">Track your current habits without changes</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Target className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                      <div className="font-semibold">Week 2-3: Gradual Reduction</div>
                      <div className="text-muted-foreground">Reduce unproductive app time by 20% weekly</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Trophy className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                      <div className="font-semibold">Week 4+: Optimization</div>
                      <div className="text-muted-foreground">Replace with productive alternatives</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
