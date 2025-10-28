import { Trophy } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RankDeltaIndicator } from "./RankDeltaIndicator";
import { Badges } from "./Badges";
import type { LeaderboardEntry } from "@/lib/data/queries";

interface LeaderboardItemProps {
  entry: LeaderboardEntry;
  isCurrentUser: boolean;
}

export const LeaderboardItem = ({
  entry,
  isCurrentUser,
}: LeaderboardItemProps) => {
  const isTopThree = entry.rank <= 3;

  const getTierColor = () => {
    switch (entry.tier) {
      case "Gold":
        return "text-yellow-500";
      case "Silver":
        return "text-gray-300";
      case "Bronze":
        return "text-orange-600";
      default:
        return "text-muted-foreground";
    }
  };

  const getTierBg = () => {
    switch (entry.tier) {
      case "Gold":
        return "bg-yellow-500/10";
      case "Silver":
        return "bg-gray-300/10";
      case "Bronze":
        return "bg-orange-600/10";
      default:
        return "bg-muted/10";
    }
  };

  const getTopThreeBg = () => {
    if (!isTopThree) return "";
    if (entry.rank === 1) return "bg-gradient-to-r from-yellow-500/10 to-transparent";
    if (entry.rank === 2) return "bg-gradient-to-r from-gray-300/10 to-transparent";
    if (entry.rank === 3) return "bg-gradient-to-r from-orange-600/10 to-transparent";
    return "";
  };

  return (
    <div
      className={`
        flex items-center gap-4 p-4 rounded-xl border transition-all duration-300
        hover:scale-[1.02] hover:shadow-lg
        ${getTopThreeBg()}
        ${isCurrentUser ? "border-primary bg-primary/5" : "border-border bg-card"}
        ${isTopThree && !isCurrentUser ? "border-primary/20" : ""}
        animate-scale-in
      `}
    >
      {/* Rank */}
      <div className="flex items-center gap-2 min-w-[60px]">
        <span
          className={`text-2xl font-bold ${
            isTopThree ? getTierColor() : "text-muted-foreground"
          }`}
        >
          #{entry.rank}
        </span>
        {isTopThree && <Trophy className={`w-5 h-5 ${getTierColor()}`} />}
      </div>

      {/* Avatar & Name */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar className="w-12 h-12 border-2 border-border">
          <AvatarFallback className="text-2xl">{entry.avatarUrl}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-base truncate max-w-[140px]">
              {entry.name}
            </span>
            {isCurrentUser && (
              <span className="text-xs text-primary font-semibold">(You)</span>
            )}
          </div>
          <Badges badges={entry.badges} />
        </div>
      </div>

      {/* Efficiency */}
      <div
        className={`px-4 py-2 rounded-lg font-bold text-lg ${getTierBg()} ${getTierColor()}`}
      >
        {entry.efficiency}%
      </div>

      {/* Rank Delta */}
      <RankDeltaIndicator
        rankDelta={entry.rankDelta}
        efficiency={entry.efficiency}
      />
    </div>
  );
};
