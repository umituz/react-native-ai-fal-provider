/**
 * General Helper Utilities
 * Common utility functions
 */

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
