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

    // Wait for all uploads and build the final array without sparse elements
    const processedUrls = await Promise.all(
      uploadTasks
        .sort((a, b) => a.index - b.index)
        .map((task) => Promise.resolve(task.url))
    );

    result.image_urls = processedUrls;
  }

  // Wait for ALL uploads to complete (both individual keys and array)
  if (uploadPromises.length > 0) {
    await Promise.all(uploadPromises);
  }

  return result;
}
