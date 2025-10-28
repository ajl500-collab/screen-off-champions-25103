# AI-Driven Engagement System

## Overview

Phase 2 adds AI-powered roasts, motivations, weekly summaries, and squad insights using Lovable AI (Google Gemini 2.5 Flash). The system automatically generates personalized content based on user performance.

## Architecture

### Edge Functions
- `generate-roast` - Creates funny roasts when performance drops
- `generate-motivation` - Generates encouragement for improvements
- `generate-weekly-summary` - Weekly performance recaps
- `generate-squad-insights` - Squad-level competitive analysis

### Database Tables
- `roast_history` - Stores all roasts with trigger context
- `motivation_history` - Stores motivational messages
- `weekly_summary` - Weekly performance summaries
- `squad_insights` - Squad-level insights

### Client Components
- `LatestAIMessage` - Shows most recent roast/motivation on Dashboard
- `WeeklySummaryBanner` - Displays weekly recap banner
- `AIMessageHistory` - Full history view with tabs
- `AIMessageCard` - Reusable message display component

## Trigger Logic

### Roasts (Automatic)
Triggered when:
- Efficiency drops >15% vs yesterday
- Leaderboard rank decreases ≥3 spots
- Manual trigger via API

### Motivations (Automatic)
Triggered when:
- Efficiency improves +10% or more
- New tier unlocked (Bronze→Silver, etc.)
- 3-day or 7-day streak milestones reached

### Weekly Summaries
- Run every Sunday night (or manually triggered)
- Analyzes full week of data
- Includes efficiency trends, top apps, streaks

### Squad Insights
- Generated after weekly leaderboard reset
- Analyzes squad member performance
- Identifies top performers and biggest improvements

## Usage

### Generate Roast
```typescript
import { useGenerateRoast } from "@/lib/ai/queries";

const { mutate: generateRoast } = useGenerateRoast();

generateRoast({
  userId: user.id,
  userName: user.display_name,
  efficiency: 45,
  rankDelta: -5,
  triggerReason: "rank_drop"
});
```

### Generate Motivation
```typescript
import { useGenerateMotivation } from "@/lib/ai/queries";

const { mutate: generateMotivation } = useGenerateMotivation();

generateMotivation({
  userId: user.id,
  userName: user.display_name,
  efficiency: 75,
  streakDays: 7,
  triggerReason: "week_streak"
});
```

## AI Model Configuration

Uses Lovable AI Gateway with Google Gemini 2.5 Flash:
- Fast response times
- Cost-effective
- High-quality creative content
- Built-in safety filters

## Safety & Content Guidelines

All AI-generated content is:
- PG-rated and friendly
- Never offensive or mean-spirited
- Contextually relevant to user data
- Limited to 15 words for messages
- 2-3 sentences for summaries

## Error Handling

Edge functions handle:
- Rate limiting (429) - Retry with backoff
- Payment required (402) - Show user message
- AI API failures - Graceful degradation
- Database errors - Logged and reported

## Future Enhancements

- User preference for roast intensity (Light/Standard/Spicy)
- Sharable weekly recap images
- Custom trigger rules per user
- Multi-language support
- Voice message generation
