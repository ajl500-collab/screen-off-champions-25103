import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "./OnboardingContext";
import { CheckCircle2, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ConnectScreenProps {
  onNext: () => void;
}

export const ConnectScreen = ({ onNext }: ConnectScreenProps) => {
  const { setScreenTimeConnected, setDemoMode } = useOnboarding();
  const [connected, setConnected] = useState(false);

  const handleConnect = () => {
    setConnected(true);
    setScreenTimeConnected(true);
    setDemoMode(false);
    setTimeout(() => {
      onNext();
    }, 800);
  };

  const handleDemo = () => {
    setDemoMode(true);
    setScreenTimeConnected(false);
    onNext();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 animate-fade-in">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mb-8">
          <div className="h-1.5 w-12 bg-primary rounded-full" />
          <div className="h-1.5 w-12 bg-primary rounded-full" />
          <div className="h-1.5 w-12 bg-muted rounded-full" />
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h2 className="text-4xl font-bold">Sync your screen time</h2>
          <p className="text-muted-foreground">
            We use Apple Shortcuts to pull your screen-time data. You can connect now or use demo mode to test.
          </p>
        </div>

        {/* Connection Status */}
        {connected && (
          <div className="flex items-center justify-center gap-2 text-green-600 animate-scale-in">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">Connected</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4 pt-6">
          <Button 
            size="lg" 
            onClick={handleConnect}
            disabled={connected}
            className="w-full hover-lift text-lg h-14"
          >
            {connected ? "✅ Connected" : "Connect via Apple Shortcuts"}
          </Button>

          <Button 
            size="lg" 
            variant="outline"
            onClick={handleDemo}
            className="w-full hover-lift text-lg h-14"
          >
            Skip for now (demo mode)
          </Button>
        </div>

        {/* Tooltip */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                <Info className="h-4 w-4" />
                <span>You can link later in Settings → Sync</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                Don't worry, you can always connect your Apple Shortcuts later from the settings page.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Status Bar */}
        <div className="pt-8">
          <div className="text-xs text-muted-foreground">
            {connected ? "1 of 1 connected" : "0 of 1 connected"}
          </div>
        </div>
      </div>
    </div>
  );
};
