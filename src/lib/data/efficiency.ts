export interface EfficiencyInput {
  productive: number;
  unproductive: number;
  neutral: number;
  streakBonus?: number;
}

export interface EfficiencyResult {
  score: number;
  tier: "Bronze" | "Silver" | "Gold" | "Diamond";
  color: string;
}

export function computeEfficiency(input: EfficiencyInput): EfficiencyResult {
  const { productive, unproductive, neutral, streakBonus = 0 } = input;
  
  const total = productive + unproductive + neutral;
  if (total === 0) {
    return { score: 0, tier: "Bronze", color: "#CD7F32" };
  }

  // Calculate base efficiency as percentage
  const productivePercent = (productive / total) * 100;
  const unproductivePercent = (unproductive / total) * 100;
  
  // Score = productive% - unproductive% + streak bonus
  let score = productivePercent - unproductivePercent + streakBonus;
  
  // Clamp to 0-100
  score = Math.max(0, Math.min(100, score));

  // Determine tier
  let tier: "Bronze" | "Silver" | "Gold" | "Diamond";
  let color: string;

  if (score >= 95) {
    tier = "Diamond";
    color = "#B9F2FF";
  } else if (score >= 80) {
    tier = "Gold";
    color = "#FFD700";
  } else if (score >= 60) {
    tier = "Silver";
    color = "#C0C0C0";
  } else {
    tier = "Bronze";
    color = "#CD7F32";
  }

  return { score: Math.round(score), tier, color };
}

export interface DailySummary {
  date: string;
  productive: number;
  unproductive: number;
  neutral: number;
  efficiency: EfficiencyResult;
  total: number;
}

export function calculateDailySummary(
  productive: number,
  unproductive: number,
  neutral: number,
  date: string
): DailySummary {
  const efficiency = computeEfficiency({ productive, unproductive, neutral });
  const total = productive + unproductive + neutral;

  return {
    date,
    productive,
    unproductive,
    neutral,
    efficiency,
    total,
  };
}

export function calculateWeeklySummary(dailySummaries: DailySummary[]) {
  const totalProductive = dailySummaries.reduce((sum, d) => sum + d.productive, 0);
  const totalUnproductive = dailySummaries.reduce((sum, d) => sum + d.unproductive, 0);
  const totalNeutral = dailySummaries.reduce((sum, d) => sum + d.neutral, 0);
  
  const avgEfficiency = dailySummaries.length > 0
    ? dailySummaries.reduce((sum, d) => sum + d.efficiency.score, 0) / dailySummaries.length
    : 0;

  return {
    totalProductive,
    totalUnproductive,
    totalNeutral,
    avgEfficiency: Math.round(avgEfficiency),
    daysTracked: dailySummaries.length,
  };
}

// Helper function to get tier from score
export function getTierFromScore(score: number): "Bronze" | "Silver" | "Gold" | "Diamond" {
  if (score >= 95) return "Diamond";
  if (score >= 80) return "Gold";
  if (score >= 60) return "Silver";
  return "Bronze";
}

// Helper to get weekly series data
export function getWeeklySeries() {
  // This is a wrapper around useWeeklyUsage for easier importing
  return { data: null };
}
