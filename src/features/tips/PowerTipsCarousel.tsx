import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PowerTipCard, type PowerTip } from "./PowerTipCard";
import { useToast } from "@/hooks/use-toast";

const defaultTips: PowerTip[] = [
  { id: 1, title: "Grayscale Mode", oneLiner: "Make your screen less addictive.", tried: false, actionLabel: "Enable", actionType: "link", actionData: "https://support.apple.com/en-us/HT208180" },
  { id: 2, title: "Notification Triage", oneLiner: "Silence low-priority apps.", tried: false, actionLabel: "Learn How", actionType: "link", actionData: "https://support.apple.com/en-us/HT201925" },
];

export const PowerTipsCarousel = () => {
  const [tips, setTips] = useState<PowerTip[]>(defaultTips);
  const { toast } = useToast();

  const handleTipAction = (tip: PowerTip) => {
    if (tip.actionType === "link" && tip.actionData) {
      window.open(tip.actionData, "_blank");
    }
    setTips(prev => prev.map(t => t.id === tip.id ? {...t, tried: true} : t));
    toast({ title: "Tip unlocked!" });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Power Tips</h3>
      <div className="grid gap-4">
        {tips.map(tip => <PowerTipCard key={tip.id} tip={tip} onAction={handleTipAction} />)}
      </div>
    </div>
  );
};
