# Changelog - UX Refresh

## Phase 7: Sync Status + Connected Services (2025-10-28)

### New Files Created

- **`src/features/settings/SyncStatus.tsx`**: Sync status card with visual indicators (✅/❌), last updated timestamp, connect/reconnect button with mock loading state (1.5s), and localStorage persistence.

- **`src/features/settings/ConnectedServices.tsx`**: Services list component with Apple Shortcuts and Webhooks integrations, toggle switches, privacy info tooltips, and collapsible troubleshooting accordion.

- **`src/pages/SyncSettings.tsx`**: Dedicated sync settings page at `/settings/sync` route with back navigation and both SyncStatus and ConnectedServices components.

- **`README-SYNC.md`**: Complete documentation of sync module architecture, state management, user flows, and testing scenarios.

### Modified Files

- **`src/features/dashboard/mockData.ts`**: Added `SyncService` and `MockSyncData` interfaces with `mockSyncData` object containing connection status, last updated time, and services array.

- **`src/features/dashboard/copy.ts`**: Added `SyncCopy` interface and `syncCopy` object with connected/disconnected states, reconnecting message, success/error toasts, and troubleshooting steps.

- **`src/pages/Settings.tsx`**: Added "Sync Status" link button with icon and description that navigates to `/settings/sync`.

- **`src/App.tsx`**: Added `/settings/sync` route with SyncSettings page component, imported SyncSettings.

- **`CHANGELOG.md`**: Added Phase 7 documentation.

### Features Implemented

- **Sync Status Card**: Visual health check with green (connected) or red (disconnected) indicators, pulse animation when disconnected
- **Connection Flow**: Mock connect/reconnect with 1.5s loader state, success toast, status update
- **Last Updated Timestamp**: Shows "Last updated: Xm ago" when connected
- **Connected Services List**: Two services (Apple Shortcuts enabled, Webhooks coming soon)
- **Service Toggles**: Functional switch for Apple Shortcuts with toast feedback
- **Privacy Tooltip**: "We'll never access private data; only total usage time"
- **Troubleshooting Accordion**: Collapsible section with 3 help steps, smooth expand/collapse
- **LocalStorage Persistence**: Sync status and service states survive page refresh
- **Toast Notifications**: Success messages on connect/disconnect and toggle changes
- **Settings Link**: Accessible from main settings page with icon and description

### Copy Tone Examples

| Context      | Example                                       |
| ------------ | --------------------------------------------- |
| Connected    | "All synced. You're running clean."           |
| Disconnected | "No data yet — reconnect to flex your focus." |
| Reconnecting | "Syncing with the mothership…"                |
| Success      | "Connected successfully 🎯"                   |

### Visual Design

- **Status Card Colors**: Green border/bg (connected), Red border/bg with pulse (disconnected)
- **Service Cards**: Primary border/bg when enabled, neutral when disabled
- **Animations**: 300ms fade-in, pulse on disconnect, smooth accordion
- **Icons**: Check (✅) for connected, X (❌) for disconnected, Loader during sync

### State Management

- **LocalStorage Keys**: 
  - `screenVS-sync-status`: Stores connection state and last updated time
  - `screenVS-connected-services`: Stores service toggle states
- **Persistence**: All states load on mount and save on change
- **Mock Delay**: 1.5s simulated connection time

### User Journey

1. User navigates to Settings
2. Clicks "Sync Status" button
3. Sees current connection status card
4. Views available services with toggles
5. Clicks "Reconnect" → loader → success toast
6. Toggle service on/off → toast confirmation
7. Expand troubleshooting section for help
8. Back to main Settings

### Accessibility

- All buttons keyboard accessible
- Tooltip provides privacy context
- Color contrast WCAG AA compliant
- Touch targets 44px minimum
- Animations respect `prefers-reduced-motion`

---

## Phase 6: Power-Tips Carousel - Daily Habits + Unlockables (2025-10-28)

### New Files Created

- **`src/features/tips/PowerTipsCarousel.tsx`**: Swipeable carousel component with navigation arrows, pagination dots, localStorage persistence, and progress tracking.

- **`src/features/tips/PowerTipCard.tsx`**: Individual tip card with gradient backgrounds, unlock animations, ribbon badges, and action buttons.

- **`src/pages/Tips.tsx`**: Standalone tips page with full carousel and additional context about why tips work.

- **`README-TIPS.md`**: Complete documentation of carousel architecture, unlock system, action types, and integration points.

### Modified Files

- **`src/features/dashboard/mockData.ts`**: Added `PowerTip` interface and `mockPowerTipsData` with 5 starter tips including action types (link/toast/tooltip).

- **`src/features/dashboard/Dashboard.tsx`**: Added PowerTipsCarousel as fifth section below Efficiency Explainer.

- **`src/App.tsx`**: Added `/tips` route and imported Tips page component.

- **`src/index.css`**: Added shimmer animation for unlocked card effect.

- **`CHANGELOG.md`**: Added Phase 6 documentation.

### Features Implemented

- **Swipeable Carousel**: Horizontal scroll with snap points, smooth 300ms transitions
- **Navigation**: Desktop arrows (left/right) + mobile swipe gestures
- **Pagination Dots**: Visual indicator with active state (2px → 8px width)
- **5 Starter Tips**: Grayscale, Notifications, Widgets, App Limits, Home Screen
- **Action Types**: Link (opens URL), Toast (shows message), Tooltip (displays instructions)
- **Unlock System**: Cards transition from gradient → muted with ribbon badge
- **LocalStorage Persistence**: Unlock states survive page refreshes
- **Progress Tracking**: "X / 5 unlocked" text below carousel
- **XP Toast**: "+5 Efficiency XP" feedback on unlock
- **Shimmer Effect**: Subtle gradient animation on unlocked cards
- **Responsive Layout**: 1 card (mobile) → 2-3 cards (desktop)
- **View All Button**: Links to dedicated `/tips` route

