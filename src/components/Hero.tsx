import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-[120px] animate-float" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-block">
              <span className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
                🏆 Join the Competition
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Turn Screen Time Into
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-glow">
                Epic Competition
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Compete with your squad to spend less time on your phone. 
              Weekly battles, live leaderboards, and bragging rights. 
              Losers get roasted. Winners get glory.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-primary/20 transition-all">
                Start Competing
              </Button>
              <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/10 font-semibold px-8 py-6 text-lg rounded-xl">
                How It Works
              </Button>
            </div>
            
            <div className="flex items-center gap-8 justify-center lg:justify-start text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-muted-foreground">1,247 Active Players</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-muted-foreground">83 Teams Battling</span>
              </div>
            </div>
          </div>
          
          {/* Hero image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-primary/20 shadow-2xl">
              <img 
                src={heroImage} 
                alt="Screen time competition platform"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
            
            {/* Floating stat cards */}
            <div className="absolute -bottom-6 -left-6 bg-card border border-primary/20 rounded-xl p-4 shadow-xl backdrop-blur-sm">
              <div className="text-sm text-muted-foreground">This Week's Winner</div>
              <div className="text-2xl font-bold text-success">-64% Screen Time</div>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-card border border-destructive/20 rounded-xl p-4 shadow-xl backdrop-blur-sm">
              <div className="text-sm text-muted-foreground">Last Place Gets</div>
              <div className="text-2xl font-bold text-destructive">🤡 Roasted</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
