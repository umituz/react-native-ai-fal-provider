/**
 * Default FAL AI Models Catalog
 * Provides default model configurations for all FAL AI capabilities
 */

import type { FalModelType } from "../entities/fal.types";
import type { ModelType } from "../types/model-selection.types";
import { DEFAULT_TEXT_TO_IMAGE_MODELS } from "./models/text-to-image.models";
import { DEFAULT_TEXT_TO_VOICE_MODELS } from "./models/text-to-voice.models";
import { DEFAULT_TEXT_TO_VIDEO_MODELS } from "./models/text-to-video.models";
import { DEFAULT_IMAGE_TO_VIDEO_MODELS } from "./models/image-to-video.models";
import { DEFAULT_TEXT_TO_TEXT_MODELS } from "./models/text-to-text.models";

// Export model lists
export { DEFAULT_TEXT_TO_IMAGE_MODELS };
export { DEFAULT_TEXT_TO_VOICE_MODELS };
export { DEFAULT_TEXT_TO_VIDEO_MODELS };
export { DEFAULT_IMAGE_TO_VIDEO_MODELS };
export { DEFAULT_TEXT_TO_TEXT_MODELS };

export interface FalModelConfig {
  readonly id: string;
  readonly name: string;
  readonly type: FalModelType;
  readonly isDefault?: boolean;
  readonly isActive?: boolean;
  readonly pricing?: {
    readonly freeUserCost: number;
    readonly premiumUserCost: number;
  };
  readonly description?: string;
  readonly order?: number;
}

/**
 * Default credit costs for each model type
 */
export const DEFAULT_CREDIT_COSTS: Record<ModelType, number> = {
  "text-to-image": 2,
  "text-to-video": 20,
  "image-to-video": 20,
  "text-to-voice": 3,
} as const;

/**
 * Default model IDs for each model type
 */
export const DEFAULT_MODEL_IDS: Record<ModelType, string> = {
  "text-to-image": "fal-ai/flux/schnell",
  "text-to-video": "fal-ai/minimax-video",
  "image-to-video": "fal-ai/kling-video/v1.5/pro/image-to-video",
  "text-to-voice": "fal-ai/playai/tts/v3",
} as const;

/**
 * Get all default models
 */
export function getAllDefaultModels(): FalModelConfig[] {
  return [
    ...DEFAULT_TEXT_TO_IMAGE_MODELS,
    ...DEFAULT_TEXT_TO_VOICE_MODELS,
    ...DEFAULT_TEXT_TO_VIDEO_MODELS,
    ...DEFAULT_IMAGE_TO_VIDEO_MODELS,
    ...DEFAULT_TEXT_TO_TEXT_MODELS,
  ];
}

/**
 * Get default models by type
 */
export function getDefaultModelsByType(type: FalModelType): FalModelConfig[] {
  switch (type) {
    case "text-to-image":
      return DEFAULT_TEXT_TO_IMAGE_MODELS;
    case "text-to-voice":
      return DEFAULT_TEXT_TO_VOICE_MODELS;
    case "text-to-video":
      return DEFAULT_TEXT_TO_VIDEO_MODELS;
    case "image-to-video":
      return DEFAULT_IMAGE_TO_VIDEO_MODELS;
    case "text-to-text":
      return DEFAULT_TEXT_TO_TEXT_MODELS;
    case "image-to-image":
      return [];
    default: {
      return [];
    }
  }
}

/**
 * Get default model for a type
 */
export function getDefaultModel(type: FalModelType): FalModelConfig | undefined {
  const models = getDefaultModelsByType(type);
  return models.find((m) => m.isDefault) || models[0];
}

/**
 * Find model by ID across all types
 */
export function findModelById(id: string): FalModelConfig | undefined {
  return getAllDefaultModels().find((m) => m.id === id);
}
