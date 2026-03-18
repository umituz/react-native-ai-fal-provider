/**
 * Shared Type Guards
 * Runtime type checking for model types, error types, and other domain types
 *
 * This file consolidates functionality from:
 * - model-type-guards.util.ts
 * - validation-guards.util.ts (type guard portions)
 */

import type { FalModelType } from "../domain/entities/fal.types";
import type { ModelType } from "../domain/types/model-selection.types";
import { FalErrorType } from "../domain/entities/error.types";

// ─── Model Type Guards ─────────────────────────────────────────────────────────

/**
 * Check if a string is a valid FalModelType
 *
 * @param value - Value to check
 * @returns Type guard indicating if the value is a FalModelType
 */
export function isFalModelType(value: unknown): value is FalModelType {
  const validTypes: ReadonlyArray<FalModelType> = [
    "text-to-image",
    "text-to-video",
    "text-to-voice",
    "image-to-video",
    "image-to-image",
    "text-to-text",
  ];
  return typeof value === "string" && validTypes.includes(value as FalModelType);
}

/**
 * Check if a string is a valid ModelType
 *
 * @param value - Value to check
 * @returns Type guard indicating if the value is a ModelType
 */
export function isModelType(value: unknown): value is ModelType {
  const validTypes: ReadonlyArray<ModelType> = [
    "text-to-image",
    "text-to-video",
    "image-to-video",
    "text-to-voice",
  ];
  return typeof value === "string" && validTypes.includes(value as ModelType);
}

// ─── Error Type Guards ────────────────────────────────────────────────────────

/**
 * Check if error is a FalErrorType
 *
 * @param value - Value to check
 * @returns Type guard indicating if the value is a FalErrorType
 */
export function isFalErrorType(value: unknown): value is FalErrorType {
  const validTypes: ReadonlyArray<FalErrorType> = [
    FalErrorType.NETWORK,
    FalErrorType.TIMEOUT,
    FalErrorType.API_ERROR,
    FalErrorType.VALIDATION,
    FalErrorType.IMAGE_TOO_SMALL,
    FalErrorType.CONTENT_POLICY,
    FalErrorType.RATE_LIMIT,
    FalErrorType.AUTHENTICATION,
    FalErrorType.QUOTA_EXCEEDED,
    FalErrorType.MODEL_NOT_FOUND,
    FalErrorType.UNKNOWN,
  ];
  return typeof value === "string" && validTypes.includes(value as FalErrorType);
}

// ─── API Error Type Guards ────────────────────────────────────────────────────

/**
 * Check if error is retryable based on error type
 *
 * @param error - Error to check
 * @returns True if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("network") ||
      message.includes("timeout") ||
      message.includes("timed out") ||
      message.includes("econnrefused") ||
      message.includes("enotfound") ||
      message.includes("fetch")
    );
  }
  return false;
}

/**
 * Check if value is a local file URI
 *
 * @param value - Value to check
 * @returns Type guard indicating if the value is a local file URI
 */
export function isLocalFileUri(value: unknown): value is string {
  return (
    typeof value === "string" &&
    (value.startsWith("file://") || value.startsWith("content://"))
  );
}

/**
 * Check if value is an HTTP/HTTPS URL
 *
 * @param value - Value to check
 * @returns Type guard indicating if the value is an HTTP/HTTPS URL
 */
export function isHttpUrl(value: unknown): value is string {
  return (
    typeof value === "string" &&
    (value.startsWith("http://") || value.startsWith("https://"))
  );
}
