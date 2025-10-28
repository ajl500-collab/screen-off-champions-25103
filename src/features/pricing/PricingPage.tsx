import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FAQAccordion } from "./FAQAccordion";
import { useToast } from "@/hooks/use-toast";
import { useConfetti } from "@/hooks/useConfetti";
import { COPY } from "@/lib/copy";
import { Check } from "lucide-react";

export const PricingPage = () => {
  const { toast } = useToast();
  const { celebrate } = useConfetti();
  const [currentPlan, setCurrentPlan] = useState(
    localStorage.getItem("screenVsPlan") || "free"
  );

  const handleUpgradeToPro = () => {
    setCurrentPlan("pro");
    localStorage.setItem("screenVsPlan", "pro");
    celebrate();
    toast({
      title: COPY.pricing.proActivated.title,
      description: COPY.pricing.proActivated.description,
    });
  };

  const handleStayFree = () => {
    toast({
      title: COPY.pricing.stayFree.title,
      description: COPY.pricing.stayFree.description,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
          {COPY.pricing.header.title}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {COPY.pricing.header.subtitle}
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-primary via-accent to-primary mx-auto mt-6 rounded-full" />
      </header>

      {/* Pricing Cards */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <Card className="p-8 border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="text-center mb-6">
              <Badge variant="secondary" className="mb-4">
                Free Forever
              </Badge>
              <h2 className="text-2xl font-bold mb-2 text-foreground">
                {COPY.pricing.free.title}
              </h2>
              <div className="mb-4">
                <span className="text-5xl font-bold text-foreground">$0</span>
                <span className="text-muted-foreground ml-2">/forever</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {COPY.pricing.free.tagline}
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {COPY.pricing.free.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleStayFree}
              disabled={currentPlan === "free"}
            >
              {currentPlan === "free" ? "Current Plan" : "Stay Free"}
            </Button>
          </Card>

          {/* Pro Plan */}
          <Card className="p-8 border-2 border-primary relative hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-background via-background to-primary/5">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                ⚡ Most Popular
              </Badge>
            </div>

            <div className="text-center mb-6">
              <Badge variant="default" className="mb-4">
                Pro Mode
              </Badge>
              <h2 className="text-2xl font-bold mb-2 text-foreground">
                {COPY.pricing.pro.title}
              </h2>
              <div className="mb-4">
                <span className="text-5xl font-bold text-foreground">
                  $4.99
                </span>
                <span className="text-muted-foreground ml-2">/month</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {COPY.pricing.pro.tagline}
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {COPY.pricing.pro.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
              onClick={handleUpgradeToPro}
              disabled={currentPlan === "pro"}
            >
              {currentPlan === "pro" ? "✅ Current Plan" : "Go Pro 🚀"}
            </Button>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
          {COPY.pricing.faq.title}
        </h2>
        <FAQAccordion />
      </section>

      {/* CTA Section */}
      <section className="text-center py-16 px-4 bg-gradient-to-b from-background to-primary/5">
        <h2 className="text-3xl font-bold mb-4 text-foreground">
          {COPY.pricing.cta.title}
        </h2>
        <Button
          size="lg"
          className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          onClick={handleUpgradeToPro}
          disabled={currentPlan === "pro"}
        >
          {COPY.pricing.cta.button}
        </Button>
      </section>
    </div>
  );
};
