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

interface LeaderboardCopy {
  rankUp: string[];
  rankDown: string[];
  topOne: string[];
  emptyState: {
    title: string;
    subtitle: string;
    buttonText: string;
  };
  badges: {
    "Most Improved": { emoji: string; description: string };
    "Streak King": { emoji: string; description: string };
    "Ice Cold": { emoji: string; description: string };
    "Clutch Comeback": { emoji: string; description: string };
  };
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

export const leaderboardCopy: LeaderboardCopy = {
  rankUp: [
    "🔥 Up {delta} ranks! You're built different.",
    "Rising! +{delta} since yesterday.",
    "On the grind! Up {delta} spots.",
    "Climbing! +{delta} ranks today.",
  ],
  rankDown: [
    "👀 Someone's been scrolling again.",
    "Down {delta}—time to lock in.",
    "Slipped {delta} spots. Get it back.",
    "Down {delta}. Redemption arc incoming?",
  ],
  topOne: [
    "🥇 You're the GOAT this week.",
    "👑 Sitting at the top—stay hungry.",
    "🏆 #1. That's what champions do.",
    "💪 Top of the leaderboard. Respect.",
  ],
  emptyState: {
    title: "Your squad's empty — invite 2 friends and start roasting.",
    subtitle: "Create a squad to see how you rank against your friends.",
    buttonText: "Invite Friends",
  },
  badges: {
    "Most Improved": {
      emoji: "🏹",
      description: "Biggest efficiency gain this week",
    },
    "Streak King": {
      emoji: "🔥",
      description: "Longest improvement streak",
    },
    "Ice Cold": {
      emoji: "🧊",
      description: "Most consistent screen time",
    },
    "Clutch Comeback": {
      emoji: "🕹️",
      description: "Biggest improvement in last 24h",
    },
  },
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

export const getRankChangeCopy = (rankDelta: number): string => {
  if (rankDelta > 0) {
    const copy =
      leaderboardCopy.rankUp[
        Math.floor(Math.random() * leaderboardCopy.rankUp.length)
      ];
    return copy.replace("{delta}", Math.abs(rankDelta).toString());
  } else if (rankDelta < 0) {
    const copy =
      leaderboardCopy.rankDown[
        Math.floor(Math.random() * leaderboardCopy.rankDown.length)
      ];
    return copy.replace("{delta}", Math.abs(rankDelta).toString());
  }
  return "";
};

export const getTopRankCopy = (): string => {
  return leaderboardCopy.topOne[
    Math.floor(Math.random() * leaderboardCopy.topOne.length)
  ];
};
