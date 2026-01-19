/**
 * Video Feature Input Builder
 * Builds inputs for video-based AI features (Wan 2.5)
 */

import type {
  VideoFeatureType,
  VideoFeatureInputData,
} from "@umituz/react-native-ai-generation-content";
import { buildVideoFromImageInput } from "../utils/video-feature-builders.util";

const DEFAULT_VIDEO_PROMPTS: Partial<Record<VideoFeatureType, string>> = {
  "ai-kiss": "A romantic couple kissing tenderly, smooth natural movement, cinematic lighting",
  "ai-hug": "A heartwarming embrace between two people, gentle natural movement, cinematic quality",
  "image-to-video": "Animate this image with natural, smooth motion while preserving all details",
  "text-to-video": "Generate a high-quality video based on the description, smooth motion",
} as const;

export function buildVideoFeatureInput(
  feature: VideoFeatureType,
  data: VideoFeatureInputData,
): Record<string, unknown> {
  const { sourceImageBase64, prompt, options } = data;

  const effectivePrompt = prompt || DEFAULT_VIDEO_PROMPTS[feature] || "Generate video with natural motion";

  return buildVideoFromImageInput(sourceImageBase64, {
    prompt: effectivePrompt,
    duration: (options?.duration as 5 | 10) || 5,
    resolution: (options?.resolution as "480p" | "720p" | "1080p") || "720p",
  });
}
