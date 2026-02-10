/**
 * FAL Error Mapper - Maps errors to user-friendly info
 *
 * This module re-exports error handling functions from the unified
 * fal-error-handler.util module for backward compatibility.
 */

export {
  mapFalError,
  parseFalError,
  isFalErrorRetryable,
  categorizeFalError,
  extractStatusCode,
} from "./fal-error-handler.util";
