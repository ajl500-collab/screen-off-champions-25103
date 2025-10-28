import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export interface PowerTip {
  id: number;
  title: string;
  oneLiner: string;
  tried: boolean;
  actionLabel: string;
  actionType: "link" | "toast" | "tooltip";
  actionData?: string;
}

interface PowerTipCardProps {
  tip: PowerTip;
  onAction: (tip: PowerTip) => void;
}

export const PowerTipCard = ({ tip, onAction }: PowerTipCardProps) => {
  const { toast } = useToast();
  
  return (
    <div className={`p-6 rounded-xl border ${tip.tried ? "opacity-60" : ""}`}>
      <h4 className="font-bold mb-2">{tip.title}</h4>
      <p className="text-sm text-muted-foreground mb-4">{tip.oneLiner}</p>
      <Button onClick={() => onAction(tip)} disabled={tip.tried} size="sm">
        {tip.tried ? "Done ✓" : tip.actionLabel}
      </Button>
    </div>
  );
};
