/**
 * Video Feature Input Builder
 * Builds inputs for video-based AI features
 */

import type {
  VideoFeatureType,
  VideoFeatureInputData,
} from "@umituz/react-native-ai-generation-content";
import {
  buildVideoFromImageInput,
  buildTextToVideoInput,
} from "../utils/video-feature-builders.util";

const DEFAULT_VIDEO_PROMPTS: Partial<Record<VideoFeatureType, string>> = {
  "ai-kiss": "A romantic couple kissing tenderly, smooth natural movement, cinematic lighting",
  "ai-hug": "A heartwarming embrace between two people, gentle natural movement, cinematic quality",
  "image-to-video": "Animate this image with natural, smooth motion while preserving all details",
  "text-to-video": "Generate a high-quality video based on the description, smooth motion",
} as const;

/**
 * Features that require image input
 */
const IMAGE_REQUIRED_FEATURES: readonly VideoFeatureType[] = [
  "image-to-video",
  "ai-kiss",
  "ai-hug",
] as const;

function isImageRequiredFeature(feature: VideoFeatureType): boolean {
  return IMAGE_REQUIRED_FEATURES.includes(feature);
}

export function buildVideoFeatureInput(
  feature: VideoFeatureType,
  data: VideoFeatureInputData,
): Record<string, unknown> {
  const { sourceImageBase64, prompt, options } = data;
  const effectivePrompt = prompt || DEFAULT_VIDEO_PROMPTS[feature] || "Generate video";

  if (isImageRequiredFeature(feature)) {
    return buildVideoFromImageInput(sourceImageBase64 || "", {
      prompt: effectivePrompt,
      duration: options?.duration as number | undefined,
      resolution: options?.resolution as string | undefined,
    });
  }

  return buildTextToVideoInput({
    prompt: effectivePrompt,
    duration: options?.duration as number | undefined,
    aspectRatio: options?.aspect_ratio as string | undefined,
    resolution: options?.resolution as string | undefined,
  });
}
