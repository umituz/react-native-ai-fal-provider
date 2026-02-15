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
