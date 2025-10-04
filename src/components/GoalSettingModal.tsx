import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Sparkles } from "lucide-react";

interface GoalSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoalCreated: () => void;
  isPremium?: boolean;
}

const GoalSettingModal = ({ isOpen, onClose, onGoalCreated, isPremium = false }: GoalSettingModalProps) => {
  const [goalText, setGoalText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPlan, setAiPlan] = useState("");
  const { toast } = useToast();

  const generateAIPlan = async () => {
    if (!goalText.trim()) {
      toast({
        title: "Goal Required",
        description: "Please enter your goal first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-goal-plan", {
        body: { goal: goalText },
      });

      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message || "Failed to generate plan");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (!data?.plan) {
        throw new Error("No plan received from AI");
      }

      setAiPlan(data.plan);
      toast({
        title: "✨ Plan Generated",
        description: "Your AI-powered plan is ready!",
      });
    } catch (error: any) {
      console.error("Error generating plan:", error);
      
      const errorMessage = error.message?.includes("Authentication failed") 
        ? "AI service is temporarily unavailable. Please try again later."
        : error.message?.includes("Rate limit")
        ? "Too many requests. Please wait a moment and try again."
        : error.message || "Failed to generate AI plan. Please try again.";
      
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveGoal = async () => {
    if (!goalText.trim()) {
      toast({
        title: "Goal Required",
        description: "Please enter your goal",
        variant: "destructive",
      });
      return;
    }

    console.log("Attempting to save goal...");
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error("Auth error:", authError);
      toast({
        title: "Authentication Error",
        description: "Please sign in to save goals",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      console.error("No user found");
      toast({
        title: "Not Signed In",
        description: "Please sign in to save goals",
        variant: "destructive",
      });
      return;
    }

    console.log("User authenticated:", user.id);

    try {
      const goalData = {
        user_id: user.id,
        goal_text: goalText,
        ai_plan: aiPlan || null,
      };
      
      console.log("Inserting goal:", goalData);
      
      const { data, error } = await supabase.from("user_goals").insert([goalData]).select();

      if (error) {
        console.error("Database error:", error);
        toast({
          title: "Error",
          description: `Failed to save goal: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log("Goal saved successfully:", data);
      
      toast({
        title: "Goal Saved",
        description: "Your goal has been saved successfully!",
      });

      setGoalText("");
      setAiPlan("");
      onGoalCreated();
      onClose();
    } catch (error) {
      console.error("Error saving goal:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save goal",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Set Your Screen Time Goal</DialogTitle>
          <DialogDescription>
            Tell us what you want to achieve, and we'll help you get there
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Your Goal</label>
            <Textarea
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              placeholder="e.g., Reduce my screen time by 2 hours per day, spend less time on social media..."
              className="min-h-[100px]"
            />
          </div>

          <Button
            onClick={generateAIPlan}
            disabled={isGenerating || !goalText.trim()}
            className="w-full"
            variant="outline"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating AI Plan...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate AI-Powered Plan
              </>
            )}
          </Button>

          {aiPlan && (
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Your Personalized Plan
              </h3>
              <div className="text-sm whitespace-pre-wrap">{aiPlan}</div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={saveGoal} disabled={!goalText.trim()} className="flex-1">
              Save Goal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoalSettingModal;
