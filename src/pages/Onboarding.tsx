import { useState } from "react";
import { WelcomeScreen } from "@/features/onboarding/WelcomeScreen";
import { ConnectScreen } from "@/features/onboarding/ConnectScreen";
import { SquadSetupScreen } from "@/features/onboarding/SquadSetupScreen";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "@/features/onboarding/OnboardingContext";

type OnboardingStep = 'welcome' | 'connect' | 'squad';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const navigate = useNavigate();
  const { completeOnboarding } = useOnboarding();

  const handleSkip = () => {
    completeOnboarding();
    navigate('/dashboard');
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background to-background/50">
      {/* Skip Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSkip}
        className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground"
      >
        Skip intro
      </Button>

      {/* Step Content */}
      {currentStep === 'welcome' && (
        <WelcomeScreen onNext={() => setCurrentStep('connect')} />
      )}
      {currentStep === 'connect' && (
        <ConnectScreen onNext={() => setCurrentStep('squad')} />
      )}
      {currentStep === 'squad' && (
        <SquadSetupScreen />
      )}
    </div>
  );
};

export default Onboarding;
