/**
 * Object Transformer Utilities
 * Clone, merge, pick, and omit operations
 */

/**
 * Deep clone object using JSON serialization
 * Throws on failure (circular references, non-serializable values)
 * No silent fallback - caller must handle errors explicitly
 */
export function deepClone<T>(data: T): T {
  const serialized = JSON.stringify(data);
  return JSON.parse(serialized) as T;
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
