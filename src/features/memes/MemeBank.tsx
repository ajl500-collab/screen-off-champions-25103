import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { mockMemesData, MemeItem } from "../dashboard/mockData";
import { memesCopy } from "../dashboard/copy";
import { MemeUploadForm } from "./MemeUploadForm";
import { Trash2, AlertCircle, Info } from "lucide-react";

export const MemeBank = () => {
  const [userMemes, setUserMemes] = useState<MemeItem[]>(mockMemesData.userMemes);
  const [useCommunityPool, setUseCommunityPool] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const displayedMemes = useCommunityPool
    ? [...userMemes, ...mockMemesData.communityMemes]
    : userMemes;

  const handleMemeAdded = (url: string, title: string) => {
    const newMeme: MemeItem = {
      id: Date.now(),
      url,
      title,
      isCommunity: false,
    };
    setUserMemes([...userMemes, newMeme]);
  };

  const handleDeleteMeme = (id: number) => {
    setUserMemes(userMemes.filter((meme) => meme.id !== id));
    toast({
      title: "Deleted",
      description: memesCopy.deleteSuccess,
    });
  };

  const handleImageError = (id: number) => {
    setImageErrors(new Set(imageErrors).add(id));
  };

  return (
    <div className="space-y-6">
      {/* Community Pool Toggle */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="community-pool" className="text-base cursor-pointer">
                Use Community Meme Pool
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">{memesCopy.communityToggleTooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Switch
              id="community-pool"
              checked={useCommunityPool}
              onCheckedChange={setUseCommunityPool}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add Meme Form */}
      <MemeUploadForm onMemeAdded={handleMemeAdded} />

      {/* Meme Grid */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">All Memes</TabsTrigger>
          <TabsTrigger value="my">My Memes</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {displayedMemes.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">{memesCopy.emptyUserMemes}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {displayedMemes.map((meme) => (
                <Card
                  key={meme.id}
                  className="overflow-hidden group hover:shadow-lg transition-all duration-300 animate-fade-in"
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
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{meme.title}</p>
                        {meme.isCommunity && (
                          <p className="text-xs text-primary mt-1">Community</p>
                        )}
                      </div>
                      {!meme.isCommunity && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteMeme(meme.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my" className="mt-6">
          {userMemes.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">{memesCopy.emptyUserMemes}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {userMemes.map((meme) => (
                <Card
                  key={meme.id}
                  className="overflow-hidden group hover:shadow-lg transition-all duration-300 animate-fade-in"
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
        </TabsContent>
      </Tabs>
    </div>
  );
};
