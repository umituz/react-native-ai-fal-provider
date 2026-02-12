/**
 * Object Helper Utilities
 * Object manipulation and validation helpers
 */

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
 * Generate unique ID
 */
export function generateUniqueId(prefix: string = ""): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}_${timestamp}${randomStr}` : `${timestamp}${randomStr}`;
}
