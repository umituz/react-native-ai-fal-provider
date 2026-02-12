/**
 * Number Helper Utilities
 * Number manipulation and formatting
 */

/**
 * Clamp number between min and max
 */
export function clampNumber(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Round to decimal places
 */
export function roundToDecimals(value: number, decimals: number): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}
