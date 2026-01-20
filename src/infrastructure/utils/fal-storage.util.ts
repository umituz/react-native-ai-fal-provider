/**
 * FAL Storage Utility
 * Handles image uploads to FAL storage (React Native compatible)
 */

import { fal } from "@fal-ai/client";
import {
  base64ToTempFile,
  deleteTempFile,
  getFileSize,
  detectMimeType,
} from "@umituz/react-native-design-system/filesystem";

declare const __DEV__: boolean | undefined;

/**
 * Upload base64 image to FAL storage
 * Uses design system's filesystem utilities for React Native compatibility
 */
export async function uploadToFalStorage(base64: string): Promise<string> {
  const tempUri = await base64ToTempFile(base64);
  const fileSize = getFileSize(tempUri);
  const mimeType = detectMimeType(base64);

  if (typeof __DEV__ !== "undefined" && __DEV__) {
    console.log("[FalStorage] Uploading image", {
      size: `${(fileSize / 1024).toFixed(1)}KB`,
      type: mimeType,
    });
  }

  const response = await fetch(tempUri);
  const blob = await response.blob();
  const url = await fal.storage.upload(blob);

  await deleteTempFile(tempUri);

  if (typeof __DEV__ !== "undefined" && __DEV__) {
    console.log("[FalStorage] Upload complete", { url: url.slice(0, 60) + "..." });
  }

  return url;
}

/**
 * Upload multiple images to FAL storage in parallel
 */
export async function uploadMultipleToFalStorage(
  images: string[],
): Promise<string[]> {
  return Promise.all(images.map(uploadToFalStorage));
}
