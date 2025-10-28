# Onboarding Flow Documentation

## Overview

The ScreenVS onboarding flow is a 3-screen sequence designed to get users competing in under 60 seconds. It teaches the core loop, connects screen time tracking, and drops users directly into their first match.

## Flow Diagram

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Welcome   │ ───> │   Connect   │ ───> │   Squad     │
│   Screen    │      │   Screen    │      │   Setup     │
└─────────────┘      └─────────────┘      └─────────────┘
      │                                          │
      │                                          │
      └──────────────────────────────────────────┘
                         │
                         ▼
                   Dashboard
```

## Screens

### 1. Welcome Screen
**Purpose:** Introduce the core loop in under 10 seconds

**Key Elements:**
- Logo with subtle animation
- Bold headline: "You vs Your Screen"
- Tagline: "Track time. Compete. Win—or get roasted."
- 3 icon cards explaining the loop:
  - ⏱️ Track Automatically
  - ⚔️ Compete Weekly
  - 🏆 Win Glory
- "Let's Go" CTA button
- Time estimate: "Takes less than a minute"

### 2. Connect Screen
**Purpose:** Set up screen time sync (mock for now)

**Key Elements:**
- Progress indicator (2 of 3)
- Heading: "Sync your screen time"
- Two action paths:
  - "Connect via Apple Shortcuts" (mock success)
  - "Skip for now (demo mode)"
- Helpful tooltip about connecting later
- Connection status indicator

### 3. Squad Setup Screen
**Purpose:** Create competitive context immediately

**Key Elements:**
- Progress indicator (3 of 3)
- Heading: "Form your squad"
- Squad name input with emoji support
- Two action buttons:
  - "Invite Friends" (generates shareable link)
  - "Start Solo" (immediate entry)
- Confetti celebration on completion
- Info about weekly resets

## State Management

The onboarding flow uses React Context (`OnboardingContext`) to persist state across screens and sessions.

### State Shape

```typescript
{
  onboardingComplete: boolean;
  screenTimeConnected: boolean;
  demoMode: boolean;
  squadName: string;
  squadMode: 'solo' | 'duo' | 'squad';
}
```

State is automatically persisted to `localStorage` and restored on page refresh.

## File Structure

```
src/
├── features/
│   └── onboarding/
│       ├── OnboardingContext.tsx    # State management
│       ├── WelcomeScreen.tsx        # Screen 1
│       ├── ConnectScreen.tsx        # Screen 2
│       └── SquadSetupScreen.tsx     # Screen 3
└── pages/
    └── Onboarding.tsx               # Main orchestrator
```

## Usage

### Adding the Provider

Wrap your app with `OnboardingProvider` in `main.tsx`:

```tsx
import { OnboardingProvider } from '@/features/onboarding/OnboardingContext';

<OnboardingProvider>
  <App />
</OnboardingProvider>
```

### Accessing State

Use the `useOnboarding` hook anywhere in your app:

```tsx
import { useOnboarding } from '@/features/onboarding/OnboardingContext';

const { onboardingComplete, squadName, squadMode } = useOnboarding();
```

### Redirecting to Onboarding

Check if onboarding is complete and redirect if needed:

```tsx
const { onboardingComplete } = useOnboarding();
const navigate = useNavigate();

useEffect(() => {
  if (!onboardingComplete) {
    navigate('/onboarding');
  }
}, [onboardingComplete]);
```

## Customizing Copy

All copy strings are embedded in the components. To modify:

1. **Welcome Screen** (`WelcomeScreen.tsx`):
   - Update headline, tagline, or icon card copy
   - Modify animation delays for card reveals

2. **Connect Screen** (`ConnectScreen.tsx`):
   - Change connection messaging
   - Update tooltip content

3. **Squad Setup Screen** (`SquadSetupScreen.tsx`):
   - Modify squad formation copy
   - Update success toast messages

## Animations

All screens use the global animation utilities:
- `animate-fade-in` - Smooth entrance
- `animate-scale-in` - Logo and success states
- `animate-slide-up` - Staggered card reveals
- `hover-lift` - Interactive elements

Animations respect `prefers-reduced-motion` for accessibility.

## Skip Path

Users can skip onboarding via:
- "Skip intro" button (top-right)
- "Skip for now (demo mode)" in Connect screen

Both paths mark `onboardingComplete = true` and redirect to dashboard.

## Testing

### Mock Data
All integrations use mock state—no backend calls required.

### Test Scenarios
1. Fresh user → complete full flow → lands on dashboard
2. Returning user → skip button → immediate dashboard access
3. Demo mode → mock sync state → functional dashboard
4. Squad creation → invite link generation → clipboard copy
5. Page refresh during onboarding → state persists → resume flow

## Future Enhancements

- Real Apple Shortcuts integration
- Actual invite system with backend
- Onboarding analytics tracking
- A/B test different copy variations
- Animated tutorial tooltips
- Social proof ("1,234 users competed this week")

## Accessibility

- Semantic HTML structure
- Keyboard navigation support
- Focus management between screens
- Reduced-motion respect
- ARIA labels on interactive elements
- High contrast text (WCAG AA compliant)

## Performance

- Lazy-loaded confetti effect
- Optimized image loading
- Minimal re-renders via Context optimization
- localStorage debouncing for state persistence

---

**Total Time to Complete:** < 60 seconds  
**Target Audience:** Male 15–30, competitive mindset  
**Tone:** Confident, playful, slightly irreverent
