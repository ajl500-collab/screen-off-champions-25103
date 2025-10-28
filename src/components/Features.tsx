import { Trophy, Users, TrendingDown, Zap } from "lucide-react";
import { COPY } from "@/lib/copy";

const features = [
  {
    icon: Users,
    title: COPY.features.squadUp.title,
    description: COPY.features.squadUp.description,
    gradient: "from-primary to-accent"
  },
  {
    icon: TrendingDown,
    title: COPY.features.autoTrack.title,
    description: COPY.features.autoTrack.description,
    gradient: "from-accent to-primary"
  },
  {
    icon: Trophy,
    title: COPY.features.winGlory.title,
    description: COPY.features.winGlory.description,
    gradient: "from-success to-primary"
  },
  {
    icon: Zap,
    title: COPY.features.losersRoasted.title,
    description: COPY.features.losersRoasted.description,
    gradient: "from-destructive to-accent"
  }
];

const Features = () => {
  return (
    <section className="py-24 relative bg-background" id="how-it-works">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 right-10 w-64 h-64 bg-success rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-destructive rounded-full blur-[100px] animate-float" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple, automatic, and addictively competitive. Screen time reduction has never been this fun.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="group relative bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover-lift"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
