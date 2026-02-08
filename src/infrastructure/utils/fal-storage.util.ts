/**
 * FAL Storage Utility
 * Handles image uploads to FAL storage (React Native compatible)
 */

import { fal } from "@fal-ai/client";
import {
  base64ToTempFile,
  deleteTempFile,
} from "@umituz/react-native-design-system/filesystem";

/**
 * Upload base64 image to FAL storage
 * Uses design system's filesystem utilities for React Native compatibility
 */
export async function uploadToFalStorage(base64: string): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
  const tempUri = (await base64ToTempFile(base64));

  try {
    const response = await fetch(tempUri);
    const blob = await response.blob();
    const url = await fal.storage.upload(blob);
    return url;
  } finally {
    if (tempUri) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        await deleteTempFile(tempUri);
      } catch (cleanupError) {
        // Log cleanup failure but don't throw
        // eslint-disable-next-line no-console
        console.warn(`Failed to cleanup temp file ${tempUri}:`, cleanupError);
      }
    }
  }
}

/**
 * Upload multiple images to FAL storage in parallel
 */
export async function uploadMultipleToFalStorage(
  images: string[],
): Promise<string[]> {
  return Promise.all(images.map(uploadToFalStorage));
}
