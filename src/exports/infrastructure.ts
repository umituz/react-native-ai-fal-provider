/**
 * Infrastructure Layer Exports
 */

export {
  FalProvider,
  falProvider,
  NSFWContentError,
  cleanupRequestStore,
  stopAutomaticCleanup,
} from "../infrastructure/services";
export type { FalProviderType, ActiveRequest } from "../infrastructure/services";

export {
  mapFalError,
  parseFalError,
  isFalErrorRetryable,
} from "../infrastructure/utils";

export {
  getErrorMessage,
  getErrorMessageOr,
  formatErrorMessage,
} from "../infrastructure/utils/helpers/error-helpers.util";

export {
  IMAGE_URL_FIELDS,
  isImageField,
} from "../infrastructure/utils/constants/image-fields.constants";
export type {
  ImageUrlField,
} from "../infrastructure/utils/constants/image-fields.constants";

export {
  isDataUri,
  isBase64DataUri,
  extractMimeType,
  extractBase64Content,
} from "../infrastructure/utils/validators/data-uri-validator.util";
export {
  isEmptyString,
  isNonEmptyString,
  isString,
} from "../infrastructure/utils/validators/string-validator.util";

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
} from "../infrastructure/utils";

export {
  formatImageDataUri,
  extractBase64,
  getDataUriExtension,
  uploadToFalStorage,
  uploadMultipleToFalStorage,
  buildErrorMessage,
  isDefined,
  removeNullish,
  generateUniqueId,
  sleep,
} from "../infrastructure/utils";

export {
  calculateVideoCredits,
  calculateImageCredits,
  calculateCreditsFromConfig,
} from "../infrastructure/utils";
export type { GenerationResolution } from "../infrastructure/utils";
