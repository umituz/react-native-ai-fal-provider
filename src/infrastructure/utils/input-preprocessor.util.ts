/**
 * Input Preprocessor Utility
 * Detects and uploads base64 images to FAL storage before API calls
 */

import { uploadToFalStorage } from "./fal-storage.util";

declare const __DEV__: boolean | undefined;

const IMAGE_URL_KEYS = [
  "image_url",
  "driver_image_url",
  "base_image_url",
  "swap_image_url",
  "second_image_url",
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

  for (const key of IMAGE_URL_KEYS) {
    const value = result[key];
    if (isBase64DataUri(value)) {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.log(`[FalPreprocessor] Uploading ${key} to storage...`);
      }

      const uploadPromise = uploadToFalStorage(value).then((url) => {
        result[key] = url;
        if (typeof __DEV__ !== "undefined" && __DEV__) {
          console.log(`[FalPreprocessor] ${key} uploaded`, {
            url: url.slice(0, 50) + "...",
          });
        }
      });

      uploadPromises.push(uploadPromise);
    }
  }

  if (uploadPromises.length > 0) {
    await Promise.all(uploadPromises);
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log(`[FalPreprocessor] All images uploaded (${uploadPromises.length})`);
    }
  }

  return result;
}
