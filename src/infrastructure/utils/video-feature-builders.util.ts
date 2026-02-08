/**
 * Video Feature Input Builders
 * Builder functions for video features
 */

import type {
  ImageToImagePromptConfig,
  VideoFromImageOptions,
  TextToVideoOptions,
} from "../../domain/types";
import { buildSingleImageInput } from "./base-builders.util";
import { formatImageDataUri } from "./image-helpers.util";

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

export function buildVideoFromImageInput(
  base64: string,
  options?: VideoFromImageOptions & {
    enable_safety_checker?: boolean;
    default_prompt?: string;
  },
): Record<string, unknown> {
  return {
    prompt: options?.prompt || options?.default_prompt || "Generate natural motion video",
    image_url: formatImageDataUri(base64),
    enable_safety_checker: options?.enable_safety_checker ?? false,
    ...(options?.duration && { duration: options.duration }),
    ...(options?.resolution && { resolution: options.resolution }),
  };
}

/**
 * Build input for text-to-video generation (no image required)
 */
export function buildTextToVideoInput(
  options: TextToVideoOptions,
): Record<string, unknown> {
  const { prompt, duration, aspectRatio, resolution } = options;

  return {
    prompt,
    enable_safety_checker: false,
    ...(duration && { duration }),
    ...(aspectRatio && { aspect_ratio: aspectRatio }),
    ...(resolution && { resolution }),
  };
}
