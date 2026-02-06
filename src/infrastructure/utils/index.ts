/**
 * Utils Index
 */

export { categorizeFalError } from "./error-categorizer";
export {
  falErrorMapper,
  mapFalError,
  isFalErrorRetryable,
} from "./error-mapper";

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
} from "./image-helpers.util";

export {
  uploadToFalStorage,
  uploadMultipleToFalStorage,
} from "./fal-storage.util";

export {
  truncatePrompt,
  sanitizePrompt,
} from "./prompt-helpers.util";

export {
  calculateTimeoutWithJitter,
  debounce,
  throttle,
} from "./timing-helpers.util";

export {
  formatCreditCost,
  buildErrorMessage,
  isDefined,
  removeNullish,
} from "./general-helpers.util";

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
} from "./job-metadata";

export type { FalJobMetadata } from "./job-metadata";

export {
  saveJobMetadata,
  loadJobMetadata,
  deleteJobMetadata,
  loadAllJobs,
  cleanupOldJobs,
  getJobsByModel,
  getJobsByStatus,
  updateJobStatus,
} from "./job-storage";

export type { IJobStorage, InMemoryJobStorage } from "./job-storage";

export { CostTracker } from "./cost-tracker";

export { executeWithCostTracking } from "./cost-tracking-executor.util";

export { preprocessInput } from "./input-preprocessor.util";
