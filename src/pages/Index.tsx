import { useNavigate } from "react-router-dom";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import EfficiencyInsights from "@/components/EfficiencyInsights";
import Tips from "@/components/Tips";
import CTA from "@/components/CTA";
import Header from "@/components/Header";
import { CoreLoopStrip } from "@/components/CoreLoopStrip";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { COPY } from "@/lib/copy";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      
      {/* Core Loop Strip */}
      <CoreLoopStrip />
      
      {/* Quick Access to App */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container mx-auto px-4 text-center">
          <Button 
            size="lg" 
            onClick={() => navigate("/dashboard")}
            className="text-lg px-8 hover-lift"
          >
            Open App <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      <Features />
      <EfficiencyInsights />
      <Tips />
      <CTA />
      
      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-1">Screen<span className="italic">VS</span></h3>
              <p className="text-sm text-muted-foreground">{COPY.footer.tagline}</p>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <button onClick={() => navigate("/privacy")} className="hover:text-primary transition-colors">Privacy</button>
              <button onClick={() => navigate("/terms")} className="hover:text-primary transition-colors">Terms</button>
              <button onClick={() => navigate("/support")} className="hover:text-primary transition-colors">Support</button>
              <button onClick={() => navigate("/blog")} className="hover:text-primary transition-colors">Blog</button>
            </div>
          </div>
          
          <div className="text-center mt-8 text-sm text-muted-foreground">
            © 2025 Screen<span className="italic">VS</span>. {COPY.footer.copyright}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
