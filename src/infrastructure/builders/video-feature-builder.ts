/**
 * Video Feature Input Builder
 * Builds inputs for video-based AI features
 */

import type {
  VideoFeatureType,
  VideoFeatureInputData,
} from "@umituz/react-native-ai-generation-content";
import { buildVideoFromImageInput } from "../utils/video-feature-builders.util";

const DEFAULT_VIDEO_PROMPTS: Record<VideoFeatureType, string> = {
  "ai-kiss": "A romantic couple kissing tenderly, the two reference people sharing an intimate kiss moment, smooth natural movement, cinematic lighting, high quality video",
  "ai-hug": "A heartwarming embrace between two people, the reference characters hugging warmly with genuine emotion, gentle natural movement, cinematic quality, touching moment",
} as const;

export function buildVideoFeatureInput(
  feature: VideoFeatureType,
  data: VideoFeatureInputData,
): Record<string, unknown> {
  const { sourceImageBase64, targetImageBase64, prompt, options } = data;

  const effectivePrompt = prompt || DEFAULT_VIDEO_PROMPTS[feature] || "Generate video with natural motion";

  return buildVideoFromImageInput(sourceImageBase64, {
    prompt: effectivePrompt,
    target_image: targetImageBase64,
    aspect_ratio: (options?.aspect_ratio as "16:9" | "9:16" | "1:1") || "9:16",
    movement_amplitude: (options?.movement_amplitude as "auto" | "small" | "medium" | "large") || "medium",
  });
}
