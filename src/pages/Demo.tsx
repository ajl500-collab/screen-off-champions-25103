import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const Demo = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<"free" | "premium">("free");

  const plans = {
    free: {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "Basic efficiency tracking",
        "Leaderboard access",
        "Community participation",
        "Up to 3 tracked apps",
        "Daily insights"
      ]
    },
    premium: {
      name: "Premium",
      price: "$19.99",
      period: "per year",
      features: [
        "Everything in Free, plus:",
        "Unlimited Apps tracking",
        "Intentional App-Switching (3s cooldown)",
        "Breathing Exercise with custom duration & location",
        "Adult Content Detox & impulse tracking",
        "\"Don't Get Lost\" smart notifications",
        "Time Tracking with detailed analytics",
        "Website blocking (10+ sites)",
        "Strict Block for apps & websites",
        "Desktop Browser Extension (Chrome)",
        "Advanced efficiency insights",
        "Historical data export",
        "Ad-free experience"
      ]
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 pt-24">
      <Header />
      
      {/* Demo Content */}
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Experience Screen<span className="italic">VS</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how competitive screen time tracking can transform your phone habits
          </p>
        </div>

        {/* Subscription Plans - Moved to Top */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Choose Your Plan</h2>
            <p className="text-muted-foreground">Start free, upgrade anytime</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Plan */}
            <div 
              className={`border rounded-2xl p-8 cursor-pointer transition-all ${
                selectedPlan === "free" 
                  ? "border-primary bg-primary/5 scale-105" 
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => setSelectedPlan("free")}
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plans.free.name}</h3>
                <div className="text-4xl font-bold mb-1">{plans.free.price}</div>
                <div className="text-sm text-muted-foreground">{plans.free.period}</div>
              </div>

              <ul className="space-y-3 mb-6">
                {plans.free.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className="w-full" 
                variant={selectedPlan === "free" ? "default" : "outline"}
                onClick={() => navigate("/auth")}
              >
                Get Started Free
              </Button>
            </div>

            {/* Premium Plan */}
            <div 
              className={`border rounded-2xl p-8 cursor-pointer transition-all relative ${
                selectedPlan === "premium" 
                  ? "border-primary bg-primary/5 scale-105" 
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => setSelectedPlan("premium")}
            >
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                  POPULAR
                </span>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plans.premium.name}</h3>
                <div className="text-4xl font-bold mb-1">{plans.premium.price}</div>
                <div className="text-sm text-muted-foreground">{plans.premium.period}</div>
              </div>

              <ul className="space-y-3 mb-6 max-h-80 overflow-y-auto">
                {plans.premium.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className="w-full" 
                variant={selectedPlan === "premium" ? "default" : "outline"}
                onClick={() => navigate("/auth")}
              >
                Start Premium Trial
              </Button>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              7-day free trial • Cancel anytime • All plans include 24/7 support
            </p>
          </div>
        </div>

        {/* Interactive Demo Section */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Live Demo Dashboard</h2>
            
            {/* Demo Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
                <div className="text-sm text-muted-foreground mb-2">Your Rank</div>
                <div className="text-4xl font-bold text-primary">#3</div>
                <div className="text-xs text-success mt-1">↑ 2 spots today</div>
              </div>
              
              <div className="bg-success/10 border border-success/20 rounded-xl p-6">
                <div className="text-sm text-muted-foreground mb-2">Efficiency Score</div>
                <div className="text-4xl font-bold text-success">68%</div>
                <div className="text-xs text-muted-foreground mt-1">Productive usage</div>
              </div>
              
              <div className="bg-accent/10 border border-accent/20 rounded-xl p-6">
                <div className="text-sm text-muted-foreground mb-2">Screen Time</div>
                <div className="text-4xl font-bold">3.2h</div>
                <div className="text-xs text-success mt-1">↓ 45min vs yesterday</div>
              </div>
            </div>

            {/* Demo Features */}
            <div className="space-y-4">
              <div className="border border-border rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Real-time Leaderboards</h4>
                    <p className="text-sm text-muted-foreground">Compete with friends and communities</p>
                  </div>
                  <div className="text-2xl">🏆</div>
                </div>
              </div>
              
              <div className="border border-border rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Smart Notifications</h4>
                    <p className="text-sm text-muted-foreground">Witty reminders to stay focused</p>
                  </div>
                  <div className="text-2xl">💬</div>
                </div>
              </div>
              
              <div className="border border-border rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Efficiency Algorithm</h4>
                    <p className="text-sm text-muted-foreground">Not all screen time is equal</p>
                  </div>
                  <div className="text-2xl">⚡</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
