/**
 * Error Helper Utilities
 * Centralized error message extraction and formatting
 *
 * This utility eliminates the repeated pattern:
 * `error instanceof Error ? error.message : String(error)`
 * which appeared 8 times across 6 files in the codebase.
 */

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
 *
 * @example
 * ```typescript
 * const message = getErrorMessageOr(error, 'An unknown error occurred');
 * ```
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
 *
 * @example
 * ```typescript
 * throw new Error(formatErrorMessage(error, 'Failed to upload image'));
 * // Output: "Failed to upload image: Network timeout"
 * ```
 */
export function formatErrorMessage(error: unknown, context: string): string {
  return `${context}: ${getErrorMessage(error)}`;
}

/**
 * Extract error name (for Error instances)
 * Returns undefined for non-Error types
 *
 * @param error - The error to extract name from
 * @returns The error name or undefined
 */
export function getErrorName(error: unknown): string | undefined {
  return error instanceof Error ? error.name : undefined;
}

/**
 * Extract error stack trace
 * Returns undefined for non-Error types
 *
 * @param error - The error to extract stack from
 * @returns The error stack trace or undefined
 */
export function getErrorStack(error: unknown): string | undefined {
  return error instanceof Error ? error.stack : undefined;
}