### Copy Tone Examples

| Context     | Example                                    |
| ----------- | ------------------------------------------ |
| Title       | "Grayscale Mode"                           |
| One-liner   | "Make your screen less addictive."         |
| Success     | "+5 Efficiency XP"                         |
| Tooltip     | "Settings → Face ID & Passcode → ..."     |

### Visual Design

- **Default Card**: Gradient `from-primary/10 via-accent/10 to-primary/10`
- **Unlocked Card**: `bg-muted/30` with 60% opacity
- **Ribbon**: Green badge with check icon (top-right)
- **Hover**: Scale 1.05x with shadow lift
- **Animations**: 300ms transitions, shimmer effect

### State Management

- **LocalStorage Key**: `screenVS-power-tips-tried`
- **Data**: Array of unlocked tip IDs `[1, 3, 5]`
- **Functions**: `markTipTried(id)` updates state + storage
- **Persistence**: Loads on mount, survives refresh

### User Journey

1. User sees carousel on Dashboard
2. Swipes/clicks through 5 tips
3. Clicks CTA button (e.g., "Enable")
4. Action executes (opens link/shows toast/displays tooltip)
5. Card updates to "unlocked" with ribbon
6. Toast shows "+5 Efficiency XP"
7. Progress updates "1 / 5 unlocked"
8. User reloads page → unlocked state persists
9. User clicks "View All →" → navigates to `/tips`

### Standalone Tips Page

- Full carousel with all tips
- "Why These Work" section with detailed explanations
- "Pro Tip" card with stacking recommendations
- Mobile-friendly layout

### Accessibility

- All animations respect `prefers-reduced-motion`
- Pagination dots have aria-labels
- Touch targets meet 44px minimum
- Keyboard navigation supported
- Color contrast WCAG AA compliant

---

## Phase 5: Efficiency Explainer - UI + Data Insight Component (2025-10-28)

### New Files Created

- **`src/features/insights/EfficiencyExplainer.tsx`**: Interactive insights component with donut chart showing productive/unproductive/neutral time split, 7-day efficiency trend chart, auto-generated summaries, and expandable formula card.

- **`README-EFFICIENCY.md`**: Complete documentation of insights component architecture, animations, copy logic, and data visualization patterns.

### Modified Files

- **`src/features/dashboard/mockData.ts`**: Added `weeklyEfficiency` array with 7 days of efficiency scores and daily change percentages. Added `EfficiencyDayData` interface.

- **`src/features/dashboard/copy.ts`**: Added `InsightsCopy` interface and `insightsCopy` object with context-aware summaries (productive up/down, unproductive up/down, balanced, legendary). Added `getInsightSummary()` function with delta-based logic.

- **`CHANGELOG.md`**: Added Phase 5 documentation.

### Features Implemented

- **Donut Chart Visualization**: Shows productive (green), unproductive (red), and neutral (gray) time split with animated drawing effect (700ms)
- **Center Label**: Total time and efficiency score with count-up animation
- **7-Day Trend Chart**: Horizontal bar chart with color-coded efficiency (green = improvement, red = decline)
- **Streak Indicator**: Shows flame icon when streak ≥3 days with message
- **Auto-Generated Summaries**: Context-aware copy based on performance deltas (6 different categories)
- **Formula Card**: Expandable "Why?" toggle showing plain-English efficiency calculation
- **Tooltips**: Hover states on chart segments and trend bars
- **Confetti Trigger**: Celebration animation when efficiency ≥80 (Gold tier)
- **Staggered Animations**: Trend bars enter with 50ms delay each
- **Responsive Grid**: Two-column on desktop, stacked on mobile

### Copy Tone Examples

| Context              | Example                                                      |
| -------------------- | ------------------------------------------------------------ |
| Productive Up        | "Legendary focus mode activated. +31% productive."           |
| Unproductive Spike   | "Unproductive time spiked +22%. Touch grass."                |
| Balanced             | "Right in the pocket. Balanced day."                         |
| Legendary (≥85%)     | "You're unstoppable. Keep this energy."                      |

### Visual Design

- **Chart Colors**: Productive (#4ADE80), Unproductive (#F87171), Neutral (#A3A3A3)
- **Animations**: 700ms donut draw, 600ms count-up, 50ms stagger
- **Layout**: 256px donut chart, 80px trend height
- **Typography**: Title (text-xl), center (text-3xl), body (text-sm)
- **Spacing**: Consistent with dashboard design system

### Data Flow

- Uses `mockDashboardData` from `mockData.ts`
- Calculates percentage deltas for all three categories
- Compares today vs yesterday for summary logic
- Displays 7-day efficiency trend with daily changes
- Triggers confetti once per session for Gold tier

### Accessibility

- All animations respect `prefers-reduced-motion`
- Recharts tooltips provide context
- Color contrast meets WCAG AA
- Keyboard navigation fully supported

### User Journey

1. Component mounts with donut chart animation
2. Slices draw from 0 → actual value over 700ms
3. Center label counts up simultaneously
4. Trend bars slide in with stagger
5. Summary sentence displays based on performance
6. User can toggle formula card for explanation
7. Confetti triggers if Gold tier achieved

---

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
