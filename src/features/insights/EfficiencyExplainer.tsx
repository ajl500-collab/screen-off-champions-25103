import { useState, useEffect } from "react";
import { Info, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { useDailyUsage, useWeeklyUsage } from "@/lib/data/queries";
import { computeEfficiency, getTierFromScore } from "@/lib/data/efficiency";
import { insightsCopy, getInsightSummary } from "../dashboard/copy";
import { useConfetti } from "@/hooks/useConfetti";
import ConfettiExplosion from "react-confetti-explosion";
import { subDays, format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const EfficiencyExplainer = () => {
  // ALL HOOKS MUST BE CALLED FIRST - before any conditional returns
  const [showFormula, setShowFormula] = useState(false);
  const [showApps, setShowApps] = useState(false);
  const [animatedValues, setAnimatedValues] = useState({
    productive: 0,
    unproductive: 0,
    neutral: 0,
  });
  const { isExploding, celebrate } = useConfetti();
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false);

  // Fetch real data
  const { data: todayData, isLoading: todayLoading } = useDailyUsage(new Date());
  const { data: yesterdayData } = useDailyUsage(subDays(new Date(), 1));
  const { data: weeklyData } = useWeeklyUsage();
  
  // Fetch today's app breakdown
  const { data: appsData, isLoading: appsLoading } = useQuery({
    queryKey: ["apps-breakdown", format(new Date(), "yyyy-MM-dd")],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("user_screen_time")
        .select(`
          app_name,
          time_spent_minutes,
          app_categories (category)
        `)
        .eq("user_id", user.id)
        .eq("date", format(new Date(), "yyyy-MM-dd"))
        .order("time_spent_minutes", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // NOW we can do conditional rendering after all hooks are called
  if (todayLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-64 w-full" />
      </Card>
    );
  }

  if (!todayData) {
    return (
      <Card className="p-6 text-center">
        <div className="space-y-4">
          <div className="text-4xl">📊</div>
          <h3 className="text-xl font-bold">No data yet</h3>
          <p className="text-sm text-muted-foreground">
            Add your first day of screen time to see insights.
          </p>
        </div>
      </Card>
    );
  }

  const today = {
    productiveMins: todayData.productive_mins,
    unproductiveMins: todayData.unproductive_mins,
    neutralMins: todayData.neutral_mins,
  };

  const yesterday = yesterdayData ? {
    productiveMins: yesterdayData.productive_mins,
    unproductiveMins: yesterdayData.unproductive_mins,
    neutralMins: yesterdayData.neutral_mins,
  } : { productiveMins: 0, unproductiveMins: 0, neutralMins: 0 };

  const efficiencyResult = computeEfficiency({
    productive: today.productiveMins,
    unproductive: today.unproductiveMins,
    neutral: today.neutralMins,
  });

  const yesterdayResult = yesterdayData ? computeEfficiency({
    productive: yesterday.productiveMins,
    unproductive: yesterday.unproductiveMins,
    neutral: yesterday.neutralMins,
  }) : { score: 0, tier: "Bronze" as const, color: "" };

  const efficiency = {
    value: efficiencyResult.score,
    tier: efficiencyResult.tier,
    streakDays: 0,
    deltaVsYesterday: efficiencyResult.score - yesterdayResult.score,
  };

  const weeklyEfficiency = weeklyData?.map((day) => {
    const dayResult = computeEfficiency({
      productive: day.productive_mins,
      unproductive: day.unproductive_mins,
      neutral: day.neutral_mins,
    });
    return {
      day: new Date(day.usage_date).toLocaleDateString('en-US', { weekday: 'short' }),
      efficiency: dayResult.score,
      change: 0,
    };
  }) || [];

  const totalMins = today.productiveMins + today.unproductiveMins + today.neutralMins;
  const totalHours = Math.floor(totalMins / 60);
  const totalMinutes = totalMins % 60;

  // Calculate deltas
  const yesterdayTotal =
    yesterday.productiveMins + yesterday.unproductiveMins + yesterday.neutralMins;
  const productiveDelta =
    yesterdayTotal > 0
      ? ((today.productiveMins - yesterday.productiveMins) / yesterdayTotal) * 100
      : 0;
  const unproductiveDelta =
    yesterdayTotal > 0
      ? ((today.unproductiveMins - yesterday.unproductiveMins) / yesterdayTotal) * 100
      : 0;
  const neutralDelta =
    yesterdayTotal > 0
      ? ((today.neutralMins - yesterday.neutralMins) / yesterdayTotal) * 100
      : 0;

  // Donut chart data
  const chartData = [
    { name: "Productive", value: today.productiveMins, color: "#4ADE80" },
    { name: "Unproductive", value: today.unproductiveMins, color: "#F87171" },
    { name: "Neutral", value: today.neutralMins, color: "#A3A3A3" },
  ];

  // Animate values on mount
  useEffect(() => {
    const duration = 700;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setAnimatedValues({
        productive: Math.floor(today.productiveMins * progress),
        unproductive: Math.floor(today.unproductiveMins * progress),
        neutral: Math.floor(today.neutralMins * progress),
      });

      if (step >= steps) {
        clearInterval(timer);
        setAnimatedValues({
          productive: today.productiveMins,
          unproductive: today.unproductiveMins,
          neutral: today.neutralMins,
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [today.productiveMins, today.unproductiveMins, today.neutralMins]);

  // Trigger confetti for gold tier
  useEffect(() => {
    if (!hasTriggeredConfetti && efficiency.value >= 80) {
      celebrate();
      setHasTriggeredConfetti(true);
    }
  }, [efficiency.value, celebrate, hasTriggeredConfetti]);

  const formatTime = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return `${hours}h ${minutes}m`;
  };

  const summary = getInsightSummary(
    productiveDelta,
    unproductiveDelta,
    neutralDelta,
    efficiency.value
  );

  return (
    <Card className="p-6 bg-card border-border relative overflow-hidden">
      {/* Confetti */}
      {isExploding && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
          <ConfettiExplosion
            force={0.6}
            duration={2500}
            particleCount={80}
            width={1200}
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold">Efficiency Insights</h3>
          <p className="text-sm text-muted-foreground">
            Where your time really went today.
          </p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Info className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Based on daily app-use data</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Donut Chart */}
        <div className="flex flex-col items-center">
          <div className="relative w-64 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.map((item) => ({
                    ...item,
                    value:
                      item.name === "Productive"
                        ? animatedValues.productive
                        : item.name === "Unproductive"
                        ? animatedValues.unproductive
                        : animatedValues.neutral,
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  animationDuration={700}
                  animationEasing="ease-out"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card border border-border rounded-lg p-2 text-xs">
                          <p className="font-semibold">{payload[0].name}</p>
                          <p>{formatTime(payload[0].value as number)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-3xl font-bold font-mono animate-count-up">
                {totalHours}h {totalMinutes}m
              </div>
              <div className="text-xs text-muted-foreground mt-1">Total Time</div>
              <div className="text-sm font-semibold mt-2 text-primary">
                Score: {efficiency.value} ({efficiency.tier})
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex gap-4 mt-4">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Trend & Summary */}
        <div className="flex flex-col justify-center space-y-4">
          {/* 7-Day Mini Trend */}
          <div>
            <h4 className="text-sm font-semibold mb-3">7-Day Trend</h4>
            <div className="flex items-end justify-between gap-1 h-20 mb-2">
              {weeklyEfficiency.map((day, index) => {
                const maxEfficiency = Math.max(
                  ...weeklyEfficiency.map((d) => d.efficiency)
                );
                const height = (day.efficiency / maxEfficiency) * 100;
                const isUp = day.change >= 0;

                return (
                  <TooltipProvider key={day.day}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className={`w-full rounded-t transition-all duration-500 ${
                              isUp ? "bg-success" : "bg-destructive"
                            }`}
                            style={{
                              height: `${height}%`,
                              transitionDelay: `${index * 50}ms`,
                            }}
                          />
                          <span className="text-xs text-muted-foreground">
                            {day.day.slice(0, 1)}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs">
                          <p className="font-semibold">{day.day}</p>
                          <p>
                            Efficiency: {day.efficiency}
                            {day.change !== 0 &&
                              ` (${day.change > 0 ? "+" : ""}${day.change}%)`}
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>

            {/* Streak indicator */}
            {efficiency.streakDays >= 3 && (
              <div className="text-sm font-semibold text-primary">
                {insightsCopy.streak.replace(
                  "{days}",
                  efficiency.streakDays.toString()
                )}
              </div>
            )}
          </div>

          {/* Summary Sentence */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-sm font-medium italic">{summary}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFormula(!showFormula)}
              className="flex-1 gap-2"
            >
              {showFormula ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Hide Formula
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Why?
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowApps(!showApps)}
              className="flex-1 gap-2"
            >
              {showApps ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Hide Apps
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show Apps
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Formula Card (Expandable) */}
      {showFormula && (
        <div className="bg-muted/30 border border-border rounded-lg p-4 mb-4 animate-scale-in">
          <h4 className="font-semibold mb-2">{insightsCopy.formula.title}</h4>
          <p className="text-sm text-muted-foreground mb-4">
            {insightsCopy.formula.explanation}
          </p>
          <Button
            onClick={() => setShowFormula(false)}
            variant="default"
            size="sm"
          >
            {insightsCopy.formula.gotIt}
          </Button>
        </div>
      )}

      {/* Apps List (Expandable) */}
      {showApps && (
        <div className="bg-muted/30 border border-border rounded-lg p-4 animate-scale-in">
          <h4 className="font-semibold mb-4">Today's Apps</h4>
          {appsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : !appsData || appsData.length === 0 ? (
            <p className="text-sm text-muted-foreground">No apps tracked today yet.</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {appsData.map((app: any, index: number) => {
                const category = app.app_categories?.category || "neutral";
                const hours = Math.floor(app.time_spent_minutes / 60);
                const mins = app.time_spent_minutes % 60;
                
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          category === "productive"
                            ? "bg-success"
                            : category === "unproductive"
                            ? "bg-destructive"
                            : "bg-muted-foreground"
                        }`}
                      />
                      <div>
                        <p className="font-medium text-sm">{app.app_name}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-semibold">
                        {hours > 0 ? `${hours}h ` : ""}{mins}m
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
