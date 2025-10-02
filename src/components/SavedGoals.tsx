import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GoalCard } from "./GoalCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

interface Goal {
  id: string;
  goal_text: string;
  ai_plan: string | null;
  is_favorite: boolean;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export const SavedGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchGoals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error("Error fetching goals:", error);
      toast({
        title: "Error",
        description: "Failed to load your goals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("goals-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_goals",
        },
        () => {
          fetchGoals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleToggleFavorite = async (id: string) => {
    const goal = goals.find((g) => g.id === id);
    if (!goal) return;

    const { error } = await supabase
      .from("user_goals")
      .update({ is_favorite: !goal.is_favorite })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update goal",
        variant: "destructive",
      });
    }
  };

  const handleToggleComplete = async (id: string) => {
    const goal = goals.find((g) => g.id === id);
    if (!goal) return;

    const { error } = await supabase
      .from("user_goals")
      .update({
        is_completed: !goal.is_completed,
        completed_at: !goal.is_completed ? new Date().toISOString() : null,
      })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update goal",
        variant: "destructive",
      });
    } else {
      toast({
        title: goal.is_completed ? "Goal reopened" : "Goal completed!",
        description: goal.is_completed ? "Keep working on it!" : "Great job achieving your goal!",
      });
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("user_goals").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete goal",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Goal deleted",
        description: "Your goal has been removed",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const activeGoals = goals.filter((g) => !g.is_completed);
  const completedGoals = goals.filter((g) => g.is_completed);
  const favoriteGoals = goals.filter((g) => g.is_favorite);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{goals.length}</div>
          <div className="text-sm text-muted-foreground">Total Goals</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">{completedGoals.length}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-500">{favoriteGoals.length}</div>
          <div className="text-sm text-muted-foreground">Favorites</div>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({goals.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeGoals.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedGoals.length})</TabsTrigger>
          <TabsTrigger value="favorites">Favorites ({favoriteGoals.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {goals.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No goals yet. Click "Set New Goal" to get started!
            </p>
          ) : (
            goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onToggleFavorite={handleToggleFavorite}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDelete}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4 mt-6">
          {activeGoals.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No active goals</p>
          ) : (
            activeGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onToggleFavorite={handleToggleFavorite}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDelete}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-6">
          {completedGoals.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No completed goals yet</p>
          ) : (
            completedGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onToggleFavorite={handleToggleFavorite}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDelete}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="favorites" className="space-y-4 mt-6">
          {favoriteGoals.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No favorite goals yet</p>
          ) : (
            favoriteGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onToggleFavorite={handleToggleFavorite}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDelete}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
