/**
 * FAL Storage Utility
 * Handles image uploads to FAL storage (React Native compatible)
 */

import { fal } from "@fal-ai/client";
import {
  base64ToTempFile,
  deleteTempFile,
} from "@umituz/react-native-design-system/filesystem";
import { getErrorMessage } from './helpers/error-helpers.util';

/**
 * Upload base64 image to FAL storage
 * Uses design system's filesystem utilities for React Native compatibility
 */
export async function uploadToFalStorage(base64: string): Promise<string> {
  if (typeof __DEV__ !== "undefined" && __DEV__) {
    console.log(`[fal-storage] Uploading base64 image to FAL (first 50 chars): ${base64.substring(0, 50)}...`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
  const tempUri = (await base64ToTempFile(base64));

  if (!tempUri) {
    throw new Error("Failed to create temporary file from base64 data");
  }

  try {
    const response = await fetch(tempUri);
    const blob = await response.blob();
    const url = await fal.storage.upload(blob);
    
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log(`[fal-storage] Successfully uploaded base64 data to FAL. URL: ${url}`);
    }

    return url;
  } finally {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await deleteTempFile(tempUri);
    } catch (cleanupError) {
      // Log cleanup errors to prevent disk space leaks
      console.warn(
        `[fal-storage] Failed to delete temp file: ${tempUri}`,
        getErrorMessage(cleanupError)
      );
      // Don't throw - cleanup errors shouldn't fail the upload
    }
  }
}

/**
 * Upload a local file (file:// or content:// URI) to FAL storage
 * Directly fetches the file as a blob — no base64 intermediate step
 */
export async function uploadLocalFileToFalStorage(fileUri: string): Promise<string> {
  try {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log(`[fal-storage] Starting local file upload to FAL: ${fileUri}`);
    }

    const response = await fetch(fileUri);
    const blob = await response.blob();
    const url = await fal.storage.upload(blob);

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log(`[fal-storage] Successfully uploaded local file to FAL. URL: ${url}`);
    }

    return url;
  } catch (error) {
    throw new Error(
      `Failed to upload local file to FAL storage: ${getErrorMessage(error)}`
    );
  }
}

/**
 * Upload multiple images to FAL storage in parallel
 * Uses Promise.allSettled to handle partial failures gracefully
 * @throws {Error} if any upload fails, with details about all failures
 * Note: Successful uploads before the first failure are NOT cleaned up automatically
 * as FAL storage doesn't provide a delete API. Monitor orphaned uploads externally.
 */
export async function uploadMultipleToFalStorage(
  images: string[],
): Promise<string[]> {
  const results = await Promise.allSettled(images.map(uploadToFalStorage));

  const successfulUploads: string[] = [];
  const failures: Array<{ index: number; error: unknown }> = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      successfulUploads.push(result.value);
    } else {
      failures.push({ index, error: result.reason });
    }
  });

  // If any upload failed, throw detailed error
  if (failures.length > 0) {
    const errorMessage = failures
      .map(({ index, error }) =>
        `Image ${index}: ${getErrorMessage(error)}`
      )
      .join('; ');

    // Log warning about orphaned uploads
    if (successfulUploads.length > 0) {
      console.warn(
        `[fal-storage] ${successfulUploads.length} upload(s) succeeded before failure. ` +
        'These files remain in FAL storage and may need manual cleanup:',
        successfulUploads
      );
    }

    throw new Error(
      `Failed to upload ${failures.length} of ${images.length} image(s): ${errorMessage}`
    );
  }

  return successfulUploads;
}
