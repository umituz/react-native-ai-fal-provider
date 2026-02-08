/**
 * Prompt Helper Utilities
 * Functions for prompt manipulation and sanitization
 */

/**
 * Truncate prompt to maximum length
 */
export function truncatePrompt(prompt: string, maxLength: number = 5000): string {
  if (prompt.length <= maxLength) {
    return prompt;
  }
  return prompt.slice(0, maxLength - 3) + "...";
}

/**
 * Sanitize prompt by removing excessive whitespace and control characters
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
