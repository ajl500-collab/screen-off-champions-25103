# 🤝 Communities & Invites — Feature Documentation

## Overview

The **Communities & Invites** feature enables users to form squads, invite friends, and join groups through shareable links. This is where competition, humor, and accountability come alive in ScreenVS.

**Route:** `/communities`

---

## 🏗️ Architecture

```
/features/communities/
    CommunitiesPage.tsx        # Main communities page
    SquadCard.tsx             # Individual squad display card
    CreateSquadModal.tsx      # Modal for creating new squads
    JoinSquadModal.tsx        # Modal for joining via invite link

/pages/
    Communities.tsx           # Page wrapper/route

/lib/
    copy.ts                   # Centralized communities copy

/features/dashboard/
    mockData.ts              # Squad data structures
```

---

## 🎨 Visual Design

### Header (Sticky)
- **Title:** "Your Squads"
- **Subtitle:** "Compete, roast, and grow together."
- Two action buttons:
  - "Join" (outline variant with Link icon)
  - "Create" (primary variant with Plus icon)
- Responsive: Icons only on mobile, text + icons on desktop
- Glass morphism effect with backdrop blur

### Squad Cards

Display in responsive grid (1 column mobile, 2 columns desktop):

**Card Contents:**
- **Top Section:**
  - Large emoji (squad logo)
  - Squad name (bold, hover effect → primary color)
  - Member count with Users icon
  - Optional "👑 Leader" badge (if top member has efficiency ≥ 85%)

- **Members Section:**
  - Up to 4 member avatars (rounded circles)
  - "+X more" indicator if > 4 members
  - Tooltips show member names on hover

- **Bottom Stats:**
  - Average efficiency percentage with TrendingUp icon
  - "View Squad →" link (hover: underline)

**Interactions:**
- Hover: Slight lift (-translate-y-1), enhanced shadow, border glow
- Transition: 300ms smooth
- Cursor: pointer
- Click: Navigate to `/communities/[id]` (placeholder for future)

---

## 🪟 Modal Components

### Create Squad Modal

**Trigger:** "Create" button in header

**Form Fields:**
1. **Squad Name**
   - Text input
   - Max length: 30 characters
   - Placeholder: "e.g., Study Crew, Gym Bros"
   - Validation: Required, trimmed

2. **Emoji Picker**
   - Select dropdown
   - 10 preset options:
     - 💪 Flex, 🎓 Study, 🧘 Focus, 🎮 Gaming
     - 🔥 Fire, ⚡ Energy, 🎯 Target, 🚀 Launch
     - 🧠 Brain, 👑 Crown
   - Default: 💪

**Submit Behavior:**
- Creates new squad object with current user as first member
- Generates fake invite link: `https://screenvs.app/join/squad-[timestamp]`
- Copies invite link to clipboard
- Shows toast: "Squad created! 🎉 — Invite link copied to clipboard."
- Triggers confetti burst
- Persists to localStorage
- Closes modal and resets form

**Error States:**
- Empty name → "Squad name is required"
- Name > 30 chars → "Squad name must be less than 30 characters"

---

### Join Squad Modal

**Trigger:** "Join" button in header

**Form Fields:**
1. **Invite Link**
   - Text input
   - Placeholder: "https://screenvs.app/join/squad-XYZ"
   - Validation: Must contain "/join/"

**Submit Behavior:**
- Validates invite link format
- Extracts squad ID from URL
- Creates mock squad with 2 members (user + sample member)
- Shows toast: "Welcome aboard. 🚀 — Prepare to get judged."
- Triggers confetti burst
- Persists to localStorage
- Closes modal and resets form

**Error States:**
- Empty link → "Invite link is required"
- Invalid format → "Invalid link — double-check and try again."
- Red border on input when error present

---

## 🏝️ Empty State

Displays when user has no squads (squads.length === 0).

**Layout:**
- Centered card
- Large emoji: 🏝️
- **Title:** "You haven't joined a squad yet."
- **Subtitle:** "Everyone needs someone to roast them into greatness."

**Quick Join Suggestions:**
- Section title: "Quick start with these:"
- 4 pre-configured squad buttons:
  - 🎓 Study Crew
  - 💪 Gym Bros
  - 🧘 Focus Queens
  - 🎮 Dorm Rivals

**Interaction:**
- Click any suggestion → Instantly creates squad with 2 members
- Triggers confetti
- Shows toast: "Joined squad! 🎉 — You're now part of [Squad Name]."
- Persists to localStorage

---

## 📊 Mock Data

Extended `mockData.ts` with squad interfaces and default data:

```typescript
export interface SquadMember {
  name: string;
  avatarUrl: string;  // Emoji or image URL
  efficiency: number;
}

export interface Squad {
  id: string;
  name: string;
  emoji: string;
  members: SquadMember[];
  averageEfficiency: number;
}

export interface MockSquadsData {
  squads: Squad[];
}

export const mockSquadsData: MockSquadsData = {
  squads: [
    {
      id: "1",
      name: "Gym Bros",
      emoji: "💪",
      members: [
        { name: "Andrew", avatarUrl: "🏆", efficiency: 82 },
        { name: "Drew", avatarUrl: "🎯", efficiency: 74 },
        { name: "Marcus", avatarUrl: "⚡", efficiency: 79 }
      ],
      averageEfficiency: 78
    },
    {
      id: "2",
      name: "Study Crew",
      emoji: "🎓",
      members: [
        { name: "Sarah", avatarUrl: "📚", efficiency: 91 },
        { name: "Emma", avatarUrl: "✨", efficiency: 88 },
        { name: "Jordan", avatarUrl: "🔥", efficiency: 85 },
        { name: "Alex", avatarUrl: "💎", efficiency: 87 }
      ],
      averageEfficiency: 88
    }
  ]
};
```

