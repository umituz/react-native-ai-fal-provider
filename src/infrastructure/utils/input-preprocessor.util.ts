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
  const uploadPromises: Promise<void>[] = [];

  // Handle individual image URL keys
  for (const key of IMAGE_URL_KEYS) {
    const value = result[key];
    if (isBase64DataUri(value)) {
      const uploadPromise = uploadToFalStorage(value)
        .then((url) => {
          result[key] = url;
        })
        .catch((error) => {
          throw new Error(`Failed to upload ${key}: ${error instanceof Error ? error.message : "Unknown error"}`);
        });

      uploadPromises.push(uploadPromise);
    }
  }

  // Handle image_urls array (for multi-person generation)
  if (Array.isArray(result.image_urls) && result.image_urls.length > 0) {
    const imageUrls = result.image_urls as unknown[];
    const processedUrls: string[] = [];
    const errors: string[] = [];

    for (let i = 0; i < imageUrls.length; i++) {
      const imageUrl = imageUrls[i];

      if (!imageUrl) {
        errors.push(`image_urls[${i}] is null or undefined`);
        continue;
      }

      if (isBase64DataUri(imageUrl)) {
        const index = i;
        const uploadPromise = uploadToFalStorage(imageUrl)
          .then((url) => {
            processedUrls[index] = url;
          })
          .catch((error) => {
            errors.push(`Failed to upload image_urls[${index}]: ${error instanceof Error ? error.message : "Unknown error"}`);
            throw new Error(`Failed to upload image_urls[${index}]: ${error instanceof Error ? error.message : "Unknown error"}`);
          });

        uploadPromises.push(uploadPromise);
      } else if (typeof imageUrl === "string") {
        processedUrls[i] = imageUrl;
      } else {
        errors.push(`image_urls[${i}] has invalid type: ${typeof imageUrl}`);
      }
    }

    if (errors.length > 0) {
      throw new Error(`Image URL validation failed:\n${errors.join('\n')}`);
    }

    result.image_urls = processedUrls;
  }

  // Wait for ALL uploads to complete (both individual keys and array)
  if (uploadPromises.length > 0) {
    await Promise.all(uploadPromises);
  }

  return result;
}
