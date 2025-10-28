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

interface InsightsCopy {
  summaries: {
    productiveUp: string[];
    productiveDown: string[];
    unproductiveUp: string[];
    unproductiveDown: string[];
    balanced: string[];
    legendary: string[];
  };
  formula: {
    title: string;
    explanation: string;
    gotIt: string;
  };
  streak: string;
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

interface SyncCopy {
  connected: {
    title: string;
    subtitle: string;
    message: string;
  };
  disconnected: {
    title: string;
    subtitle: string;
    message: string;
  };
  reconnecting: string;
  success: string;
  error: string;
  lastUpdated: string;
  troubleshoot: {
    title: string;
    steps: string[];
  };
}

export const syncCopy: SyncCopy = {
  connected: {
    title: "Screen-Time Sync",
    subtitle: "iPhone Screen Time connected",
    message: "All synced. You're running clean.",
  },
  disconnected: {
    title: "Screen-Time Sync",
    subtitle: "Not connected",
    message: "No data yet — reconnect to flex your focus.",
  },
  reconnecting: "Syncing with the mothership…",
  success: "Connected successfully 🎯",
  error: "Failed to connect. Try again.",
  lastUpdated: "Last updated: {minutes}m ago",
  troubleshoot: {
    title: "Having trouble connecting?",
    steps: [
      "Make sure Shortcuts is installed on your iPhone.",
      "Reconnect via Settings → Privacy & Screen Time.",
      "If issues persist, contact support.",
    ],
  },
};

export const insightsCopy: InsightsCopy = {
  summaries: {
    productiveUp: [
      "Productive up +{productiveDelta}%, Unproductive down -{unproductiveDelta}%. Keep rolling.",
      "Legendary focus mode activated. +{productiveDelta}% productive.",
      "Numbers don't lie—you crushed it today. +{productiveDelta}%.",
      "That's what we're talking about. Productive +{productiveDelta}%.",
    ],
    productiveDown: [
      "Productive down -{productiveDelta}%. Tomorrow's redemption arc.",
      "Your thumb deserved a day off. Productive -{productiveDelta}%.",
      "Not your best day. Productive -{productiveDelta}%, but you'll bounce back.",
    ],
    unproductiveUp: [
      "Unproductive time spiked +{unproductiveDelta}%. Touch grass.",
      "Scroll city today. Unproductive +{unproductiveDelta}%.",
      "Your phone won today. Unproductive +{unproductiveDelta}%.",
      "Big yikes. Unproductive +{unproductiveDelta}%.",
    ],
    unproductiveDown: [
      "Unproductive down -{unproductiveDelta}%. That's progress.",
      "Less doom scrolling. Unproductive -{unproductiveDelta}%.",
      "Cutting the waste. Unproductive -{unproductiveDelta}%.",
    ],
    balanced: [
      "Neutral time steady (+{neutralDelta}%), solid balance today.",
      "Right in the pocket. Balanced day.",
      "Consistency unlocked. Neutral ±{neutralDelta}%.",
    ],
    legendary: [
      "Legendary day. Efficiency through the roof.",
      "You're unstoppable. Keep this energy.",
      "Peak performance unlocked.",
    ],
  },
  formula: {
    title: "How we calculate it",
    explanation:
      "Efficiency = (Productive × positive weight) – (Unproductive × negative weight). Neutral apps don't count. Consistency & streaks add bonus points.",
    gotIt: "Got it 👍",
  },
  streak: "🔥 {days}-day improvement streak",
};

interface ProfileCopy {
  tiers: {
    Diamond: string;
    Gold: string;
    Silver: string;
    Bronze: string;
  };
  emptyBio: string;
  emptyMemes: string;
}

export const profileCopy: ProfileCopy = {
  tiers: {
    Diamond: "You're basically a focus machine.",
    Gold: "Elite tier. Keep the streak alive.",
    Silver: "Solid performance. Gold is next.",
    Bronze: "Bronze today. Tomorrow's comeback season.",
  },
  emptyBio: "Nothing here yet — time to build your story.",
  emptyMemes: "No roasts yet — stay humble 😉.",
};

interface MemesCopy {
  title: string;
  addSuccess: string;
  deleteSuccess: string;
  copySuccess: string;
  sendSuccess: string;
  invalidUrl: string;
  communityToggleTooltip: string;
  emptyUserMemes: string;
  roastGenerated: string;
}

export const memesCopy: MemesCopy = {
  title: "Meme Bank 🖼️",
  addSuccess: "Added to your bank 🔥",
  deleteSuccess: "Deleted.",
  copySuccess: "Roast copied to clipboard 📋",
  sendSuccess: "Roast sent (safely) 😂",
  invalidUrl: "Invalid URL. Use https:// with .jpg, .png, or .webp",
  communityToggleTooltip: "These memes are moderated for good vibes only.",
  emptyUserMemes: "No memes yet. Add your first one!",
  roastGenerated: "Roast generated 🔥",
};

export const getInsightSummary = (
  productiveDelta: number,
  unproductiveDelta: number,
  neutralDelta: number,
  efficiency: number
): string => {
  // Legendary performance
  if (efficiency >= 85) {
    return insightsCopy.summaries.legendary[
      Math.floor(Math.random() * insightsCopy.summaries.legendary.length)
    ];
  }

  // Productive improved significantly
  if (productiveDelta > 15) {
    const copy =
      insightsCopy.summaries.productiveUp[
        Math.floor(Math.random() * insightsCopy.summaries.productiveUp.length)
      ];
    return copy
      .replace("{productiveDelta}", Math.abs(productiveDelta).toFixed(0))
      .replace("{unproductiveDelta}", Math.abs(unproductiveDelta).toFixed(0));
  }

  // Unproductive spiked
  if (unproductiveDelta > 15) {
    const copy =
      insightsCopy.summaries.unproductiveUp[
        Math.floor(
          Math.random() * insightsCopy.summaries.unproductiveUp.length
        )
      ];
    return copy.replace(
      "{unproductiveDelta}",
      Math.abs(unproductiveDelta).toFixed(0)
    );
  }

  // Unproductive decreased
  if (unproductiveDelta < -10) {
    const copy =
      insightsCopy.summaries.unproductiveDown[
        Math.floor(
          Math.random() * insightsCopy.summaries.unproductiveDown.length
        )
      ];
    return copy.replace(
      "{unproductiveDelta}",
      Math.abs(unproductiveDelta).toFixed(0)
    );
  }

  // Productive decreased
  if (productiveDelta < -10) {
    const copy =
      insightsCopy.summaries.productiveDown[
        Math.floor(
          Math.random() * insightsCopy.summaries.productiveDown.length
        )
      ];
    return copy.replace(
      "{productiveDelta}",
      Math.abs(productiveDelta).toFixed(0)
    );
  }

  // Balanced/neutral
  const copy =
    insightsCopy.summaries.balanced[
      Math.floor(Math.random() * insightsCopy.summaries.balanced.length)
    ];
  return copy.replace("{neutralDelta}", Math.abs(neutralDelta).toFixed(0));
};
