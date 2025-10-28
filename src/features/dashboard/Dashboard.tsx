import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../onboarding/OnboardingContext";
import { useDailyUsage, useWeeklyUsage, useStreak } from "@/lib/data/queries";
import { calculateDailySummary, calculateWeeklySummary } from "@/lib/data/efficiency";
import { TodayAtAGlance } from "./TodayAtAGlance";
import { WeeklyProgress } from "./WeeklyProgress";
import { EfficiencyMeter } from "./EfficiencyMeter";
import { EfficiencyExplainer } from "../insights/EfficiencyExplainer";
import { PowerTipsCarousel } from "../tips/PowerTipsCarousel";
import { CoreLoopStrip } from "@/components/CoreLoopStrip";
import { Badge } from "@/components/ui/badge";
import { ManualTimeEntry } from "@/components/ManualTimeEntry";
import { format, subDays } from "date-fns";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { onboardingComplete, demoMode } = useOnboarding();

  const today = useDailyUsage();
  const yesterday = useDailyUsage(subDays(new Date(), 1));
  const weeklyData = useWeeklyUsage();
  const streak = useStreak();

  useEffect(() => {
    if (!onboardingComplete && !demoMode) {
      navigate("/onboarding");
    }
  }, [onboardingComplete, demoMode, navigate]);

  // Calculate today's summary
  const todaySummary = today.data
    ? calculateDailySummary(
        today.data.productive_mins,
        today.data.unproductive_mins,
        today.data.neutral_mins,
        today.data.usage_date
      )
    : null;

  // Calculate yesterday's summary for delta
  const yesterdaySummary = yesterday.data
    ? calculateDailySummary(
        yesterday.data.productive_mins,
        yesterday.data.unproductive_mins,
        yesterday.data.neutral_mins,
        yesterday.data.usage_date
      )
    : null;

  const deltaVsYesterday = todaySummary && yesterdaySummary
    ? ((todaySummary.unproductive - yesterdaySummary.unproductive) / 
       Math.max(yesterdaySummary.unproductive, 1)) * 100
    : 0;

  // Convert weekly data to chart format
  const weeklyChartData = weeklyData.data?.map((day) => {
    const summary = calculateDailySummary(
      day.productive_mins,
      day.unproductive_mins,
      day.neutral_mins,
      day.usage_date
    );
    return {
      day: format(new Date(day.usage_date), "EEE"),
      productive: day.productive_mins,
      unproductive: day.unproductive_mins,
      neutral: day.neutral_mins,
      total: summary.total,
    };
  }) || [];

  if (today.isLoading || weeklyData.isLoading) {
    return <div className="min-h-screen bg-background pb-24 flex items-center justify-center">
      <p className="text-muted-foreground">Loading dashboard...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-2">
            <ManualTimeEntry />
            {onboardingComplete && (
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                Week 1 Active
              </Badge>
            )}
          </div>
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
            productiveMins={todaySummary?.productive || 0}
            unproductiveMins={todaySummary?.unproductive || 0}
            neutralMins={todaySummary?.neutral || 0}
            deltaVsYesterday={Math.round(deltaVsYesterday)}
          />
        </section>

        {/* Section 2: Weekly Progress */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-foreground">
            Weekly Progress
          </h2>
          <WeeklyProgress
            weeklyData={weeklyChartData}
            streakDays={streak.data || 0}
          />
        </section>

        {/* Section 3: Efficiency Meter */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-foreground">
            Efficiency Meter
          </h2>
          <EfficiencyMeter
            efficiency={todaySummary?.efficiency.score || 0}
            tier={todaySummary?.efficiency.tier || "Bronze"}
            streakDays={streak.data || 0}
            deltaVsYesterday={Math.round(deltaVsYesterday)}
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
