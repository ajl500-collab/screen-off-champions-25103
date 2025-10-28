import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getRankChangeCopy } from "../dashboard/copy";

interface RankDeltaIndicatorProps {
  rankDelta: number;
  efficiency: number;
}

export const RankDeltaIndicator = ({
  rankDelta,
  efficiency,
}: RankDeltaIndicatorProps) => {
  if (rankDelta === 0) {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/40 text-muted-foreground">
        <Minus className="w-4 h-4" />
        <span className="text-xs font-semibold">—</span>
      </div>
    );
  }

  const isUp = rankDelta > 0;
  const color = isUp ? "text-success" : "text-destructive";
  const bgColor = isUp ? "bg-success/10" : "bg-destructive/10";
  const Icon = isUp ? TrendingUp : TrendingDown;
  const tooltipText = getRankChangeCopy(rankDelta);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${bgColor} ${color} animate-slide-up`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-xs font-semibold">{Math.abs(rankDelta)}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{tooltipText}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Efficiency: {efficiency}%
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
