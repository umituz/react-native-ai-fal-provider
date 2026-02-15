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
 * Uses indexOf instead of split to handle edge cases where comma might appear in base64
 */
export function extractBase64(dataUri: string): string {
  if (!dataUri.startsWith("data:")) {
    return dataUri;
  }

  // Find the first comma which separates header from data
  const commaIndex = dataUri.indexOf(",");
  if (commaIndex === -1) {
    throw new Error(`Invalid data URI format (no comma separator): ${dataUri.substring(0, 50)}...`);
  }

  // Extract everything after the first comma
  const base64Part = dataUri.substring(commaIndex + 1);

  if (!base64Part || base64Part.length === 0) {
    throw new Error(`Empty base64 data in URI: ${dataUri.substring(0, 50)}...`);
  }

  return base64Part;
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
