/**
 * Domain Service: Image Processing
 * Pure business logic for image data URI manipulation
 * No infrastructure dependencies
 */

/**
 * Domain service for image data processing
 * Single responsibility: manipulate and validate image data URIs
 */
export class ImageProcessingService {
  /**
   * Format image as data URI if not already formatted
   *
   * @param base64 - Base64 string (with or without data URI prefix)
   * @returns Data URI formatted string
   */
  static formatImageDataUri(base64: string): string {
    if (base64.startsWith("data:")) {
      return base64;
    }
    return `data:image/jpeg;base64,${base64}`;
  }

  /**
   * Extract base64 from data URI
   * Uses indexOf instead of split to handle edge cases where comma might appear in base64
   *
   * @param dataUri - Data URI string
   * @returns Base64 content
   * @throws Error if data URI format is invalid
   */
  static extractBase64(dataUri: string): string {
    if (!dataUri.startsWith("data:")) {
      return dataUri;
    }

    // Find the first comma which separates header from data
    const commaIndex = dataUri.indexOf(",");
    if (commaIndex === -1) {
      throw new Error(
        `Invalid data URI format (no comma separator): ${dataUri.substring(0, 50)}...`
      );
    }

    // Extract everything after the first comma
    const base64Part = dataUri.substring(commaIndex + 1);

    if (!base64Part || base64Part.length === 0) {
      throw new Error(
        `Empty base64 data in URI: ${dataUri.substring(0, 50)}...`
      );
    }

    return base64Part;
  }

  /**
   * Get file extension from data URI
   *
   * @param dataUri - Data URI string
   * @returns File extension (e.g., "png", "jpeg") or null
   */
  static getDataUriExtension(dataUri: string): string | null {
    const match = dataUri.match(/^data:image\/(\w+);base64/);
    return match ? match[1] : null;
  }

  /**
   * Extract MIME type from data URI
   *
   * @param dataUri - Data URI string
   * @returns MIME type (e.g., "image/png") or null
   */
  static extractMimeType(dataUri: string): string | null {
    const match = dataUri.match(/^data:([^;,]+)/);
    return match ? match[1] : null;
  }

  /**
   * Check if data URI is base64-encoded
   *
   * @param dataUri - Data URI string
   * @returns True if base64-encoded
   */
  static isBase64DataUri(dataUri: string): boolean {
    return dataUri.startsWith("data:") && dataUri.includes("base64,");
  }
}
