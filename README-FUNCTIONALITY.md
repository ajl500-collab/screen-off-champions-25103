# ScreenVS - Phase 1: Full Functionality Implementation

## Overview

ScreenVS is now a fully functional, data-driven application with AI-powered app categorization. Users can track their screen time, have apps automatically classified by AI, view efficiency insights, compete on leaderboards, and receive adaptive summaries.

## 🤖 AI-Powered Categorization

### How It Works

Every app is automatically categorized into one of three buckets:

- **Productive**: LinkedIn, Notion, Gmail, Bloomberg, banking apps, learning apps
- **Unproductive**: TikTok, Instagram, games, streaming services
- **Neutral**: Messages, Phone, Maps, Settings, Camera

### Implementation

1. **Edge Function**: `categorize-app`
   - Uses Lovable AI (Google Gemini 2.5 Flash)
   - Caches results in `app_categories` table
   - Falls back to keyword matching if AI unavailable

2. **Database Table**: `app_categories`
   ```sql
   - app_name (text, primary key)
   - category (productive | unproductive | neutral)
   - efficiency_multiplier (numeric: 1.0, -1.0, or 0.0)
   ```

## 📲 Data Ingestion Methods

### 1. Apple Shortcuts Webhook

**Endpoint**: `/functions/v1/screentime-ingest`

**New Format** (with AI categorization):
```json
{
  "user_id": "uuid",
  "data": [
    { "app": "Instagram", "minutes": 42, "date": "2025-01-01" },
    { "app": "LinkedIn", "minutes": 18, "date": "2025-01-01" }
  ]
}
```

**Headers**:
```
x-ingest-token: your-secret-token
Content-Type: application/json
```

**Legacy Format** (pre-aggregated):
```json
{
  "user_id": "uuid",
  "payload": [
    {
      "date": "2025-01-01",
      "productive_mins": 120,
      "unproductive_mins": 45,
      "neutral_mins": 30
    }
  ]
}
```

### 2. Manual Entry

- "Add Daily Usage" on Dashboard
- Direct input of productive/unproductive/neutral minutes
- Source stored as `"manual"`

### 3. CSV Import

- Upload CSV with columns: `date,app,minutes`
- AI categorizes each app automatically
- Preview before confirming import

## 📊 Efficiency System

### Calculation

Located in `/lib/data/efficiency.ts`:

```typescript
efficiency = (productive_mins - unproductive_mins) / total_mins * 100
efficiency = Math.max(0, Math.min(100, efficiency))
```

### Tier System

- **Bronze**: < 60
- **Silver**: 60-79
- **Gold**: 80-94
- **Diamond**: 95+

### Streaks

Consecutive days of efficiency improvement tracked automatically.

## 🏆 Leaderboard

- Ranks by 7-day average efficiency
- Shows rank deltas (↑/↓ since yesterday)
- Auto-assigned badges:
  - Most Improved
  - Streak King
  - Clutch Comeback

## 🔧 Admin Tools

### Recategorize Existing Apps

**Endpoint**: `/functions/v1/recategorize-existing-apps`

Runs AI categorization on all uncategorized apps in the database. Useful for:
- Initial setup with existing data
- Recategorizing after schema changes
- Batch processing historical data

**Usage**:
```bash
curl -X POST https://your-project.supabase.co/functions/v1/recategorize-existing-apps \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

## 🔐 Authentication

- Supabase Auth enabled (email/password)
- Row Level Security (RLS) on all tables
- Auto-profile creation on signup

## 📝 Database Schema

### Key Tables

- `profiles`: User information, efficiency scores, streaks
- `daily_usage`: Aggregated daily totals by category
- `user_screen_time`: Per-app usage data
- `app_categories`: AI-categorized apps (cache)
- `settings`: User preferences, sync status
- `squads`: Team/community data
- `memberships`: Squad membership

## 🚀 Setup Instructions

### 1. Environment Variables

Already configured in Lovable Cloud:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `LOVABLE_API_KEY`
- `INGEST_SHARED_SECRET`

### 2. Test Data Ingestion

```bash
# Test with app-level data (AI categorization)
curl -X POST https://your-project.supabase.co/functions/v1/screentime-ingest \
  -H "x-ingest-token: your-secret" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "your-user-id",
    "data": [
      { "app": "LinkedIn", "minutes": 30 },
      { "app": "Instagram", "minutes": 45 }
    ]
  }'
```

### 3. Categorize Existing Apps

```bash
# Run once to categorize all existing apps
curl -X POST https://your-project.supabase.co/functions/v1/recategorize-existing-apps \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

## 📱 Frontend Integration

All components now use real data:

- **Dashboard**: Live efficiency meter, weekly progress, today's summary
- **Leaderboard**: Real-time rankings with deltas
- **Player Card**: User profile with live stats
- **Communities**: Squad-based features

## 🧪 Testing

1. Sign up for an account
2. Add manual daily usage data
3. View updated efficiency on Dashboard
4. Check Player Card for tier changes
5. View Leaderboard rankings

## 🔄 Data Flow

```
Apple Shortcuts → Webhook → AI Categorization → Database
                                ↓
                        app_categories (cache)
                                ↓
                        daily_usage + user_screen_time
                                ↓
                        Efficiency Calculation
                                ↓
                        Dashboard + Leaderboard
```

## 🎯 Next Steps (Phase 2)

- Real-time leaderboard updates
- Push notifications
- Advanced analytics
- Social features
- Achievements system
- Custom app categorization overrides

## 🐛 Troubleshooting

### AI Categorization Not Working

- Check `LOVABLE_API_KEY` is set
- Verify Lovable AI credits available
- Check edge function logs for errors
- Fallback keyword matching will activate automatically

### Webhook Not Receiving Data

- Verify `x-ingest-token` header matches `INGEST_SHARED_SECRET`
- Check request format matches documentation
- View edge function logs for detailed errors

### Efficiency Not Updating

- Ensure data is being written to `daily_usage` table
- Check RLS policies allow user access
- Verify efficiency calculation in `/lib/data/efficiency.ts`

## 📚 Additional Documentation

- `README-DASHBOARD.md`: Dashboard components
- `README-LEADERBOARD.md`: Leaderboard features
- `README-PROFILE.md`: Player Card
- `README-DATA.md`: Data layer architecture
- `README-EFFICIENCY.md`: Efficiency system details
