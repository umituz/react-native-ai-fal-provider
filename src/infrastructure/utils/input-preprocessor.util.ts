/**
 * Input Preprocessor Utility
 * Detects and uploads base64 images to FAL storage before API calls
 */

import { uploadToFalStorage } from "./fal-storage.util";

declare const __DEV__: boolean | undefined;

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
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.log(`[FalPreprocessor] Uploading ${key} to storage...`);
      }

      const uploadPromise = uploadToFalStorage(value)
        .then((url) => {
          result[key] = url;
          if (typeof __DEV__ !== "undefined" && __DEV__) {
            console.log(`[FalPreprocessor] ${key} uploaded`, {
              url: url.slice(0, 50) + "...",
            });
          }
        })
        .catch((error) => {
          if (typeof __DEV__ !== "undefined" && __DEV__) {
            console.error(`[FalPreprocessor] Failed to upload ${key}:`, error);
          }
          throw new Error(`Failed to upload ${key}: ${error instanceof Error ? error.message : "Unknown error"}`);
        });

      uploadPromises.push(uploadPromise);
    }
  }

  // Handle image_urls array (for multi-person generation)
  if (Array.isArray(result.image_urls)) {
    const imageUrls = result.image_urls as unknown[];
    // Pre-initialize array with correct length to avoid sparse array
    const processedUrls: string[] = new Array(imageUrls.length).fill("");

    for (let i = 0; i < imageUrls.length; i++) {
      const imageUrl = imageUrls[i];
      if (isBase64DataUri(imageUrl)) {
        if (typeof __DEV__ !== "undefined" && __DEV__) {
          console.log(`[FalPreprocessor] Uploading image_urls[${i}] to storage...`);
        }

        // Capture index in closure to ensure correct assignment
        const index = i;
        const uploadPromise = uploadToFalStorage(imageUrl)
          .then((url) => {
            processedUrls[index] = url;
            if (typeof __DEV__ !== "undefined" && __DEV__) {
              console.log(`[FalPreprocessor] image_urls[${index}] uploaded`, {
                url: url.slice(0, 50) + "...",
              });
            }
          })
          .catch((error) => {
            if (typeof __DEV__ !== "undefined" && __DEV__) {
              console.error(`[FalPreprocessor] Failed to upload image_urls[${index}]:`, error);
            }
            throw new Error(`Failed to upload image_urls[${index}]: ${error instanceof Error ? error.message : "Unknown error"}`);
          });

        uploadPromises.push(uploadPromise);
      } else if (typeof imageUrl === "string") {
        processedUrls[i] = imageUrl;
      }
    }

    // Always set processed URLs after all uploads complete
    result.image_urls = processedUrls;
  }

  // Wait for ALL uploads to complete (both individual keys and array)
  if (uploadPromises.length > 0) {
    await Promise.all(uploadPromises);
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log(`[FalPreprocessor] All images uploaded (${uploadPromises.length})`);
    }
  }

  return result;
}
