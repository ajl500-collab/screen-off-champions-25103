import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

// Mock memes - will be replaced with real data in Phase 2
const mockMemes = [
  { id: 1, title: "Screen Time Surge 😂", date: "2 days ago" },
  { id: 2, title: "Scroll King 👑", date: "1 week ago" },
  { id: 3, title: "Notification Ninja 🥷", date: "2 weeks ago" },
];

export const MemeHistory = () => {
  if (mockMemes.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">No roasts yet.</p>
          <p className="text-xs text-muted-foreground">
            Your friends will start roasting you when you slip up.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">
        Recent Roasts
      </h3>
      <div className="space-y-3">
        {mockMemes.slice(0, 3).map((meme) => (
          <div
            key={meme.id}
            className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/30 transition-colors"
          >
            <div>
              <p className="text-sm font-medium">{meme.title}</p>
              <p className="text-xs text-muted-foreground">{meme.date}</p>
            </div>
            <Button variant="ghost" size="sm" className="gap-2">
              <Eye className="w-4 h-4" />
              View
            </Button>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-4 text-center">
        Meme history coming in Phase 2
      </p>
    </Card>
  );
};
