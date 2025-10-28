import { useState, useEffect } from "react";
import { Crown, Share2, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { mockProfileData } from "../dashboard/mockData";
import { profileCopy } from "../dashboard/copy";
import { PlayerStatsGrid } from "./PlayerStatsGrid";
import { MemeHistory } from "./MemeHistory";
import { EfficiencyMeter } from "../dashboard/EfficiencyMeter";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useConfetti } from "@/hooks/useConfetti";

const getTierEmoji = (tier: string) => {
  switch (tier) {
    case "Diamond":
      return "💎";
    case "Gold":
      return "🥇";
    case "Silver":
      return "🥈";
    case "Bronze":
      return "🥉";
    default:
      return "🏅";
  }
};

const getTierGradient = (tier: string) => {
  switch (tier) {
    case "Diamond":
      return "from-cyan-400/20 via-blue-500/20 to-purple-500/20";
    case "Gold":
      return "from-yellow-400/20 via-amber-500/20 to-orange-500/20";
    case "Silver":
      return "from-gray-300/20 via-slate-400/20 to-gray-500/20";
    case "Bronze":
      return "from-orange-600/20 via-amber-700/20 to-yellow-800/20";
    default:
      return "from-primary/20 to-accent/20";
  }
};

export const PlayerCard = () => {
  const [bio, setBio] = useState(
    localStorage.getItem("playerBio") || mockProfileData.bio
  );
  const [isEditingBio, setIsEditingBio] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isExploding, celebrate } = useConfetti();

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("playerBio", bio);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [bio]);

  const handleBioBlur = () => {
    localStorage.setItem("playerBio", bio);
    setIsEditingBio(false);
    toast({
      title: "Bio updated",
      description: "Your story has been saved.",
    });
  };

  const handleShareCard = () => {
    toast({
      title: "Coming soon",
      description: "Player card sharing will be available soon.",
    });
  };

  useEffect(() => {
    if (mockProfileData.efficiency.value >= 80) {
      const timer = setTimeout(() => celebrate(), 500);
      return () => clearTimeout(timer);
    }
  }, [celebrate]);

  return (
    <div className="space-y-6 pb-6">
      {/* Header Card with Avatar and Tier */}
      <Card
        className={`overflow-hidden border-2 bg-gradient-to-br ${getTierGradient(
          mockProfileData.efficiency.tier
        )}`}
      >
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Avatar with Tier Badge */}
            <div className="relative group">
              <div
                className={`w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-5xl border-4 border-background shadow-xl transition-transform duration-300 hover:scale-105 ${
                  mockProfileData.efficiency.value < 60 ? "grayscale" : ""
                }`}
              >
                {mockProfileData.avatarUrl}
              </div>
              {/* Tier Badge Overlay */}
              <div
                className={`absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-gradient-to-br ${getTierGradient(
                  mockProfileData.efficiency.tier
                )} border-2 border-background flex items-center justify-center text-2xl shadow-lg ${
                  mockProfileData.efficiency.tier === "Gold" ||
                  mockProfileData.efficiency.tier === "Diamond"
                    ? "animate-pulse"
                    : ""
                }`}
              >
                {getTierEmoji(mockProfileData.efficiency.tier)}
              </div>
            </div>

            {/* Name and Tier */}
            <div>
              <h2 className="text-2xl font-bold mb-1">{mockProfileData.name}</h2>
              <div className="flex items-center gap-2 justify-center">
                <Crown className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">
                  {mockProfileData.efficiency.tier} Tier
                </span>
              </div>
            </div>

            {/* Bio */}
            <div className="w-full">
              {isEditingBio ? (
                <Textarea
                  value={bio}
                  onChange={(e) =>
                    setBio(e.target.value.slice(0, 80))
                  }
                  onBlur={handleBioBlur}
                  maxLength={80}
                  className="text-sm text-center resize-none"
                  autoFocus
                  rows={2}
                />
              ) : (
                <button
                  onClick={() => setIsEditingBio(true)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-md hover:bg-background/50"
                >
                  {bio || profileCopy.emptyBio}
                </button>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {bio.length}/80
              </p>
            </div>

            {/* Tier Message */}
            <p className="text-sm text-muted-foreground italic">
              {profileCopy.tiers[mockProfileData.efficiency.tier]}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <PlayerStatsGrid />

      {/* Efficiency Summary */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">
            Current Performance
          </h3>
          <EfficiencyMeter
            efficiency={mockProfileData.efficiency.value}
            tier={mockProfileData.efficiency.tier}
            streakDays={mockProfileData.bestStreak}
            deltaVsYesterday={6}
          />
        </CardContent>
      </Card>

      {/* Meme History */}
      <MemeHistory />

      {/* CTA Row */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => navigate("/communities")}
          variant="outline"
          className="w-full"
        >
          <Trophy className="w-4 h-4 mr-2" />
          Leaderboard
        </Button>
        <Button onClick={handleShareCard} className="w-full">
          <Share2 className="w-4 h-4 mr-2" />
          Share Card
        </Button>
      </div>

      {/* Confetti Effect */}
      {isExploding && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          <div className="text-6xl animate-bounce">🎉</div>
        </div>
      )}
    </div>
  );
};
