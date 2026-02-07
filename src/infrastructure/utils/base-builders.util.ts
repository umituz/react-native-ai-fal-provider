/**
 * Base Input Builders
 * Core builder functions for FAL API
 */

import { formatImageDataUri } from "./image-helpers.util";

export function buildSingleImageInput(
  base64: string,
  extraParams?: Record<string, unknown>,
): Record<string, unknown> {
  return {
    image_url: formatImageDataUri(base64),
    ...extraParams,
  };
}

export function buildDualImageInput(
  sourceBase64: string,
  targetBase64: string,
  extraParams?: Record<string, unknown>,
): Record<string, unknown> {
  return {
    image_url: formatImageDataUri(sourceBase64),
    second_image_url: formatImageDataUri(targetBase64),
    ...extraParams,
  };
}
