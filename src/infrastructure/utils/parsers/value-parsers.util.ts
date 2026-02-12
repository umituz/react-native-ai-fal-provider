/**
 * Value Parser Utilities
 * Parse primitive values with fallbacks
 */

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
