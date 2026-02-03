/**
 * Infrastructure Layer Exports
 */

export {
  FalProvider,
  falProvider,
  falModelsService,
  NSFWContentError,
  cancelCurrentFalRequest,
  hasRunningFalRequest,
} from "../infrastructure/services";
export type { FalProviderType } from "../infrastructure/services";

export {
  categorizeFalError,
  falErrorMapper,
  mapFalError,
  isFalErrorRetryable,
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
} from "../infrastructure/utils";

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
  isImageDataUri,
  uploadToFalStorage,
  uploadMultipleToFalStorage,
  calculateTimeoutWithJitter,
  formatCreditCost,
  truncatePrompt,
  sanitizePrompt,
  buildErrorMessage,
  isDefined,
  removeNullish,
  debounce,
  throttle,
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

export type {
  FalJobMetadata,
  IJobStorage,
  InMemoryJobStorage,
} from "../infrastructure/utils";
