/**
 * @umituz/react-native-ai-fal-provider
 * FAL AI provider service for React Native applications
 *
 * Usage:
 *   import {
 *     falClientService,
 *     useFalGeneration,
 *     mapFalError
 *   } from '@umituz/react-native-ai-fal-provider';
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
// INFRASTRUCTURE LAYER - Services
// =============================================================================

export { falClientService } from "./infrastructure/services";

// =============================================================================
// INFRASTRUCTURE LAYER - Utils
// =============================================================================

export {
  categorizeFalError,
  falErrorMapper,
  mapFalError,
  isFalErrorRetryable,
} from "./infrastructure/utils";

// =============================================================================
// PRESENTATION LAYER - Hooks
// =============================================================================

export {
  useFalGeneration,
} from "./presentation/hooks";

export type {
  UseFalGenerationOptions,
  UseFalGenerationResult,
} from "./presentation/hooks";
