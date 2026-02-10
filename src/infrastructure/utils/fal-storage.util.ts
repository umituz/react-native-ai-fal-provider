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

  if (!tempUri) {
    throw new Error("Failed to create temporary file from base64 data");
  }

  try {
    const response = await fetch(tempUri);
    const blob = await response.blob();
    const url = await fal.storage.upload(blob);
    return url;
  } finally {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await deleteTempFile(tempUri);
    } catch {
      // Silently ignore cleanup errors
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
