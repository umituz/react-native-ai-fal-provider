/**
 * FAL Error Types
 * Error handling type definitions
 */

export enum FalErrorType {
  NETWORK = "network",
  TIMEOUT = "timeout",
  API_ERROR = "api_error",
  VALIDATION = "validation",
  IMAGE_TOO_SMALL = "image_too_small",
  CONTENT_POLICY = "content_policy",
  RATE_LIMIT = "rate_limit",
  AUTHENTICATION = "authentication",
  QUOTA_EXCEEDED = "quota_exceeded",
  MODEL_NOT_FOUND = "model_not_found",
  UNKNOWN = "unknown",
}

export interface FalErrorCategory {
  readonly type: FalErrorType;
  readonly messageKey: string;
  readonly retryable: boolean;
}

export interface FalErrorInfo {
  readonly type: FalErrorType;
  readonly messageKey: string;
  readonly retryable: boolean;
  readonly originalError: string;
  readonly statusCode?: number;
}

export interface FalErrorMessages {
  network?: string;
  timeout?: string;
  api_error?: string;
  validation?: string;
  image_too_small?: string;
  content_policy?: string;
  rate_limit?: string;
  authentication?: string;
  quota_exceeded?: string;
  model_not_found?: string;
  unknown?: string;
}
