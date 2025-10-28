# Changelog - UX Refresh

## Phase 4: Leaderboard Redesign - Motion + Status + Weekly Rhythm (2025-10-28)

### New Files Created

- **`src/features/leaderboard/Leaderboard.tsx`**: Main leaderboard component with header, filters (Squad/Global/Friends), weekly reset countdown, and animated list.

- **`src/features/leaderboard/LeaderboardItem.tsx`**: Individual rank row with avatar, name, efficiency badge, rank delta, badges, and hover animations.

- **`src/features/leaderboard/Badges.tsx`**: Badge chip component with tooltips showing badge name and description.

- **`src/features/leaderboard/RankDeltaIndicator.tsx`**: Rank change indicator with color-coded arrows (green up, red down, gray neutral) and motivational tooltips.

- **`README-LEADERBOARD.md`**: Complete documentation of leaderboard architecture, animations, badge system, and testing scenarios.

### Modified Files

- **`src/features/dashboard/mockData.ts`**: Added leaderboard mock data structure with 8 users, including rank, efficiency, tier, badges, and rank deltas.

- **`src/features/dashboard/copy.ts`**: Added leaderboard-specific copy including rank change messages, top rank copy, empty state text, and badge descriptions.

- **`CHANGELOG.md`**: Added Phase 4 documentation.

### Features Implemented

- **Animated Rank Deltas**: Green/red arrows show rank changes with smooth slide-up animation
- **Tier System**: Gold (≥80%), Silver (60-79%), Bronze (<60%) with color-coded badges
- **Badge System**: 4 achievement badges (Most Improved, Streak King, Ice Cold, Clutch Comeback) with tooltips
- **Filter Tabs**: Squad / Global / Friends selection (UI only, mock data)
- **Weekly Reset Timer**: Countdown showing time until leaderboard resets
- **Top 3 Highlighting**: Gradient backgrounds for top 3 ranks with trophy icons
- **Current User Highlight**: Primary border and background for user's row
- **Empty State**: Invite friends CTA with clipboard copy functionality
- **Hover Effects**: Scale (1.02x) with shadow lift on row hover
- **Staggered Animations**: 50ms delay per row on mount
- **Tooltips**: Contextual information on badges and rank deltas

### Copy Tone Examples

| Context     | Example                                      |
| ----------- | -------------------------------------------- |
| Rank Up     | "🔥 Up 2 ranks! You're built different."     |
| Rank Down   | "👀 Someone's been scrolling again."         |
| Top 1       | "🥇 You're the GOAT this week."              |

### Visual Design

- **Tier Colors**: Gold (yellow), Silver (gray), Bronze (orange)
- **Top 3 Gradient**: Fades from tier color to transparent background
- **Current User**: Primary border with background tint
- **Animations**: Scale on hover, slide-up deltas, pulse clock icon
- **Spacing**: Consistent with dashboard design system

### State Management

- Mock data only (no backend integration yet)
- Filter state managed locally (squad/global/friends)
- Current user detection via userId comparison
- Timer updates every 60 seconds (mock countdown)

### User Journey

1. User navigates to Communities page
2. Leaderboard renders with animated entry
3. User sees their rank highlighted with primary border
4. Hover on rank delta shows motivational tooltip
5. Hover on badge shows achievement description
6. Filter tabs switch between Squad/Global/Friends views
7. Empty state appears if no users in squad

---

## Phase 3: Dashboard Redesign - Emotion + Progression (2025-10-28)

### New Files Created

- **`src/features/dashboard/Dashboard.tsx`**: Main dashboard component that orchestrates three vertical sections with mock data integration.

- **`src/features/dashboard/TodayAtAGlance.tsx`**: Daily performance snapshot with animated count-up, delta indicators, and motivational copy.

- **`src/features/dashboard/WeeklyProgress.tsx`**: 7-day bar chart component with stacked segments, tooltips, and streak indicator with animated flame.

- **`src/features/dashboard/EfficiencyMeter.tsx`**: Circular progress ring with tier badges (Gold/Silver/Bronze), gradient colors, and confetti celebration.

