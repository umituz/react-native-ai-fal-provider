/**
 * FAL Models Service - Simple model retrieval functions
 */

import type { FalModelType } from "../../domain/entities/fal.types";
import {
  type FalModelConfig,
  getDefaultModelsByType,
  getDefaultModel as getDefaultModelFromConstants,
  findModelById as findModelByIdFromConstants,
} from "../../domain/constants/default-models.constants";

export type { FalModelConfig };

function sortModels(models: FalModelConfig[]): FalModelConfig[] {
  return [...models].sort((a, b) => {
    if (a.order !== b.order) {
      return (a.order ?? 0) - (b.order ?? 0);
    }
    return a.name.localeCompare(b.name);
  });
}

export function getModels(type: FalModelType): FalModelConfig[] {
  return sortModels(getDefaultModelsByType(type));
}

export function getDefaultModel(type: FalModelType): FalModelConfig | undefined {
  return getDefaultModelFromConstants(type);
}

export function findModelById(id: string): FalModelConfig | undefined {
  return findModelByIdFromConstants(id);
}

export function getModelPricing(modelId: string): { freeUserCost: number; premiumUserCost: number } | null {
  const model = findModelById(modelId);
  return model?.pricing ?? null;
}

// Singleton service export
export const falModelsService = {
  getModels,
  getDefaultModel,
  findById: findModelById,
  getModelPricing,
  getTextToImageModels: () => getModels("text-to-image"),
  getTextToVoiceModels: () => getModels("text-to-voice"),
  getTextToVideoModels: () => getModels("text-to-video"),
  getImageToVideoModels: () => getModels("image-to-video"),
};
