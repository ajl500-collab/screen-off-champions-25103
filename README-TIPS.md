# Power-Tips Carousel: Daily Habits + Unlockables

## Overview

The Power-Tips Carousel is a gamified, swipeable component that educates users on quick screen-time reduction strategies. Each tip card is collectible with unlock states, micro-animations, and localStorage persistence.

## Architecture

### File Structure

```
/features/tips/
├── PowerTipsCarousel.tsx    # Main carousel with navigation and state management
├── PowerTipCard.tsx          # Individual tip card with unlock animation
```

### Pages
- **Dashboard**: Carousel appears below Efficiency Explainer
- **/tips**: Standalone page with full carousel and additional context

## Features

### 1️⃣ Header

**Components:**
- Title: "Power-Tips 💡"
- Subtitle: "Small tweaks. Big gains."
- "View All →" button (links to `/tips` route)

### 2️⃣ Carousel Layout

**Card Properties:**
- Width: 260px (mobile) / 300px (desktop)
- Height: 200px
- Horizontal scroll with snap points
- 5 starter tip cards

**Navigation:**
- Swipe horizontally on mobile (touch-friendly)
- Arrow buttons on desktop (left/right)
- Pagination dots below carousel
- Smooth scroll animation (300ms ease-in-out)

### 3️⃣ Power Tip Cards

**Each Card Contains:**
| Element         | Description                                      |
| --------------- | ------------------------------------------------ |
| Title           | One-line tip name (e.g., "Grayscale Mode")      |
| One-liner       | Brief benefit description                        |
| CTA Button      | Action label ("Enable", "Learn How", "Try It")  |
| Unlocked Ribbon | Appears after user completes action              |

**Card States:**
- **Default**: Gradient background, primary border, hover scale effect
- **Unlocked**: Muted background, green ribbon badge, disabled button

### 4️⃣ Starter Tips (5 Defaults)

| ID | Title                   | One-liner                            | Action        | Type    |
| -- | ----------------------- | ------------------------------------ | ------------- | ------- |
| 1  | Grayscale Mode          | Make your screen less addictive.     | Enable        | Link    |
| 2  | Notification Triage     | Silence low-priority apps.           | Learn How     | Link    |
| 3  | Lock Screen Widgets Off | Remove dopamine traps.               | Learn How     | Tooltip |
| 4  | App Limits              | Timebox your biggest distractions.   | Learn How     | Link    |
| 5  | Home Screen Folders     | Hide temptations, not texts.         | Try It        | Toast   |

## Action Types

### Link
Opens external URL in new tab (Apple Support guides)
```typescript
actionType: "link"
actionData: "https://support.apple.com/..."
```

### Toast
Shows success toast message
```typescript
actionType: "toast"
actionData: "Organized like a pro!"
```

### Tooltip
Displays instructions on hover/click
```typescript
actionType: "tooltip"
actionData: "Settings → Face ID & Passcode → ..."
```

## State Management

### LocalStorage Persistence

**Storage Key:** `screenVS-power-tips-tried`

**Data Structure:**
```typescript
// Stored as JSON array of tip IDs
[1, 3, 5] // User has unlocked tips 1, 3, and 5
```

**Functions:**
- `markTipTried(tipId: number)`: Marks tip as completed
- Persists across page refreshes
- Loads on component mount

### Unlock Flow

1. User clicks CTA button
2. Action executes (link/toast/tooltip)
3. Tip ID saved to localStorage
4. Card state updates to "unlocked"
5. "+5 Efficiency XP" toast appears
6. Unlock animation plays

## Animations

### Card Animations
- **Hover Scale**: `scale(1.05)` with shadow lift
- **Unlock**: Scale-in animation on ribbon appearance
- **Shimmer**: Subtle gradient effect on unlocked cards

### Carousel Animations
- **Scroll**: Smooth snap scrolling (300ms)
- **Navigation**: Arrow button transitions
- **Dots**: Active dot expands width (2px → 8px)

## Visual Design

### Colors
- **Default Card**: `from-primary/10 via-accent/10 to-primary/10`
- **Unlocked Card**: `bg-muted/30` with 60% opacity
- **Ribbon**: `bg-success` with check icon
- **CTA**: Primary button (default state)

