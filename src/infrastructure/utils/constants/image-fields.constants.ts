/**
 * Image Field Constants
 * Single source of truth for all image-related field names
 *
 * CRITICAL: This file consolidates image field names that were previously
 * duplicated and inconsistent across the codebase:
 * - input-validator.util.ts had 5 fields
 * - input-preprocessor.util.ts had 9 fields
 *
 * All image field definitions must be maintained here to prevent future inconsistencies.
 */

/**
 * All supported image URL field names across the FAL AI API
 * Used for preprocessing (base64 to URL conversion) and validation
 *
 * @example
 * ```typescript
 * for (const field of IMAGE_URL_FIELDS) {
 *   if (field in input && isBase64(input[field])) {
 *     input[field] = await uploadToStorage(input[field]);
 *   }
 * }
 * ```
 */
export const IMAGE_URL_FIELDS = [
  "image_url",
  "second_image_url",
  "third_image_url",
  "fourth_image_url",
  "base_image_url",
  "swap_image_url",
  "driver_image_url",
  "mask_url",
  "input_image_url",
  "subject_reference_image_url",
] as const;

/**
 * Type-safe image URL field names
 */
export type ImageUrlField = typeof IMAGE_URL_FIELDS[number];

/**
 * Check if a field name is a known image field
 *
 * @param fieldName - The field name to check
 * @returns Type guard indicating if the field is an ImageUrlField
 *
 * @example
 * ```typescript
 * if (isImageField(fieldName)) {
 *   // TypeScript knows fieldName is ImageUrlField here
 *   console.log(`Processing image field: ${fieldName}`);
 * }
 * ```
 */
export function isImageField(fieldName: string): fieldName is ImageUrlField {
  return IMAGE_URL_FIELDS.includes(fieldName as ImageUrlField);
}
