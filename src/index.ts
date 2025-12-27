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
// INFRASTRUCTURE LAYER - Provider (IAIProvider Implementation)
// =============================================================================

export { FalProvider, falProvider } from "./infrastructure/services";

// =============================================================================
// INFRASTRUCTURE LAYER - Services (Low-level client)
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
