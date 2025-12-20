/**
 * FAL Error Categorizer
 * Classifies FAL AI errors for handling
 */

import { FalErrorType, type FalErrorCategory } from "../../domain/entities/error.types";

const NETWORK_PATTERNS = [
  "network",
  "fetch",
  "connection",
  "econnrefused",
  "enotfound",
  "timeout",
  "etimedout",
];

const VALIDATION_PATTERNS = [
  "validation",
  "invalid",
  "unprocessable",
  "422",
  "bad request",
  "400",
];

const CONTENT_POLICY_PATTERNS = [
  "content_policy",
  "content policy",
  "policy violation",
  "not allowed",
  "nsfw",
  "inappropriate",
];

const RATE_LIMIT_PATTERNS = ["rate limit", "too many requests", "429", "quota"];

const AUTH_PATTERNS = [
  "unauthorized",
  "401",
  "forbidden",
  "403",
  "api key",
  "authentication",
  "invalid credentials",
];

const QUOTA_PATTERNS = [
  "quota exceeded",
  "insufficient credits",
  "billing",
  "payment required",
  "402",
];

const MODEL_NOT_FOUND_PATTERNS = [
  "model not found",
  "endpoint not found",
  "404",
  "not found",
];

class FalErrorClassifier {
  categorize(error: unknown): FalErrorCategory {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorString = errorMessage.toLowerCase();
    const errorName = error instanceof Error ? error.constructor.name : "";

    if (this.matchesPatterns(errorString, NETWORK_PATTERNS)) {
      return { type: FalErrorType.NETWORK, messageKey: "network", retryable: true };
    }

    if (errorString.includes("timeout") || errorString.includes("timed out")) {
      return { type: FalErrorType.TIMEOUT, messageKey: "timeout", retryable: true };
    }

    if (this.matchesPatterns(errorString, VALIDATION_PATTERNS)) {
      return { type: FalErrorType.VALIDATION, messageKey: "validation", retryable: false };
    }

    if (this.matchesPatterns(errorString, CONTENT_POLICY_PATTERNS)) {
      return { type: FalErrorType.CONTENT_POLICY, messageKey: "content_policy", retryable: false };
    }

    if (this.matchesPatterns(errorString, RATE_LIMIT_PATTERNS)) {
      return { type: FalErrorType.RATE_LIMIT, messageKey: "rate_limit", retryable: true };
    }

    if (this.matchesPatterns(errorString, AUTH_PATTERNS)) {
      return { type: FalErrorType.AUTHENTICATION, messageKey: "authentication", retryable: false };
    }

    if (this.matchesPatterns(errorString, QUOTA_PATTERNS)) {
      return { type: FalErrorType.QUOTA_EXCEEDED, messageKey: "quota_exceeded", retryable: false };
    }

    if (this.matchesPatterns(errorString, MODEL_NOT_FOUND_PATTERNS)) {
      return { type: FalErrorType.MODEL_NOT_FOUND, messageKey: "model_not_found", retryable: false };
    }

    if (this.isApiError(errorString, errorName)) {
      const retryable = !this.isInternalServerError(errorString);
      return { type: FalErrorType.API_ERROR, messageKey: "api_error", retryable };
    }

    return { type: FalErrorType.UNKNOWN, messageKey: "unknown", retryable: false };
  }

  private matchesPatterns(errorString: string, patterns: string[]): boolean {
    return patterns.some((pattern) => errorString.includes(pattern));
  }

  private isApiError(errorString: string, errorName: string): boolean {
    return (
      errorString.includes("api error") ||
      errorName.toLowerCase() === "apierror" ||
      ["502", "503", "504"].some((code) => errorString.includes(code)) ||
      this.isInternalServerError(errorString)
    );
  }

  private isInternalServerError(errorString: string): boolean {
    return errorString.includes("internal server error") || errorString.includes("500");
  }
}

const classifier = new FalErrorClassifier();

export const categorizeFalError = (error: unknown): FalErrorCategory => {
  return classifier.categorize(error);
};
