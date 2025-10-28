import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const RoastEngine = () => {
  const { toast } = useToast();

  return (
    <Card className="p-6 text-center">
      <div className="space-y-4">
        <div className="text-4xl">🔥</div>
        <h3 className="text-xl font-bold">Roast Engine</h3>
        <p className="text-sm text-muted-foreground">
          Get roasted based on your screen time performance.
        </p>
        <Button className="gap-2" onClick={() => toast({ title: "Coming in Phase 2" })}>
          <Flame className="w-4 h-4" />
          Generate Roast
        </Button>
      </div>
    </Card>
  );
};
