import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { memesCopy } from "../dashboard/copy";
import { Plus } from "lucide-react";

interface MemeUploadFormProps {
  onMemeAdded: (url: string, title: string) => void;
}

export const MemeUploadForm = ({ onMemeAdded }: MemeUploadFormProps) => {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const { toast } = useToast();

  const isValidUrl = (urlString: string): boolean => {
    if (!urlString.startsWith("https://")) return false;
    const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    return validExtensions.some((ext) => urlString.toLowerCase().includes(ext));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidUrl(url)) {
      toast({
        title: "Invalid URL",
        description: memesCopy.invalidUrl,
        variant: "destructive",
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: "Missing Title",
        description: "Please add a title for your meme.",
        variant: "destructive",
      });
      return;
    }

    onMemeAdded(url, title);
    setUrl("");
    setTitle("");
    
    toast({
      title: "Success",
      description: memesCopy.addSuccess,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add New Meme
        </CardTitle>
        <CardDescription>Add a meme to your personal collection</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meme-url">Image URL</Label>
            <Input
              id="meme-url"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Must start with https:// and end with .jpg, .png, or .webp
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meme-title">Title</Label>
            <Input
              id="meme-title"
              type="text"
              placeholder="e.g., Focus Mode"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={50}
              required
            />
            <p className="text-xs text-muted-foreground">
              {title.length}/50 characters
            </p>
          </div>

          <Button type="submit" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Meme
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
