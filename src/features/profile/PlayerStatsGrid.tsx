import { useEffect, useState } from "react";
import { Flame, TrendingDown, BookOpen, Users } from "lucide-react";
import { mockProfileData } from "../dashboard/mockData";

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  animateValue?: boolean;
}

const StatItem = ({ icon, label, value, animateValue = false }: StatItemProps) => {
  const [displayValue, setDisplayValue] = useState(animateValue ? 0 : value);

  useEffect(() => {
    if (!animateValue || typeof value !== "number") return;

    let start = 0;
    const end = value;
    const duration = 700;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, animateValue]);

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-primary">{icon}</div>
        <div className="text-xs text-muted-foreground font-medium">{label}</div>
      </div>
      <div className="text-2xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
        {displayValue}
      </div>
    </div>
  );
};

export const PlayerStatsGrid = () => {
  const stats = [
    {
      icon: <Flame className="w-5 h-5" />,
      label: "Best Streak",
      value: mockProfileData.bestStreak,
      animateValue: true,
    },
    {
      icon: <TrendingDown className="w-5 h-5" />,
      label: "Best Week",
      value: `–${mockProfileData.bestWeekDrop}%`,
      animateValue: false,
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: "Top Category",
      value: mockProfileData.mostProductiveCategory,
      animateValue: false,
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Squads Joined",
      value: mockProfileData.squadsJoined,
      animateValue: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in">
      {stats.map((stat, index) => (
        <div
          key={index}
          style={{ animationDelay: `${index * 100}ms` }}
          className="animate-scale-in"
        >
          <StatItem {...stat} />
        </div>
      ))}
    </div>
  );
};
