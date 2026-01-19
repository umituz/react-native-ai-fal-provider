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
 * Sanitize prompt by removing excessive whitespace
 */
export function sanitizePrompt(prompt: string): string {
  return prompt.trim().replace(/\s+/g, " ");
}
