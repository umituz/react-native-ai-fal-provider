/**
 * Domain Service: Error Classification
 * Pure business logic for categorizing and extracting error information
 * No infrastructure dependencies (except for @fal-ai/client types)
 */

import { ApiError, ValidationError } from "@fal-ai/client";
import type { FalErrorInfo, FalErrorCategory } from "../entities/error.types";
import { FalErrorType } from "../entities/error.types";

/**
 * HTTP status code to error type mapping
 */
const STATUS_TO_ERROR_TYPE: Record<number, FalErrorType> = {
  400: FalErrorType.VALIDATION,
  401: FalErrorType.AUTHENTICATION,
  402: FalErrorType.QUOTA_EXCEEDED,
  403: FalErrorType.AUTHENTICATION,
  404: FalErrorType.MODEL_NOT_FOUND,
  422: FalErrorType.VALIDATION,
  429: FalErrorType.RATE_LIMIT,
  500: FalErrorType.API_ERROR,
  502: FalErrorType.API_ERROR,
  503: FalErrorType.API_ERROR,
  504: FalErrorType.API_ERROR,
};

const RETRYABLE_TYPES = new Set<FalErrorType>([
  FalErrorType.NETWORK,
  FalErrorType.TIMEOUT,
  FalErrorType.RATE_LIMIT,
]);

/**
 * Message-based error type detection (for non-ApiError errors)
 */
const MESSAGE_PATTERNS: Array<{ type: FalErrorType; patterns: string[] }> = [
  {
    type: FalErrorType.NETWORK,
    patterns: ["network", "fetch", "econnrefused", "enotfound", "etimedout"],
  },
  { type: FalErrorType.TIMEOUT, patterns: ["timeout", "timed out"] },
  {
    type: FalErrorType.CONTENT_POLICY,
    patterns: ["nsfw", "content_policy", "content policy", "policy violation"],
  },
  {
    type: FalErrorType.IMAGE_TOO_SMALL,
    patterns: [
      "image_too_small",
      "image dimensions are too small",
      "minimum dimensions",
    ],
  },
];

/**
 * Domain service for error classification
 * Single responsibility: categorize errors and extract user-friendly messages
 */
export class ErrorClassificationService {
  /**
   * Categorize error using @fal-ai/client error types
   * Priority: ApiError status code > message pattern matching
   *
   * @param error - Error to categorize
   * @returns Error category with type, message key, and retryable flag
   */
  static categorizeError(error: unknown): FalErrorCategory {
    // 1. ApiError (includes ValidationError) - use HTTP status code
    if (error instanceof ApiError) {
      const typeFromStatus = STATUS_TO_ERROR_TYPE[error.status];
      if (typeFromStatus) {
        return {
          type: typeFromStatus,
          messageKey: typeFromStatus,
          retryable: RETRYABLE_TYPES.has(typeFromStatus),
        };
      }
      // Unknown status code - still an API error
      return {
        type: FalErrorType.API_ERROR,
        messageKey: "api_error",
        retryable: false,
      };
    }

    // 2. Standard Error - match message patterns
    const message = (
      error instanceof Error
        ? error.message
        : error != null
        ? String(error)
        : "unknown"
    ).toLowerCase();

    for (const { type, patterns } of MESSAGE_PATTERNS) {
      if (patterns.some((p) => message.includes(p))) {
        return {
          type,
          messageKey: type,
          retryable: RETRYABLE_TYPES.has(type),
        };
      }
    }

    // 3. No match - UNKNOWN, not retryable
    return {
      type: FalErrorType.UNKNOWN,
      messageKey: "unknown",
      retryable: false,
    };
  }

  /**
   * Extract user-readable message from error
   * Uses @fal-ai/client types for structured extraction
   *
   * @param error - Error to extract message from
   * @returns User-friendly error message
   */
  static extractMessage(error: unknown): string {
    // ValidationError - extract field-level messages
    if (error instanceof ValidationError) {
      const fieldErrors = error.fieldErrors;
      if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
        const messages = fieldErrors
          .map(
            (e) =>
              e && typeof e === "object" && "msg" in e && typeof e.msg === "string"
                ? e.msg
                : null
          )
          .filter((msg): msg is string => msg !== null);
        if (messages.length > 0) return messages.join("; ");
      }
      return error.message;
    }

    // ApiError - extract from body or message
    if (error instanceof ApiError) {
      const body = error.body as { detail?: Array<{ msg?: string }> } | undefined;

      if (
        body &&
        body.detail &&
        Array.isArray(body.detail) &&
        body.detail.length > 0
      ) {
        const firstItem = body.detail[0];
        if (
          firstItem &&
          typeof firstItem === "object" &&
          typeof firstItem.msg === "string" &&
          firstItem.msg
        ) {
          return firstItem.msg;
        }
      }
      return error.message;
    }

    // Standard Error
    if (error instanceof Error) {
      return error.message;
    }

    return error != null ? String(error) : "Unknown error";
  }

  /**
   * Map error to FalErrorInfo with full categorization
   *
   * @param error - Error to map
   * @returns Complete error information
   */
  static mapError(error: unknown): FalErrorInfo {
    const category = this.categorizeError(error);
    const message = this.extractMessage(error);

    return {
      type: category.type,
      messageKey: `fal.errors.${category.messageKey}`,
      retryable: category.retryable,
      originalError: message,
      originalErrorName: error instanceof Error ? error.name : undefined,
      stack: error instanceof Error ? error.stack : undefined,
      statusCode: error instanceof ApiError ? error.status : undefined,
    };
  }

  /**
   * Check if error is retryable
   *
   * @param error - Error to check
   * @returns True if error is retryable
   */
  static isRetryable(error: unknown): boolean {
    return this.categorizeError(error).retryable;
  }
}
