# Efficiency Explainer: UI + Data Insight Component

## Overview

The Efficiency Explainer is an interactive visualization module that transforms raw screen-time data into quick, motivating insights. It helps users understand their performance through a donut chart, 7-day trend, and context-aware summaries with personality.

## Architecture

### File Structure

```
/features/insights/
└── EfficiencyExplainer.tsx    # Main component with donut chart, trend, and summaries
```

## Features

### 1️⃣ Header

**Components:**
- Title: "Efficiency Insights"
- Subtitle: "Where your time really went today."
- Info icon with tooltip: "Based on daily app-use data"

### 2️⃣ Donut Chart (Split Visualization)

**Purpose:** Instantly show category balance

**Slices:**
| Slice        | Color    | Description                                        |
| ------------ | -------- | -------------------------------------------------- |
| Productive   | `#4ADE80` | LinkedIn, Notes, Finance apps, etc.                |
| Unproductive | `#F87171` | Social media, games, streaming                     |
| Neutral      | `#A3A3A3` | Messaging, clock, maps, misc.                      |

**Center Label:**
- Total time: `4h 27m`
- Efficiency score: `76 (Silver)`

**Animation:**
- Each slice draws from 0 → value (700ms ease-out)
- Center numbers count up (600ms)

**Tooltips:**
- Hover shows category name and exact time

### 3️⃣ 7-Day Mini Trend Chart

**Visualization:**
- Horizontal bar chart showing efficiency per day
- Green bars: efficiency ≥ yesterday
- Red bars: efficiency < yesterday
- Staggered animation (50ms delay per bar)

**Tooltip on Hover:**
```
Tue: Efficiency 82 (+6%)
```

**Streak Indicator:**
- Shows when streak ≥ 3 days
- Format: "🔥 4-day improvement streak"

### 4️⃣ Summary Sentence

**Auto-generated copy based on performance:**

| Context              | Example                                                      |
| -------------------- | ------------------------------------------------------------ |
| Productive Up        | "Productive up +31%, Unproductive down -18%. Keep rolling."  |
| Unproductive Spike   | "Unproductive time spiked +22%. Touch grass."                |
| Balanced             | "Neutral time steady (+1%), solid balance today."            |
| Legendary (≥85)      | "Legendary focus mode activated."                            |

**Logic:**
- Compares today vs yesterday for each category
- Calculates percentage deltas
- Selects appropriate message from copy bank
- Replaces placeholders with actual values

### 5️⃣ "Why?" Toggle → Formula Card

**Expanded View:**
- Title: "How we calculate it"
- Explanation: Plain-English formula description
- "Got it 👍" button to collapse

**Content:**
> "Efficiency = (Productive × positive weight) – (Unproductive × negative weight). Neutral apps don't count. Consistency & streaks add bonus points."

## Data Structure

### Mock Data from `mockData.ts`

```typescript
{
  today: { 
    productiveMins: 135, 
    unproductiveMins: 192, 
    neutralMins: 45 
  },
  yesterday: { 
    productiveMins: 120, 
    unproductiveMins: 210, 
    neutralMins: 30 
  },
  efficiency: { 
    value: 76, 
    tier: "Silver", 
    streakDays: 4, 
    deltaVsYesterday: -12 
  },
  weeklyEfficiency: [
    { day: "Mon", efficiency: 71, change: -3 },
    { day: "Tue", efficiency: 74, change: 3 },
    // ... 7 days total
  ]
}
```

### Derived Values (Frontend)

- **Total Time:** Sum of all categories in hours/minutes
- **Category Deltas:** `(today - yesterday) / yesterdayTotal * 100`
- **Efficiency Trend:** Array of 7 efficiency scores with daily change

## Copy Examples

### Productive Improvements
- "Legendary focus mode activated. +{productiveDelta}% productive."
- "Numbers don't lie—you crushed it today. +{productiveDelta}%."
- "That's what we're talking about. Productive +{productiveDelta}%."

