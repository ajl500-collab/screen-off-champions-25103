import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useConfetti } from "@/hooks/useConfetti";
import ConfettiExplosion from "react-confetti-explosion";
import { dashboardCopy } from "./copy";

interface EfficiencyMeterProps {
  efficiency: number;
  tier: "Gold" | "Silver" | "Bronze" | "Diamond";
  streakDays: number;
  deltaVsYesterday: number;
}

export const EfficiencyMeter = ({
  efficiency,
  tier,
  streakDays,
  deltaVsYesterday,
}: EfficiencyMeterProps) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const { isExploding, celebrate } = useConfetti();
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false);

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const currentValue = Math.floor(efficiency * progress);
      setAnimatedValue(currentValue);

      // Trigger confetti when crossing tier thresholds
      if (!hasTriggeredConfetti && currentValue >= 80 && tier === "Gold") {
        celebrate();
        setHasTriggeredConfetti(true);
      }

      if (step >= steps) {
        clearInterval(timer);
        setAnimatedValue(efficiency);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [efficiency, tier, celebrate, hasTriggeredConfetti]);

  const getTierColor = () => {
    switch (tier) {
      case "Gold":
        return "from-yellow-500 to-yellow-600";
      case "Silver":
        return "from-gray-300 to-gray-400";
      case "Bronze":
        return "from-orange-600 to-orange-700";
      default:
        return "from-primary to-accent";
    }
  };

  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference * (1 - animatedValue / 100);

  const formatTime = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <Card className="p-8 bg-card border-border relative overflow-hidden">
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

      <div className="flex flex-col items-center space-y-6">
        {/* Circular Progress */}
        <div className="relative w-64 h-64">
          <svg className="w-64 h-64 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-muted/20"
            />
            {/* Progress circle */}
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop
                  offset="0%"
                  className={`${
                    tier === "Gold"
                      ? "stop-yellow-500"
                      : tier === "Silver"
                      ? "stop-gray-300"
                      : "stop-orange-600"
                  }`}
                />
                <stop
                  offset="100%"
                  className={`${
                    tier === "Gold"
                      ? "stop-yellow-600"
                      : tier === "Silver"
                      ? "stop-gray-400"
                      : "stop-orange-700"
                  }`}
                />
              </linearGradient>
            </defs>
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div
              className={`text-6xl font-bold font-mono bg-gradient-to-r ${getTierColor()} bg-clip-text text-transparent animate-count-up`}
            >
              {animatedValue}%
            </div>
            <div className="text-sm text-muted-foreground mt-1">Efficiency</div>
            <div className="text-lg font-semibold mt-2">
              {dashboardCopy.tierLabels[tier]}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="text-center space-y-2">
          <p className="text-sm text-foreground">
            Efficiency Score: <span className="font-bold text-primary">{efficiency}</span>
          </p>
          {streakDays >= 3 && (
            <p className="text-sm text-muted-foreground">
              🔥 {streakDays}-day streak
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            {deltaVsYesterday >= 0 ? "+" : ""}{deltaVsYesterday}% vs yesterday
          </p>
        </div>
      </div>
    </Card>
  );
};
