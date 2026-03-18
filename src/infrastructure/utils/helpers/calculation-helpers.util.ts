/**
 * Calculation Helper Utilities
 * Internal calculation functions for FAL provider
 */

/**
 * Calculate elapsed time in milliseconds from a start timestamp
 */
export function getElapsedTime(startTime: number): number {
  return Date.now() - startTime;
}

/**
 * Calculate actual file size from base64 string
 * Base64 encoding inflates size by ~33%, so actual size is ~75% of base64 length
 */
export function getActualSizeKB(base64String: string): number {
  const base64SizeKB = Math.round(base64String.length / 1024);
  // Base64 inflates by ~33%, so actual size is ~75%
  return Math.round(base64SizeKB * 0.75);
}
