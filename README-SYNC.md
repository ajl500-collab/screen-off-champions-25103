# Sync Status + Connected Services

## Overview

The Sync Status and Connected Services module provides users with a clean, trustworthy interface to manage their screen-time data connections. It displays connection status, last sync time, and allows users to manage integrated services — all with mock implementations for demonstration.

## Architecture

### File Structure

```
/features/settings/
├── SyncStatus.tsx           # Main sync status card with connect/reconnect
└── ConnectedServices.tsx    # Services list with toggles and troubleshooting
```

### Pages
- **/settings/sync**: Dedicated sync settings page
- **Settings**: Link to sync page from main settings

## Features

### 1️⃣ Sync Status Card

**Purpose:** At-a-glance system health check

**Components:**
| Element       | Description                                    |
| ------------- | ---------------------------------------------- |
| Status Icon   | ✅ (connected) / ❌ (disconnected)              |
| Title         | "Screen-Time Sync"                             |
| Subtitle      | Connection status description                  |
| Last Updated  | "Last updated: 3m ago"                         |
| Action Button | "Connect Now" / "Reconnect" with loader state  |

**States:**
- **Connected**: Green border, checkmark icon, shows last update time
- **Disconnected**: Red border with pulse, X icon, shows connection message
- **Reconnecting**: Shows loader spinner, "Syncing with the mothership…"

**Visual Indicators:**
- Connected: `border-success bg-success/5`
- Disconnected: `border-destructive bg-destructive/5` with pulse animation
- Icon background: Colored circle (success/destructive)

### 2️⃣ Connected Services

**Available Services:**

| Service            | Icon | Description                                           | Status           |
| ------------------ | ---- | ----------------------------------------------------- | ---------------- |
| Apple Shortcuts    | 🍎   | Primary data source for daily screen-time tracking    | Enabled (toggle) |
| Webhooks           | 🌐   | Future integration for Android or external imports    | Disabled (soon)  |

**Service Row Features:**
- Service icon (emoji)
- Name and description
- Info icon with privacy tooltip
- Toggle switch (functional for Apple Shortcuts, disabled for Webhooks)
- Highlight animation on toggle change

**Privacy Tooltip:**
> "We'll never access private data; only total usage time."

### 3️⃣ Troubleshooting Section

**Collapsible Accordion:**
- Title: "Having trouble connecting?"
- Smooth expand/collapse animation
- Chevron icon (up/down)

**Troubleshooting Steps:**
1. "Make sure Shortcuts is installed on your iPhone."
2. "Reconnect via Settings → Privacy & Screen Time."
3. "If issues persist, contact support."

## State Management

### LocalStorage Keys

**Sync Status:** `screenVS-sync-status`
```typescript
{
  connected: boolean,
  lastUpdated: number // minutes ago
}
```

**Connected Services:** `screenVS-connected-services`
```typescript
[
  {
    name: string,
    enabled: boolean,
    description: string,
    icon: string,
    disabled?: boolean
  }
]
```

### State Persistence
- Sync status persists across page refreshes
- Service toggles persist locally
- Loads on component mount
- Updates saved immediately on change

## User Flows

### Connect Flow
1. User sees "Not connected" status card
2. Clicks "Connect Now" button
3. Button shows loader: "Syncing with the mothership…"
4. After 1.5s, status updates to "Connected"
5. Toast appears: "Connected successfully 🎯"
6. Last updated shows "0m ago"
7. State saved to localStorage

### Reconnect Flow
1. User sees "Connected" status
2. Clicks "Reconnect" button
3. Loader state activates
4. Connection toggles (mock disconnect then reconnect)
5. Success toast appears
6. Status updates with new timestamp

### Service Toggle
1. User clicks Apple Shortcuts toggle
2. Toggle switches state (on → off or off → on)
3. Toast notification confirms change
4. Card highlight fades in/out
5. State persists to localStorage

## Copy Examples

| Context      | Example                                       |
| ------------ | --------------------------------------------- |
| Connected    | "All synced. You're running clean."           |
| Disconnected | "No data yet — reconnect to flex your focus." |
| Reconnecting | "Syncing with the mothership…"                |
| Success      | "Connected successfully 🎯"                   |
| Toggle On    | "Apple Shortcuts has been enabled."           |
| Toggle Off   | "Apple Shortcuts has been disabled."          |

