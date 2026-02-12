/**
 * Function Helper Utilities
 * Common functional programming helpers
 */

/**
 * No-op function
 */
export function noop(): void {
  // Intentionally empty
}

/**
 * Identity function
 */
export function identity<T>(value: T): T {
  return value;
}

/**
 * Constant function (returns same value regardless of input)
 */
export function constant<T>(value: T): () => T {
  return () => value;
}
