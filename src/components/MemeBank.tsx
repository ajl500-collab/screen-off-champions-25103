import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const memes = [
  { type: "emoji", content: "😅" },
  { type: "emoji", content: "🤡" },
  { type: "emoji", content: "💀" },
  { type: "emoji", content: "🔥" },
  { type: "emoji", content: "💯" },
  { type: "emoji", content: "😎" },
  { type: "emoji", content: "🚀" },
  { type: "emoji", content: "⚡" },
  { type: "gif", content: "https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif", label: "Success!" },
  { type: "gif", content: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif", label: "You got this" },
  { type: "gif", content: "https://media.giphy.com/media/111ebonMs90YLu/giphy.gif", label: "Oops" },
  { type: "gif", content: "https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif", label: "Mind blown" },
];

interface MemeBankProps {
  onMemeSelect?: (meme: string) => void;
}

const MemeBank = ({ onMemeSelect }: MemeBankProps) => {
  const [selectedMeme, setSelectedMeme] = useState<string | null>(null);

  const handleMemeClick = (content: string) => {
    setSelectedMeme(content);
    if (onMemeSelect) {
      onMemeSelect(content);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Meme Bank</h3>
        <span className="text-sm text-muted-foreground">{memes.length} items</span>
      </div>
      
      <ScrollArea className="h-[300px]">
        <div className="grid grid-cols-4 gap-3">
          {memes.map((meme, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="aspect-square p-2 hover:scale-105 transition-transform"
                  onClick={() => handleMemeClick(meme.content)}
                >
                  {meme.type === "emoji" ? (
                    <span className="text-4xl">{meme.content}</span>
                  ) : (
                    <img 
                      src={meme.content} 
                      alt={meme.label || "Meme"} 
                      className="w-full h-full object-cover rounded"
                    />
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>{meme.label || "Meme"}</DialogTitle>
                </DialogHeader>
                <div className="flex items-center justify-center p-4">
                  {meme.type === "emoji" ? (
                    <span className="text-9xl">{meme.content}</span>
                  ) : (
                    <img 
                      src={meme.content} 
                      alt={meme.label || "Meme"} 
                      className="max-w-full max-h-[60vh] object-contain rounded"
                    />
                  )}
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MemeBank;
