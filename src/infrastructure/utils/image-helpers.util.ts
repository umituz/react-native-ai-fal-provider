/**
 * Image Helper Utilities
 * Functions for image data URI manipulation
 */

/**
 * Format image as data URI if not already formatted
 */
export function formatImageDataUri(base64: string): string {
  if (base64.startsWith("data:")) {
    return base64;
  }
  return `data:image/jpeg;base64,${base64}`;
}

/**
 * Extract base64 from data URI
 */
export function extractBase64(dataUri: string): string {
  if (!dataUri.startsWith("data:")) {
    return dataUri;
  }
  const parts = dataUri.split(",");
  return parts.length > 1 ? parts[1] : dataUri;
}

/**
 * Get file extension from data URI
 */
export function getDataUriExtension(dataUri: string): string | null {
  const match = dataUri.match(/^data:image\/(\w+);base64/);
  return match ? match[1] : null;
}

/**
 * Check if data URI is an image
 */
export function isImageDataUri(value: string): boolean {
  return value.startsWith("data:image/");
}
