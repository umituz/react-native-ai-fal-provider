/**
 * FAL Error Mapper - Maps errors to user-friendly info
 *
 * @deprecated This module is a re-export for backward compatibility.
 * Import directly from './fal-error-handler.util' instead.
 *
 * This module re-exports error handling functions from the unified
 * fal-error-handler.util module for backward compatibility.
 *
 * @example
 * // Instead of:
 * import { mapFalError } from './error-mapper';
 *
 * // Use:
 * import { mapFalError } from './fal-error-handler.util';
 */

export {
  mapFalError,
  parseFalError,
  isFalErrorRetryable,
  categorizeFalError,
  extractStatusCode,
} from "./fal-error-handler.util";
