import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileImage, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const TRENDING_GIFS = [
  "https://media.giphy.com/media/111ebonMs90YLu/giphy.gif",
  "https://media.giphy.com/media/g9582DNuQppxC/giphy.gif",
  "https://media.giphy.com/media/kyLYXonQYYfwYDIeZl/giphy.gif",
  "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
  "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif",
  "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif",
];

interface GifPickerProps {
  onGifSelect: (url: string) => void;
}

const GifPicker = ({ onGifSelect }: GifPickerProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <FileImage className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" side="top">
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search GIFs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <ScrollArea className="h-64">
            <div className="grid grid-cols-2 gap-2">
              {TRENDING_GIFS.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => onGifSelect(url)}
                  className="rounded overflow-hidden hover:opacity-75 transition-opacity border border-border"
                >
                  <img src={url} alt={`GIF ${idx + 1}`} className="w-full h-32 object-cover" />
                </button>
              ))}
            </div>
          </ScrollArea>
          <p className="text-xs text-muted-foreground text-center">
            Powered by GIPHY (Search coming soon!)
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GifPicker;
