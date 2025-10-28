import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import type { Squad } from "@/lib/data/queries";

interface SquadCardProps {
  squad: Squad;
}

export const SquadCard = ({ squad }: SquadCardProps) => {
  // For now, show placeholder since we don't have members array yet
  const memberCount = 1; // You + others would come from memberships table

  return (
    <Card className="p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-border hover:border-primary/30 cursor-pointer group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{squad.emoji || "🎯"}</div>
          <div>
            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
              {squad.name}
            </h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>{memberCount} {memberCount === 1 ? "member" : "members"}</span>
            </div>
          </div>
        </div>
        <Badge variant="default" className="text-xs">
          Active
        </Badge>
      </div>

      {/* Members Avatars */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm border border-border">
          🏆
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="text-sm text-muted-foreground">
          Squad stats coming soon
        </div>
        <div className="text-xs text-primary font-medium hover:underline">
          View Squad →
        </div>
      </div>
    </Card>
  );
};
