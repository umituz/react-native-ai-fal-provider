/**
 * Utils Index
 */

export {
  filterByProperty,
  filterByPredicate,
  filterByTimeRange,
  filterByAnyProperty,
  sortByDateDescending,
  sortByDateAscending,
  sortByNumberDescending,
  sortByNumberAscending,
} from "./collections";

export {
  safeJsonParse,
  safeJsonParseOrNull,
  safeJsonStringify,
  isValidJson,
  validateObjectStructure,
} from "./parsers";

export { categorizeFalError } from "./error-categorizer";
export {
  mapFalError,
  parseFalError,
  isFalErrorRetryable,
  extractStatusCode,
} from "./fal-error-handler.util";

export { formatDate } from "./date-format.util";
export { formatNumber, formatBytes, formatDuration } from "./number-format.util";
export { truncateText } from "./string-format.util";

export {
  buildSingleImageInput,
  buildDualImageInput,
} from "./base-builders.util";

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
  buildErrorMessage,
  isDefined,
  removeNullish,
  generateUniqueId,
  sleep,
} from "./helpers";

export { preprocessInput } from "./input-preprocessor.util";
export { validateInput } from "./input-validator.util";

export type { FalJobMetadata } from "./job-metadata";
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

export type { IJobStorage } from "./job-storage";
export {
  InMemoryJobStorage,
  saveJobMetadata,
  loadJobMetadata,
  deleteJobMetadata,
  updateJobStatus,
  loadAllJobs,
  cleanupOldJobs,
  getJobsByModel,
  getJobsByStatus,
} from "./job-storage";

export { executeWithCostTracking } from "./cost-tracking-executor.util";
export { CostTracker } from "./cost-tracker";
export type { CostSummary, GenerationCost } from "./cost-tracker";

export { FalGenerationStateManager } from "./fal-generation-state-manager.util";
export type { GenerationState } from "./fal-generation-state-manager.util";
