/**
 * @umituz/react-native-ai-fal-provider
 * FAL AI provider for React Native - implements IAIProvider interface
 */

export type {
  FalConfig, FalModel, FalModelType, FalModelPricing, FalJobInput,
  FalJobResult, FalLogEntry, FalQueueStatus, FalSubscribeOptions,
} from "./domain/entities/fal.types";

export { FalErrorType } from "./domain/entities/error.types";
export type { FalErrorCategory, FalErrorInfo, FalErrorMessages } from "./domain/entities/error.types";

export {
  DEFAULT_TEXT_TO_IMAGE_MODELS, DEFAULT_TEXT_TO_VOICE_MODELS,
  DEFAULT_TEXT_TO_VIDEO_MODELS, DEFAULT_IMAGE_TO_VIDEO_MODELS,
  getAllDefaultModels, getDefaultModelsByType, getDefaultModel, findModelById,
} from "./domain/constants/default-models.constants";
export type { FalModelConfig } from "./domain/constants/default-models.constants";

export {
  FAL_IMAGE_FEATURE_MODELS, FAL_VIDEO_FEATURE_MODELS, getAllFeatureModels,
} from "./domain/constants/feature-models.constants";
export type { FeatureModelConfig } from "./domain/constants/feature-models.constants";

export {
  FalProvider, falProvider, falModelsService,
  getImageFeatureModel, getVideoFeatureModel, NSFWContentError,
} from "./infrastructure/services";

export {
  categorizeFalError, falErrorMapper, mapFalError, isFalErrorRetryable,
  buildSingleImageInput, buildDualImageInput, buildUpscaleInput,
  buildPhotoRestoreInput, buildVideoFromImageInput, buildFaceSwapInput,
  buildImageToImageInput, buildRemoveBackgroundInput, buildRemoveObjectInput,
  buildReplaceBackgroundInput, buildHDTouchUpInput,
} from "./infrastructure/utils";

export {
  isFalModelType, isModelType, isFalErrorType,
  isValidBase64Image, isValidApiKey, isValidModelId, isValidPrompt,
  isValidTimeout, isValidRetryCount,
} from "./infrastructure/utils";

export {
  formatImageDataUri, extractBase64, getDataUriExtension, isImageDataUri,
  calculateTimeoutWithJitter, formatCreditCost, truncatePrompt, sanitizePrompt,
  buildErrorMessage, isDefined, removeNullish, debounce, throttle,
} from "./infrastructure/utils";

export {
  createJobMetadata, updateJobMetadata, isJobCompleted, isJobRunning,
  isJobStale, getJobDuration, formatJobDuration, calculateJobProgress,
  serializeJobMetadata, deserializeJobMetadata, filterValidJobs,
  sortJobsByCreation, getActiveJobs, getCompletedJobs,
} from "./infrastructure/utils";

export type { FalJobMetadata } from "./infrastructure/utils";

export type {
  UpscaleOptions, PhotoRestoreOptions, FaceSwapOptions, ImageToImagePromptConfig,
  RemoveBackgroundOptions, RemoveObjectOptions, ReplaceBackgroundOptions,
  VideoFromImageOptions, ModelType, ModelSelectionConfig, ModelSelectionState,
  ModelSelectionActions, UseModelsReturn,
} from "./domain/types";

export { useFalGeneration, useModels } from "./presentation/hooks";
export type { UseFalGenerationOptions, UseFalGenerationResult, UseModelsProps } from "./presentation/hooks";