## Animations

### Status Card
- **Fade-in**: 300ms on mount
- **Pulse**: When disconnected (red border)
- **Loader**: Spinning icon during reconnect

### Services
- **Highlight**: Fade transition on toggle (300ms)
- **Accordion**: Smooth expand/collapse

### Toasts
- **Duration**: 2 seconds
- **Position**: Bottom-right (default)

## Visual Design

### Colors
- **Connected**: `border-success`, `bg-success/5`, `text-success`
- **Disconnected**: `border-destructive`, `bg-destructive/5`, `text-destructive`
- **Service Active**: `border-primary/20`, `bg-primary/5`
- **Service Inactive**: `border-border`, `bg-card`

### Typography
- **Title**: 1.125rem (text-lg), bold
- **Subtitle**: 0.875rem (text-sm), colored by state
- **Description**: 0.875rem (text-sm), muted-foreground
- **Last Updated**: 0.75rem (text-xs), muted-foreground

### Spacing
- **Card Padding**: 1.5rem (p-6)
- **Service Row Padding**: 1rem (p-4)
- **Gap Between Elements**: 1rem (gap-4)

## Responsive Behavior

### Desktop
- Full-width cards (max-w-2xl container)
- All elements visible
- Hover effects active

### Mobile (≤768px)
- Single column layout
- Touch-optimized buttons
- Collapsible sections stack
- Maintains full functionality

## Accessibility

- **Keyboard Navigation**: All buttons and toggles accessible
- **Screen Readers**: Descriptive labels on all interactive elements
- **Color Contrast**: WCAG AA compliant
- **Touch Targets**: 44px minimum for mobile
- **Reduced Motion**: Animations respect `prefers-reduced-motion`

## Testing Scenarios

### Connection Toggle
1. Set `connected=false` in mockData
2. Card shows red X, "Not connected"
3. Click "Connect Now"
4. Loader appears for 1.5s
5. Status updates to green checkmark
6. Toast shows success message
7. Refresh page → state persists

### Service Toggle
1. Toggle Apple Shortcuts off
2. Toast confirms: "Apple Shortcuts has been disabled"
3. Card updates to inactive style
4. Refresh page → toggle remains off
5. Toggle back on → state updates

### Troubleshooting Accordion
1. Click "Having trouble connecting?"
2. Section expands smoothly
3. Shows 3 troubleshooting steps
4. Click again → section collapses
5. Chevron icon flips direction

### Last Updated Counter
1. Set `lastUpdatedMinutesAgo: 3`
2. Text shows "Last updated: 3m ago"
3. User reconnects → resets to "0m ago"
4. (In real app, would increment over time)

## Integration Points

- **Settings Page**: Main entry point via link button
- **Dashboard**: Could show sync status indicator
- **Profile**: Could display connection health
- **Onboarding**: Link to sync setup on completion

## Data Structure

### MockSyncData

```typescript
export const mockSyncData: MockSyncData = {
  connected: true,
  lastUpdatedMinutesAgo: 3,
  services: [
    {
      name: "Apple Shortcuts",
      enabled: true,
      description: "Primary data source for daily screen-time tracking.",
      icon: "🍎",
      disabled: false,
    },
    {
      name: "Webhooks",
      enabled: false,
      description: "Future integration for Android or external imports.",
      icon: "🌐",
      disabled: true,
    },
  ],
};
```

## Future Enhancements

- **Real-Time Updates**: Show actual last sync timestamp
- **Sync History**: Log of past sync attempts
- **Error States**: Specific error messages for connection failures
- **Sync Frequency**: Configure auto-sync intervals
- **Multiple Devices**: Manage connections from different devices
- **Android Support**: Enable Webhooks integration
- **Manual Sync**: Force sync button for immediate data pull
- **Sync Analytics**: Show data transfer stats

## Performance

- No network requests (mock only)
- LocalStorage reads once on mount
- State updates batched
- Animations use GPU acceleration (transform/opacity)
- Smooth 60fps transitions

---

**Built with:** React, TypeScript, Tailwind CSS, Radix UI, Lucide Icons
**Storage:** LocalStorage for persistence
**Data:** Mock data in `mockData.ts`
**Copy:** Centralized in `copy.ts`
