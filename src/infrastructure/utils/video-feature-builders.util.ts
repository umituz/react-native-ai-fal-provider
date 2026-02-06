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
  options?: VideoFromImageOptions,
): Record<string, unknown> {
  const formatImage = (b64: string) =>
    b64.startsWith("data:") ? b64 : `data:image/jpeg;base64,${b64}`;

  return {
    prompt: options?.prompt || "Generate natural motion video",
    image_url: formatImage(base64),
    enable_safety_checker: false,
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
