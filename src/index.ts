/**
 * @umituz/react-native-ai-fal-provider
 * FAL AI provider for React Native - implements IAIProvider interface
 *
 * Usage:
 *   import {
 *     FalProvider,
 *     falProvider,
 *     providerRegistry,
 *   } from '@umituz/react-native-ai-fal-provider';
 *   import { providerRegistry } from '@umituz/react-native-ai-generation-content';
 *
 *   // Register provider at app startup
 *   falProvider.initialize({ apiKey: 'your-api-key' });
 *   providerRegistry.register(falProvider);
 *   providerRegistry.setActiveProvider('fal');
 */

// =============================================================================
// DOMAIN LAYER - Types
// =============================================================================

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

export {
  FalErrorType,
} from "./domain/entities/error.types";

export type {
  FalErrorCategory,
  FalErrorInfo,
  FalErrorMessages,
} from "./domain/entities/error.types";

// =============================================================================
// DOMAIN LAYER - Default Models
// =============================================================================

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

// =============================================================================
// DOMAIN LAYER - Feature Models
// =============================================================================

export {
  FAL_IMAGE_FEATURE_MODELS,
  FAL_VIDEO_FEATURE_MODELS,
  getAllFeatureModels,
} from "./domain/constants/feature-models.constants";

// Feature model getters (use these instead of deprecated getFal* functions)
export {
  getImageFeatureModel,
  getVideoFeatureModel,
} from "./infrastructure/services";

export type {
  FeatureModelConfig,
} from "./domain/constants/feature-models.constants";

// =============================================================================
// INFRASTRUCTURE LAYER - Provider (IAIProvider Implementation)
// =============================================================================

export { FalProvider, falProvider } from "./infrastructure/services";

// =============================================================================
// INFRASTRUCTURE LAYER - Services
// =============================================================================

export { falModelsService } from "./infrastructure/services";
export type { ModelFetcher } from "./infrastructure/services";

// =============================================================================
// INFRASTRUCTURE LAYER - Utils
// =============================================================================

export {
  categorizeFalError,
  falErrorMapper,
  mapFalError,
  isFalErrorRetryable,
  // Input builders
  buildSingleImageInput,
  buildDualImageInput,
  buildUpscaleInput,
  buildPhotoRestoreInput,
  buildVideoFromImageInput,
  buildFaceSwapInput,
  buildAnimeSelfieInput,
  buildRemoveBackgroundInput,
  buildRemoveObjectInput,
  buildReplaceBackgroundInput,
  buildHDTouchUpInput,
} from "./infrastructure/utils";

export type {
  UpscaleOptions,
  PhotoRestoreOptions,
  FaceSwapOptions,
  AnimeSelfieOptions,
  RemoveBackgroundOptions,
  RemoveObjectOptions,
  ReplaceBackgroundOptions,
  VideoFromImageOptions,
} from "./infrastructure/utils";

// =============================================================================
// DOMAIN LAYER - Model Selection Types
// =============================================================================

export type {
  ModelType,
  ModelSelectionConfig,
  ModelSelectionState,
  ModelSelectionActions,
  UseModelsReturn,
} from "./domain/types";

// =============================================================================
// PRESENTATION LAYER - Hooks
// =============================================================================

export {
  useFalGeneration,
  useModels,
} from "./presentation/hooks";

export type {
  UseFalGenerationOptions,
  UseFalGenerationResult,
  UseModelsProps,
} from "./presentation/hooks";
