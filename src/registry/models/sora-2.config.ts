/**
 * Sora 2 Model Configuration
 * OpenAI's Sora 2 video generation model via FAL AI
 *
 * @see https://fal.ai/models/fal-ai/sora-2
 *
 * Pricing: $0.10 per second
 * - 4s = $0.40 → 10 credits
 * - 8s = $0.80 → 18 credits
 * - 12s = $1.20 → 28 credits
 */

import type {
  ModelConfig,
  DurationOption,
  ResolutionOption,
} from "../model-registry.types";

// =============================================================================
// SORA 2 SPECIFIC CAPABILITIES
// =============================================================================

export const SORA_2_DURATIONS: DurationOption[] = [
  { value: 4, label: "4s" },
  { value: 8, label: "8s" },
  { value: 12, label: "12s" },
];

export const SORA_2_RESOLUTIONS: ResolutionOption[] = [
  { value: "720p", label: "720p" },
  { value: "default", label: "Default" },
];

export const SORA_2_CREDITS_BY_DURATION: Record<number, number> = {
  4: 10,
  8: 18,
  12: 28,
};

// =============================================================================
// MODEL CONFIGURATIONS
// =============================================================================

export const SORA_2_TEXT_TO_VIDEO: ModelConfig = {
  id: "fal-ai/sora-2/text-to-video",
  name: "Sora 2",
  type: "text-to-video",
  provider: "fal",
  capabilities: {
    durations: SORA_2_DURATIONS,
    resolutions: SORA_2_RESOLUTIONS,
    maxPromptLength: 500,
    supportsSound: true,
    supportsStyle: true,
  },
  pricing: {
    costPerSecond: 0.1,
    creditsByDuration: SORA_2_CREDITS_BY_DURATION,
  },
  defaults: {
    duration: 4,
    resolution: "720p",
    aspectRatio: "16:9",
  },
  enabled: true,
};

export const SORA_2_IMAGE_TO_VIDEO: ModelConfig = {
  id: "fal-ai/sora-2/image-to-video",
  name: "Sora 2",
  type: "image-to-video",
  provider: "fal",
  capabilities: {
    durations: SORA_2_DURATIONS,
    resolutions: SORA_2_RESOLUTIONS,
    maxPromptLength: 300,
    supportsSound: false,
    supportsStyle: true,
  },
  pricing: {
    costPerSecond: 0.1,
    creditsByDuration: SORA_2_CREDITS_BY_DURATION,
  },
  defaults: {
    duration: 4,
    resolution: "720p",
    aspectRatio: "16:9",
  },
  enabled: true,
};

export const SORA_2_MODELS = {
  TEXT_TO_VIDEO: SORA_2_TEXT_TO_VIDEO,
  IMAGE_TO_VIDEO: SORA_2_IMAGE_TO_VIDEO,
} as const;
