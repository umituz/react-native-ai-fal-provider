/**
 * Model Type Guards
 * Runtime type checking for model types
 */

import type { FalModelType } from "../../../domain/entities/fal.types";
import type { ModelType } from "../../../domain/types/model-selection.types";
import { FalErrorType } from "../../../domain/entities/error.types";

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
