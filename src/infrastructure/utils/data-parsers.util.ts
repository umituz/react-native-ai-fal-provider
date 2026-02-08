/**
 * Data Parser Utilities
 * Common patterns for parsing, validating, and transforming data
 */

/**
 * Safely parse JSON with fallback
 */
export function safeJsonParse<T = unknown>(
  data: string,
  fallback: T
): T {
  try {
    return JSON.parse(data) as T;
  } catch {
    return fallback;
  }
}

/**
 * Safely parse JSON with null fallback
 */
export function safeJsonParseOrNull<T = unknown>(data: string): T | null {
  try {
    return JSON.parse(data) as T;
  } catch {
    return null;
  }
}

/**
 * Safely stringify object with fallback
 */
export function safeJsonStringify(
  data: unknown,
  fallback: string
): string {
  try {
    return JSON.stringify(data);
  } catch {
    return fallback;
  }
}

/**
 * Check if string is valid JSON
 */
export function isValidJson(data: string): boolean {
  try {
    JSON.parse(data);
    return true;
  } catch {
    return false;
  }
}

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

/**
 * Parse number with fallback
 */
export function parseNumber(value: unknown, fallback: number): number {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isNaN(parsed) ? fallback : parsed;
  }

  return fallback;
}

/**
 * Parse boolean with fallback
 */
export function parseBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const lower = value.toLowerCase().trim();
    if (lower === "true" || lower === "yes" || lower === "1") {
      return true;
    }
    if (lower === "false" || lower === "no" || lower === "0") {
      return false;
    }
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  return fallback;
}

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

/**
 * Deep clone object using JSON
 */
export function deepClone<T>(data: T): T {
  return safeJsonParse(safeJsonStringify(data, "{}"), data);
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
