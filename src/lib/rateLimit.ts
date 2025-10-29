/**
 * Simple in-memory rate limiter using token bucket algorithm
 * For production with multiple instances, use Redis instead
 */

interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, TokenBucket>();

/**
 * Check if an action is rate-limited
 * @param key - Unique identifier (e.g., userId)
 * @param maxTokens - Maximum tokens in bucket
 * @param refillRate - Tokens added per second
 * @returns true if allowed, false if rate limited
 */
export function checkRateLimit(
  key: string,
  maxTokens: number,
  refillRate: number
): boolean {
  const now = Date.now();
  let bucket = buckets.get(key);

  if (!bucket) {
    bucket = {
      tokens: maxTokens - 1,
      lastRefill: now,
    };
    buckets.set(key, bucket);
    return true;
  }

  // Refill tokens based on time elapsed
  const timeElapsed = (now - bucket.lastRefill) / 1000;
  const tokensToAdd = timeElapsed * refillRate;
  bucket.tokens = Math.min(maxTokens, bucket.tokens + tokensToAdd);
  bucket.lastRefill = now;

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return true;
  }

  return false;
}

/**
 * Rate limit for chat messages: 5 messages per 5 seconds
 */
export function checkChatRateLimit(userId: string): boolean {
  return checkRateLimit(userId, 5, 1); // 5 tokens, refill 1 per second
}

/**
 * Rate limit for data ingestion: 60 rows per hour
 */
export function checkIngestRateLimit(userId: string): boolean {
  return checkRateLimit(userId, 60, 60 / 3600); // 60 tokens, refill 1 per minute
}

/**
 * Clear rate limit for a user (useful for testing or after upgrading plan)
 */
export function clearRateLimit(key: string): void {
  buckets.delete(key);
}
