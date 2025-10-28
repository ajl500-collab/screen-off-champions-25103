# Changelog - UX Refresh: Global Changes

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
