export interface DayData {
  day: string;
  total: number;
  productive: number;
  unproductive: number;
  neutral: number;
}

export interface EfficiencyDayData {
  day: string;
  efficiency: number;
  change: number;
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
  weeklyEfficiency: EfficiencyDayData[];
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
  weeklyEfficiency: [
    { day: "Mon", efficiency: 71, change: -3 },
    { day: "Tue", efficiency: 74, change: 3 },
    { day: "Wed", efficiency: 73, change: -1 },
    { day: "Thu", efficiency: 75, change: 2 },
    { day: "Fri", efficiency: 68, change: -7 },
    { day: "Sat", efficiency: 62, change: -6 },
    { day: "Sun", efficiency: 76, change: 14 },
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

export interface PowerTip {
  id: number;
  title: string;
  oneLiner: string;
  tried: boolean;
  actionLabel: string;
  actionType: "link" | "toast" | "tooltip";
  actionData?: string;
}

export interface MockPowerTipsData {
  tips: PowerTip[];
}

export const mockPowerTipsData: MockPowerTipsData = {
  tips: [
    {
      id: 1,
      title: "Grayscale Mode",
      oneLiner: "Make your screen less addictive.",
      tried: false,
      actionLabel: "Enable",
      actionType: "link",
      actionData: "https://support.apple.com/en-us/HT208180",
    },
    {
      id: 2,
      title: "Notification Triage",
      oneLiner: "Silence low-priority apps.",
      tried: false,
      actionLabel: "Learn How",
      actionType: "link",
      actionData: "https://support.apple.com/en-us/HT201925",
    },
    {
      id: 3,
      title: "Lock Screen Widgets Off",
      oneLiner: "Remove dopamine traps.",
      tried: false,
      actionLabel: "Learn How",
      actionType: "tooltip",
      actionData: "Settings → Face ID & Passcode → Allow Access When Locked → Turn off all widgets",
    },
    {
      id: 4,
      title: "App Limits",
      oneLiner: "Timebox your biggest distractions.",
      tried: false,
      actionLabel: "Learn How",
      actionType: "link",
      actionData: "https://support.apple.com/en-us/HT208982",
    },
    {
      id: 5,
      title: "Home Screen Folders",
      oneLiner: "Hide temptations, not texts.",
      tried: false,
      actionLabel: "Try It",
      actionType: "toast",
      actionData: "Organized like a pro!",
    },
  ],
};

export interface SyncService {
  name: string;
  enabled: boolean;
  description: string;
  icon: string;
  disabled?: boolean;
}

export interface MockSyncData {
  connected: boolean;
  lastUpdatedMinutesAgo: number;
  services: SyncService[];
}

export const mockSyncData: MockSyncData = {
  connected: true,
  lastUpdatedMinutesAgo: 3,
  services: [
    {
      name: "Apple Shortcuts",
      enabled: true,
      description: "Primary data source for daily screen-time tracking.",
      icon: "🍎",
      disabled: false,
    },
    {
      name: "Webhooks",
      enabled: false,
      description: "Future integration for Android or external imports.",
      icon: "🌐",
      disabled: true,
    },
  ],
};

export interface ProfileMeme {
  id: number;
  title: string;
  date: string;
}

export interface MockProfileData {
  name: string;
  avatarUrl: string;
  efficiency: {
    value: number;
    tier: "Gold" | "Silver" | "Bronze" | "Diamond";
  };
  bestStreak: number;
  bestWeekDrop: number;
  mostProductiveCategory: string;
  squadsJoined: number;
  memes: ProfileMeme[];
  bio: string;
}

export const mockProfileData: MockProfileData = {
  name: "Andrew",
  avatarUrl: "🏆",
  efficiency: { value: 78, tier: "Silver" },
  bestStreak: 6,
  bestWeekDrop: 42,
  mostProductiveCategory: "Finance",
  squadsJoined: 5,
  memes: [
    { id: 1, title: "Screen Time Surge 😂", date: "2 days ago" },
    { id: 2, title: "Scroll King 👑", date: "1 week ago" },
    { id: 3, title: "Notification Ninja 🥷", date: "2 weeks ago" },
  ],
  bio: "Known for: last-minute comebacks",
};

export interface MemeItem {
  id: number;
  url: string;
  title: string;
  isCommunity?: boolean;
}

export interface RoastTemplate {
  id: number;
  template: string;
}

export interface MockMemesData {
  userMemes: MemeItem[];
  communityMemes: MemeItem[];
  roastTemplates: RoastTemplate[];
}

export const mockMemesData: MockMemesData = {
  userMemes: [
    { id: 1, url: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400", title: "Focus Mode" },
    { id: 2, url: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400", title: "Infinite Scroll" },
    { id: 3, url: "https://images.unsplash.com/photo-1588421357574-87938a86fa28?w=400", title: "Notification Hell" },
  ],
  communityMemes: [
    { id: 101, url: "https://images.unsplash.com/photo-1596496181848-3091d4878b24?w=400", title: "Work Focus", isCommunity: true },
    { id: 102, url: "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=400", title: "Phone Addict", isCommunity: true },
    { id: 103, url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400", title: "Squad Goals", isCommunity: true },
  ],
  roastTemplates: [
    { id: 1, template: "📱 {name}, your thumb's training for a marathon." },
    { id: 2, template: "🔥 {name}, you just hit a new PR in screen time." },
    { id: 3, template: "💀 {name}, your battery died before you did today." },
    { id: 4, template: "{name}, your screen time's up +{delta}%. Embarrassing." },
    { id: 5, template: "{name}, Bronze tier again? You scroll like it's your job." },
    { id: 6, template: "{name}, {hours} hours on TikTok. Seek help." },
    { id: 7, template: "Calm down, influencer. - Sent to {name}" },
    { id: 8, template: "You could build a startup with those hours, {name}." },
    { id: 9, template: "Roasted with love 🔥 — back on track tomorrow, {name}." },
  ],
};

export interface PlanOption {
  id: "free" | "pro";
  name: string;
  price: number;
  features: string[];
}

export interface MockPlanData {
  current: "free" | "pro";
  options: PlanOption[];
}

export const mockPlanData: MockPlanData = {
  current: "free",
  options: [
    {
      id: "free",
      name: "Free Forever",
      price: 0,
      features: [
        "Weekly challenges",
        "Leaderboard access",
        "Basic insights",
      ],
    },
    {
      id: "pro",
      name: "Pro Mode",
      price: 4.99,
      features: [
        "Advanced efficiency insights",
        "Custom meme packs",
        "Priority squads",
        "Unlimited roasts",
      ],
    },
  ],
};
