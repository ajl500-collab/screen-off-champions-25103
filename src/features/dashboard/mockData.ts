export interface DayData {
  day: string;
  total: number;
  productive: number;
  unproductive: number;
  neutral: number;
}

export interface MockDashboardData {
  today: {
    productiveMins: number;
    unproductiveMins: number;
    neutralMins: number;
  };
  yesterday: {
    productiveMins: number;
    unproductiveMins: number;
    neutralMins: number;
  };
  efficiency: {
    value: number;
    tier: "Gold" | "Silver" | "Bronze";
    streakDays: number;
    deltaVsYesterday: number;
  };
  weekly: DayData[];
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatarUrl: string;
  efficiency: number;
  rankDelta: number;
  tier: "Gold" | "Silver" | "Bronze";
  badges: string[];
  userId: string;
}

export interface MockLeaderboardData {
  leaderboard: LeaderboardEntry[];
  weekEndsIn: string;
  currentUserId: string;
}

export const mockDashboardData: MockDashboardData = {
  today: {
    productiveMins: 135,
    unproductiveMins: 192,
    neutralMins: 45,
  },
  yesterday: {
    productiveMins: 120,
    unproductiveMins: 210,
    neutralMins: 30,
  },
  efficiency: {
    value: 76,
    tier: "Silver",
    streakDays: 4,
    deltaVsYesterday: -12,
  },
  weekly: [
    { day: "Mon", total: 420, productive: 150, unproductive: 210, neutral: 60 },
    { day: "Tue", total: 390, productive: 180, unproductive: 180, neutral: 30 },
    { day: "Wed", total: 360, productive: 160, unproductive: 160, neutral: 40 },
    { day: "Thu", total: 450, productive: 200, unproductive: 200, neutral: 50 },
    { day: "Fri", total: 330, productive: 120, unproductive: 180, neutral: 30 },
    { day: "Sat", total: 480, productive: 100, unproductive: 320, neutral: 60 },
    { day: "Sun", total: 372, productive: 135, unproductive: 192, neutral: 45 },
  ],
};

export const mockLeaderboardData: MockLeaderboardData = {
  leaderboard: [
    {
      rank: 1,
      name: "Andrew",
      avatarUrl: "🏆",
      efficiency: 91,
      rankDelta: 2,
      tier: "Gold",
      badges: ["Streak King"],
      userId: "user-1",
    },
    {
      rank: 2,
      name: "Lucas",
      avatarUrl: "🚀",
      efficiency: 86,
      rankDelta: -1,
      tier: "Gold",
      badges: ["Most Improved"],
      userId: "user-2",
    },
    {
      rank: 3,
      name: "Sarah",
      avatarUrl: "⚡",
      efficiency: 82,
      rankDelta: 1,
      tier: "Gold",
      badges: ["Ice Cold"],
      userId: "user-3",
    },
    {
      rank: 4,
      name: "Marcus",
      avatarUrl: "🎯",
      efficiency: 76,
      rankDelta: 0,
      tier: "Silver",
      badges: ["Clutch Comeback"],
      userId: "current-user",
    },
    {
      rank: 5,
      name: "Emma",
      avatarUrl: "🌟",
      efficiency: 72,
      rankDelta: -2,
      tier: "Silver",
      badges: [],
      userId: "user-5",
    },
    {
      rank: 6,
      name: "Jordan",
      avatarUrl: "💎",
      efficiency: 68,
      rankDelta: 1,
      tier: "Silver",
      badges: [],
      userId: "user-6",
    },
    {
      rank: 7,
      name: "Alex",
      avatarUrl: "🔥",
      efficiency: 65,
      rankDelta: 0,
      tier: "Silver",
      badges: [],
      userId: "user-7",
    },
    {
      rank: 8,
      name: "Taylor",
      avatarUrl: "⭐",
      efficiency: 58,
      rankDelta: -1,
      tier: "Bronze",
      badges: [],
      userId: "user-8",
    },
  ],
  weekEndsIn: "3d 14h",
  currentUserId: "current-user",
};
