import { COPY } from "@/lib/copy";
import { Card } from "@/components/ui/card";

interface CoreLoopStripProps {
  className?: string;
}

export const CoreLoopStrip = ({ className = "" }: CoreLoopStripProps) => {
  return (
    <section className={`py-12 bg-card/50 border-y border-border ${className}`}>
      <div className="container mx-auto px-4">
        <h3 className="text-2xl font-bold text-center mb-8">
          {COPY.coreLoop.title}
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {COPY.coreLoop.steps.map((step, index) => (
            <Card 
              key={index}
              className="relative p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/10 group"
            >
              {/* Step number badge */}
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-lg group-hover:scale-110 transition-transform">
                {step.number}
              </div>
              
              {/* Emoji icon */}
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {step.emoji}
              </div>
              
              {/* Content */}
              <h4 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                {step.title}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
