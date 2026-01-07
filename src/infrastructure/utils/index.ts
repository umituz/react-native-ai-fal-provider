/**
 * Utils Index
 */

export { categorizeFalError } from "./error-categorizer";
export { falErrorMapper, mapFalError, isFalErrorRetryable } from "./error-mapper";

export {
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
} from "./input-builders.util";

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
} from "./type-guards.util";

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
} from "./helpers.util";