- **`src/features/dashboard/mockData.ts`**: Mock data structure for dashboard metrics (today, yesterday, efficiency, weekly).

- **`src/features/dashboard/copy.ts`**: Centralized motivational copy with context-aware messages (improvement/decline/neutral).

- **`README-DASHBOARD.md`**: Complete documentation of dashboard architecture, animations, design system integration, and testing scenarios.

### Modified Files

- **`src/pages/Dashboard.tsx`**: Replaced entire implementation with import of new modular `Dashboard` component from `/features/dashboard/`.

- **`CHANGELOG.md`**: Added Phase 3 documentation.

### Features Implemented

- **Three Vertical Sections**: Today At A Glance → Weekly Progress → Efficiency Meter
- **Animated Count-Up**: Numbers smoothly animate from 0 → value (800ms)
- **Delta Indicators**: Green/red arrows showing improvement or decline vs yesterday
- **7-Day Bar Chart**: Stacked segments (productive/unproductive/neutral) with slide-in animation
- **Streak Tracking**: Flame icon pulses when streak ≥3 days
- **Tier System**: Gold (≥80%), Silver (60-79%), Bronze (<60%) with dynamic gradients
- **Confetti Celebration**: Triggers when crossing Gold threshold
- **Motivational Copy**: Context-aware messages based on performance
- **Tooltips**: Hover/tap to see detailed breakdowns on weekly chart
- **"Week 1 Active" Badge**: Shows when onboarding is complete
- **Reduced Motion Support**: All animations respect accessibility preferences

### Design System Integration

- Uses semantic tokens from `index.css` (all HSL colors)
- Consistent spacing: `px-4 py-3` baseline
- Font hierarchy: h2 (1.5rem), h3 (1.2rem), body (0.9rem)
- Dark gradient background with soft shadows
- Mobile-first responsive design (320px+)

### Copy Tone Examples

| Context     | Example                                   |
| ----------- | ----------------------------------------- |
| Improvement | "🔥 Big comeback today—keep that energy." |
| Decline     | "Bruh, 5h on TikTok? Rough."              |
| Neutral     | "Holding steady—momentum's everything."   |

### State Management

- Integrates with `OnboardingContext` for completion status
- Mock data only (no backend calls yet)
- Ready for real-time Supabase integration
- State persists via context `localStorage`

### User Journey

1. User completes onboarding → redirected to `/dashboard`
2. Dashboard renders with three animated sections
3. Count-up animations play on mount
4. Weekly bars slide in left-to-right with stagger
5. Efficiency meter fills to current value
6. Confetti triggers if tier = Gold
7. "Week 1 Active" badge visible in header

---

## Phase 2: Onboarding Flow (2025-10-28)

### New Files Created

- **`src/features/onboarding/OnboardingContext.tsx`**: React Context provider for onboarding state management. Persists state to localStorage including completion status, sync settings, squad details.

- **`src/features/onboarding/WelcomeScreen.tsx`**: First onboarding screen explaining the core loop with animated icon cards and competitive messaging.

- **`src/features/onboarding/ConnectScreen.tsx`**: Second screen for screen time sync setup. Offers both Apple Shortcuts connection (mock) and demo mode skip path.

- **`src/features/onboarding/SquadSetupScreen.tsx`**: Final screen for squad creation with invite link generation, confetti celebration on completion.

- **`src/pages/Onboarding.tsx`**: Main orchestrator component that manages flow between the 3 screens with skip functionality.

- **`README-ONBOARDING.md`**: Complete documentation of onboarding flow, state management, customization guide, and test scenarios.

### Modified Files

- **`src/App.tsx`**: Added `/onboarding` route to routing configuration.

- **`src/main.tsx`**: Wrapped app with `OnboardingProvider` for global state access.

### Features Implemented

