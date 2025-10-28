import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COPY } from "@/lib/copy";

interface CreateSquadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateSquad: (name: string, emoji: string) => void;
}

const EMOJI_OPTIONS = [
  { value: "💪", label: "💪 Flex" },
  { value: "🎓", label: "🎓 Study" },
  { value: "🧘", label: "🧘 Focus" },
  { value: "🎮", label: "🎮 Gaming" },
  { value: "🔥", label: "🔥 Fire" },
  { value: "⚡", label: "⚡ Energy" },
  { value: "🎯", label: "🎯 Target" },
  { value: "🚀", label: "🚀 Launch" },
  { value: "🧠", label: "🧠 Brain" },
  { value: "👑", label: "👑 Crown" },
];

export const CreateSquadModal = ({
  open,
  onOpenChange,
  onCreateSquad,
}: CreateSquadModalProps) => {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("💪");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("Squad name is required");
      return;
    }

    if (name.trim().length > 30) {
      setError("Squad name must be less than 30 characters");
      return;
    }

    onCreateSquad(name.trim(), emoji);
    
    // Reset and close
    setName("");
    setEmoji("💪");
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{COPY.communities.createModal.title}</DialogTitle>
          <DialogDescription>
            {COPY.communities.createModal.description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Squad Name */}
          <div className="space-y-2">
            <Label htmlFor="squadName">
              {COPY.communities.createModal.nameLabel}
            </Label>
            <Input
              id="squadName"
              placeholder="e.g., Study Crew, Gym Bros"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              maxLength={30}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          {/* Emoji Picker */}
          <div className="space-y-2">
            <Label htmlFor="emoji">
              {COPY.communities.createModal.emojiLabel}
            </Label>
            <Select value={emoji} onValueChange={setEmoji}>
              <SelectTrigger id="emoji">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EMOJI_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            {COPY.communities.createModal.submitButton}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
