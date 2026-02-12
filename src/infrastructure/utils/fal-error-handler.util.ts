/**
 * FAL Error Handler
 * Unified error handling for FAL AI operations
 */

import type { FalErrorInfo, FalErrorCategory, FalErrorType } from "../../domain/entities/error.types";
import { FalErrorType as ErrorTypeEnum } from "../../domain/entities/error.types";
import { safeJsonParseOrNull } from "./data-parsers.util";

const STATUS_CODES = ["400", "401", "402", "403", "404", "422", "429", "500", "502", "503", "504"];

interface FalApiErrorDetail {
  msg?: string;
  type?: string;
  loc?: string[];
}

interface FalApiError {
  body?: { detail?: FalApiErrorDetail[] } | string;
  message?: string;
}

const ERROR_PATTERNS: Record<FalErrorType, string[]> = {
  [ErrorTypeEnum.NETWORK]: ["network", "fetch", "connection", "econnrefused", "enotfound", "etimedout"],
  [ErrorTypeEnum.TIMEOUT]: ["timeout", "timed out"],
  [ErrorTypeEnum.IMAGE_TOO_SMALL]: ["image_too_small", "image dimensions are too small", "minimum dimensions"],
  [ErrorTypeEnum.VALIDATION]: ["validation", "invalid", "unprocessable", "422", "bad request", "400"],
  [ErrorTypeEnum.CONTENT_POLICY]: ["content_policy", "content policy", "policy violation", "nsfw", "inappropriate"],
  [ErrorTypeEnum.RATE_LIMIT]: ["rate limit", "too many requests", "429"],
  [ErrorTypeEnum.AUTHENTICATION]: ["unauthorized", "401", "forbidden", "403", "api key", "authentication"],
  [ErrorTypeEnum.QUOTA_EXCEEDED]: ["quota exceeded", "insufficient credits", "billing", "payment required", "402"],
  [ErrorTypeEnum.MODEL_NOT_FOUND]: ["model not found", "endpoint not found", "404", "not found"],
  [ErrorTypeEnum.API_ERROR]: ["api error", "502", "503", "504", "500", "internal server error"],
  [ErrorTypeEnum.UNKNOWN]: [],
};

const RETRYABLE_TYPES = new Set([
  ErrorTypeEnum.NETWORK,
  ErrorTypeEnum.TIMEOUT,
  ErrorTypeEnum.RATE_LIMIT,
]);

/**
 * Extract HTTP status code from error message
 */
function extractStatusCode(errorString: string): number | undefined {
  const code = STATUS_CODES.find((c) => errorString.includes(c));
  return code ? parseInt(code, 10) : undefined;
}

/**
 * Parse FAL API error and extract user-friendly message
 */
function parseFalApiError(error: unknown): string {
  const fallback = error instanceof Error ? error.message : String(error);

  const falError = error as FalApiError;
  if (!falError?.body) return fallback;

  const body = typeof falError.body === "string"
    ? safeJsonParseOrNull<{ detail?: FalApiErrorDetail[] }>(falError.body)
    : falError.body;

  const detail = body?.detail?.[0];
  return detail?.msg ?? falError.message ?? fallback;
}

/**
 * Check if error string matches any of the provided patterns
 */
function matchesPatterns(errorString: string, patterns: string[]): boolean {
  return patterns.some((pattern) => errorString.includes(pattern));
}

/**
 * Categorize FAL error based on error message patterns
 */
function categorizeError(error: unknown): FalErrorCategory {
  const message = error instanceof Error ? error.message : String(error);
  const errorString = message.toLowerCase();

  for (const [type, patterns] of Object.entries(ERROR_PATTERNS)) {
    if (patterns.length > 0 && matchesPatterns(errorString, patterns)) {
      const errorType = type as FalErrorType;
      return {
        type: errorType,
        messageKey: errorType,
        retryable: RETRYABLE_TYPES.has(errorType),
      };
    }
  }

  return { type: ErrorTypeEnum.UNKNOWN, messageKey: "unknown", retryable: false };
}

/**
 * Build FalErrorInfo from error string and category
 */
function buildErrorInfo(
  category: FalErrorCategory,
  errorString: string,
  errorInstance?: Error
): FalErrorInfo {
  return {
    type: category.type,
    messageKey: `fal.errors.${category.messageKey}`,
    retryable: category.retryable,
    originalError: errorString,
    originalErrorName: errorInstance?.name,
    stack: errorInstance?.stack,
    statusCode: extractStatusCode(errorString),
  };
}

/**
 * Map error to FalErrorInfo with full error details
 */
export function mapFalError(error: unknown): FalErrorInfo {
  const category = categorizeError(error);

  if (error instanceof Error) {
    return buildErrorInfo(category, error.message, error);
  }

  return buildErrorInfo(category, String(error));
}

/**
 * Parse FAL error and return user-friendly message
 */
export function parseFalError(error: unknown): string {
  const userMessage = parseFalApiError(error);
  if (!userMessage || userMessage.trim().length === 0) {
    return "An unknown error occurred. Please try again.";
  }
  return userMessage;
}

/**
 * Categorize FAL error
 */
export function categorizeFalError(error: unknown): FalErrorCategory {
  return categorizeError(error);
}

/**
 * Check if FAL error is retryable
 */
export function isFalErrorRetryable(error: unknown): boolean {
  return categorizeFalError(error).retryable;
}

/**
 * Extract status code from error
 */
export { extractStatusCode };
