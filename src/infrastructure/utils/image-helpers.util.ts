/**
 * Image Helper Utilities (Infrastructure Layer)
 * Delegates to domain ImageProcessingService for image data manipulation
 *
 * This file now serves as a thin adapter layer for backward compatibility.
 * The actual image processing logic has been moved to the domain layer.
 */

import { ImageProcessingService } from "../../domain/services/ImageProcessingService";

/**
 * Format image as data URI if not already formatted
 * Delegates to domain ImageProcessingService
 */
export function formatImageDataUri(base64: string): string {
  return ImageProcessingService.formatImageDataUri(base64);
}

/**
 * Extract base64 from data URI
 * Delegates to domain ImageProcessingService
 */
export function extractBase64(dataUri: string): string {
  return ImageProcessingService.extractBase64(dataUri);
}

/**
 * Get file extension from data URI
 * Delegates to domain ImageProcessingService
 */
export function getDataUriExtension(dataUri: string): string | null {
  return ImageProcessingService.getDataUriExtension(dataUri);
}
