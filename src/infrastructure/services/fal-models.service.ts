/**
 * FAL Models Service - Model retrieval and selection logic
 */

import type { FalModelType } from "../../domain/entities/fal.types";
import type { ModelType, ModelSelectionConfig } from "../../domain/types/model-selection.types";
import { DEFAULT_CREDIT_COSTS, DEFAULT_MODEL_IDS } from "../../domain/constants/default-models.constants";
import {
  type FalModelConfig,
  getDefaultModelsByType,
  getDefaultModel as getDefaultModelFromConstants,
  findModelById as findModelByIdFromConstants,
} from "../../domain/constants/default-models.constants";

export type { FalModelConfig };

/**
 * Model selection result
 */
export interface ModelSelectionResult {
  models: FalModelConfig[];
  selectedModel: FalModelConfig | null;
  defaultCreditCost: number;
  defaultModelId: string;
}

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

/**
 * Get credit cost for a model
 * Returns the model's free user cost if available, otherwise returns the default cost for the type
 * NOTE: Use ?? instead of || to handle 0 values correctly (free models)
 */
export function getModelCreditCost(modelId: string, modelType: FalModelType): number {
  const pricing = getModelPricing(modelId);
  // CRITICAL: Use !== undefined instead of truthy check
  // because freeUserCost can be 0 for free models!
  if (pricing && pricing.freeUserCost !== undefined) {
    return pricing.freeUserCost;
  }
  return DEFAULT_CREDIT_COSTS[modelType] ?? 0;
}

/**
 * Get default credit cost for a model type
 */
export function getDefaultCreditCost(modelType: FalModelType): number {
  return DEFAULT_CREDIT_COSTS[modelType] ?? 0;
}

/**
 * Get default model ID for a model type
 */
export function getDefaultModelId(modelType: FalModelType): string {
  return DEFAULT_MODEL_IDS[modelType] ?? "";
}

/**
 * Select initial model based on configuration
 * Returns the model matching initialModelId, or the default model, or the first model
 */
export function selectInitialModel(
  models: FalModelConfig[],
  config: ModelSelectionConfig | undefined,
  modelType: ModelType
): FalModelConfig | null {
  if (models.length === 0) {
    return null;
  }

  const defaultModelId = getDefaultModelId(modelType);
  const targetId = config?.initialModelId ?? defaultModelId;

  return (
    models.find((m) => m.id === targetId) ??
    models.find((m) => m.isDefault) ??
    models[0]
  );
}

/**
 * Get model selection data for a model type
 * Returns models, selected model, and default configuration
 */
export function getModelSelectionData(
  modelType: ModelType,
  config?: ModelSelectionConfig
): ModelSelectionResult {
  // ModelType is now a subset of FalModelType, so this cast is safe
  const models = getModels(modelType);
  const defaultCreditCost = config?.defaultCreditCost ?? getDefaultCreditCost(modelType);
  const defaultModelId = config?.defaultModelId ?? getDefaultModelId(modelType);
  const selectedModel = selectInitialModel(models, config, modelType);

  return {
    models,
    selectedModel,
    defaultCreditCost,
    defaultModelId,
  };
}

// Singleton service export
export const falModelsService = {
  getModels,
  getDefaultModel,
  findById: findModelById,
  getModelPricing,
  getModelCreditCost,
  getDefaultCreditCost,
  getDefaultModelId,
  selectInitialModel,
  getModelSelectionData,
  getTextToImageModels: () => getModels("text-to-image"),
  getTextToVoiceModels: () => getModels("text-to-voice"),
  getTextToVideoModels: () => getModels("text-to-video"),
  getImageToVideoModels: () => getModels("image-to-video"),
};
