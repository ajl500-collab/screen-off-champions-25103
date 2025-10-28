import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Squad } from "@/features/dashboard/mockData";
import { Users, TrendingUp } from "lucide-react";

interface SquadCardProps {
  squad: Squad;
}

export const SquadCard = ({ squad }: SquadCardProps) => {
  const displayMembers = squad.members.slice(0, 4);
  const remainingCount = squad.members.length - 4;

  return (
    <Card className="p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-border hover:border-primary/30 cursor-pointer group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{squad.emoji}</div>
          <div>
            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
              {squad.name}
            </h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>{squad.members.length} members</span>
            </div>
          </div>
        </div>
        {squad.members.length > 0 && squad.members[0].efficiency >= 85 && (
          <Badge variant="default" className="text-xs">
            👑 Leader
          </Badge>
        )}
      </div>

      {/* Members Avatars */}
      <div className="flex items-center gap-2 mb-4">
        {displayMembers.map((member, idx) => (
          <div
            key={idx}
            className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm border border-border"
            title={member.name}
          >
            {member.avatarUrl}
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground border border-border">
            +{remainingCount}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            {squad.averageEfficiency}%
          </span>
          <span className="text-xs text-muted-foreground">avg</span>
        </div>
        <div className="text-xs text-primary font-medium hover:underline">
          View Squad →
        </div>
      </div>
    </Card>
  );
};
