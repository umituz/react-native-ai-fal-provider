/**
 * FAL Error Categorizer - Classifies FAL AI errors
 */

import { FalErrorType, type FalErrorCategory } from "../../domain/entities/error.types";

const PATTERNS: Record<FalErrorType, string[]> = {
  [FalErrorType.NETWORK]: ["network", "fetch", "connection", "econnrefused", "enotfound", "etimedout"],
  [FalErrorType.TIMEOUT]: ["timeout", "timed out"],
  [FalErrorType.IMAGE_TOO_SMALL]: ["image_too_small", "image dimensions are too small", "minimum dimensions"],
  [FalErrorType.VALIDATION]: ["validation", "invalid", "unprocessable", "422", "bad request", "400"],
  [FalErrorType.CONTENT_POLICY]: ["content_policy", "content policy", "policy violation", "nsfw", "inappropriate"],
  [FalErrorType.RATE_LIMIT]: ["rate limit", "too many requests", "429", "quota"],
  [FalErrorType.AUTHENTICATION]: ["unauthorized", "401", "forbidden", "403", "api key", "authentication"],
  [FalErrorType.QUOTA_EXCEEDED]: ["quota exceeded", "insufficient credits", "billing", "payment required", "402"],
  [FalErrorType.MODEL_NOT_FOUND]: ["model not found", "endpoint not found", "404", "not found"],
  [FalErrorType.API_ERROR]: ["api error", "502", "503", "504", "500", "internal server error"],
  [FalErrorType.UNKNOWN]: [],
};

const RETRYABLE_TYPES = new Set([
  FalErrorType.NETWORK,
  FalErrorType.TIMEOUT,
  FalErrorType.RATE_LIMIT,
]);

function matchesPatterns(errorString: string, patterns: string[]): boolean {
  return patterns.some((pattern) => errorString.includes(pattern));
}

export function categorizeFalError(error: unknown): FalErrorCategory {
  const message = error instanceof Error ? error.message : String(error);
  const errorString = message.toLowerCase();

  for (const [type, patterns] of Object.entries(PATTERNS)) {
    if (patterns.length > 0 && matchesPatterns(errorString, patterns)) {
      const errorType = type as FalErrorType;
      return {
        type: errorType,
        messageKey: errorType,
        retryable: RETRYABLE_TYPES.has(errorType),
      };
    }
  }

  return { type: FalErrorType.UNKNOWN, messageKey: "unknown", retryable: false };
}
