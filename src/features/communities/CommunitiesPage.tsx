import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateSquadModal } from "./CreateSquadModal";
import { JoinSquadModal } from "./JoinSquadModal";
import { SquadCard } from "./SquadCard";
import { useSquads } from "@/lib/data/queries";
import { createSquad as createSquadMutation, joinSquad as joinSquadMutation } from "@/lib/data/mutations";
import { useQueryClient } from "@tanstack/react-query";
import { useConfetti } from "@/hooks/useConfetti";
import { toast } from "sonner";
import { COPY } from "@/lib/copy";
import { Plus, Link } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export const CommunitiesPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const { celebrate } = useConfetti();
  const queryClient = useQueryClient();
  const { data: squads = [], isLoading } = useSquads();

  const handleCreateSquad = async (name: string, emoji: string) => {
    try {
      const squad = await createSquadMutation(name, emoji);
      await queryClient.invalidateQueries({ queryKey: ["squads"] });

      // Copy full invite LINK (not just code)
      const inviteCode = squad.invite_code;
      if (inviteCode) {
        const inviteLink = `${window.location.origin}/join?code=${inviteCode}`;
        await navigator.clipboard.writeText(inviteLink);
        toast.success(`Squad created! Invite link copied to clipboard`);
        trackEvent("invite_copied", { squad_name: name });
      } else {
        toast.success(COPY.communities.toasts.created);
      }

      trackEvent("squad_created", { squad_name: name, emoji });
      celebrate();
      setShowCreateModal(false);
    } catch (error) {
      toast.error("Failed to create squad");
      console.error(error);
    }
  };

  const handleJoinSquad = async (inviteCode: string): Promise<boolean> => {
    try {
      await joinSquadMutation(inviteCode);
      await queryClient.invalidateQueries({ queryKey: ["squads"] });

      trackEvent("squad_joined", { invite_code: inviteCode });
      celebrate();
      toast.success("Successfully joined squad!");
      setShowJoinModal(false);
      return true;
    } catch (error: any) {
      if (error.message.includes("Already a member")) {
        toast.error("You're already in this squad");
      } else if (error.message.includes("Invalid invite code")) {
        toast.error("Invalid invite code - please check and try again");
      } else {
        toast.error("Failed to join squad");
      }
      console.error(error);
      return false;
    }
  };

  const handleQuickJoin = async (name: string, emoji: string) => {
    await handleCreateSquad(name, emoji);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {COPY.communities.header.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {COPY.communities.header.subtitle}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowJoinModal(true)}
              className="gap-2"
            >
              <Link className="w-4 h-4" />
              <span className="hidden sm:inline">Join</span>
            </Button>
            <Button
              size="sm"
              onClick={() => setShowCreateModal(true)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading squads...</p>
          </div>
        ) : squads.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏝️</div>
            <h2 className="text-2xl font-bold mb-2 text-foreground">
              {COPY.communities.empty.title}
            </h2>
            <p className="text-muted-foreground mb-8">
              {COPY.communities.empty.subtitle}
            </p>

            {/* Quick Join Suggestions */}
            <div className="max-w-md mx-auto space-y-3">
              <p className="text-sm font-semibold text-foreground mb-4">
                {COPY.communities.empty.suggestionsTitle}
              </p>
              {COPY.communities.suggestions.map((suggestion) => (
                <Button
                  key={suggestion.name}
                  variant="outline"
                  className="w-full justify-start gap-3 h-auto py-3"
                  onClick={() => handleQuickJoin(suggestion.name, suggestion.emoji)}
                >
                  <span className="text-2xl">{suggestion.emoji}</span>
                  <span className="font-medium">{suggestion.name}</span>
                </Button>
              ))}
            </div>
          </div>
        ) : (
          /* Active Squads Grid */
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              {COPY.communities.activeSquads}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {squads.map((squad) => (
                <SquadCard key={squad.id} squad={squad} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateSquadModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreateSquad={handleCreateSquad}
      />
      <JoinSquadModal
        open={showJoinModal}
        onOpenChange={setShowJoinModal}
        onJoinSquad={handleJoinSquad}
      />
    </div>
  );
};
