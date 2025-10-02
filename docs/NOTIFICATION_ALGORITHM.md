# ScreenVS Notification Algorithm

## Overview
The ScreenVS notification system is designed to encourage healthy phone usage patterns by providing timely, witty interventions that help users stay aware of their screen time habits.

## Technical Implementation Requirements

### Native Platform Integration

Since ScreenVS is a web application, implementing system-level notification management and screen time tracking requires native mobile app capabilities through Capacitor plugins.

#### Required Capacitor Plugins:

1. **@capacitor/local-notifications** - For sending ScreenVS notifications
2. **@capacitor/app** - For detecting app state changes
3. **@capacitor/preferences** - For storing user notification preferences
4. **Screen Time API Integration** (iOS) or **UsageStatsManager** (Android)

### iOS Implementation

```typescript
// Access Screen Time data via iOS ScreenTime API
// Requires proper entitlements and user permission

import { FamilyActivityPicker } from 'FamilyControls';
import { DeviceActivityCenter } from 'DeviceActivity';

// Request authorization
await AuthorizationCenter.requestAuthorization();

// Access screen time data
const screenTimeData = await DeviceActivityCenter.getActivityReport();
```

### Android Implementation

```kotlin
// Access usage statistics via Android UsageStatsManager
// Requires PACKAGE_USAGE_STATS permission

val usageStatsManager = getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
val stats = usageStatsManager.queryUsageStats(
    UsageStatsManager.INTERVAL_DAILY,
    startTime,
    endTime
)
```

## Algorithm Logic

### 1. Activity Monitoring
- Track foreground app changes
- Categorize apps as productive/unproductive/utility
- Calculate real-time efficiency scores

### 2. Trigger Conditions

#### High Unproductive Usage
```typescript
if (unproductiveTime > 2 * productiveTime && totalTime > 1_hour) {
  sendNotification({
    title: "Your phone is winning 📱",
    body: "2 hours on TikTok vs 30 mins on LinkedIn. Time to switch sides?",
    priority: "high"
  });
}
```

#### Extended Session on Unproductive App
```typescript
if (currentAppCategory === "unproductive" && sessionDuration > 20_minutes) {
  sendNotification({
    title: "Still scrolling? 🤔",
    body: "You've been on Instagram for 20 minutes. Your efficiency score is crying.",
    priority: "default"
  });
}
```

#### Streak Breaking
```typescript
if (userHadPositiveStreakYesterday && todayEfficiency < 0) {
  sendNotification({
    title: "Streak breaker! 💔",
    body: "You had a 5-day positive streak. Don't let it die today!",
    priority: "high"
  });
}
```

#### Rank Dropping
```typescript
if (rankChange < 0 && Math.abs(rankChange) >= 3) {
  sendNotification({
    title: "Rank Alert! 📉",
    body: "You just dropped from #3 to #6. Your squad is watching.",
    priority: "high"
  });
}
```

#### Periodic Reminders (Smart Timing)
```typescript
// Only send during active hours, avoid sleep time
if (isActivePeriod() && lastNotification > 2_hours_ago) {
  sendNotification({
    title: "Check-in time ⏰",
    body: "Quick! Open ScreenVS and see where you stand today.",
    priority: "low"
  });
}
```

### 3. Notification Frequency Management

```typescript
const notificationRules = {
  maxPerDay: 8,
  minIntervalMinutes: 30,
  quietHours: { start: 22, end: 7 }, // 10 PM - 7 AM
  priorityOverride: true, // High priority can bypass some limits
};

function shouldSendNotification(type: string, priority: string): boolean {
  const now = new Date();
  const hour = now.getHours();
  
  // Respect quiet hours
  if (hour >= quietHours.start || hour < quietHours.end) {
    return priority === "critical";
  }
  
  // Check daily limit
  if (notificationsSentToday >= notificationRules.maxPerDay) {
    return false;
  }
  
  // Check minimum interval
  const timeSinceLastNotification = now.getTime() - lastNotificationTime;
  if (timeSinceLastNotification < notificationRules.minIntervalMinutes * 60 * 1000) {
    return priority === "high" && notificationRules.priorityOverride;
  }
  
  return true;
}
```

## Witty Message Bank

### Guilt Trip Messages
- "Your screen time just beat your gym time. Again. 💪🙈"
- "TikTok: 3 hours. LinkedIn: 0 hours. Math checks out. 📊"
- "Imagine if you invested in stocks like you invest time in Instagram 📈"
- "Your future self is not proud right now 🤨"
- "Plot twist: You're not stuck in traffic, you're stuck in TikTok 🚗"

### Encouragement Messages
- "You're crushing it! +45 efficiency today 🔥"
- "3-day positive streak! Don't break it now 💪"
- "Your squad is impressed. Keep it up! 🏆"
- "That's how you do it! #2 on the leaderboard 🚀"

### Challenge Messages
- "Jake just overtook you. Revenge time? ⚔️"
- "Your community average is 65. You're at 42. 👀"
- "Last chance to hit positive today. 90 mins left! ⏰"

## Privacy & Permissions

### Required User Permissions
1. Screen Time / Usage Access permission
2. Local notifications permission
3. Background app refresh (iOS) / Foreground service (Android)

### Privacy Guarantees
- All tracking happens locally on device
- Only aggregated efficiency scores sync to backend
- Individual app usage data never leaves the device
- User can disable tracking anytime in settings

## Implementation Checklist

- [ ] Set up Capacitor for iOS and Android
- [ ] Implement Screen Time API integration (iOS)
- [ ] Implement UsageStatsManager integration (Android)
- [ ] Create local notification service
- [ ] Build categorization engine (productive/unproductive/utility)
- [ ] Implement trigger logic with smart throttling
- [ ] Create witty message generator system
- [ ] Add user preferences for notification frequency
- [ ] Implement quiet hours and DND respect
- [ ] Test notification delivery across different scenarios
- [ ] Add notification action buttons (e.g., "Open App", "Dismiss")
- [ ] Set up analytics to track notification effectiveness

## Future Enhancements
- AI-powered personalized messages based on user behavior
- Social notifications (friend challenges, community updates)
- Achievement notifications (milestones, badges)
- Predictive notifications (before user typically falls into bad habits)
- Integration with device focus modes
