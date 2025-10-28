import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../onboarding/OnboardingContext";
import { mockDashboardData } from "./mockData";
import { TodayAtAGlance } from "./TodayAtAGlance";
import { WeeklyProgress } from "./WeeklyProgress";
import { EfficiencyMeter } from "./EfficiencyMeter";
import { EfficiencyExplainer } from "../insights/EfficiencyExplainer";
import { PowerTipsCarousel } from "../tips/PowerTipsCarousel";
import { CoreLoopStrip } from "@/components/CoreLoopStrip";
import { Badge } from "@/components/ui/badge";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { onboardingComplete, demoMode } = useOnboarding();

  useEffect(() => {
    // Redirect to onboarding if not complete
    if (!onboardingComplete && !demoMode) {
      navigate("/onboarding");
    }
  }, [onboardingComplete, demoMode, navigate]);

  const { today, yesterday, efficiency, weekly } = mockDashboardData;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          {onboardingComplete && (
            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
              Week 1 Active
            </Badge>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Core Loop Strip */}
        <CoreLoopStrip className="mb-6" />

        {/* Section 1: Today At A Glance */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-foreground">
            Today At A Glance
          </h2>
          <TodayAtAGlance
            productiveMins={today.productiveMins}
            unproductiveMins={today.unproductiveMins}
            neutralMins={today.neutralMins}
            deltaVsYesterday={efficiency.deltaVsYesterday}
          />
        </section>

        {/* Section 2: Weekly Progress */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-foreground">
            Weekly Progress
          </h2>
          <WeeklyProgress
            weeklyData={weekly}
            streakDays={efficiency.streakDays}
          />
        </section>

        {/* Section 3: Efficiency Meter */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-foreground">
            Efficiency Meter
          </h2>
          <EfficiencyMeter
            efficiency={efficiency.value}
            tier={efficiency.tier}
            streakDays={efficiency.streakDays}
            deltaVsYesterday={efficiency.deltaVsYesterday}
          />
        </section>

        {/* Section 4: Efficiency Explainer */}
        <section>
          <EfficiencyExplainer />
        </section>

        {/* Section 5: Power-Tips Carousel */}
        <section>
          <PowerTipsCarousel />
        </section>
      </div>
    </div>
  );
};
