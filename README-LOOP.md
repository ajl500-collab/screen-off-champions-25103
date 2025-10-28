# ScreenVS Core Loop

## The Loop

ScreenVS is built around a simple, addictive competitive loop:

```
Track → Compete → Win/Roast → Repeat
```

### 1. Track Automatically 📱
Users connect their screen time once via Apple Shortcuts. From that point forward, their usage syncs automatically—no manual entry, no cheating possible.

### 2. Compete Weekly ⚔️
Every week, users are randomly matched into:
- **Solo**: 1v1v1v1... (up to 10 players)
- **Duo**: 2v2 teams
- **Squad**: 3v3 or 4v4 teams

New week = new opponents = fresh competition.

### 3. Win or Get Roasted 🏆
- **Winners**: Get glory, legendary status, and bragging rights
- **Losers**: Get meme notifications, roasted in group chats, and their profile pic changes to grayscale

The stakes are low (it's just an app), but the shame/glory is real enough to keep people engaged.

## Where The Loop Is Surfaced

### 1. **Landing Page** (`src/pages/Index.tsx`)
- **CoreLoopStrip component** appears right after the Hero section
- Shows all 3 steps in a horizontal card layout
- Users see this before signing up, so they understand the game immediately

### 2. **Dashboard** (coming next)
- Will show current week's competition status
- Weekly reset countdown
- Your current rank vs. squad/opponents
- Efficiency score progress

### 3. **Onboarding** (coming next)
- 3-screen onboarding will walk through:
  1. The loop explanation (Track → Compete → Win)
  2. Connect screen time sync
  3. Get placed into first match

### 4. **Leaderboard** (coming next)
- Shows live rankings
- Rank deltas (who's moving up/down)
- Weekly reset timer
- Badges (Most Improved, Streak King, etc.)

### 5. **Communities** (existing)
- Shows squad members
- Current week's standings
- Chat for trash talk

## Why This Loop Works

1. **Automatic = No Friction**  
   Users don't have to remember to log anything. It just works.

2. **Weekly Reset = Fresh Starts**  
   Even if you lose this week, next week is a clean slate with new opponents.

3. **Social Stakes = Engagement**  
   The memes and roasts aren't mean, but they're enough to make people care. Winners want to win again. Losers want revenge.

4. **Random Matching = Always Novel**  
   You're not stuck playing the same people forever. New opponents keep it fresh.

## Visual Language

- **Green**: Productive gains, winning, efficiency improvements
- **Red**: Unproductive increases, losing, efficiency drops
- **Gray**: Neutral/utility apps (don't affect score much)
- **Primary (cyan)**: Main actions, primary state
- **Accent (purple)**: Secondary highlights, special badges

## Copy Tone

All copy lives in `src/lib/copy.ts` and follows these guidelines:

- **Competitive**: "Dominate the leaderboard"
- **Playful**: "Touch grass?" when screen time spikes
- **Spicy**: "Losers get roasted" (but never mean/toxic)
- **Motivating**: "You're on a 3-day streak—don't choke"

## Milestone Celebrations

The loop includes celebration moments (via `useConfetti` hook):
- 🔥 Streak milestones (3 days, 7 days, 30 days)
- 📈 Rank improvements
- 🥇 Efficiency tier upgrades (Bronze → Silver → Gold)
- 🏆 Weekly wins

These moments of delight keep users engaged and coming back.

---

**Last Updated**: 2025-10-28  
**Status**: Foundation complete, ready for onboarding + dashboard work
