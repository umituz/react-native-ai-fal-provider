/**
 * @umituz/react-native-ai-fal-provider
 * FAL AI provider for React Native - Public API exports
 */

// ─── Core Provider ───────────────────────────────────────────────────────────
export { FalProvider, falProvider } from "./infrastructure/services/fal-provider";
export type { FalProvider as FalProviderType } from "./infrastructure/services/fal-provider";
export { NSFWContentError } from "./infrastructure/services/nsfw-content-error";

// ─── React Hook ───────────────────────────────────────────────────────────────
export { useFalGeneration } from "./presentation/hooks/use-fal-generation";
export type {
  UseFalGenerationOptions,
  UseFalGenerationResult,
} from "./presentation/hooks/use-fal-generation";
export {
  FalGenerationStateManager,
} from "./infrastructure/utils/fal-generation-state-manager.util";
export type {
  GenerationState,
  GenerationStateOptions,
} from "./infrastructure/utils/fal-generation-state-manager.util";

// ─── Initialization ───────────────────────────────────────────────────────────
export { initializeFalProvider } from "./init/initializeFalProvider";
export {
  createAiProviderInitModule,
  type AiProviderInitModuleConfig,
} from "./init/createAiProviderInitModule";

// ─── Error Handling ───────────────────────────────────────────────────────────
export {
  mapFalError,
  parseFalError,
  isFalErrorRetryable,
} from "./infrastructure/utils/fal-error-handler.util";
export { FalErrorType } from "./domain/entities/error.types";
export type {
  FalErrorCategory,
  FalErrorInfo,
  FalErrorMessages,
} from "./domain/entities/error.types";

// ─── Utilities (public API) ────────────────────────────────────────────────────
// Shared utilities (consolidated)
export {
  getErrorMessage,
  getErrorMessageOr,
  formatErrorMessage,
  buildErrorMessage,
  isDefined,
  removeNullish,
  generateUniqueId,
  sleep,
  getElapsedTime,
  getActualSizeKB,
} from "./shared/helpers";

export {
  IMAGE_URL_FIELDS,
  isImageField,
} from "./infrastructure/utils/constants/image-fields.constants";
export type { ImageUrlField } from "./infrastructure/utils/constants/image-fields.constants";

export {
  isEmptyString,
  isNonEmptyString,
  isString,
  isDataUri,
  isImageDataUri,
  isBase64DataUri,
  extractMimeType,
  extractBase64Content,
  isValidBase64Image,
  isValidApiKey,
  isValidModelId,
  isValidPrompt,
  isValidTimeout,
  isValidRetryCount,
  isValidAndSafeUrl,
} from "./shared/validators";

export {
  isFalModelType,
  isModelType,
  isFalErrorType,
  isRetryableError,
  isLocalFileUri,
  isHttpUrl,
} from "./shared/type-guards";

export {
  formatImageDataUri,
  extractBase64,
  getDataUriExtension,
} from "./infrastructure/utils/image-helpers.util";

export {
  uploadToFalStorage,
  uploadMultipleToFalStorage,
} from "./infrastructure/utils/fal-storage.util";

export { preprocessInput } from "./infrastructure/utils/input-preprocessor.util";

export {
  calculateVideoCredits,
  calculateImageCredits,
  calculateCreditsFromConfig,
} from "./infrastructure/utils/pricing/fal-pricing.util";
export type { GenerationResolution } from "./infrastructure/utils/pricing/fal-pricing.util";

// ─── Types (public API) ───────────────────────────────────────────────────────
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
export type { FalModelConfig } from "./domain/types/fal-model-config.types";
export type {
  UpscaleOptions,
  PhotoRestoreOptions,
  FaceSwapOptions,
  ImageToImagePromptConfig,
  RemoveBackgroundOptions,
  RemoveObjectOptions,
  ReplaceBackgroundOptions,
  VideoFromImageOptions,
  TextToVideoOptions,
  TextToVoiceOptions,
  ImageFeatureType,
  VideoFeatureType,
  AIProviderConfig,
  AIJobStatusType,
  AILogEntry,
  JobSubmission,
  JobStatus,
  ProviderProgressInfo,
  SubscribeOptions,
  RunOptions,
  ProviderCapabilities,
  ImageFeatureInputData,
  VideoFeatureInputData,
  IAIProvider,
} from "./domain/types";

// ─── Request Store Management ─────────────────────────────────────────────────
export {
  cleanupRequestStore,
  stopAutomaticCleanup,
} from "./infrastructure/services/request-store";
export type { ActiveRequest } from "./infrastructure/services/request-store";
