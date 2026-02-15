/**
 * Infrastructure Layer Exports
 */

export {
  FalProvider,
  falProvider,
  falModelsService,
  NSFWContentError,
  cleanupRequestStore,
  stopAutomaticCleanup,
} from "../infrastructure/services";
export type { FalProviderType, ActiveRequest } from "../infrastructure/services";

export {
  categorizeFalError,
  mapFalError,
  parseFalError,
  isFalErrorRetryable,
  buildSingleImageInput,
  buildDualImageInput,
} from "../infrastructure/utils";

// Error handling utilities
export {
  getErrorMessage,
  getErrorMessageOr,
  formatErrorMessage,
} from "../infrastructure/utils/helpers/error-helpers.util";

// Image field constants
export {
  IMAGE_URL_FIELDS,
  isImageField,
} from "../infrastructure/utils/constants/image-fields.constants";
export type {
  ImageUrlField,
} from "../infrastructure/utils/constants/image-fields.constants";

// Validators
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

export { CostTracker } from "../infrastructure/utils/cost-tracker";

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
  formatNumber,
  formatBytes,
  formatDuration,
  truncateText,
  truncatePrompt,
  sanitizePrompt,
  buildErrorMessage,
  isDefined,
  removeNullish,
  generateUniqueId,
  sleep,
} from "../infrastructure/utils";

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
} from "../infrastructure/utils";

export {
  saveJobMetadata,
  loadJobMetadata,
  deleteJobMetadata,
  loadAllJobs,
  cleanupOldJobs,
  getJobsByModel,
  getJobsByStatus,
  updateJobStatus,
} from "../infrastructure/utils";

export type { FalJobMetadata, IJobStorage } from "../infrastructure/utils";
export { InMemoryJobStorage } from "../infrastructure/utils";
