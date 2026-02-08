/**
 * Type Guards and Validation Utilities
 * Runtime type checking and validation helpers
 */

import type { FalModelType } from "../../domain/entities/fal.types";
import type { ModelType } from "../../domain/types/model-selection.types";
import { FalErrorType } from "../../domain/entities/error.types";

/**
 * Check if a string is a valid FalModelType
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

/**
 * Check if error is a FalErrorType
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

/**
 * Validate base64 image string
 */
export function isValidBase64Image(value: unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }

  // Check data URI prefix
  if (value.startsWith("data:image/")) {
    const base64Part = value.split("base64,")[1];
    if (!base64Part) return false;
    // Base64 should be at least 100 chars (meaningful image data)
    return base64Part.length >= 100;
  }

  // Check if it's a valid base64 string with minimum length
  const base64Pattern = /^[A-Za-z0-9+/]+=*$/;
  // Minimum 100 characters for meaningful base64 image data
  return base64Pattern.test(value) && value.length >= 100;
}

/**
 * Validate API key format
 */
export function isValidApiKey(value: unknown): boolean {
  return typeof value === "string" && value.length > 0;
}

/**
 * Validate model ID format
 */
const MODEL_ID_PATTERN = /^[a-zA-Z0-9-_]+\/[a-zA-Z0-9-_.]+(\/[a-zA-Z0-9-_.]+)?$/;

export function isValidModelId(value: unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }

  return MODEL_ID_PATTERN.test(value) && value.length >= 3;
}

/**
 * Validate prompt string
 */
export function isValidPrompt(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0 && value.length <= 5000;
}

/**
 * Validate timeout value
 */
export function isValidTimeout(value: unknown): boolean {
  return typeof value === "number" && !isNaN(value) && isFinite(value) && value > 0 && value <= 600000; // Max 10 minutes
}

/**
 * Validate retry count
 */
export function isValidRetryCount(value: unknown): boolean {
  return typeof value === "number" && !isNaN(value) && isFinite(value) && Number.isInteger(value) && value >= 0 && value <= 10;
}
