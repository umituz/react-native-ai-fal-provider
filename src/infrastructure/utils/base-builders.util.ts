/**
 * Base Input Builders
 * Core builder functions for FAL API
 */

export function buildSingleImageInput(
  base64: string,
  extraParams?: Record<string, unknown>,
): Record<string, unknown> {
  return {
    image_url: base64.startsWith("data:")
      ? base64
      : `data:image/jpeg;base64,${base64}`,
    ...extraParams,
  };
}

export function buildDualImageInput(
  sourceBase64: string,
  targetBase64: string,
  extraParams?: Record<string, unknown>,
): Record<string, unknown> {
  const formatImage = (b64: string) =>
    b64.startsWith("data:") ? b64 : `data:image/jpeg;base64,${b64}`;

  return {
    image_url: formatImage(sourceBase64),
    second_image_url: formatImage(targetBase64),
    ...extraParams,
  };
}
