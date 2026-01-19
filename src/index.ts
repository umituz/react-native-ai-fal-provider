/**
 * @umituz/react-native-ai-fal-provider
 * FAL AI provider for React Native - implements IAIProvider interface
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
} from "./domain/entities/fal.types";

export type {
  GenerationCost,
  CostTrackerConfig,
  CostSummary,
  ModelCostInfo,
} from "./domain/entities/cost-tracking.types";

export { FalErrorType } from "./domain/entities/error.types";
export type {
  FalErrorCategory,
  FalErrorInfo,
  FalErrorMessages,
} from "./domain/entities/error.types";

export {
  DEFAULT_TEXT_TO_IMAGE_MODELS,
  DEFAULT_TEXT_TO_VOICE_MODELS,
  DEFAULT_TEXT_TO_VIDEO_MODELS,
  DEFAULT_IMAGE_TO_VIDEO_MODELS,
  getAllDefaultModels,
  getDefaultModelsByType,
  getDefaultModel,
  findModelById,
} from "./domain/constants/default-models.constants";
export type { FalModelConfig } from "./domain/constants/default-models.constants";

export { FAL_IMAGE_FEATURE_MODELS } from "./domain/constants/feature-models.constants";

export {
  FalProvider,
  falProvider,
  falModelsService,
  NSFWContentError,
  cancelCurrentFalRequest,
  hasRunningFalRequest,
} from "./infrastructure/services";
export type { FalProviderType } from "./infrastructure/services";

export {
  categorizeFalError,
  falErrorMapper,
  mapFalError,
  isFalErrorRetryable,
  buildSingleImageInput,
  buildDualImageInput,
  buildUpscaleInput,
  buildPhotoRestoreInput,
  buildVideoFromImageInput,
  buildFaceSwapInput,
  buildImageToImageInput,
  buildRemoveBackgroundInput,
  buildRemoveObjectInput,
  buildReplaceBackgroundInput,
  buildHDTouchUpInput,
} from "./infrastructure/utils";

export { CostTracker } from "./infrastructure/utils/cost-tracker";

export {
  isFalModelType,
  isModelType,
  isFalErrorType,
  isValidBase64Image,
  isValidApiKey,
  isValidModelId,
  isValidPrompt,
  isValidTimeout,
  isValidRetryCount,
} from "./infrastructure/utils";

export {
  formatImageDataUri,
  extractBase64,
  getDataUriExtension,
  isImageDataUri,
  calculateTimeoutWithJitter,
  formatCreditCost,
  truncatePrompt,
  sanitizePrompt,
  buildErrorMessage,
  isDefined,
  removeNullish,
  debounce,
  throttle,
} from "./infrastructure/utils";

export {
  createJobMetadata,
  updateJobMetadata,
  isJobCompleted,
  isJobRunning,
  isJobStale,
  getJobDuration,
  formatJobDuration,
  calculateJobProgress,
  serializeJobMetadata,
  deserializeJobMetadata,
  filterValidJobs,
  sortJobsByCreation,
  getActiveJobs,
  getCompletedJobs,
} from "./infrastructure/utils";

export {
  saveJobMetadata,
  loadJobMetadata,
  deleteJobMetadata,
  loadAllJobs,
  cleanupOldJobs,
  getJobsByModel,
  getJobsByStatus,
  updateJobStatus,
} from "./infrastructure/utils";

export type {
  FalJobMetadata,
  IJobStorage,
  InMemoryJobStorage,
} from "./infrastructure/utils";

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
} from "./domain/types";

export {
  useFalGeneration,
  useModels,
  useModelCapabilities,
  useVideoDurations,
  useVideoResolutions,
  useAspectRatios,
} from "./presentation/hooks";
export type {
  UseFalGenerationOptions,
  UseFalGenerationResult,
  UseModelsProps,
  UseModelCapabilitiesOptions,
  UseModelCapabilitiesReturn,
  UseVideoDurationsReturn,
  UseVideoResolutionsReturn,
  UseAspectRatiosReturn,
} from "./presentation/hooks";

// Init Module Factory
export {
  createAiProviderInitModule,
  type AiProviderInitModuleConfig,
} from './init';

// Model Registry
export {
  VIDEO_ASPECT_RATIOS,
  IMAGE_ASPECT_RATIOS,
  GLOBAL_CAPABILITIES,
  GLOBAL_DEFAULTS,
  SORA_2_DURATIONS,
  SORA_2_RESOLUTIONS,
  SORA_2_CREDITS_BY_DURATION,
  SORA_2_TEXT_TO_VIDEO,
  SORA_2_IMAGE_TO_VIDEO,
  SORA_2_MODELS,
  MODEL_REGISTRY,
  getModelConfig,
  getModelsByType,
  getEnabledModels,
  getModelCapabilities,
  getModelCreditCost,
  getDefaultModelFromRegistry,
} from "./registry";
export type {
  ModelType as RegistryModelType,
  ModelProvider,
  DurationOption,
  ResolutionOption,
  AspectRatioOption,
  ModelCapabilities,
  ModelPricing,
  ModelDefaults,
  ModelConfig,
  ModelRegistry as ModelRegistryType,
  ResolvedCapabilities,
  GlobalCapabilities,
  GlobalDefaults,
} from "./registry";
