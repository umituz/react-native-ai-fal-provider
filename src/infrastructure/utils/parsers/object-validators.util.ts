/**
 * Object Validator Utilities
 * Runtime object structure validation
 */

/**
 * Validate object structure
 */
export function validateObjectStructure<T extends Record<string, unknown>>(
  data: unknown,
  requiredKeys: readonly (keyof T)[]
): data is T {
  if (!data || typeof data !== "object") {
    return false;
  }

  for (const key of requiredKeys) {
    if (!(key in data)) {
      return false;
    }
  }

  return true;
}

/**
 * Validate array of objects
 */
export function validateObjectArray<T>(
  data: unknown,
  validator: (item: unknown) => item is T
): data is T[] {
  if (!Array.isArray(data)) {
    return false;
  }

  return data.every(validator);
}
