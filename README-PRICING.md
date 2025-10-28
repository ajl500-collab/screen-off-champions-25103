# 💰 Pricing & Plans — Feature Documentation

## Overview

The **Pricing & Plans** page presents ScreenVS's free and paid tiers in a premium, dark-themed design. It reinforces the brand personality through confident, cheeky copy while clearly explaining feature differences and addressing common questions.

**Route:** `/pricing`

---

## 🏗️ Architecture

```
/features/pricing/
    PricingPage.tsx        # Main pricing page component
    FAQAccordion.tsx       # Collapsible FAQ section

/pages/
    Pricing.tsx            # Page wrapper/route

/lib/
    copy.ts                # Centralized pricing copy

/features/dashboard/
    mockData.ts            # Plan options and mock data
```

---

## 🎨 Visual Design

### Header
- **Title:** "Pick Your Plan."
- **Subtitle:** "Both versions make you less of a scroll zombie — one just does it faster."
- Gradient accent divider beneath title
- Clean, centered layout

### Pricing Cards

Two responsive cards that stack on mobile, side-by-side on desktop:

#### 🆓 Free Forever
- Badge: "Free Forever"
- Price: $0/forever
- Tagline: "Perfect for casual competitors and professional procrastinators."
- Features:
  - Weekly challenges
  - Leaderboard access
  - Basic insights
  - Community meme pool
- CTA: "Stay Free" button (outline variant)
- Hover: Subtle lift animation

#### ⚡ Pro Mode
- Badge: "⚡ Most Popular" (top-center ribbon)
- Price: $4.99/month
- Tagline: "For people who take self-improvement way too seriously."
- Features:
  - Advanced efficiency insights
  - Custom meme packs
  - Priority squads
  - Unlimited roasts
  - 7-day trend analysis
  - Early access to new features
- CTA: "Go Pro 🚀" button (gradient)
- Animated gradient border (6s loop)
- Background: Subtle gradient from background to primary/5
- Hover: Enhanced lift + shadow

---

## ❓ FAQ Section

Collapsible accordion with 5 default questions:

1. **"Will I really get roasted?"**
   → "Lovingly. Never maliciously. We promise."

2. **"Can I play solo?"**
   → "Yes. Solo, duos, or squads — your choice every week."

3. **"Does it work without Apple?"**
   → "Yep. You can use demo mode or Webhook connections (coming soon)."

4. **"Do I lose progress if I downgrade?"**
   → "Nope. You'll just miss out on advanced insights and meme packs."

5. **"Can I cancel anytime?"**
   → "Always. No guilt. No exit surveys asking 'why?'."

**Behavior:**
- Smooth 300ms expand/collapse animation
- Chevron rotates on toggle
- All closed by default
- Hover state on trigger

---

## 🎯 CTA Section

Below FAQ:
- **Heading:** "Ready to reclaim your focus?"
- **Button:** "Upgrade Now →"
- Gradient background from background to primary/5

**Interactions:**
- Click "Go Pro" → Updates localStorage to "pro"
- Triggers confetti burst
- Shows toast: "Pro Mode activated 💸 — Welcome to the upper tier."
- Click "Stay Free" → Shows toast: "Still free. Still focused."

---

## 📊 Mock Data

Extended `mockData.ts` with:

```typescript
export interface PlanOption {
  id: "free" | "pro";
  name: string;
  price: number;
  features: string[];
}

export interface MockPlanData {
  current: "free" | "pro";
  options: PlanOption[];
}

export const mockPlanData: MockPlanData = {
  current: "free",
  options: [
    {
      id: "free",
      name: "Free Forever",
      price: 0,
      features: ["Weekly challenges", "Leaderboard access", "Basic insights"]
    },
    {
      id: "pro",
      name: "Pro Mode",
      price: 4.99,
      features: [
        "Advanced efficiency insights",
        "Custom meme packs",
        "Priority squads",
        "Unlimited roasts"
      ]
    }
  ]
};
```

---

## 💬 Copy Tone

**Voice:** Cheeky, confident, but clean.

| Context   | Example Copy |
|-----------|--------------|
| Header    | "Both versions make you less of a scroll zombie." |
| Free Plan | "Perfect for casual competitors and professional procrastinators." |
| Pro Plan  | "For people who take self-improvement way too seriously." |
| Toast     | "Pro Mode activated 💸 Welcome to the upper tier." |

All copy lives in `copy.ts` under `COPY.pricing`.

---

## ✅ Acceptance Criteria

- [x] Page renders cleanly with both plans
- [x] Accordion expands/collapses smoothly with chevron rotation
- [x] Mock data correctly populates features
- [x] Clicking "Go Pro" updates localStorage + triggers confetti
- [x] All copy centralized in `copy.ts`
- [x] Responsive mobile-first design (stacked cards on mobile)
- [x] No console or TypeScript errors
- [x] Current plan state persists via localStorage
- [x] Hover animations on cards
- [x] Gradient border animation on Pro card

---

## 🧪 Test Cases

1. ✅ Click FAQ → expands smoothly + chevron rotates
2. ✅ Click "Go Pro" → localStorage updates + confetti burst
3. ✅ Reload → Pro state persists
4. ✅ Resize window → pricing cards stack properly on mobile
5. ✅ "Stay Free" → triggers neutral toast
6. ✅ Current plan shows "Current Plan" instead of CTA

---

## 🎨 Visual Style

- Dark background with subtle vignette
- Font hierarchy: h1 2rem, h2 1.2rem, body 0.9rem
- Gradient accents on buttons + Pro card border
- Responsive grid (stacked mobile, side-by-side desktop)
- Animated gradient border for Pro Mode card (loop every 6s)
- Smooth hover lift animations (300ms)
- Semantic color tokens from design system

---

## 🔗 Integration Points

- **localStorage:** Stores current plan as "screenVsPlan"
- **Toast System:** Uses centralized toast from `/hooks/use-toast`
- **Confetti:** Triggers confetti via `/hooks/useConfetti`
- **Copy:** All text from `COPY.pricing` in `/lib/copy.ts`
- **Mock Data:** Plan options from `mockPlanData` in `mockData.ts`

---

## 🚀 Future Enhancements

- Integrate Stripe for actual payment processing
- Add annual pricing option with discount
- Show comparison table for detailed feature breakdown
- Add testimonials section
- Enterprise/team pricing tier
- Currency selector for international users

---

## 📝 Notes

- Plan state persists in localStorage only (no backend yet)
- All interactions are mock/demo for Phase 9
- Copy tone matches overall ScreenVS voice (competitive, playful)
- Design system tokens used throughout (no hardcoded colors)
- Fully responsive with mobile-first approach
