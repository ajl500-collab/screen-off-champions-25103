/**
 * Content moderation utilities using OpenAI moderation API
 */

interface ModerationResult {
  ok: boolean;
  flagged: boolean;
  categories?: string[];
  reason?: string;
}

/**
 * Check if text content violates moderation policies
 * @param content - Text to moderate
 * @returns Moderation result
 */
export async function moderateText(content: string): Promise<ModerationResult> {
  // Basic client-side checks first
  if (!content || content.trim().length === 0) {
    return { ok: false, flagged: true, reason: "Empty content" };
  }

  if (content.length > 5000) {
    return { ok: false, flagged: true, reason: "Content too long" };
  }

  // For now, implement basic profanity check
  // In production, this should call OpenAI moderation API via edge function
  const profanityPatterns = [
    /\b(fuck|shit|damn|bitch|asshole)\b/gi,
    /\b(offensive|hate|racist|sexist)\b/gi,
  ];

  const flagged = profanityPatterns.some((pattern) => pattern.test(content));

  if (flagged) {
    return {
      ok: false,
      flagged: true,
      categories: ["profanity"],
      reason: "Content contains inappropriate language",
    };
  }

  return { ok: true, flagged: false };
}

/**
 * Check if an image violates moderation policies
 * @param imageUrl - URL of image to moderate
 * @returns Moderation result
 */
export async function moderateImage(imageUrl: string): Promise<ModerationResult> {
  // TODO: Implement OpenAI vision moderation
  // For now, just validate URL format
  try {
    new URL(imageUrl);
    return { ok: true, flagged: false };
  } catch {
    return { ok: false, flagged: true, reason: "Invalid image URL" };
  }
}
