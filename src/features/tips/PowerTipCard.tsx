import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { PowerTip } from "../dashboard/mockData";

interface PowerTipCardProps {
  tip: PowerTip;
  onAction: (tip: PowerTip) => void;
}

export const PowerTipCard = ({ tip, onAction }: PowerTipCardProps) => {
  return (
    <div
      className={`
        relative flex-shrink-0 w-[260px] md:w-[300px] h-[200px] 
        rounded-2xl border transition-all duration-300
        ${
          tip.tried
            ? "bg-muted/30 border-border opacity-60"
            : "bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 border-primary/20 hover:scale-105 hover:shadow-lg"
        }
        overflow-hidden
      `}
    >
      {/* Unlocked Ribbon */}
      {tip.tried && (
        <div className="absolute top-4 right-4 z-10 animate-scale-in">
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-success text-success-foreground text-xs font-semibold">
            <Check className="w-3 h-3" />
            Unlocked
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6 flex flex-col h-full">
        <div className="flex-1">
          <h4 className="text-lg font-bold mb-2 line-clamp-1">{tip.title}</h4>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {tip.oneLiner}
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-4">
          {tip.actionType === "tooltip" ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => onAction(tip)}
                    variant={tip.tried ? "outline" : "default"}
                    className="w-full"
                    disabled={tip.tried}
                  >
                    {tip.tried ? "Done ✓" : tip.actionLabel}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">{tip.actionData}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button
              onClick={() => onAction(tip)}
              variant={tip.tried ? "outline" : "default"}
              className="w-full"
              disabled={tip.tried}
            >
              {tip.tried ? "Done ✓" : tip.actionLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Shimmer effect for unlocked cards */}
      {tip.tried && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      )}
    </div>
  );
};
