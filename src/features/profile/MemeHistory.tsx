import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { mockProfileData } from "../dashboard/mockData";
import { profileCopy } from "../dashboard/copy";
import { ImageIcon } from "lucide-react";

export const MemeHistory = () => {
  const [selectedMeme, setSelectedMeme] = useState<number | null>(null);

  if (mockProfileData.memes.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            {profileCopy.emptyMemes}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🖼️</span>
            Meme History
          </CardTitle>
          <CardDescription>Your roast collection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockProfileData.memes.slice(0, 3).map((meme) => (
              <button
                key={meme.id}
                onClick={() => setSelectedMeme(meme.id)}
                className="w-full text-left p-3 rounded-lg bg-card/50 hover:bg-card border border-border/50 hover:border-primary/30 transition-all duration-200 hover:shadow-md group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm group-hover:text-primary transition-colors">
                      {meme.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {meme.date}
                    </div>
                  </div>
                  <ImageIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={selectedMeme !== null} onOpenChange={() => setSelectedMeme(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {mockProfileData.memes.find((m) => m.id === selectedMeme)?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center border border-border/50">
            <p className="text-4xl">🎭</p>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Mock meme preview - coming soon
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
};
