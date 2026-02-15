/**
 * Input Preprocessor Utility
 * Detects and uploads base64 images to FAL storage before API calls
 */

import { uploadToFalStorage } from "./fal-storage.util";

const IMAGE_URL_KEYS = [
  "image_url",
  "second_image_url",
  "third_image_url",
  "fourth_image_url",
  "driver_image_url",
  "base_image_url",
  "swap_image_url",
  "mask_url",
  "input_image_url",
];

function isBase64DataUri(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("data:image/");
}

/**
 * Preprocess input by uploading base64 images to FAL storage
 * Returns input with URLs instead of base64 data URIs
 */
export async function preprocessInput(
  input: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const result = { ...input };
  const uploadPromises: Promise<unknown>[] = [];

  // Handle individual image URL keys
  for (const key of IMAGE_URL_KEYS) {
    const value = result[key];
    if (isBase64DataUri(value)) {
      const uploadPromise = uploadToFalStorage(value)
        .then((url) => {
          result[key] = url;
          return url;
        })
        .catch((error) => {
          const errorMessage = `Failed to upload ${key}: ${error instanceof Error ? error.message : "Unknown error"}`;
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
            const errorMessage = `Failed to upload image_urls[${i}]: ${error instanceof Error ? error.message : "Unknown error"}`;
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
          `Upload ${index} failed: ${result.reason instanceof Error ? result.reason.message : String(result.reason)}`
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
          ? (result.reason instanceof Error ? result.reason.message : String(result.reason))
          : 'Unknown error'
      );

      throw new Error(`Some image uploads failed:\n${errorMessages.join('\n')}`);
    }
  }

  return result;
}
