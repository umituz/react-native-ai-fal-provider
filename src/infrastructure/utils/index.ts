/**
 * Utils Index
 */

export {
  mapFalError,
  parseFalError,
  isFalErrorRetryable,
} from "./fal-error-handler.util";

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
} from "./type-guards";

export {
  formatImageDataUri,
  extractBase64,
  getDataUriExtension,
} from "./image-helpers.util";

export {
  uploadToFalStorage,
  uploadMultipleToFalStorage,
} from "./fal-storage.util";

export {
  buildErrorMessage,
  isDefined,
  removeNullish,
  generateUniqueId,
  sleep,
} from "./helpers";

export { preprocessInput } from "./input-preprocessor.util";

export { FalGenerationStateManager } from "./fal-generation-state-manager.util";
export type { GenerationState } from "./fal-generation-state-manager.util";

export {
  calculateVideoCredits,
  calculateImageCredits,
  calculateCreditsFromConfig,
} from "./pricing/fal-pricing.util";
export type { GenerationResolution } from "./pricing/fal-pricing.util";
