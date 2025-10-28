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
import { COPY } from "@/lib/copy";

interface JoinSquadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoinSquad: (inviteLink: string) => boolean;
}

export const JoinSquadModal = ({
  open,
  onOpenChange,
  onJoinSquad,
}: JoinSquadModalProps) => {
  const [inviteLink, setInviteLink] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inviteLink.trim()) {
      setError("Invite link is required");
      return;
    }

    if (!inviteLink.includes("/join/")) {
      setError("Invalid link — double-check and try again.");
      return;
    }

    const success = onJoinSquad(inviteLink.trim());
    
    if (success) {
      // Reset and close
      setInviteLink("");
      setError("");
      onOpenChange(false);
    } else {
      setError("Invalid link — double-check and try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{COPY.communities.joinModal.title}</DialogTitle>
          <DialogDescription>
            {COPY.communities.joinModal.description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Invite Link Input */}
          <div className="space-y-2">
            <Label htmlFor="inviteLink">
              {COPY.communities.joinModal.linkLabel}
            </Label>
            <Input
              id="inviteLink"
              placeholder="https://screenvs.app/join/squad-XYZ"
              value={inviteLink}
              onChange={(e) => {
                setInviteLink(e.target.value);
                setError("");
              }}
              className={error ? "border-destructive" : ""}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            {COPY.communities.joinModal.submitButton}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
