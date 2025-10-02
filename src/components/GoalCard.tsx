import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Trash2, CheckCircle2, Circle } from "lucide-react";
import { format } from "date-fns";

interface GoalCardProps {
  goal: {
    id: string;
    goal_text: string;
    ai_plan: string | null;
    is_favorite: boolean;
    is_completed: boolean;
    completed_at: string | null;
    created_at: string;
  };
  onToggleFavorite: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export const GoalCard = ({ goal, onToggleFavorite, onToggleComplete, onDelete }: GoalCardProps) => {
  return (
    <Card className={`transition-all ${goal.is_completed ? 'opacity-75' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className={`text-lg ${goal.is_completed ? 'line-through text-muted-foreground' : ''}`}>
              {goal.goal_text}
            </CardTitle>
            <div className="flex gap-2 mt-2">
              {goal.is_favorite && (
                <Badge variant="secondary" className="gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  Favorite
                </Badge>
              )}
              {goal.is_completed && (
                <Badge variant="outline" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Completed
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleFavorite(goal.id)}
              className="shrink-0"
            >
              <Star className={`h-4 w-4 ${goal.is_favorite ? 'fill-current text-yellow-500' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleComplete(goal.id)}
              className="shrink-0"
            >
              {goal.is_completed ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <Circle className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(goal.id)}
              className="shrink-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {goal.ai_plan && (
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div className="text-sm whitespace-pre-wrap">{goal.ai_plan}</div>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            Created {format(new Date(goal.created_at), "MMM d, yyyy")}
            {goal.completed_at && (
              <> • Completed {format(new Date(goal.completed_at), "MMM d, yyyy")}</>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};
