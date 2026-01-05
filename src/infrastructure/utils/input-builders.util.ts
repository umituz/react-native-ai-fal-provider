/**
 * FAL Input Builders - Constructs FAL API input from normalized data
 * Provider-agnostic: accepts prompt config as parameter, not imported
 */

import type {
  UpscaleOptions,
  PhotoRestoreOptions,
  ImageToImagePromptConfig,
  RemoveBackgroundOptions,
  RemoveObjectOptions,
  ReplaceBackgroundOptions,
  VideoFromImageOptions,
  FaceSwapOptions,
} from "../../domain/types";

/**
 * Build FAL single image input format
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

/**
 * Build FAL dual image input format
 */
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

// =============================================================================
// FEATURE-SPECIFIC BUILDERS
// =============================================================================

/**
 * Build upscale input for FAL clarity-upscaler
 */
export function buildUpscaleInput(
  base64: string,
  options?: UpscaleOptions,
): Record<string, unknown> {
  return buildSingleImageInput(base64, {
    scale: options?.scaleFactor || 2,
    face_enhance: options?.enhanceFaces || false,
  });
}

/**
 * Build photo restore input for FAL aura-sr
 */
export function buildPhotoRestoreInput(
  base64: string,
  options?: PhotoRestoreOptions,
): Record<string, unknown> {
  return buildSingleImageInput(base64, {
    face_enhance: options?.enhanceFaces || true,
  });
}

/**
 * Build reference-to-video input for FAL Vidu Q1
 * Supports up to 7 reference images for multi-person scenarios like kiss/hug
 * Uses reference_image_urls array for consistent character appearance
 */
export function buildVideoFromImageInput(
  base64: string,
  options?: VideoFromImageOptions,
): Record<string, unknown> {
  const formatImage = (b64: string) =>
    b64.startsWith("data:") ? b64 : `data:image/jpeg;base64,${b64}`;

  // Build reference images array - both source and target for kiss/hug
  const referenceImages: string[] = [formatImage(base64)];
  if (options?.target_image) {
    referenceImages.push(formatImage(options.target_image));
  }

  return {
    prompt: options?.prompt || options?.motion_prompt || "Generate natural motion video",
    reference_image_urls: referenceImages,
    aspect_ratio: options?.aspect_ratio || "9:16",
    movement_amplitude: options?.movement_amplitude || "auto",
  };
}

/**
 * Build face swap input for FAL face-swap
 * FAL API requires: base_image_url (target face) and swap_image_url (face to swap in)
 */
export function buildFaceSwapInput(
  sourceBase64: string,
  targetBase64: string,
  _options?: FaceSwapOptions,
): Record<string, unknown> {
  const formatImage = (b64: string) =>
    b64.startsWith("data:") ? b64 : `data:image/jpeg;base64,${b64}`;

  return {
    base_image_url: formatImage(sourceBase64),
    swap_image_url: formatImage(targetBase64),
  };
}

/**
 * Build image-to-image input for FAL flux/dev/image-to-image
 * Accepts prompt config as parameter for provider-agnostic usage
 */
export function buildImageToImageInput(
  base64: string,
  promptConfig: ImageToImagePromptConfig,
): Record<string, unknown> {
  return buildSingleImageInput(base64, {
    prompt: promptConfig.prompt,
    negative_prompt: promptConfig.negativePrompt,
    strength: promptConfig.strength ?? 0.85,
    num_inference_steps: promptConfig.num_inference_steps ?? 50,
    guidance_scale: promptConfig.guidance_scale ?? 7.5,
  });
}

/**
 * Build remove background input for FAL birefnet
 * Uses General Use (Light) model for fast processing
 */
export function buildRemoveBackgroundInput(
  base64: string,
  _options?: RemoveBackgroundOptions,
): Record<string, unknown> {
  return buildSingleImageInput(base64, {
    model: "General Use (Light)",
    operating_resolution: "1024x1024",
    output_format: "png",
    refine_foreground: true,
  });
}

/**
 * Build remove object (inpaint) input for FAL flux-kontext-lora/inpaint
 */
export function buildRemoveObjectInput(
  base64: string,
  options?: RemoveObjectOptions,
): Record<string, unknown> {
  return buildSingleImageInput(base64, {
    mask_url: options?.mask,
    prompt: options?.prompt || "Remove the object and fill with background",
  });
}

/**
 * Build replace background input for FAL bria/background/replace
 */
export function buildReplaceBackgroundInput(
  base64: string,
  options: ReplaceBackgroundOptions,
): Record<string, unknown> {
  return buildSingleImageInput(base64, {
    prompt: options.prompt,
  });
}

/**
 * Build HD touch up input (same as upscale)
 */
export function buildHDTouchUpInput(
  base64: string,
  options?: UpscaleOptions,
): Record<string, unknown> {
  return buildUpscaleInput(base64, options);
}

/**
 * Build Kontext style transfer input for FAL flux-pro/kontext
 * Instruction-based editing that preserves character identity
 */
export interface KontextStyleTransferOptions {
  prompt: string;
  guidance_scale?: number;
}

export function buildKontextStyleTransferInput(
  base64: string,
  options: KontextStyleTransferOptions,
): Record<string, unknown> {
  return buildSingleImageInput(base64, {
    prompt: options.prompt,
    guidance_scale: options.guidance_scale ?? 3.5,
  });
}
