import { useNavigate } from "react-router-dom";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import EfficiencyInsights from "@/components/EfficiencyInsights";
import Tips from "@/components/Tips";
import CTA from "@/components/CTA";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Quick Access to App */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container mx-auto px-4 text-center">
          <Button 
            size="lg" 
            onClick={() => navigate("/dashboard")}
            className="text-lg px-8"
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
              <h3 className="text-xl font-bold mb-1">ScreenSlayer</h3>
              <p className="text-sm text-muted-foreground">Turn screen time into competition.</p>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Support</a>
              <a href="#" className="hover:text-primary transition-colors">Blog</a>
            </div>
          </div>
          
          <div className="text-center mt-8 text-sm text-muted-foreground">
            © 2025 ScreenSlayer. All rights reserved. Made for the squad.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