---

## 💬 Copy Tone

**Voice:** Light, competitive, funny

| Context           | Example Copy |
|-------------------|--------------|
| Header            | "Compete, roast, and grow together." |
| Empty State       | "Everyone needs someone to roast them into greatness." |
| Create Modal      | "Name your squad. Keep it clever." |
| Join Success      | "Welcome aboard. Prepare to get judged." |
| Create Success    | "Squad created! Invite link copied to clipboard." |
| Quick Join        | "You're now part of [Squad Name]." |

All copy centralized in `COPY.communities` in `/lib/copy.ts`.

---

## ✅ Acceptance Criteria

- [x] Create & Join modals functional with mock data only
- [x] Squad list updates dynamically without page refresh
- [x] Empty state triggers only when no squads exist
- [x] Confetti animation fires on join/create
- [x] Responsive design (mobile-first, 1-col → 2-col)
- [x] No console or TypeScript errors
- [x] localStorage persistence for squads
- [x] Invite link copied to clipboard on squad creation
- [x] Form validation with clear error messages
- [x] Smooth hover animations on squad cards
- [x] Quick join suggestions create squads instantly

---

## 🧪 Test Cases

1. ✅ **Create new squad** → Appears in list + toast + confetti + clipboard
2. ✅ **Join via mock link** → Adds to list + toast + confetti
3. ✅ **Invalid link** → Shows validation error with red border
4. ✅ **Empty state suggestions** → Create squads instantly on click
5. ✅ **Responsive view** → Cards stack on mobile, 2-col on desktop
6. ✅ **Refresh page** → Squads persist via localStorage
7. ✅ **Empty name in create** → Shows error message
8. ✅ **Name > 30 chars** → Shows error message
9. ✅ **Member avatars** → Shows up to 4 + "+X more"
10. ✅ **Leader badge** → Appears when top member ≥ 85% efficiency

---

## 🎨 Visual Style

- Dark theme with glass morphism header
- Rounded-xl cards with hover lift
- Subtle glow border on hover (primary/30)
- Emojis as squad logos (3xl size)
- Mobile-first responsive grid
- Smooth transitions (300ms)
- Semantic design tokens (no hardcoded colors)
- Consistent spacing and typography hierarchy

---

## 🔗 Integration Points

- **localStorage:** Key = "screenVsSquads"
  - Stores array of Squad objects
  - Loaded on page mount
  - Updated on create/join/quick-join

- **Clipboard API:** 
  - Copies invite link on squad creation
  - Gracefully handles permission errors

- **Toast System:** 
  - Uses centralized toast from `/hooks/use-toast`
  - All feedback messages from `COPY.communities`

- **Confetti:** 
  - Triggers via `/hooks/useConfetti`
  - Fires on all join/create actions

- **Copy:** 
  - All text from `COPY.communities` in `/lib/copy.ts`
  - Includes suggestions array with emoji + name

- **Mock Data:** 
  - Default squads from `mockSquadsData`
  - Squad interfaces for type safety

---

## 🚀 Future Enhancements

- **Squad Detail Pages:**
  - Individual squad view at `/communities/[id]`
  - Member leaderboard within squad
  - Squad-specific meme bank
  - Weekly challenge results
  - Activity feed

- **Real Invite Links:**
  - Generate unique tokens
  - Expire after 7 days
  - Track who invited whom

- **Backend Integration:**
  - Supabase tables for squads/members
  - Real-time updates via Realtime subscriptions
  - RLS policies for squad privacy

- **Enhanced Features:**
  - Squad chat/comments
  - Private vs. public squads
  - Squad achievements/badges
  - Squad vs. squad challenges
  - Kick/remove members
  - Transfer squad ownership
  - Squad settings (name, emoji, privacy)

- **Notifications:**
  - New member joined
  - Squad weekly results
  - Challenge invites

- **Analytics:**
  - Squad engagement metrics
  - Most active squads
  - Retention rates

---

## 📝 Notes

- All squads stored in localStorage only (no backend yet)
- Invite links are mock/demo (don't actually route)
- Squad detail view placeholder (`/communities/[id]` not yet implemented)
- Average efficiency calculated on squad creation (not dynamic)
- Member count and avatars update with new joins
- Copy tone matches overall ScreenVS voice (competitive, playful, safe)
- Design system tokens used throughout
- Fully responsive with mobile-first approach
- All actions feel rewarding (animations + feedback)
- Squad creation takes < 15 seconds
- Simple mock state for Phase 10 (ready for backend migration)

---

## 🎯 User Flow

### First-Time User (Empty State)
1. Land on `/communities`
2. See empty state with 🏝️ emoji
3. Choose quick-join suggestion OR click "Create"
4. Squad added to list immediately
5. Confetti + toast feedback

### Creating a Squad
1. Click "Create" button
2. Enter squad name + choose emoji
3. Submit form
4. Invite link copied to clipboard
5. Squad appears in grid
6. Confetti + toast
7. Share invite link with friends

### Joining via Link
1. Receive invite link from friend
2. Click "Join" button
3. Paste invite link
4. Submit form
5. Squad appears in grid
6. Confetti + toast

### Viewing Squads
1. See all squads in responsive grid
2. Hover for lift effect + border glow
3. Click card to view squad details (future)
4. See member avatars + average efficiency
5. Identify top squads via leader badge
