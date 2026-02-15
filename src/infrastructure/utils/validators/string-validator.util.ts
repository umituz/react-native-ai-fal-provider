/**
 * String Validation Utilities
 * Common string validation patterns
 *
 * Eliminates the duplicated pattern:
 * `value.trim().length === 0`
 * which appeared in 3+ files.
 */

/**
 * Check if string is empty or whitespace-only
 *
 * @param value - Value to check
 * @returns True if the value is an empty string or contains only whitespace
 *
 * @example
 * ```typescript
 * isEmptyString(""); // true
 * isEmptyString("   "); // true
 * isEmptyString("Hello"); // false
 * isEmptyString(null); // false
 * ```
 */
export function isEmptyString(value: unknown): boolean {
  return typeof value === "string" && value.trim().length === 0;
}

/**
 * Check if value is a non-empty string
 * Type guard version for better TypeScript inference
 *
 * @param value - Value to check
 * @returns Type guard indicating if the value is a non-empty string
 *
 * @example
 * ```typescript
 * if (isNonEmptyString(input)) {
 *   // TypeScript knows input is a string here
 *   console.log(input.toUpperCase());
 * }
 * ```
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Check if value is a string (empty or non-empty)
 * Basic type guard for string validation
 *
 * @param value - Value to check
 * @returns Type guard indicating if the value is a string
 *
 * @example
 * ```typescript
 * if (isString(value)) {
 *   // TypeScript knows value is a string here
 *   console.log(value.length);
 * }
 * ```
 */
export function isString(value: unknown): value is string {
  return typeof value === "string";
}
