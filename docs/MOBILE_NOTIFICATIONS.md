# Mobile Notification Strategy for ScreenVS

## Overview
ScreenVS uses a smart notification system designed to encourage users to reduce screen time while staying engaged with the app. This document outlines the notification algorithm and implementation strategy.

## Important Note
**This is a web application** built with React/Vite. Native mobile notification management (reducing notifications from other apps) requires native mobile capabilities through:
- iOS: Capacitor with native iOS plugins
- Android: Capacitor with native Android plugins

To fully implement this system, you would need to:
1. Set up Capacitor for mobile development
2. Create native plugins for notification management
3. Request appropriate permissions from users
4. Integrate with iOS Screen Time API / Android Digital Wellbeing API

## Notification Algorithm

### 1. Notification Types

#### Motivation Notifications
- **Frequency**: 3-5 times per day
- **Timing**: Smart timing based on user activity patterns
- **Content Types**:
  - Witty guilt-trip messages: "Your phone misses being in your pocket 📱"
  - Competition updates: "Sarah just beat your screen time by 2 hours! 🏆"
  - Milestone reminders: "You're 30 minutes away from beating yesterday!"
  - Streak maintenance: "Don't break your 5-day winning streak! 🔥"

#### Activity-Based Triggers
```javascript
// Pseudo-code for notification triggers
if (screenTimeToday > averageScreenTime * 1.5) {
  sendNotification({
    type: 'warning',
    message: 'You've been on your phone 50% more than usual today 😅',
    priority: 'high'
  });
}

if (inactiveOnScreenVS > 2_days) {
  sendNotification({
    type: 'engagement',
    message: 'Your team misses you! Check the leaderboard 👀',
    priority: 'medium'
  });
}
```

#### Competition-Based Notifications
- When team member overtakes you in leaderboard
- When weekly competition is about to end (24hr warning)
- When you're close to achieving a new rank
- Team chat activity alerts

### 2. Notification Frequency Management

#### Priority Levels
1. **High Priority** (Max 2/day):
   - Competition deadline warnings
   - Major rank changes
   - Team chat mentions

2. **Medium Priority** (Max 3/day):
   - Motivational messages
   - General activity reminders
   - Milestone achievements

3. **Low Priority** (Max 2/day):
   - Tips and tricks
   - Community updates
   - General app features

#### Time-Based Rules
```javascript
const NOTIFICATION_RULES = {
  quietHours: {
    start: '22:00',
    end: '08:00'
  },
  maxDailyNotifications: 7,
  minTimeBetweenNotifications: 60, // minutes
  peakEngagementTimes: ['12:00-13:00', '18:00-20:00']
};
```

### 3. Witty Message Bank

#### Guilt-Trip Messages
- "Your phone is working harder than you today 💪"
- "If procrastination was a sport, you'd be winning 🏅"
- "Your screen time is showing commitment issues 😬"
- "Plot twist: Your phone needs a break from YOU 📵"
- "Your battery is crying. So are your productivity goals 🔋"

#### Motivational Messages
- "Last place gets roasted, first place gets toasted! 🍞"
- "Be the friend who flexes their low screen time 😎"
- "Your future self called. They said put the phone down 📞"
- "Winners scroll less, achieve more 🏆"

#### Competition Messages
- "[Name] is 45 minutes ahead. Time to catch up! ⚡"
- "You're in last place. That's not a vibe 🤡"
- "The leaderboard is judging you right now 👀"
- "Plot armor won't save you from screen time stats 📊"

### 4. User Activity Tracking Integration

#### Data Sources
```javascript
// iOS Integration (requires native plugin)
const screenTimeData = {
  source: 'iOS Screen Time API',
  metrics: {
    totalScreenTime: 'minutes',
    appUsageByCategory: 'object',
    pickupsPerDay: 'number',
    notifications: 'number'
  }
};

// Android Integration (requires native plugin)
const digitalWellbeingData = {
  source: 'Android Digital Wellbeing API',
  metrics: {
    screenTime: 'minutes',
    appUsage: 'object',
    unlocks: 'number',
    notificationCount: 'number'
  }
};
```

#### Activity Scoring
```javascript
function calculateNotificationUrgency(userData) {
  const {
    currentScreenTime,
    averageScreenTime,
    hoursUntilCompetitionEnd,
    leaderboardPosition,
    daysSinceLastActive
  } = userData;

  let urgency = 0;

  // Screen time exceeded average
  if (currentScreenTime > averageScreenTime * 1.5) urgency += 30;
  
  // Competition deadline approaching
  if (hoursUntilCompetitionEnd < 24) urgency += 40;
  
  // Falling behind in leaderboard
  if (leaderboardPosition > 3) urgency += 20;
  
  // Inactive user
  if (daysSinceLastActive > 2) urgency += 25;

  return urgency; // 0-100 scale
}
```

### 5. Notification Suppression for Other Apps

**Note**: This requires native mobile capabilities and appropriate permissions.

#### Strategy
1. **Do Not Disturb Integration**: Leverage system DND settings
2. **Notification Categories**: Prioritize ScreenVS notifications
3. **Smart Filtering**: Reduce social media app notifications during focus time
4. **User Control**: Allow users to whitelist important apps

#### Implementation Requirements
- Request notification access permissions
- Integrate with iOS Focus Mode / Android DND API
- Provide granular user controls
- Respect system-level notification settings

### 6. Ethical Considerations

- **User Control**: Always allow users to customize notification frequency
- **Respect Boundaries**: Honor quiet hours and DND settings
- **Transparency**: Clearly explain what data is tracked and why
- **Opt-Out Available**: Easy settings to reduce or disable notifications
- **No Spam**: Never exceed reasonable notification limits

## Implementation Checklist

For full mobile implementation:
- [ ] Set up Capacitor for iOS and Android
- [ ] Request notification permissions
- [ ] Integrate Screen Time API (iOS) / Digital Wellbeing API (Android)
- [ ] Create native plugin for notification management
- [ ] Implement backend notification scheduling system
- [ ] Create notification content management system
- [ ] Set up analytics to track notification effectiveness
- [ ] Implement user notification preferences
- [ ] Add A/B testing for message effectiveness
- [ ] Build notification history/settings UI

## Current Web Implementation Limitations

This web app can:
✅ Track screen time data users manually input
✅ Send web push notifications (requires user permission)
✅ Display in-app messages and alerts
✅ Show motivational messages within the app

This web app cannot:
❌ Access system-level screen time data automatically
❌ Suppress notifications from other apps
❌ Integrate with iOS Screen Time / Android Digital Wellbeing
❌ Manage other apps' notification settings

For these features, mobile native development is required.
