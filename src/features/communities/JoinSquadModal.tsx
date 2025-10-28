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
  onJoinSquad: (inviteCode: string) => Promise<boolean>;
}

export const JoinSquadModal = ({
  open,
  onOpenChange,
  onJoinSquad,
}: JoinSquadModalProps) => {
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inviteCode.trim()) {
      setError("Invite code is required");
      return;
    }

    // Extract code from link if they paste a full link
    let codeToUse = inviteCode.trim();
    if (codeToUse.includes("/join/")) {
      codeToUse = codeToUse.split("/join/")[1];
    }

    const success = await onJoinSquad(codeToUse);
    
    if (success) {
      // Reset and close
      setInviteCode("");
      setError("");
      onOpenChange(false);
    } else {
      setError("Invalid invite code — double-check and try again.");
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
          {/* Invite Code Input */}
          <div className="space-y-2">
            <Label htmlFor="inviteCode">
              Invite Code or Link
            </Label>
            <Input
              id="inviteCode"
              placeholder="e.g. ABC123XYZ or paste full link"
              value={inviteCode}
              onChange={(e) => {
                setInviteCode(e.target.value);
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
            Join Squad
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
