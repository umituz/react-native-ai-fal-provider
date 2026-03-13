/**
 * Calculation Helper Utilities
 * Centralized calculation functions for consistent metrics across the codebase
 */

/**
 * Calculate elapsed time in milliseconds from a start timestamp
 *
 * @param startTime - Start timestamp in milliseconds (from Date.now())
 * @returns Elapsed time in milliseconds
 *
 * @example
 * ```typescript
 * const start = Date.now();
 * // ... do work ...
 * const elapsed = getElapsedTime(start); // e.g., 1234
 * ```
 */
export function getElapsedTime(startTime: number): number {
  return Date.now() - startTime;
}

/**
 * Format elapsed time in milliseconds to human-readable string
 *
 * @param elapsedMs - Elapsed time in milliseconds
 * @returns Formatted string (e.g., "1234ms", "1.2s")
 *
 * @example
 * ```typescript
 * formatDuration(1234); // "1234ms"
 * formatDuration(1200); // "1.2s"
 * formatDuration(1500); // "1.5s"
 * ```
 */
export function formatDuration(elapsedMs: number): string {
  if (elapsedMs < 1000) {
    return `${Math.round(elapsedMs)}ms`;
  }
  return `${(elapsedMs / 1000).toFixed(1)}s`;
}

/**
 * Convert bytes to kilobytes (KB)
 *
 * @param bytes - Size in bytes
 * @returns Size in kilobytes (rounded)
 *
 * @example
 * ```typescript
 * bytesToKB(5000); // 5
 * bytesToKB(1536); // 2
 * ```
 */
export function bytesToKB(bytes: number): number {
  return Math.round(bytes / 1024);
}

/**
 * Calculate actual file size from base64 string
 * Base64 encoding inflates size by ~33%, so actual size is ~75% of base64 length
 *
 * @param base64String - Base64 encoded string
 * @returns Actual size in kilobytes (rounded)
 *
 * @example
 * ```typescript
 * getActualSizeKB("data:image/png;base64,iVBOR..."); // ~3KB for 4KB base64
 * ```
 */
export function getActualSizeKB(base64String: string): number {
  const base64SizeKB = Math.round(base64String.length / 1024);
  // Base64 inflates by ~33%, so actual size is ~75%
  return Math.round(base64SizeKB * 0.75);
}

/**
 * Calculate base64 size in KB (before inflation adjustment)
 *
 * @param base64String - Base64 encoded string
 * @returns Size in kilobytes (rounded)
 *
 * @example
 * ```typescript
 * getBase64SizeKB("data:image/png;base64,iVBOR..."); // 4
 * ```
 */
export function getBase64SizeKB(base64String: string): number {
  return Math.round(base64String.length / 1024);
}

/**
 * Calculate success rate as percentage
 *
 * @param successCount - Number of successful operations
 * @param totalCount - Total number of operations
 * @returns Success rate as percentage (0-100)
 *
 * @example
 * ```typescript
 * getSuccessRate(8, 10); // 80
 * getSuccessRate(5, 5); // 100
 * getSuccessRate(0, 10); // 0
 * ```
 */
export function getSuccessRate(successCount: number, totalCount: number): number {
  if (totalCount === 0) return 0;
  return Math.round((successCount / totalCount) * 100);
}

/**
 * Format bytes to human-readable size
 *
 * @param bytes - Size in bytes
 * @returns Formatted string (e.g., "1.5KB", "2.3MB")
 *
 * @example
 * ```typescript
 * formatBytes(1536); // "1.5KB"
 * formatBytes(2048000); // "2.0MB"
 * formatBytes(500); // "500B"
 * ```
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

/**
 * Calculate retry count suffix for logging
 *
 * @param attempt - Current attempt number (0-indexed)
 * @param totalAttempts - Total number of attempts
 * @returns Formatted suffix string
 *
 * @example
 * ```typescript
 * getRetrySuffix(1, 2); // " (succeeded on retry 1)"
 * getRetrySuffix(0, 1); // ""
 * ```
 */
export function getRetrySuffix(attempt: number, _totalAttempts: number): string {
  if (attempt > 0) {
    return ` (succeeded on retry ${attempt})`;
  }
  return "";
}

/**
 * Calculate failure info string for logging
 *
 * @param attempt - Current attempt number (0-indexed)
 * @param totalAttempts - Total number of attempts
 * @returns Formatted failure info string
 *
 * @example
 * ```typescript
 * getFailureInfo(1, 2); // " after 2 attempts"
 * getFailureInfo(0, 1); // ""
 * ```
 */
export function getFailureInfo(attempt: number, _totalAttempts: number): string {
  if (attempt > 0) {
    return ` after ${attempt + 1} attempts`;
  }
  return "";
}
