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
  sumByProperty,
  groupByProperty,
  chunkArray,
  distinctByProperty,
} from "./collection-filters.util";

export {
  safeJsonParse,
  safeJsonParseOrNull,
  safeJsonStringify,
  isValidJson,
  validateObjectStructure,
  validateObjectArray,
  parseNumber,
  parseBoolean,
  clampNumber,
  roundToDecimals,
  deepClone,
  mergeObjects,
  pickProperties,
  omitProperties,
} from "./data-parsers.util";

export { categorizeFalError } from "./error-categorizer";
export {
  mapFalError,
  parseFalError,
  isFalErrorRetryable,
} from "./error-mapper";

export {
  formatNumber,
  formatCurrency,
  formatBytes,
  formatDuration,
  formatPercentage,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  truncateText,
  capitalize,
  toTitleCase,
  toSlug,
  formatList,
  pluralize,
  formatCount,
} from "./formatting.util";

export {
  buildSingleImageInput,
  buildDualImageInput,
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
  buildErrorMessage,
  isDefined,
  removeNullish,
  generateUniqueId,
  debounce,
  throttle,
  sleep,
  retry,
  noop,
  identity,
  constant,
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

export {
  validateInput,
  type InputValidationError,
  type ValidationError,
} from "./input-validator.util";

