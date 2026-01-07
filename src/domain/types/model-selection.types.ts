/**
 * Model Selection Types
 * Types for useModels hook and model selection functionality
 */

import type { FalModelConfig } from "../constants/default-models.constants";

export type ModelType =
  | "text-to-image"
  | "text-to-video"
  | "image-to-video"
  | "text-to-voice";

/**
 * Configuration for model selection behavior
 */
export interface ModelSelectionConfig {
  /** Initial model ID to select */
  readonly initialModelId?: string;
  /** Default credit cost when model has no pricing */
  readonly defaultCreditCost?: number;
  /** Default model ID when no models loaded */
  readonly defaultModelId?: string;
}

/**
 * Model selection state
 */
export interface ModelSelectionState {
  /** All available models for the type */
  readonly models: FalModelConfig[];
  /** Currently selected model */
  readonly selectedModel: FalModelConfig | null;
  /** Credit cost based on selected model */
  readonly creditCost: number;
  /** Selected model's FAL ID for API calls */
  readonly modelId: string;
  /** Loading state */
  readonly isLoading: boolean;
  /** Error message if fetch failed */
  readonly error: string | null;
}

/**
 * Model selection actions
 */
export interface ModelSelectionActions {
  /** Select a model by ID */
  readonly selectModel: (modelId: string) => void;
  /** Refresh models from source */
  readonly refreshModels: () => void;
}

/**
 * Complete return type for useModels hook
 */
export type UseModelsReturn = ModelSelectionState & ModelSelectionActions;
