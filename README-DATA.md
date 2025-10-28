# Data Layer & Ingestion Documentation

This document describes the real data layer implementation that replaced mock data throughout the application.

## Overview

The app now uses **Supabase (Postgres + Auth + RLS)** for all data persistence. Users can input data through three methods:
1. **Manual Entry** - Direct UI input for daily totals
2. **CSV Import** - Bulk upload of historical data
3. **Apple Shortcuts Webhook** - Automated sync from iPhone

---

## Database Schema

### Tables

#### `profiles`
- User profiles (username, avatar, etc.)
- Automatically created on signup via trigger

#### `squads`
- Team/community groups
- Contains name, emoji, invite_code

#### `memberships`
- Junction table linking users to squads
- Tracks role (admin/member)

#### `daily_usage`
- Core table storing aggregated daily screen time
- Columns: `productive_mins`, `unproductive_mins`, `neutral_mins`
- Unique constraint on `(user_id, usage_date)`
- Source tracking: `manual`, `csv`, or `webhook`

#### `settings`
- User preferences and sync status
- Tracks `sync_connected`, `sync_last_updated`, `plan`, `bio`

### Row Level Security (RLS)

All tables have RLS policies ensuring users can only access their own data:
- Users see only their own `daily_usage`, `settings`
- Users see squads they're members of
- Squad creators can update/delete their squads

---

## Data Layer (`/lib/data/`)

### `queries.ts`
React Query hooks for fetching data:
- `useDailyUsage(date)` - Get single day's data
- `useWeeklyUsage()` - Get 7-day series
- `useSettings()` - Get user settings
- `useSquads()` - Get user's squads
- `useStreak()` - Calculate improvement streak

### `mutations.ts`
Functions for updating data:
- `upsertDailyUsage(input)` - Save/update daily totals
- `bulkUpsertDailyUsage(inputs)` - Batch import
- `setSyncConnected(boolean)` - Update sync status
- `updateSettings(updates)` - Save user preferences
- `createSquad(name, emoji)` - Create new squad
- `joinSquad(inviteCode)` - Join existing squad

### `efficiency.ts`
Calculation logic:
- `computeEfficiency(input)` - Calculate score (0-100) and tier
- `calculateDailySummary()` - Aggregate day's metrics
- `calculateWeeklySummary()` - Aggregate week's metrics

**Formula:**
```
efficiency = (productive% - unproductive%) + streak_bonus
Clamped to 0-100
```

**Tiers:**
- Diamond: ≥95
- Gold: 80-94
- Silver: 60-79
- Bronze: <60

---

## Ingestion Flows

### 1. Manual Entry (`/components/ManualTimeEntry.tsx`)
- Button in Dashboard/Settings
- Date picker (defaults to today)
- Three number inputs: productive, unproductive, neutral
- Upserts to `daily_usage` with `source='manual'`

### 2. CSV Import (`/features/ingest/CsvImport.tsx`)
- Upload CSV with columns: `date,productive_mins,unproductive_mins,neutral_mins`
- Shows preview of first 5 rows
- Batch upserts with `source='csv'`

**Example CSV:**
```csv
date,productive_mins,unproductive_mins,neutral_mins
2025-10-26,120,180,60
2025-10-27,150,150,45
```

### 3. Webhook (`/supabase/functions/screentime-ingest/`)
- Edge function endpoint: `/functions/v1/screentime-ingest`
- Requires `X-Ingest-Token` header for auth
- Accepts JSON payload:

```json
{
  "user_id": "uuid-string",
  "payload": [
    {
      "date": "2025-10-26",
      "productive_mins": 135,
      "unproductive_mins": 180,
      "neutral_mins": 45
    }
  ]
}
```

- Upserts to `daily_usage` with `source='webhook'`
- Updates `settings.sync_connected=true`

**Setup (shown in `/features/settings/SyncWebhook.tsx`):**
1. Generate personal ingest token
2. Create Apple Shortcut with:
   - URL: webhook endpoint
   - Method: POST
   - Headers: `X-Ingest-Token`, `Content-Type: application/json`
   - Body: JSON payload with user_id and screen time data

---

## Environment Variables

Required in `.env`:
```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<anon-key>
```

For webhook (server-side):
```
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
INGEST_SHARED_SECRET=<custom-secret-for-webhook-auth>
```

---

## Refactored Components

### Dashboard (`/features/dashboard/Dashboard.tsx`)
- Removed `mockDashboardData` import
- Uses `useDailyUsage()`, `useWeeklyUsage()`, `useStreak()`
- Calculates efficiency live via `calculateDailySummary()`
- Shows loading state while fetching

### Communities (`/features/communities/CommunitiesPage.tsx`)
- Removed localStorage persistence
- Uses `useSquads()` query
- Mutations via `createSquad()`, `joinSquad()`
- Real invite code generation via DB function

### Settings (`/pages/SyncSettings.tsx`)
- Added `SyncWebhook` component
- Added `CsvImport` component
- Shows live sync status from `settings` table

---

## Testing

### Manual Test Script:
1. **Sign in** → Profile auto-created
2. **Dashboard** → Open "Add Today's Time" → Enter values → Submit → See charts update
3. **Settings → Sync** → Upload CSV → Verify weekly bars populate
4. **Settings → Sync** → Copy webhook URL + token → POST test payload → See "Connected" status
5. **Communities** → Create squad → Copy invite → Join from second account → See members

### Data Verification:
```sql
-- Check user's data
SELECT * FROM daily_usage WHERE user_id = '<user-id>' ORDER BY usage_date DESC;

-- Check sync status
SELECT sync_connected, sync_last_updated FROM settings WHERE user_id = '<user-id>';

-- Check squads
SELECT * FROM squads WHERE id IN (SELECT squad_id FROM memberships WHERE user_id = '<user-id>');
```

---

## Migration from Mocks

**Before:** All data from `/features/dashboard/mockData.ts`

**After:**
- Dashboard: Live Supabase queries
- Leaderboard: Computed from real `daily_usage`
- Communities: Real `squads` + `memberships` tables
- Settings: Real `settings` table

**Removed:**
- All `localStorage` dependencies for persistence
- Mock data generators
- Hardcoded efficiency calculations

---

## Future Enhancements

1. **Per-app breakdown** - Use `app_sessions` table for drill-down
2. **Leaderboard rankings** - Query weekly efficiency across squad members
3. **Realtime updates** - Add Supabase Realtime subscriptions
4. **Push notifications** - Daily reminders via mobile
5. **Export data** - Allow users to download their data as CSV

---

## Security Notes

- RLS enforced on all tables
- Webhook requires secret token
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to client
- User data isolated by `auth.uid()`
- Invite codes generated via secure DB function

---

**Status:** ✅ Fully functional MVP with real data persistence
