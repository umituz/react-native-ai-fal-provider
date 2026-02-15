/**
 * Object Transformer Utilities
 * Clone, merge, pick, and omit operations
 */

import { getErrorMessage } from '../helpers/error-helpers.util';

/**
 * Deep clone object using JSON serialization
 * NOTE: This has limitations:
 * - Functions are not cloned
 * - Dates become strings
 * - Circular references will cause errors
 * For complex objects, consider a dedicated cloning library
 */
export function deepClone<T>(data: T): T {
  try {
    // Try JSON clone first (fast path)
    const serialized = JSON.stringify(data);
    return JSON.parse(serialized) as T;
  } catch (error) {
    // Fallback for circular references or other JSON errors
    console.warn(
      '[object-transformers] deepClone failed, returning original:',
      getErrorMessage(error)
    );
    // Return original data if cloning fails
    return data;
  }
}

/**
 * Merge objects with later objects overriding earlier ones
 */
export function mergeObjects<T extends Record<string, unknown>>(
  ...objects: Partial<T>[]
): T {
  return Object.assign({}, ...objects) as T;
}

/**
 * Pick specified properties from object
 */
export function pickProperties<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Omit specified properties from object
 */
export function omitProperties<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result as Omit<T, K>;
}
