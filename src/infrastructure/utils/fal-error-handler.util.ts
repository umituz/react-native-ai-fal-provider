/**
 * FAL Error Handler (Infrastructure Layer)
 * Delegates to domain ErrorClassificationService for error handling logic
 *
 * This file now serves as a thin adapter layer for backward compatibility.
 * The actual error handling logic has been moved to the domain layer.
 */

import { ErrorClassificationService } from "../../domain/services/ErrorClassificationService";
import type { FalErrorInfo, FalErrorCategory } from "../../domain/entities/error.types";

/**
 * Map error to FalErrorInfo with full categorization
 * Delegates to domain ErrorClassificationService
 */
export function mapFalError(error: unknown): FalErrorInfo {
  return ErrorClassificationService.mapError(error);
}

/**
 * Parse FAL error and return user-friendly message
 * Delegates to domain ErrorClassificationService
 */
export function parseFalError(error: unknown): string {
  return ErrorClassificationService.extractMessage(error);
}

/**
 * Categorize FAL error
 * Delegates to domain ErrorClassificationService
 */
export function categorizeFalError(error: unknown): FalErrorCategory {
  return ErrorClassificationService.categorizeError(error);
}

/**
 * Check if FAL error is retryable
 * Delegates to domain ErrorClassificationService
 */
export function isFalErrorRetryable(error: unknown): boolean {
  return ErrorClassificationService.isRetryable(error);
}
