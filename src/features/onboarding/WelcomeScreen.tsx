import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  onNext: () => void;
}

export const WelcomeScreen = ({ onNext }: WelcomeScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 animate-fade-in">
      <div className="max-w-2xl w-full space-y-8 text-center">
        {/* Logo Animation */}
        <div className="animate-scale-in">
          <img 
            src="/src/assets/screen-vs-logo.png" 
            alt="ScreenVS" 
            className="h-20 mx-auto mb-6"
          />
        </div>

        {/* Main Heading */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            You vs Your Screen
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            Track time. Compete. Win—or get roasted.
          </p>
        </div>

        {/* Icon Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          <div className="p-6 rounded-lg bg-card border border-border hover-lift transition-all duration-300">
            <div className="text-4xl mb-3">⏱️</div>
            <h3 className="font-semibold text-lg mb-2">Track Automatically</h3>
            <p className="text-sm text-muted-foreground">
              No manual entry needed
            </p>
          </div>

          <div className="p-6 rounded-lg bg-card border border-border hover-lift transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="text-4xl mb-3">⚔️</div>
            <h3 className="font-semibold text-lg mb-2">Compete Weekly</h3>
            <p className="text-sm text-muted-foreground">
              Solos, duos, or squads
            </p>
          </div>

          <div className="p-6 rounded-lg bg-card border border-border hover-lift transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-4xl mb-3">🏆</div>
            <h3 className="font-semibold text-lg mb-2">Win Glory</h3>
            <p className="text-sm text-muted-foreground">
              Climb the leaderboard
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-8">
          <Button 
            size="lg" 
            onClick={onNext}
            className="hover-lift text-lg px-12 py-6 h-auto"
          >
            Let's Go
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Takes less than a minute
          </p>
        </div>
      </div>
    </div>
  );
};
