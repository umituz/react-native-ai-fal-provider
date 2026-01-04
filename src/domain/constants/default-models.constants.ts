/**
 * Default FAL AI Models Catalog
 * Provides default model configurations for all FAL AI capabilities
 */

import type { FalModelType } from "../entities/fal.types";

export interface FalModelConfig {
  id: string;
  name: string;
  type: FalModelType;
  isDefault?: boolean;
  isActive?: boolean;
  pricing?: {
    freeUserCost: number;
    premiumUserCost: number;
  };
  description?: string;
  order?: number;
}

export const DEFAULT_TEXT_TO_IMAGE_MODELS: FalModelConfig[] = [
  {
    id: "fal-ai/flux/schnell",
    name: "Flux Schnell",
    type: "text-to-image",
    isDefault: true,
    isActive: true,
    pricing: { freeUserCost: 1, premiumUserCost: 0.5 },
    description: "Fast and efficient text-to-image generation",
    order: 1,
  },
  {
    id: "fal-ai/flux/dev",
    name: "Flux Dev",
    type: "text-to-image",
    isDefault: false,
    isActive: true,
    pricing: { freeUserCost: 2, premiumUserCost: 1 },
    description: "High-quality text-to-image generation",
    order: 2,
  },
  {
    id: "fal-ai/flux-pro",
    name: "Flux Pro",
    type: "text-to-image",
    isDefault: false,
    isActive: true,
    pricing: { freeUserCost: 3, premiumUserCost: 1.5 },
    description: "Professional-grade text-to-image generation",
    order: 3,
  },
];

export const DEFAULT_TEXT_TO_VOICE_MODELS: FalModelConfig[] = [
  {
    id: "fal-ai/playai/tts/v3",
    name: "PlayAI TTS v3",
    type: "text-to-voice",
    isDefault: true,
    isActive: true,
    pricing: { freeUserCost: 1, premiumUserCost: 0.5 },
    description: "High-quality text-to-speech synthesis",
    order: 1,
  },
  {
    id: "fal-ai/eleven-labs/tts",
    name: "ElevenLabs TTS",
    type: "text-to-voice",
    isDefault: false,
    isActive: true,
    pricing: { freeUserCost: 2, premiumUserCost: 1 },
    description: "Premium voice synthesis with multiple voice options",
    order: 2,
  },
];

export const DEFAULT_TEXT_TO_VIDEO_MODELS: FalModelConfig[] = [
  {
    id: "fal-ai/hunyuan-video/1",
    name: "Hunyuan",
    type: "text-to-video",
    isDefault: true,
    isActive: true,
    pricing: { freeUserCost: 10, premiumUserCost: 5 },
    description: "High-quality video generation",
    order: 1,
  },
  {
    id: "fal-ai/minimax-video",
    name: "MiniMax",
    type: "text-to-video",
    isDefault: false,
    isActive: true,
    pricing: { freeUserCost: 15, premiumUserCost: 8 },
    description: "Advanced video generation with better dynamics",
    order: 2,
  },
  {
    id: "fal-ai/kling-video/v1.5/pro/text-to-video",
    name: "Kling 1.5",
    type: "text-to-video",
    isDefault: false,
    isActive: true,
    pricing: { freeUserCost: 20, premiumUserCost: 10 },
    description: "Professional video generation",
    order: 3,
  },
  {
    id: "fal-ai/mochi-v1",
    name: "Mochi",
    type: "text-to-video",
    isDefault: false,
    isActive: true,
    pricing: { freeUserCost: 8, premiumUserCost: 4 },
    description: "Fast video generation",
    order: 4,
  },
];

export const DEFAULT_IMAGE_TO_VIDEO_MODELS: FalModelConfig[] = [
  {
    id: "fal-ai/kling-video/v1.5/pro/image-to-video",
    name: "Kling I2V",
    type: "image-to-video",
    isDefault: true,
    isActive: true,
    pricing: { freeUserCost: 15, premiumUserCost: 8 },
    description: "High-quality image to video generation",
    order: 1,
  },
];

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

export const DEFAULT_TEXT_TO_TEXT_MODELS: FalModelConfig[] = [
  {
    id: "fal-ai/llama-3-8b-instruct",
    name: "Llama 3 8B Instruct",
    type: "text-to-text",
    isDefault: true,
    isActive: true,
    pricing: { freeUserCost: 0.1, premiumUserCost: 0.05 },
    description: "Fast and reliable text generation",
    order: 1,
  },
];

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
    default:
      return [];
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
