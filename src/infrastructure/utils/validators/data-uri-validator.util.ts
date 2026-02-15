/**
 * Data URI Validation Utilities
 * Centralized data URI format checking and validation
 *
 * Eliminates the duplicated pattern:
 * `value.startsWith("data:image/")`
 * which appeared in 4 different files.
 */

/**
 * Check if value is a data URI (any type)
 *
 * @param value - Value to check
 * @returns Type guard indicating if the value is a data URI string
 *
 * @example
 * ```typescript
 * isDataUri("data:text/plain;base64,SGVsbG8="); // true
 * isDataUri("https://example.com/image.png"); // false
 * ```
 */
export function isDataUri(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("data:");
}

/**
 * Check if value is an image data URI
 *
 * @param value - Value to check
 * @returns Type guard indicating if the value is an image data URI string
 *
 * @example
 * ```typescript
 * isImageDataUri("data:image/png;base64,iVBOR..."); // true
 * isImageDataUri("data:text/plain;base64,SGVsbG8="); // false
 * isImageDataUri("https://example.com/image.png"); // false
 * ```
 */
export function isImageDataUri(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("data:image/");
}

/**
 * Check if value is a base64-encoded data URI
 *
 * @param value - Value to check
 * @returns Type guard indicating if the value contains base64 encoding
 *
 * @example
 * ```typescript
 * isBase64DataUri("data:image/png;base64,iVBOR..."); // true
 * isBase64DataUri("data:image/svg+xml,<svg>...</svg>"); // false
 * ```
 */
export function isBase64DataUri(value: unknown): value is string {
  return isDataUri(value) && value.includes("base64,");
}

/**
 * Extract MIME type from data URI
 *
 * @param dataUri - Data URI string
 * @returns MIME type or null if not found
 *
 * @example
 * ```typescript
 * extractMimeType("data:image/png;base64,iVBOR..."); // "image/png"
 * extractMimeType("data:text/plain;charset=utf-8,Hello"); // "text/plain"
 * ```
 */
export function extractMimeType(dataUri: string): string | null {
  const match = dataUri.match(/^data:([^;,]+)/);
  return match ? match[1] : null;
}

/**
 * Extract base64 content from data URI
 *
 * @param dataUri - Data URI string
 * @returns Base64 content or null if not base64-encoded
 *
 * @example
 * ```typescript
 * extractBase64Content("data:image/png;base64,iVBOR..."); // "iVBOR..."
 * extractBase64Content("data:text/plain,Hello"); // null
 * ```
 */
export function extractBase64Content(dataUri: string): string | null {
  const parts = dataUri.split("base64,");
  return parts.length === 2 ? parts[1] : null;
}