### Typography
- **Title**: 1.125rem (text-lg), bold, line-clamp-1
- **One-liner**: 0.875rem (text-sm), muted-foreground, line-clamp-2
- **Button**: Standard button sizing

### Spacing
- **Card Padding**: 1.5rem (p-6)
- **Gap Between Cards**: 1rem (gap-4)
- **Carousel Margin**: Responsive (px-4)

## Copy Tone

Fast, funny, tactical:

| Context         | Example                                    |
| --------------- | ------------------------------------------ |
| Title           | "Grayscale Mode"                           |
| One-liner       | "Make your screen less addictive."         |
| Success Toast   | "+5 Efficiency XP"                         |
| Tooltip         | "Settings → Face ID & Passcode → ..."     |

**Tone Guidelines:**
- Confident, not preachy
- Action-oriented, not academic
- Humorous but helpful
- 10 seconds from insight to action

## Responsive Behavior

### Desktop (≥768px)
- Navigation arrows visible
- 2-3 cards visible at once
- Smooth arrow navigation
- Hover effects active

### Mobile (<768px)
- Navigation arrows hidden
- Swipe gesture primary interaction
- 1-1.5 cards visible at once
- Touch-optimized scrolling

## Accessibility

- **Keyboard Navigation**: Arrow keys supported
- **Screen Readers**: Pagination dots have aria-labels
- **Touch Targets**: Buttons meet 44px minimum
- **Reduced Motion**: Animations respect `prefers-reduced-motion`
- **Color Contrast**: WCAG AA compliant

## Testing Scenarios

### Swipe on Mobile
1. Load carousel on mobile viewport
2. Swipe left/right on card area
3. Cards should scroll smoothly with snap
4. Pagination dots update to match position

### Click CTA Button
1. Click "Enable" on Grayscale Mode card
2. New tab opens with Apple Support guide
3. Toast appears: "+5 Efficiency XP"
4. Card updates to unlocked state
5. Button text changes to "Done ✓"

### Persistence Test
1. Unlock 2-3 tips
2. Reload page
3. Unlocked cards remain in unlocked state
4. Progress text shows correct count

### View All Navigation
1. Click "View All →" button
2. Navigate to `/tips` route
3. Same carousel with additional context
4. Unlock states preserved

### Arrow Navigation (Desktop)
1. Click right arrow
2. Carousel scrolls to next card
3. Left arrow becomes enabled
4. Right arrow disables at end

## Integration Points

- **Dashboard**: Primary location below Efficiency Explainer
- **/tips**: Dedicated full-page view
- **Profile**: Could show user's unlocked tips count
- **Settings**: Could reset unlock progress

## Data Structure

### PowerTip Interface

```typescript
interface PowerTip {
  id: number;
  title: string;
  oneLiner: string;
  tried: boolean;
  actionLabel: string;
  actionType: "link" | "toast" | "tooltip";
  actionData?: string;
}
```

### Mock Data Location

`src/features/dashboard/mockData.ts`

```typescript
export const mockPowerTipsData: MockPowerTipsData = {
  tips: [
    {
      id: 1,
      title: "Grayscale Mode",
      oneLiner: "Make your screen less addictive.",
      tried: false,
      actionLabel: "Enable",
      actionType: "link",
      actionData: "https://support.apple.com/...",
    },
    // ... more tips
  ],
};
```

## Future Enhancements

- **Weekly Challenges**: New tips unlock each week
- **User-Submitted Tips**: Community-contributed strategies
- **Tip Effectiveness Tracking**: Measure impact on efficiency score
- **Personalized Recommendations**: AI-suggested tips based on usage
- **Social Sharing**: Share unlocked tips with squad
- **Achievements**: Badges for unlocking all tips in category
- **Tip Categories**: Filter by difficulty, time investment, platform

## Performance

- Carousel uses native CSS `scroll-snap`
- LocalStorage reads once on mount
- State updates batched with React
- No network requests required (offline-capable)
- Cards lazy-render off-screen

---

**Built with:** React, TypeScript, Tailwind CSS, Radix UI, Lucide Icons
**Storage:** LocalStorage for persistence
**Data:** Mock data in `mockData.ts`
**Navigation:** React Router for `/tips` route
