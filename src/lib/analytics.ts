/**
 * Analytics and event tracking for ScreenVS
 * Track key user actions and engagement metrics
 */

export type AnalyticsEvent =
  | "manual_entry_started"
  | "manual_entry_completed"
  | "squad_created"
  | "squad_joined"
  | "message_sent"
  | "invite_copied"
  | "csv_imported"
  | "efficiency_viewed"
  | "leaderboard_viewed"
  | "app_breakdown_viewed"
  | "goal_set"
  | "profile_updated";

interface EventData {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Track an analytics event
 * In production, this would send to your analytics provider (Mixpanel, Amplitude, etc.)
 */
export function trackEvent(event: AnalyticsEvent, data?: EventData) {
  // Console log for development
  console.log(`[Analytics] ${event}`, data);

  // In production, you would send to your analytics provider:
  // mixpanel.track(event, data);
  // amplitude.track(event, data);
  // posthog.capture(event, data);

  // Store locally for now (could be used for internal metrics)
  try {
    const events = JSON.parse(localStorage.getItem("screenVS_analytics") || "[]");
    events.push({
      event,
      data,
      timestamp: new Date().toISOString(),
    });
    // Keep only last 100 events
    if (events.length > 100) {
      events.shift();
    }
    localStorage.setItem("screenVS_analytics", JSON.stringify(events));
  } catch (error) {
    console.error("Analytics storage error:", error);
  }
}

/**
 * Track page views
 */
export function trackPageView(pageName: string) {
  console.log(`[Analytics] Page view: ${pageName}`);
}

/**
 * Set user properties for analytics
 */
export function setUserProperties(properties: EventData) {
  console.log("[Analytics] User properties:", properties);
}

/**
 * Track timing (for performance monitoring)
 */
export function trackTiming(category: string, variable: string, time: number) {
  console.log(`[Analytics] Timing: ${category}.${variable} = ${time}ms`);
}
