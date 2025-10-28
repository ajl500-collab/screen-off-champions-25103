# Player Card Profile

## Overview

The **Player Card** is a sleek, data-driven profile page that transforms user performance into a stat-driven gaming profile meets clean Apple Fitness dashboard aesthetic. It displays tier status, performance metrics, streaks, and personal history in an engaging and motivating way.

## Components

### 1. PlayerCard.tsx
Main profile component featuring:
- **Avatar with Tier Badge**: Large circular avatar with dynamic tier badge overlay
- **Tier-based Gradients**: Visual feedback based on performance (Diamond, Gold, Silver, Bronze)
- **Editable Bio**: 80-character bio field with auto-save
- **Efficiency Summary**: Current performance meter with streak data
- **CTA Buttons**: Quick navigation to leaderboard and share functionality

### 2. PlayerStatsGrid.tsx
Stats display component with:
- **4 Key Metrics**:
  - 🔥 Best Streak (animated count-up)
  - 📆 Best Week (percentage drop)
  - 📖 Most Productive Category
  - 👥 Squads Joined (animated count-up)
- **Smooth Animations**: Staggered fade-in and count-up effects
- **Hover Effects**: Subtle border and shadow transitions

### 3. MemeHistory.tsx
Roast collection display:
- **Last 3 Memes**: Recent roasts received
- **Modal Preview**: Click to view full meme (mock)
- **Empty State**: Friendly message when no roasts exist

## Features

### Tier System
- **💎 Diamond**: 95+ efficiency score
- **🥇 Gold**: 80-94 efficiency score
- **🥈 Silver**: 60-79 efficiency score  
- **🥉 Bronze**: <60 efficiency score

### Visual Effects
- **Tier Glow**: Animated gradient glow for Gold and Diamond tiers
- **Grayscale Avatar**: Applied when efficiency < 60
- **Count-up Animations**: 700ms duration for numeric stats
- **Confetti**: Celebratory effect when reaching Gold tier (80+)
- **Hover States**: Smooth transitions on interactive elements

### Data Persistence
- **Bio Field**: Saved to localStorage on blur
- **Auto-save**: Bio persisted across sessions
- **Character Limit**: 80 characters maximum

## Mock Data

Located in `src/features/dashboard/mockData.ts`:

```typescript
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
```

## Copy Tone

Encouraging and competitive messages from `copy.ts`:

- **Diamond**: "You're basically a focus machine."
- **Gold**: "Elite tier. Keep the streak alive."
- **Silver**: "Solid performance. Gold is next."
- **Bronze**: "Bronze today. Tomorrow's comeback season."

## Usage

```tsx
import { PlayerCard } from "@/features/profile/PlayerCard";

// In your Profile page
<PlayerCard />
```

## Responsive Design

- **Mobile**: Single column layout, compact stats grid (2x2)
- **Desktop**: Wider card format, stats grid (4x1)
- **All Sizes**: Maintains visual hierarchy and readability

## Accessibility

- Semantic HTML structure
- Keyboard navigation support
- ARIA labels on interactive elements
- Reduced motion support for animations

## Future Enhancements

- Real data integration from Supabase
- Screenshot/share card functionality
- Achievement badges system
- Weekly history timeline
- Squad/community integration

---

**Related Documentation:**
- [Dashboard](./README-DASHBOARD.md)
- [Leaderboard](./README-LEADERBOARD.md)
- [Efficiency Explainer](./README-EFFICIENCY.md)
