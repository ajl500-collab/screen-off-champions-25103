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
