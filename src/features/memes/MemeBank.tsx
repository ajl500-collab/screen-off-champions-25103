import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MemeItem {
  id: number;
  url: string;
  title: string;
  isCommunity?: boolean;
}

// Mock memes - will be replaced with real data in Phase 2
const mockUserMemes: MemeItem[] = [
  { id: 1, url: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400", title: "Focus Mode" },
  { id: 2, url: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400", title: "Infinite Scroll" },
  { id: 3, url: "https://images.unsplash.com/photo-1588421357574-87938a86fa28?w=400", title: "Notification Hell" },
];

export const MemeBank = () => {
  const [userMemes, setUserMemes] = useState<MemeItem[]>(mockUserMemes);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const handleDeleteMeme = (id: number) => {
    setUserMemes(userMemes.filter((meme) => meme.id !== id));
    toast({
      title: "Deleted",
      description: "Meme removed from your collection.",
    });
  };

  const handleImageError = (id: number) => {
    setImageErrors(new Set(imageErrors).add(id));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Meme Bank</h3>
        <span className="text-sm text-muted-foreground">{userMemes.length} items</span>
      </div>

      {userMemes.length === 0 ? (
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No memes yet. Add your first meme!</p>
        </CardContent>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {userMemes.map((meme) => (
            <Card
              key={meme.id}
              className="overflow-hidden group hover:shadow-lg transition-all duration-300"
            >
              <div className="aspect-square bg-muted relative overflow-hidden">
                {imageErrors.has(meme.id) ? (
                  <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
                    <AlertCircle className="w-12 h-12 text-destructive" />
                    <p className="text-xs text-muted-foreground">Image failed to load</p>
                  </div>
                ) : (
                  <img
                    src={meme.url}
                    alt={meme.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={() => handleImageError(meme.id)}
                    loading="lazy"
                  />
                )}
              </div>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-sm truncate flex-1">{meme.title}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteMeme(meme.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-4 text-center">
        Meme uploads coming in Phase 2
      </p>
    </Card>
  );
};
