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
export {
  getErrorMessage,
  getErrorMessageOr,
  formatErrorMessage,
} from "./infrastructure/utils/helpers/error-helpers.util";

export {
  IMAGE_URL_FIELDS,
  isImageField,
} from "./infrastructure/utils/constants/image-fields.constants";
export type { ImageUrlField } from "./infrastructure/utils/constants/image-fields.constants";

export {
  isDataUri,
  isBase64DataUri,
  extractMimeType,
  extractBase64Content,
} from "./infrastructure/utils/validators/data-uri-validator.util";

export {
  isEmptyString,
  isNonEmptyString,
  isString,
} from "./infrastructure/utils/validators/string-validator.util";

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
} from "./infrastructure/utils/type-guards";

export {
  formatImageDataUri,
  extractBase64,
  getDataUriExtension,
} from "./infrastructure/utils/image-helpers.util";

export {
  uploadToFalStorage,
  uploadMultipleToFalStorage,
} from "./infrastructure/utils/fal-storage.util";

export {
  buildErrorMessage,
  isDefined,
  removeNullish,
  generateUniqueId,
  sleep,
} from "./infrastructure/utils/helpers";

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
