/**
 * Shared Helper Utilities
 * Consolidated helpers for error handling, object manipulation, timing, and calculations
 *
 * This file consolidates functionality from:
 * - error-helpers.util.ts
 * - object-helpers.util.ts
 * - timing-helpers.util.ts
 * - calculation-helpers.util.ts
 */

// ─── Error Helpers ─────────────────────────────────────────────────────────────

/**
 * Extract error message from any error type
 * Handles Error instances, strings, and unknown types
 *
 * @param error - The error to extract message from
 * @returns The error message as a string
 *
 * @example
 * ```typescript
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   console.error('Operation failed:', getErrorMessage(error));
 * }
 * ```
 */
export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Extract error message with fallback
 * Returns fallback if error message is empty or whitespace-only
 *
 * @param error - The error to extract message from
 * @param fallback - Fallback message if error message is empty
 * @returns The error message or fallback
 */
export function getErrorMessageOr(error: unknown, fallback: string): string {
  const message = getErrorMessage(error);
  return message && message.trim().length > 0 ? message : fallback;
}

/**
 * Create error message with context prefix
 * Useful for adding operation context to error messages
 *
 * @param error - The error to extract message from
 * @param context - Context to prepend to the error message
 * @returns Formatted error message with context
 */
export function formatErrorMessage(error: unknown, context: string): string {
  return `${context}: ${getErrorMessage(error)}`;
}

// ─── Object Helpers ───────────────────────────────────────────────────────────

/**
 * Build error message with context
 *
 * @param type - Error type or category
 * @param context - Object containing key-value pairs for context
 * @returns Formatted error message string
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
 *
 * @param value - Value to check
 * @returns Type guard indicating value is not null/undefined
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Filter out null and undefined values from object
 *
 * @param obj - Object to filter
 * @returns New object with null/undefined values removed
 */
export function removeNullish<T extends Record<string, unknown>>(
  obj: T
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => isDefined(value))
  ) as Partial<T>;
}

/**
 * Generate unique ID with optional prefix
 *
 * @param prefix - Optional prefix for the ID
 * @returns Unique identifier string
 */
export function generateUniqueId(prefix: string = ""): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}_${timestamp}${randomStr}` : `${timestamp}${randomStr}`;
}

// ─── Timing Helpers ───────────────────────────────────────────────────────────

/**
 * Sleep for specified milliseconds
 *
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after delay
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Calculation Helpers ──────────────────────────────────────────────────────

/**
 * Calculate elapsed time in milliseconds from a start timestamp
 *
 * @param startTime - Start timestamp in milliseconds
 * @returns Elapsed time in milliseconds
 */
export function getElapsedTime(startTime: number): number {
  return Date.now() - startTime;
}

/**
 * Calculate actual file size from base64 string
 * Base64 encoding inflates size by ~33%, so actual size is ~75% of base64 length
 *
 * @param base64String - Base64 encoded string
 * @returns Actual size in kilobytes
 */
export function getActualSizeKB(base64String: string): number {
  const base64SizeKB = Math.round(base64String.length / 1024);
  // Base64 inflates by ~33%, so actual size is ~75%
  return Math.round(base64SizeKB * 0.75);
}
