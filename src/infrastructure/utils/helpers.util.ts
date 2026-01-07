/**
 * Helper Utilities
 * Common helper functions for FAL operations
 */

/**
 * Format image as data URI if not already formatted
 */
export function formatImageDataUri(base64: string): string {
  if (base64.startsWith("data:")) {
    return base64;
  }
  return `data:image/jpeg;base64,${base64}`;
}

/**
 * Extract base64 from data URI
 */
export function extractBase64(dataUri: string): string {
  if (!dataUri.startsWith("data:")) {
    return dataUri;
  }

  const parts = dataUri.split(",");
  return parts.length > 1 ? parts[1] : dataUri;
}

/**
 * Get file extension from data URI
 */
export function getDataUriExtension(dataUri: string): string | null {
  const match = dataUri.match(/^data:image\/(\w+);base64/);
  return match ? match[1] : null;
}

/**
 * Check if data URI is an image
 */
export function isImageDataUri(value: string): boolean {
  return value.startsWith("data:image/");
}

/**
 * Calculate timeout with jitter to avoid thundering herd
 */
export function calculateTimeoutWithJitter(
  baseTimeout: number,
  jitterPercent: number = 0.1
): number {
  const jitter = baseTimeout * jitterPercent;
  const randomJitter = Math.random() * jitter - jitter / 2;
  return Math.max(1000, baseTimeout + randomJitter);
}

/**
 * Format credit cost for display
 */
export function formatCreditCost(cost: number): string {
  if (cost % 1 === 0) {
    return cost.toString();
  }
  return cost.toFixed(2);
}

/**
 * Truncate prompt to maximum length
 */
export function truncatePrompt(prompt: string, maxLength: number = 5000): string {
  if (prompt.length <= maxLength) {
    return prompt;
  }
  return prompt.slice(0, maxLength - 3) + "...";
}

/**
 * Sanitize prompt by removing excessive whitespace
 */
export function sanitizePrompt(prompt: string): string {
  return prompt.trim().replace(/\s+/g, " ");
}

/**
 * Build error message with context
 */
export function buildErrorMessage(
  type: string,
  context: Record<string, unknown>
): string {
  const contextStr = Object.entries(context)
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
    .join(", ");
  return `${type}${contextStr ? ` (${contextStr})` : ""}`;
}

/**
 * Check if value is defined (not null or undefined)
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Filter out null and undefined values from object
 */
export function removeNullish<T extends Record<string, unknown>>(
  obj: T
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => isDefined(value))
  ) as Partial<T>;
}

/**
 * Debounce function (for rate limiting)
 */
export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Simple throttle function
 */
export function throttle<T extends (...args: never[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
