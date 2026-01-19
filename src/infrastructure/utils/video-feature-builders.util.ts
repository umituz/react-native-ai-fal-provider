/**
 * Video Feature Input Builders
 * Builder functions for video features
 */

import type {
  ImageToImagePromptConfig,
  VideoFromImageOptions,
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
    prompt: options?.prompt || options?.motion_prompt || "Generate natural motion video",
    image_url: formatImage(base64),
    ...(options?.duration && { duration: options.duration }),
    ...(options?.resolution && { resolution: options.resolution }),
  };
}