### Unproductive Spikes
- "Unproductive time spiked +{unproductiveDelta}%. Touch grass."
- "Scroll city today. Unproductive +{unproductiveDelta}%."
- "Your phone won today. Unproductive +{unproductiveDelta}%."

### Balanced Days
- "Neutral time steady (+{neutralDelta}%), solid balance today."
- "Right in the pocket. Balanced day."
- "Consistency unlocked. Neutral ±{neutralDelta}%."

## Animations

### Chart Animations
- **Donut slices:** 700ms ease-out from 0 → value
- **Center label:** Count-up effect over 600ms
- **Trend bars:** Staggered entry (50ms delay each)

### Confetti Trigger
- Fires when efficiency ≥ 80 (Gold tier)
- Uses `react-confetti-explosion`
- Triggers once per session

### Expansion
- Formula card slides in with `animate-scale-in`
- Duration: 300ms

## Visual Design

### Colors
- **Productive:** `#4ADE80` (success green)
- **Unproductive:** `#F87171` (destructive red)
- **Neutral:** `#A3A3A3` (muted gray)

### Layout
- Two-column grid on desktop
- Stacked on mobile
- Chart: 64x64 (256px)
- Trend height: 80px

### Typography
- Title: 1.25rem (text-xl)
- Center label: 1.875rem (text-3xl)
- Body: 0.875rem (text-sm)

### Spacing
- Card padding: 1.5rem (p-6)
- Grid gap: 1.5rem (gap-6)
- Internal spacing: 1rem (space-y-4)

## State Management

- Mock data only (no backend calls)
- Formula visibility: Local component state
- Animated values: Local state with `useEffect` timer
- Confetti trigger: `useConfetti` hook with session flag

## Accessibility

- **Reduced Motion:** All animations respect `prefers-reduced-motion`
- **Tooltips:** Contextual information on all interactive elements
- **Color Contrast:** WCAG AA compliant
- **Keyboard Navigation:** Full support via Radix UI primitives

## Responsive Behavior

### Desktop (≥768px)
- Two-column layout
- Chart on left, trend/summary on right

### Mobile (<768px)
- Single column
- Chart stacks above trend/summary
- Maintains full functionality

## Testing Scenarios

### Productive Improvement
1. Set `today.productiveMins > yesterday.productiveMins` by 20+%
2. Summary should show green positive message
3. Donut chart green slice should be larger

### Unproductive Spike
1. Set `today.unproductiveMins > yesterday.unproductiveMins` by 20+%
2. Summary should show red warning message
3. Donut chart red slice should be larger

### Streak Active
1. Set `efficiency.streakDays ≥ 3`
2. Flame icon should appear below trend
3. Message: "🔥 {days}-day improvement streak"

### Formula Toggle
1. Click "Why?" button
2. Formula card should slide in below
3. Click "Got it 👍" to collapse

### Gold Tier Confetti
1. Set `efficiency.value ≥ 80`
2. Confetti should burst once on mount
3. Should not trigger again without remount

## Integration Points

- **Dashboard:** Can be placed as main insight card
- **Profile:** Shows user's historical insights
- **Insights Page:** Primary component on dedicated insights view

## Performance

- Chart renders in <100ms
- Animations use GPU acceleration (transform/opacity)
- Memoized calculations prevent unnecessary re-renders
- Mock data keeps component offline-capable

## Future Enhancements

- Historical comparison slider (compare any two days)
- Export insights as image for social sharing
- Weekly summary email with insights
- Custom goal setting based on insights
- AI-powered recommendations
- Integration with real-time data from Supabase

---

**Built with:** React, TypeScript, Recharts, Tailwind CSS, Radix UI
**Animations:** CSS transitions + React state timers
**Data:** Mock data from `mockData.ts`
**Copy:** Centralized in `copy.ts` for easy editing
