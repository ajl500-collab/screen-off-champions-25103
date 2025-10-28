import { useState, useEffect } from "react";
import { Clock, Users, Globe, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeaderboardItem } from "./LeaderboardItem";
import { mockLeaderboardData } from "../dashboard/mockData";
import { leaderboardCopy, getTopRankCopy } from "../dashboard/copy";
import { useToast } from "@/hooks/use-toast";

type FilterTab = "squad" | "global" | "friends";

export const Leaderboard = () => {
  const [filter, setFilter] = useState<FilterTab>("squad");
  const [timeRemaining, setTimeRemaining] = useState(mockLeaderboardData.weekEndsIn);
  const { toast } = useToast();

  const { leaderboard, currentUserId } = mockLeaderboardData;
  const currentUserEntry = leaderboard.find((e) => e.userId === currentUserId);
  const isTopThree = currentUserEntry && currentUserEntry.rank <= 3;

  // Mock countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real app, calculate actual time remaining
      // For mock, just keep the same value
      setTimeRemaining(mockLeaderboardData.weekEndsIn);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleInviteFriends = () => {
    // Mock invite functionality
    navigator.clipboard.writeText("https://screenVS.app/invite/squad-abc123");
    toast({
      title: "Invite link copied!",
      description: "Share it with your friends to start competing.",
    });
  };

  if (leaderboard.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="space-y-4">
          <div className="text-4xl">🏆</div>
          <h3 className="text-xl font-bold">{leaderboardCopy.emptyState.title}</h3>
          <p className="text-sm text-muted-foreground">
            {leaderboardCopy.emptyState.subtitle}
          </p>
          <Button onClick={handleInviteFriends} className="gap-2">
            <UserPlus className="w-4 h-4" />
            {leaderboardCopy.emptyState.buttonText}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Leaderboard — Week 1</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Resets in{" "}
              <span className="font-semibold text-primary">{timeRemaining}</span> — keep
              climbing.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary animate-pulse" />
          </div>
        </div>

        {/* Top rank message */}
        {currentUserEntry?.rank === 1 && (
          <div className="text-sm font-semibold text-primary animate-pulse">
            {getTopRankCopy()}
          </div>
        )}

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterTab)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="squad" className="gap-2">
              <Users className="w-4 h-4" />
              Squad
            </TabsTrigger>
            <TabsTrigger value="global" className="gap-2">
              <Globe className="w-4 h-4" />
              Global
            </TabsTrigger>
            <TabsTrigger value="friends" className="gap-2">
              <Users className="w-4 h-4" />
              Friends
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Card>

      {/* Leaderboard List */}
      <div className="space-y-3">
        {leaderboard.map((entry, index) => (
          <div
            key={entry.userId}
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            <LeaderboardItem
              entry={entry}
              isCurrentUser={entry.userId === currentUserId}
            />
          </div>
        ))}
      </div>

      {/* Glow effect for top user */}
      {isTopThree && (
        <style>{`
          @keyframes top-glow {
            0%, 100% { box-shadow: 0 0 20px hsl(var(--primary) / 0.3); }
            50% { box-shadow: 0 0 30px hsl(var(--primary) / 0.5); }
          }
        `}</style>
      )}
    </div>
  );
};
