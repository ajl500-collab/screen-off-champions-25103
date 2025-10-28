# Leaderboard Redesign: Motion + Status + Weekly Rhythm

## Overview

The Leaderboard has been redesigned to create a fast, visually engaging, and emotionally competitive experience. Users can instantly see their rank, how positions are shifting, and feel the competitive energy through motion, badges, and playful copy.

## Architecture

### File Structure

```
/features/leaderboard/
├── Leaderboard.tsx              # Main component with header, filters, and list
├── LeaderboardItem.tsx          # Individual rank row with animations
├── Badges.tsx                   # Badge display with tooltips
└── RankDeltaIndicator.tsx       # Rank change arrows with colors
```

## Features

### 1️⃣ Leaderboard Header

**Components:**
- Title: "Leaderboard — Week 1"
- Weekly reset countdown: "Resets in 3d 14h — keep climbing"
- Filter tabs: Squad / Global / Friends
- Top rank message for #1 position

**Animations:**
- Countdown timer updates live (mock)
- Pulse animation on clock icon
- Special message for current user if #1

### 2️⃣ Leaderboard List

**Row Elements:**
- Rank number with trophy icon (top 3)
- Avatar emoji
- Player name (truncated at 14 chars)
- Badge chips (if earned)
- Efficiency percentage with tier color
- Rank delta indicator (↑↓ arrows)

**Tier System:**
- 🥇 Gold (≥80%): Yellow gradient
- 🥈 Silver (60-79%): Gray gradient
- 🥉 Bronze (<60%): Orange gradient

**Animations:**
- Scale on hover (1.02x with shadow)
- Staggered fade-in (50ms delay per row)
- Rank delta arrows slide up
- Top 3 get gradient background

### 3️⃣ Badge System

**Available Badges:**
| Badge               | Emoji | Criteria                        |
| ------------------- | ----- | ------------------------------- |
| Most Improved       | 🏹    | Biggest efficiency gain         |
| Streak King         | 🔥    | Longest improvement streak      |
| Ice Cold            | 🧊    | Most consistent screen time     |
| Clutch Comeback     | 🕹️   | Highest gain in last 24h        |

**Features:**
- Displayed as small chips below player name
- Hover shows tooltip with description
- Styled with primary color theme

### 4️⃣ Rank Delta Indicator

**States:**
- **Up (green):** TrendingUp icon + positive number
- **Down (red):** TrendingDown icon + negative number
- **Neutral (gray):** Minus icon + dash

**Tooltip:**
- Shows motivational copy (e.g., "🔥 Up 2 ranks! You're built different.")
- Displays current efficiency percentage

### 5️⃣ Empty State

When no users exist:
- Trophy emoji icon
- Title: "Your squad's empty — invite 2 friends and start roasting."
- Subtitle: "Create a squad to see how you rank against your friends."
- Button: "Invite Friends" (copies mock invite link)

## Mock Data Structure

```typescript
{
  leaderboard: [
    {
      rank: 1,
      name: "Andrew",
      avatarUrl: "🏆",
      efficiency: 91,
      rankDelta: 2,
      tier: "Gold",
      badges: ["Streak King"],
      userId: "user-1"
    },
    // ... more entries
  ],
  weekEndsIn: "3d 14h",
  currentUserId: "current-user"
}
```

## Copy Tone

Competitive, playful, and motivational:

| Context     | Example                                      |
| ----------- | -------------------------------------------- |
| Rank Up     | "🔥 Up 2 ranks! You're built different."     |
| Rank Down   | "👀 Someone's been scrolling again."         |
| Top 1       | "🥇 You're the GOAT this week."              |
| Empty State | "Your squad's empty — invite 2 friends..."   |

All copy is centralized in `copy.ts` for easy editing.

## Visual Design

### Colors
- **Gold tier:** `text-yellow-500` / `bg-yellow-500/10`
- **Silver tier:** `text-gray-300` / `bg-gray-300/10`
- **Bronze tier:** `text-orange-600` / `bg-orange-600/10`
- **Top 3 gradient:** Fades from tier color to transparent
- **Current user:** `border-primary` / `bg-primary/5`

### Spacing & Typography
- Card padding: `p-6`
- Item padding: `p-4`
- Gap between items: `gap-3`
- Font sizes: Rank (2xl), Name (base), Efficiency (lg)

### Animations
- **Scale on hover:** `scale-[1.02]` + shadow lift
- **Staggered entry:** `animationDelay: ${index * 50}ms`
- **Rank delta:** Slide up animation
- **Top glow:** Pulse shadow every 5s (planned)

## State Management

- Uses mock data from `mockData.ts`
- Filter state: `squad` | `global` | `friends`
- Current user highlighting based on `currentUserId`
- Timer updates every 60 seconds (mock)

## Responsive Design

- Mobile-first layout
- Name truncates at 140px max-width
- Badges wrap to new line if needed
- Touch-friendly hover states
- Works from 320px to desktop

## Accessibility

- All animations respect `prefers-reduced-motion`
- Tooltips provide context for badges and deltas
- Color contrast meets WCAG AA standards
- Keyboard navigation supported via Radix UI primitives

## Testing Scenarios

### Rank Change Animation
1. Change `rankDelta` from 0 → +2
2. Item should slide smoothly
3. Green arrow appears with animation

### Top 3 Highlighting
1. Set efficiency to 95 for new user
2. User moves to rank 1
3. Gradient background applies
4. Trophy icon appears

### Empty State
1. Set `leaderboard = []`
2. Empty state card shows
3. "Invite Friends" button copies link

### Current User Highlight
1. Scroll to current user row
2. Row has primary border and background
3. "(You)" label visible next to name

## Integration Points

- **Communities page:** Renders leaderboard within squad context
- **Dashboard:** Can show mini leaderboard preview
- **Profile:** Links to full leaderboard view
- **Onboarding:** Explains leaderboard in context flow

## Future Enhancements

- Real-time rank updates via WebSocket
- Animated transitions when ranks change
- Confetti for first-time top 3
- Historical rank chart
- Weekly summary email with rank changes
- Push notifications for rank milestones

---

**Built with:** React, TypeScript, Tailwind CSS, Radix UI, Lucide Icons
**Animations:** CSS transitions + React state
**Data:** Mock data structure in `mockData.ts`
