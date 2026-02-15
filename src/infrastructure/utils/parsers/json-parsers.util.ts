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
  } catch (error) {
    console.warn(
      '[json-parsers] Failed to parse JSON, using fallback:',
      error instanceof Error ? error.message : String(error),
      { dataPreview: data.substring(0, 100) }
    );
    return fallback;
  }
}

/**
 * Safely parse JSON with null fallback
 */
export function safeJsonParseOrNull<T = unknown>(data: string): T | null {
  try {
    return JSON.parse(data) as T;
  } catch (error) {
    console.warn(
      '[json-parsers] Failed to parse JSON, returning null:',
      error instanceof Error ? error.message : String(error),
      { dataPreview: data.substring(0, 100) }
    );
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
  } catch (error) {
    console.warn(
      '[json-parsers] Failed to stringify object, using fallback:',
      error instanceof Error ? error.message : String(error),
      { dataType: typeof data }
    );
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
    // Don't log here - this is expected to fail for validation checks
    return false;
  }
}
