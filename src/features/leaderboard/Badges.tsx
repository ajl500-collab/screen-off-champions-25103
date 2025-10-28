import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { leaderboardCopy } from "../dashboard/copy";

interface BadgesProps {
  badges: string[];
}

export const Badges = ({ badges }: BadgesProps) => {
  if (badges.length === 0) return null;

  return (
    <div className="flex gap-1 flex-wrap mt-1">
      {badges.map((badgeName) => {
        const badgeInfo =
          leaderboardCopy.badges[
            badgeName as keyof typeof leaderboardCopy.badges
          ];
        if (!badgeInfo) return null;

        return (
          <TooltipProvider key={badgeName}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="text-xs px-2 py-0 border-primary/20 bg-primary/5 text-primary"
                >
                  {badgeInfo.emoji}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs font-semibold">{badgeName}</p>
                <p className="text-xs text-muted-foreground">
                  {badgeInfo.description}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
};
