/**
 * String Formatting Utilities
 * Functions for formatting and manipulating strings
 *
 * Consolidates text truncation and prompt sanitization utilities.
 * Previously duplicated across string-format.util.ts and prompt-helpers.util.ts.
 */

/**
 * Truncate text with customizable ellipsis
 *
 * @param text - The text to truncate
 * @param maxLength - Maximum length including ellipsis
 * @param ellipsis - String to append when truncating (default: "...")
 * @returns Truncated text with ellipsis or original if under max length
 *
 * @example
 * ```typescript
 * truncateText("Hello World", 8); // "Hello..."
 * truncateText("Hello World", 8, "…"); // "Hello W…"
 * ```
 */
export function truncateText(
  text: string,
  maxLength: number,
  ellipsis: string = "..."
): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - ellipsis.length) + ellipsis;
}

/**
 * Truncate prompt to maximum length
 * Specialized wrapper for prompt truncation with 5000 char default
 *
 * @param prompt - The prompt text to truncate
 * @param maxLength - Maximum length (default: 5000)
 * @returns Truncated prompt
 *
 * @example
 * ```typescript
 * truncatePrompt(longPrompt); // Truncates to 5000 chars
 * truncatePrompt(longPrompt, 1000); // Truncates to 1000 chars
 * ```
 */
export function truncatePrompt(prompt: string, maxLength: number = 5000): string {
  return truncateText(prompt, maxLength);
}

/**
 * Sanitize prompt by removing excessive whitespace and control characters
 * Also enforces maximum length of 5000 characters
 *
 * @param prompt - The prompt text to sanitize
 * @returns Sanitized prompt
 *
 * @example
 * ```typescript
 * sanitizePrompt("Hello  \n\n  World\x00"); // "Hello World"
 * ```
 */
export function sanitizePrompt(prompt: string): string {
  return prompt
    .trim()
    .replace(/\s+/g, " ")
    // Remove control characters except tab, newline, carriage return
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
    .slice(0, 5000);
}
