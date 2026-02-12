/**
 * JSON Parser Utilities
 * Safe JSON parsing and validation operations
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
