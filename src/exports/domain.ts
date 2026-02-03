/**
 * Domain Layer Exports
 */

export type {
  FalConfig,
  FalModel,
  FalModelType,
  FalModelPricing,
  FalJobInput,
  FalJobResult,
  FalLogEntry,
  FalQueueStatus,
  FalSubscribeOptions,
} from "../domain/entities/fal.types";

export type {
  GenerationCost,
  CostTrackerConfig,
  CostSummary,
  ModelCostInfo,
} from "../domain/entities/cost-tracking.types";

export { FalErrorType } from "../domain/entities/error.types";
export type {
  FalErrorCategory,
  FalErrorInfo,
  FalErrorMessages,
} from "../domain/entities/error.types";

export {
  DEFAULT_TEXT_TO_IMAGE_MODELS,
  DEFAULT_TEXT_TO_VOICE_MODELS,
  DEFAULT_TEXT_TO_VIDEO_MODELS,
  DEFAULT_IMAGE_TO_VIDEO_MODELS,
  getAllDefaultModels,
  getDefaultModelsByType,
  getDefaultModel,
  findModelById,
} from "../domain/constants/default-models.constants";
export type { FalModelConfig } from "../domain/constants/default-models.constants";

export { FAL_IMAGE_FEATURE_MODELS } from "../domain/constants/feature-models.constants";

export type {
  UpscaleOptions,
  PhotoRestoreOptions,
  FaceSwapOptions,
  ImageToImagePromptConfig,
  RemoveBackgroundOptions,
  RemoveObjectOptions,
  ReplaceBackgroundOptions,
  VideoFromImageOptions,
  ModelType,
  ModelSelectionConfig,
  ModelSelectionState,
  ModelSelectionActions,
  UseModelsReturn,
} from "../domain/types";
