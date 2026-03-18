/**
 * FAL Storage Utility
 * Handles image uploads to FAL storage (React Native compatible)
 * Features: timeout protection, retry with exponential backoff, session-scoped logging
 */

import { fal } from "@fal-ai/client";
import {
  base64ToTempFile,
  deleteTempFile,
} from "@umituz/react-native-design-system/filesystem";
import { getErrorMessage, getElapsedTime, getActualSizeKB, sleep } from "../../shared/helpers";
import { generationLogCollector } from './log-collector';
import { UPLOAD_CONFIG } from '../services/fal-provider.constants';

const TAG = 'fal-storage';

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Upload timeout after ${ms}ms: ${label}`));
    }, ms);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
}

async function withRetry<T>(
  fn: () => Promise<T>,
  sessionId: string,
  label: string,
  maxRetries: number = UPLOAD_CONFIG.maxRetries,
  baseDelay: number = UPLOAD_CONFIG.baseDelayMs,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        const delay = baseDelay * Math.pow(2, attempt - 1);
        generationLogCollector.warn(sessionId, TAG, `Retry ${attempt}/${maxRetries} for ${label} after ${delay}ms`);
        await sleep(delay);
      }
      return await fn();
    } catch (error) {
      lastError = error;
      const errorMsg = getErrorMessage(error).toLowerCase();
      const isTransient =
        errorMsg.includes('network') ||
        errorMsg.includes('timeout') ||
        errorMsg.includes('timed out') ||
        errorMsg.includes('econnrefused') ||
        errorMsg.includes('enotfound') ||
        errorMsg.includes('fetch');

      if (attempt < maxRetries && isTransient) {
        generationLogCollector.warn(sessionId, TAG, `Attempt ${attempt + 1} failed for ${label}: ${errorMsg}`);
        continue;
      }
      break;
    }
  }

  throw lastError;
}

/**
 * Upload base64 image to FAL storage
 */
export async function uploadToFalStorage(base64: string, sessionId: string): Promise<string> {
  const startTime = Date.now();
  const actualSizeKB = getActualSizeKB(base64);
  generationLogCollector.log(sessionId, TAG, `Starting upload (~${actualSizeKB}KB actual)`);

  const tempUri = await base64ToTempFile(base64);

  // base64ToTempFile returns a string, so this check is for defensive programming
  // in case the implementation changes in the future
  if (!tempUri || typeof tempUri !== 'string') {
    throw new Error("Failed to create temporary file from base64 data");
  }

  try {
    const url = await withRetry(
      async () => {
        const response = await fetch(tempUri);

        // Validate response before processing blob
        if (!response.ok) {
          throw new Error(`Failed to fetch temp file: HTTP ${response.status} ${response.statusText}`);
        }

        const blob = await response.blob();
        generationLogCollector.log(sessionId, TAG, `Blob created (${blob.size} bytes), uploading to FAL CDN...`);
        return withTimeout(
          fal.storage.upload(blob),
          UPLOAD_CONFIG.timeoutMs,
          `image (~${actualSizeKB}KB)`,
        );
      },
      sessionId,
      'upload',
    );

    const elapsed = getElapsedTime(startTime);
    generationLogCollector.log(sessionId, TAG, `Upload complete in ${elapsed}ms`, { url, actualSizeKB, elapsed });
    return url;
  } catch (error) {
    const elapsed = getElapsedTime(startTime);
    generationLogCollector.error(sessionId, TAG, `Upload FAILED after ${elapsed}ms: ${getErrorMessage(error)}`, { actualSizeKB, elapsed });
    throw error;
  } finally {
    try {
      await deleteTempFile(tempUri);
    } catch (cleanupError) {
      generationLogCollector.warn(sessionId, TAG, `Failed to delete temp file: ${getErrorMessage(cleanupError)}`);
    }
  }
}

/**
 * Upload a local file to FAL storage
 */
export async function uploadLocalFileToFalStorage(fileUri: string, sessionId: string): Promise<string> {
  const startTime = Date.now();
  generationLogCollector.log(sessionId, TAG, `Starting local file upload: ${fileUri}`);

  try {
    const url = await withRetry(
      async () => {
        const response = await fetch(fileUri);

        // Validate response before processing blob
        if (!response.ok) {
          throw new Error(`Failed to fetch local file: HTTP ${response.status} ${response.statusText}`);
        }

        const blob = await response.blob();
        generationLogCollector.log(sessionId, TAG, `Local file blob (${blob.size} bytes), uploading...`);
        return withTimeout(
          fal.storage.upload(blob),
          UPLOAD_CONFIG.timeoutMs,
          `local file`,
        );
      },
      sessionId,
      'local file upload',
    );

    const elapsed = Date.now() - startTime;
    generationLogCollector.log(sessionId, TAG, `Local file upload complete in ${elapsed}ms`, { url, elapsed });
    return url;
  } catch (error) {
    const elapsed = Date.now() - startTime;
    generationLogCollector.error(sessionId, TAG, `Local file upload FAILED after ${elapsed}ms: ${getErrorMessage(error)}`, { elapsed });
    throw error;
  }
}

/**
 * Upload multiple images to FAL storage in parallel
 */
export async function uploadMultipleToFalStorage(
  images: string[],
  sessionId: string,
): Promise<string[]> {
  const startTime = Date.now();
  generationLogCollector.log(sessionId, TAG, `Starting batch upload of ${images.length} image(s)`);

  const results = await Promise.allSettled(
    images.map((img, i) => {
      generationLogCollector.log(sessionId, TAG, `[${i}/${images.length}] Queuing upload (~${Math.round(img.length * 0.75 / 1024)}KB)`);
      return uploadToFalStorage(img, sessionId);
    })
  );

  const successfulUploads: string[] = [];
  const failures: Array<{ index: number; error: unknown }> = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      successfulUploads.push(result.value);
    } else {
      failures.push({ index, error: result.reason });
    }
  });

  const elapsed = Date.now() - startTime;

  if (failures.length > 0) {
    const errorMessage = failures
      .map(({ index, error }) => `Image ${index}: ${getErrorMessage(error)}`)
      .join('; ');

    generationLogCollector.error(sessionId, TAG, `Batch upload FAILED: ${successfulUploads.length}/${images.length} in ${elapsed}ms`, { elapsed });
    throw new Error(
      `Failed to upload ${failures.length} of ${images.length} image(s) (${elapsed}ms): ${errorMessage}`
    );
  }

  generationLogCollector.log(sessionId, TAG, `Batch upload complete: ${images.length}/${images.length} in ${elapsed}ms`, { elapsed });
  return successfulUploads;
}
