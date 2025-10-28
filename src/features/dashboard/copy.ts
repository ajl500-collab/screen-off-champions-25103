interface DashboardCopy {
  improvement: string[];
  decline: string[];
  neutral: string[];
  tierLabels: {
    Gold: string;
    Silver: string;
    Bronze: string;
  };
  streakActive: string;
  noStreak: string;
}

export const dashboardCopy: DashboardCopy = {
  improvement: [
    "🔥 Big comeback today—keep that energy.",
    "Solid recovery today—keep that momentum.",
    "Nice! Your focus is paying off.",
    "That's the spirit—building better habits.",
  ],
  decline: [
    "Bruh, 5h on TikTok? Rough.",
    "Yikes. Your thumb's getting a workout.",
    "Today was a scroll-fest, huh?",
    "More screen time than productivity today.",
  ],
  neutral: [
    "Holding steady—momentum's everything.",
    "Not bad—consistent is key.",
    "Steady as she goes.",
    "Keeping pace—stay locked in.",
  ],
  tierLabels: {
    Gold: "Gold Day 🥇",
    Silver: "Silver Day 🥈",
    Bronze: "Bronze Day 🥉",
  },
  streakActive: "🔥 Streak:",
  noStreak: "No active streak—start one today!",
};

export const getMotivationalCopy = (deltaVsYesterday: number): string => {
  if (deltaVsYesterday < -5) {
    return dashboardCopy.improvement[
      Math.floor(Math.random() * dashboardCopy.improvement.length)
    ];
  } else if (deltaVsYesterday > 5) {
    return dashboardCopy.decline[
      Math.floor(Math.random() * dashboardCopy.decline.length)
    ];
  } else {
    return dashboardCopy.neutral[
      Math.floor(Math.random() * dashboardCopy.neutral.length)
    ];
  }
};
