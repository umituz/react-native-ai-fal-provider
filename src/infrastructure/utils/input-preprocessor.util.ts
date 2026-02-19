/**
 * Input Preprocessor Utility
 * Detects and uploads base64/local file images to FAL storage before API calls
 */

import { uploadToFalStorage, uploadLocalFileToFalStorage } from "./fal-storage.util";
import { getErrorMessage } from './helpers/error-helpers.util';
import { IMAGE_URL_FIELDS } from './constants/image-fields.constants';
import { isImageDataUri as isBase64DataUri } from './validators/data-uri-validator.util';

/**
 * Check if a value is a local file URI (file:// or content://)
 */
function isLocalFileUri(value: unknown): value is string {
  return typeof value === "string" && (
    value.startsWith("file://") || value.startsWith("content://")
  );
}

/**
 * Preprocess input by uploading base64/local file images to FAL storage.
 * Also strips sync_mode to prevent base64 data URI responses.
 * Returns input with HTTPS URLs instead of base64/local URIs.
 */
export async function preprocessInput(
  input: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  if (typeof __DEV__ !== "undefined" && __DEV__) {
    console.log("[preprocessInput] Starting input preprocessing...", {
      keys: Object.keys(input)
    });
  }

  const result = { ...input };
  const uploadPromises: Promise<unknown>[] = [];

  // SAFETY: Strip sync_mode to prevent base64 data URI responses
  // FAL returns base64 when sync_mode:true — we always want CDN URLs
  if ("sync_mode" in result) {
    delete result.sync_mode;
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.warn(
        "[preprocessInput] Stripped sync_mode from input. " +
        "sync_mode:true returns base64 data URIs which break Firestore persistence. " +
        "Use falProvider.subscribe() for CDN URLs."
      );
    }
  }

  // Handle individual image URL keys
  for (const key of IMAGE_URL_FIELDS) {
    const value = result[key];

    // Upload base64 data URIs to FAL storage
    if (isBase64DataUri(value)) {
      const uploadPromise = uploadToFalStorage(value)
        .then((url) => {
          result[key] = url;
          return url;
        })
        .catch((error) => {
          const errorMessage = `Failed to upload ${key}: ${getErrorMessage(error)}`;
          console.error(`[preprocessInput] ${errorMessage}`);
          throw new Error(errorMessage);
        });

      uploadPromises.push(uploadPromise);
    }
    // Upload local file URIs to FAL storage (file://, content://)
    else if (isLocalFileUri(value)) {
      const uploadPromise = uploadLocalFileToFalStorage(value)
        .then((url) => {
          result[key] = url;
          return url;
        })
        .catch((error) => {
          const errorMessage = `Failed to upload local file ${key}: ${getErrorMessage(error)}`;
          console.error(`[preprocessInput] ${errorMessage}`);
          throw new Error(errorMessage);
        });

      uploadPromises.push(uploadPromise);
    }
  }


  // Handle image_urls array (for multi-person generation)
  if (Array.isArray(result.image_urls) && result.image_urls.length > 0) {
    const imageUrls = result.image_urls as unknown[];
    const uploadTasks: Array<{ index: number; url: string | Promise<string> }> = [];
    const errors: string[] = [];

    for (let i = 0; i < imageUrls.length; i++) {
      const imageUrl = imageUrls[i];

      if (!imageUrl) {
        errors.push(`image_urls[${i}] is null or undefined`);
        continue;
      }

      if (isBase64DataUri(imageUrl)) {
        const uploadPromise = uploadToFalStorage(imageUrl)
          .then((url) => url)
          .catch((error) => {
            const errorMessage = `Failed to upload image_urls[${i}]: ${getErrorMessage(error)}`;
            console.error(`[preprocessInput] ${errorMessage}`);
            errors.push(errorMessage);
            throw new Error(errorMessage);
          });
        uploadTasks.push({ index: i, url: uploadPromise });
      } else if (typeof imageUrl === "string") {
        uploadTasks.push({ index: i, url: imageUrl });
      } else {
        errors.push(`image_urls[${i}] has invalid type: ${typeof imageUrl}`);
      }
    }

    if (errors.length > 0) {
      throw new Error(`Image URL validation failed:\n${errors.join('\n')}`);
    }

    // Validate that we have at least one valid image URL
    if (uploadTasks.length === 0) {
      throw new Error('image_urls array must contain at least one valid image URL');
    }

    // Wait for all uploads using Promise.allSettled to handle failures gracefully
    // This ensures all uploads complete before reporting errors
    const uploadResults = await Promise.allSettled(
      uploadTasks.map((task) => Promise.resolve(task.url))
    );

    const processedUrls: string[] = [];
    const uploadErrors: string[] = [];

    uploadResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        processedUrls.push(result.value);
      } else {
        uploadErrors.push(
          `Upload ${index} failed: ${getErrorMessage(result.reason)}`
        );
      }
    });

    // If any uploads failed, throw with details
    if (uploadErrors.length > 0) {
      console.warn(
        `[input-preprocessor] ${processedUrls.length} of ${uploadTasks.length} uploads succeeded. ` +
        'Successful uploads remain in FAL storage.'
      );
      throw new Error(`Image upload failures:\n${uploadErrors.join('\n')}`);
    }

    result.image_urls = processedUrls;
  }

  // Wait for ALL uploads to complete (both individual keys and array)
  // Use Promise.allSettled to handle partial failures gracefully
  if (uploadPromises.length > 0) {
    const individualUploadResults = await Promise.allSettled(uploadPromises);

    const failedUploads = individualUploadResults.filter(
      (result) => result.status === 'rejected'
    );

    if (failedUploads.length > 0) {
      const successCount = individualUploadResults.length - failedUploads.length;
      console.warn(
        `[input-preprocessor] ${successCount} of ${individualUploadResults.length} individual field uploads succeeded. ` +
        'Successful uploads remain in FAL storage.'
      );

      const errorMessages = failedUploads.map((result) =>
        result.status === 'rejected'
          ? (getErrorMessage(result.reason))
          : 'Unknown error'
      );

      throw new Error(`Some image uploads failed:\n${errorMessages.join('\n')}`);
    }
  }

  return result;
}
