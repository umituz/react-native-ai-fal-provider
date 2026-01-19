/**
 * Model Registry Service
 * Central registry for all AI model configurations
 */

import type {
  ModelConfig,
  ModelRegistry,
  ModelType,
  ResolvedCapabilities,
} from "./model-registry.types";
import {
  GLOBAL_DEFAULTS,
  VIDEO_ASPECT_RATIOS,
  IMAGE_ASPECT_RATIOS,
} from "./global-capabilities";
import { SORA_2_TEXT_TO_VIDEO, SORA_2_IMAGE_TO_VIDEO } from "./models";

// =============================================================================
// MODEL REGISTRY
// =============================================================================

export const MODEL_REGISTRY: ModelRegistry = {
  [SORA_2_TEXT_TO_VIDEO.id]: SORA_2_TEXT_TO_VIDEO,
  [SORA_2_IMAGE_TO_VIDEO.id]: SORA_2_IMAGE_TO_VIDEO,
};

// =============================================================================
// REGISTRY HELPERS
// =============================================================================

export function getModelConfig(modelId: string): ModelConfig | undefined {
  return MODEL_REGISTRY[modelId];
}

export function getModelsByType(type: ModelType): ModelConfig[] {
  return Object.values(MODEL_REGISTRY).filter(
    (model) => model.type === type && model.enabled
  );
}

export function getEnabledModels(): ModelConfig[] {
  return Object.values(MODEL_REGISTRY).filter((model) => model.enabled);
}

export function getModelCapabilities(
  modelId: string
): ResolvedCapabilities | undefined {
  const config = MODEL_REGISTRY[modelId];
  if (!config) return undefined;

  const isVideoModel =
    config.type === "text-to-video" || config.type === "image-to-video";

  return {
    durations: config.capabilities.durations ?? [],
    resolutions: config.capabilities.resolutions ?? [],
    aspectRatios:
      config.capabilities.aspectRatios ??
      (isVideoModel ? VIDEO_ASPECT_RATIOS : IMAGE_ASPECT_RATIOS),
    maxPromptLength:
      config.capabilities.maxPromptLength ?? GLOBAL_DEFAULTS.maxPromptLength,
    supportsSound:
      config.capabilities.supportsSound ?? GLOBAL_DEFAULTS.supportsSound,
    supportsStyle:
      config.capabilities.supportsStyle ?? GLOBAL_DEFAULTS.supportsStyle,
    pricing: config.pricing,
    defaults: config.defaults,
  };
}

export function getModelCreditCost(modelId: string, duration: number): number {
  const config = MODEL_REGISTRY[modelId];
  if (!config) return 0;

  if (config.pricing.creditsByDuration) {
    return config.pricing.creditsByDuration[duration] ?? 0;
  }

  if (config.pricing.costPerSecond) {
    const dollarCost = config.pricing.costPerSecond * duration;
    return Math.ceil(dollarCost * 10);
  }

  return config.pricing.costPerGeneration ?? 0;
}

export function getDefaultModelFromRegistry(
  type: ModelType
): ModelConfig | undefined {
  const models = getModelsByType(type);
  return models[0];
}
