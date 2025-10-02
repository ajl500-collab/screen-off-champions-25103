import { Smartphone, Bell, Target, Coffee, Moon, Pocket } from "lucide-react";

const tips = [
  {
    icon: Bell,
    title: "Silence the Noise",
    tip: "Turn off non-essential notifications. Studies show this reduces phone checks by 40%.",
  },
  {
    icon: Target,
    title: "Set Daily Limits",
    tip: "Use screen time limits for addictive apps. Start with your biggest time sink.",
  },
  {
    icon: Smartphone,
    title: "Grayscale Mode",
    tip: "Enable grayscale display. Makes your phone less visually appealing and addictive.",
  },
  {
    icon: Coffee,
    title: "Phone-Free Mornings",
    tip: "Don't check your phone for the first hour after waking. Game-changer for productivity.",
  },
  {
    icon: Moon,
    title: "Night Mode Boundaries",
    tip: "Set a hard cutoff time for phone use. No screens 1 hour before bed improves sleep quality by 35%.",
  },
  {
    icon: Pocket,
    title: "Out of Sight, Out of Mind",
    tip: "Keep your phone in another room while working. Physical distance is the ultimate focus hack.",
  },
];

const Tips = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Quick <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Pro Tips</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Science-backed strategies to help you dominate the leaderboard and actually reduce screen time.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tips.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                
                <h3 className="text-lg font-bold mb-2">
                  {item.title}
                </h3>
                
                <p className="text-sm text-muted-foreground">
                  {item.tip}
                </p>
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Want more personalized tips based on your usage?
          </p>
          <button 
            onClick={() => window.location.href = "/auth"}
            className="text-primary font-semibold hover:underline"
          >
            Join now to unlock AI-powered insights →
          </button>
        </div>
      </div>
    </section>
  );
};

export default Tips;
