import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOnboarding } from "./OnboardingContext";
import { useNavigate } from "react-router-dom";
import { useConfetti } from "@/hooks/useConfetti";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ConfettiExplosion from 'react-confetti-explosion';

export const SquadSetupScreen = () => {
  const { setSquadName, setSquadMode, completeOnboarding, squadName: savedSquadName } = useOnboarding();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isExploding, celebrate } = useConfetti();
  const [squadName, setLocalSquadName] = useState(savedSquadName || '');
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const generateInviteLink = () => {
    const mockLink = `https://screenvs.app/invite/${Math.random().toString(36).substring(7)}`;
    return mockLink;
  };

  const handleCopyInvite = () => {
    const link = generateInviteLink();
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast({
      title: "Invite link copied!",
      description: "Share it with your squad to start competing.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartSolo = () => {
    setSquadMode('solo');
    if (squadName) {
      setSquadName(squadName);
    }
    completeOnboarding();
    setShowConfetti(true);
    celebrate();
    
    setTimeout(() => {
      toast({
        title: "🎉 Week 1 starts now!",
        description: "Ready to compete? Let's see how you do.",
      });
      navigate('/dashboard');
    }, 1500);
  };

  const handleInviteFriends = () => {
    if (squadName) {
      setSquadName(squadName);
      setSquadMode('squad');
    }
    handleCopyInvite();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 animate-fade-in">
      {showConfetti && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <ConfettiExplosion
            force={0.6}
            duration={2500}
            particleCount={80}
            width={1000}
          />
        </div>
      )}

      <div className="max-w-md w-full space-y-8 text-center">
        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mb-8">
          <div className="h-1.5 w-12 bg-primary rounded-full" />
          <div className="h-1.5 w-12 bg-primary rounded-full" />
          <div className="h-1.5 w-12 bg-primary rounded-full" />
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h2 className="text-4xl font-bold">Form your squad</h2>
          <p className="text-muted-foreground">
            You'll compete for lowest screen time this week. Invite friends or jump in solo.
          </p>
        </div>

        {/* Squad Name Input */}
        <div className="space-y-2 text-left pt-6">
          <label className="text-sm font-medium">
            Squad Name (optional)
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Study Squad 📚"
              value={squadName}
              onChange={(e) => setLocalSquadName(e.target.value)}
              className="text-lg h-12"
              maxLength={30}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Add an emoji to make it memorable
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-6">
          <Button 
            size="lg" 
            onClick={handleInviteFriends}
            variant="outline"
            className="w-full hover-lift text-lg h-14 gap-2"
          >
            {copied ? (
              <>
                <Check className="h-5 w-5" />
                Link Copied!
              </>
            ) : (
              <>
                <Copy className="h-5 w-5" />
                Invite Friends
              </>
            )}
          </Button>

          <Button 
            size="lg" 
            onClick={handleStartSolo}
            className="w-full hover-lift text-lg h-14"
          >
            Start Solo
          </Button>
        </div>

        {/* Info Note */}
        <p className="text-xs text-muted-foreground pt-4">
          Squads reset weekly for new matchups
        </p>
      </div>
    </div>
  );
};
