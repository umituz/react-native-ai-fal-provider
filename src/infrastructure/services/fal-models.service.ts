/**
 * FAL Models Service - Model utilities
 */

import type { FalModelConfig } from "../../domain/types/fal-model-config.types";

export type { FalModelConfig };

/**
 * Sort models by order and name
 */
export function sortModels(models: FalModelConfig[]): FalModelConfig[] {
  return [...models].sort((a, b) => {
    if (a.order !== b.order) {
      return (a.order ?? 0) - (b.order ?? 0);
    }
    return a.name.localeCompare(b.name);
  });
}

/**
 * Find model by ID
 */
export function findModelById(id: string, models: FalModelConfig[]): FalModelConfig | undefined {
  return models.find((m) => m.id === id);
}

/**
 * Get default model from a list
 */
export function getDefaultModel(models: FalModelConfig[]): FalModelConfig | undefined {
  if (models.length === 0) return undefined;
  return models.find((m) => m.isDefault) ?? models[0];
}

export const falModelsService = {
  sortModels,
  findById: findModelById,
  getDefaultModel,
};