- **3-Screen Flow**: Welcome → Connect → Squad Setup
- **< 60 Second Completion**: Streamlined, skippable flow
- **Mock Integrations**: All features work without backend (Apple Shortcuts mock, invite links)
- **State Persistence**: localStorage-backed state survives page refreshes
- **Confetti Celebration**: Visual feedback on onboarding completion
- **Skip Paths**: "Skip intro" button + demo mode option
- **Mobile-First Design**: Fully responsive with smooth transitions
- **Accessibility**: Reduced-motion support, keyboard navigation

### User Journey

1. New user lands on app → redirected to `/onboarding`
2. Welcome screen explains loop → proceeds to Connect
3. Connect screen offers sync or demo mode → proceeds to Squad
4. Squad screen creates competitive context → confetti → dashboard redirect
5. State marked as `onboardingComplete = true` → future visits skip to dashboard

---

## Phase 1: Global Changes (2025-10-28)

## Files Changed

### New Files Created

- **`src/lib/copy.ts`**: Centralized copy constants for the entire app. All user-facing strings now live here for easy iteration. Tone: competitive, playful, slightly spicy—but never mean/unsafe.

- **`src/components/CoreLoopStrip.tsx`**: Reusable 3-step "How It Works" component that explains the core loop (Track → Compete → Win/Roast). Features hover animations and can be placed on any page.

- **`src/hooks/useConfetti.ts`**: Custom hook for triggering confetti celebrations on milestones (e.g., streak increases, rank ups). Respects reduced-motion preferences.

- **`CHANGELOG.md`** (this file): Summary of all changes made during the UX refresh.

- **`README-LOOP.md`**: Documentation explaining the core loop and where it's surfaced throughout the app.

### Modified Files

- **`src/index.css`**: 
  - Added new animations: `scale-in`, `slide-up`, `count-up`
  - Added utility classes: `hover-lift`, `hover-glow`
  - Added accessibility support for reduced-motion preferences
  - All animations respect `prefers-reduced-motion` for accessibility

- **`src/pages/Index.tsx`**:
  - Added `CoreLoopStrip` component after Hero section
  - Imported `COPY` constants for consistent messaging
  - Added `hover-lift` classes to CTAs for better interactivity
  - Replaced hardcoded footer text with centralized copy

- **`src/components/Hero.tsx`**:
  - Replaced hardcoded copy with `COPY` constants
  - Added staggered `animate-slide-up` animations to headline, subheadline, and CTAs
  - Added `hover-lift` classes to all buttons for micro-interactions

- **`src/components/Features.tsx`**:
  - Replaced hardcoded feature copy with `COPY.features` constants
  - Added `hover-lift` class to feature cards for better interactivity

- **`package.json`** (via dependency tool):
  - Added `react-confetti-explosion` for milestone celebrations

## Why These Changes?

### 1. **Core Loop Clarity**
The `CoreLoopStrip` component makes it crystal clear how the app works in 3 simple steps. This reduces confusion and gets users excited about the competitive loop.

### 2. **Consistent Copy Tone**
All copy is now centralized in `copy.ts`, making it easy to:
- Maintain a consistent voice (competitive, playful, spicy)
- Update messaging across the entire app in one place
- A/B test different copy variations

### 3. **Micro-Interactions**
New animations and hover states make the UI feel alive:
- Cards lift on hover with glowing shadows
- Staggered slide-up animations on page load
- Count-up animations for stat changes
- All animations respect accessibility (reduced-motion)

### 4. **Milestone Celebrations**
The `useConfetti` hook enables celebration moments:
- Streak milestones
- Rank improvements
- Efficiency tier upgrades
- Adds delight and encourages engagement

## Testing

All changes have been tested for:
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Accessibility (reduced-motion support)
- ✅ Performance (animations are GPU-accelerated)
- ✅ No console errors
- ✅ Backwards compatibility (existing features work as expected)

## Next Steps

With these global changes in place, we're ready to tackle:
1. Onboarding flow (3 screens, quick start)
2. Dashboard redesign (emotion + progression)
3. Leaderboard enhancements (rank deltas, badges)
4. And more targeted features...

---

**Date**: 2025-10-28  
**Branch**: `ux-refresh-core-loop` (recommended)  
**Impact**: Foundation for all future UX improvements
