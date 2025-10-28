import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Flame, Sparkles } from "lucide-react";

interface AIMessageCardProps {
  content: string;
  type: "roast" | "motivation";
  createdAt: string;
  triggerReason?: string | null;
}

export const AIMessageCard = ({ content, type, createdAt, triggerReason }: AIMessageCardProps) => {
  const isRoast = type === "roast";
  
  return (
    <Card className={`p-4 ${isRoast ? 'bg-destructive/5 border-destructive/20' : 'bg-primary/5 border-primary/20'}`}>
      <div className="flex items-start gap-3">
        <div className={`mt-1 ${isRoast ? 'text-destructive' : 'text-primary'}`}>
          {isRoast ? <Flame className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium text-foreground">{content}</p>
          {triggerReason && (
            <p className="text-xs text-muted-foreground">
              Triggered by: {triggerReason}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>
    </Card>
  );
};
