import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SquadCard } from "./SquadCard";
import { CreateSquadModal } from "./CreateSquadModal";
import { JoinSquadModal } from "./JoinSquadModal";
import { mockSquadsData, Squad } from "@/features/dashboard/mockData";
import { useToast } from "@/hooks/use-toast";
import { useConfetti } from "@/hooks/useConfetti";
import { COPY } from "@/lib/copy";
import { Plus, Link } from "lucide-react";

export const CommunitiesPage = () => {
  const { toast } = useToast();
  const { celebrate } = useConfetti();
  const [squads, setSquads] = useState<Squad[]>(() => {
    const saved = localStorage.getItem("screenVsSquads");
    return saved ? JSON.parse(saved) : mockSquadsData.squads;
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const handleCreateSquad = (name: string, emoji: string) => {
    const newSquad: Squad = {
      id: `squad-${Date.now()}`,
      name,
      emoji,
      members: [
        { name: "You", avatarUrl: "🏆", efficiency: 76 }
      ],
      averageEfficiency: 76,
    };

    const updatedSquads = [...squads, newSquad];
    setSquads(updatedSquads);
    localStorage.setItem("screenVsSquads", JSON.stringify(updatedSquads));
    
    celebrate();
    toast({
      title: COPY.communities.createSuccess.title,
      description: COPY.communities.createSuccess.description,
    });
    
    // Mock copy invite link
    navigator.clipboard.writeText(`https://screenvs.app/join/${newSquad.id}`).catch(() => {});
  };

  const handleJoinSquad = (inviteLink: string) => {
    // Extract squad ID from link
    const match = inviteLink.match(/\/join\/(.+)$/);
    if (!match) {
      return false;
    }

    // Mock squad data based on invite
    const mockNewSquad: Squad = {
      id: match[1],
      name: "New Squad",
      emoji: "🎯",
      members: [
        { name: "You", avatarUrl: "🏆", efficiency: 76 },
        { name: "Sarah", avatarUrl: "⚡", efficiency: 82 },
      ],
      averageEfficiency: 79,
    };

    const updatedSquads = [...squads, mockNewSquad];
    setSquads(updatedSquads);
    localStorage.setItem("screenVsSquads", JSON.stringify(updatedSquads));

    celebrate();
    toast({
      title: COPY.communities.joinSuccess.title,
      description: COPY.communities.joinSuccess.description,
    });

    return true;
  };

  const handleQuickJoin = (name: string, emoji: string) => {
    const newSquad: Squad = {
      id: `squad-${Date.now()}`,
      name,
      emoji,
      members: [
        { name: "You", avatarUrl: "🏆", efficiency: 76 },
        { name: "Alex", avatarUrl: "🎯", efficiency: 73 },
      ],
      averageEfficiency: 74,
    };

    const updatedSquads = [...squads, newSquad];
    setSquads(updatedSquads);
    localStorage.setItem("screenVsSquads", JSON.stringify(updatedSquads));

    celebrate();
    toast({
      title: COPY.communities.quickJoinSuccess.title,
      description: COPY.communities.quickJoinSuccess.description(name),
    });
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
              onClick={() => setIsJoinModalOpen(true)}
              className="gap-2"
            >
              <Link className="w-4 h-4" />
              <span className="hidden sm:inline">Join</span>
            </Button>
            <Button
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {squads.length === 0 ? (
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
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreateSquad={handleCreateSquad}
      />
      <JoinSquadModal
        open={isJoinModalOpen}
        onOpenChange={setIsJoinModalOpen}
        onJoinSquad={handleJoinSquad}
      />
    </div>
  );
};
