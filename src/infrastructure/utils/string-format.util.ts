/**
 * String Formatting Utilities
 * Functions for formatting and manipulating strings
 */

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Capitalize first letter of string
 */
export function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Convert string to title case
 */
export function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
}

/**
 * Convert string to slug
 */
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Format list of items with conjunction
 */
export function formatList(items: readonly string[], conjunction: string = "and"): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0] ?? "";
  if (items.length === 2) return items.join(` ${conjunction} `);

  const allButLast = items.slice(0, -1);
  const last = items[items.length - 1];
  return `${allButLast.join(", ")}, ${conjunction} ${last}`;
}

/**
 * Pluralize word based on count
 */
export function pluralize(word: string, count: number): string {
  if (count === 1) return word;
  return `${word}s`;
}

/**
 * Format count with plural word
 */
export function formatCount(word: string, count: number): string {
  return `${count} ${pluralize(word, count)}`;
}
