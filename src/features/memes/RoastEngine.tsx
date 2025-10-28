import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { mockMemesData, mockDashboardData } from "../dashboard/mockData";
import { memesCopy } from "../dashboard/copy";
import { Flame, Copy, Send } from "lucide-react";

export const RoastEngine = () => {
  const [selectedMemeId, setSelectedMemeId] = useState<string>("");
  const [targetName, setTargetName] = useState("");
  const [generatedRoast, setGeneratedRoast] = useState<{
    meme: string;
    text: string;
  } | null>(null);
  const { toast } = useToast();

  const allMemes = [...mockMemesData.userMemes, ...mockMemesData.communityMemes];
  const selectedMeme = allMemes.find((m) => m.id.toString() === selectedMemeId);

  const generateRoast = () => {
    if (!selectedMeme || !targetName.trim()) {
      toast({
        title: "Missing Info",
        description: "Please select a meme and enter a name.",
        variant: "destructive",
      });
      return;
    }

    // Get random template
    const randomTemplate =
      mockMemesData.roastTemplates[
        Math.floor(Math.random() * mockMemesData.roastTemplates.length)
      ];

    // Replace placeholders
    let roastText = randomTemplate.template
      .replace("{name}", targetName)
      .replace("{delta}", Math.abs(mockDashboardData.efficiency.deltaVsYesterday).toString())
      .replace("{hours}", Math.floor(mockDashboardData.today.unproductiveMins / 60).toString());

    setGeneratedRoast({
      meme: selectedMeme.url,
      text: roastText,
    });

    toast({
      title: "Roast Generated",
      description: memesCopy.roastGenerated,
    });
  };

  const copyRoast = async () => {
    if (!generatedRoast) return;

    try {
      await navigator.clipboard.writeText(
        `${generatedRoast.text}\n\nMeme: ${generatedRoast.meme}`
      );
      toast({
        title: "Copied!",
        description: memesCopy.copySuccess,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const sendRoast = () => {
    if (!generatedRoast) return;

    // Mock send functionality
    toast({
      title: "Sent!",
      description: memesCopy.sendSuccess,
    });
  };

  return (
    <div className="space-y-6">
      {/* Generator Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-primary" />
            Roast Preview 🔥
          </CardTitle>
          <CardDescription>
            Combine meme + stats for safe, funny roasts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meme-select">Select Meme</Label>
            <Select value={selectedMemeId} onValueChange={setSelectedMemeId}>
              <SelectTrigger id="meme-select" className="bg-background">
                <SelectValue placeholder="Choose a meme..." />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {allMemes.map((meme) => (
                  <SelectItem key={meme.id} value={meme.id.toString()}>
                    {meme.title} {meme.isCommunity ? "(Community)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-name">Target Name</Label>
            <Input
              id="target-name"
              type="text"
              placeholder="e.g., Alex"
              value={targetName}
              onChange={(e) => setTargetName(e.target.value)}
              maxLength={30}
            />
          </div>

          <Button onClick={generateRoast} className="w-full" size="lg">
            <Flame className="w-4 h-4 mr-2" />
            Generate Roast
          </Button>
        </CardContent>
      </Card>

      {/* Generated Roast Preview */}
      {generatedRoast && (
        <Card className="overflow-hidden animate-fade-in border-primary/20">
          <div className="aspect-video bg-muted relative overflow-hidden">
            <img
              src={generatedRoast.meme}
              alt="Roast meme"
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="pt-6 space-y-4">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-lg font-medium text-center">{generatedRoast.text}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button onClick={copyRoast} variant="outline" className="w-full">
                <Copy className="w-4 h-4 mr-2" />
                Copy Roast
              </Button>
              <Button onClick={sendRoast} className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Send (Mock)
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
