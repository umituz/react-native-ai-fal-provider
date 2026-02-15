/**
 * Date Formatting Utilities
 * Functions for formatting dates and times
 */

/**
 * Validate that a date is valid
 */
function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Format date to locale string
 * @throws {Error} if date is invalid
 */
export function formatDate(date: Date | string, locale: string = "en-US"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (!isValidDate(dateObj)) {
    const dateStr = typeof date === "string" ? date : date.toISOString();
    throw new Error(`Invalid date: ${dateStr}`);
  }

  return dateObj.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
