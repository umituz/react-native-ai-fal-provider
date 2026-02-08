/**
 * FAL Error Mapper - Maps errors to user-friendly info
 */

import type { FalErrorInfo } from "../../domain/entities/error.types";
import { categorizeFalError } from "./error-categorizer";

const STATUS_CODES = ["400", "401", "402", "403", "404", "422", "429", "500", "502", "503", "504"];

function extractStatusCode(errorString: string): number | undefined {
  const code = STATUS_CODES.find((c) => errorString.includes(c));
  return code ? parseInt(code, 10) : undefined;
}

export function mapFalError(error: unknown): FalErrorInfo {
  const category = categorizeFalError(error);

  // Preserve full error information including stack trace
  if (error instanceof Error) {
    return {
      type: category.type,
      messageKey: `fal.errors.${category.messageKey}`,
      retryable: category.retryable,
      originalError: error.message,
      originalErrorName: error.name,
      stack: error.stack,
      statusCode: extractStatusCode(error.message),
    };
  }

  const errorString = String(error);

  return {
    type: category.type,
    messageKey: `fal.errors.${category.messageKey}`,
    retryable: category.retryable,
    originalError: errorString,
    statusCode: extractStatusCode(errorString),
  };
}

export function isFalErrorRetryable(error: unknown): boolean {
  return categorizeFalError(error).retryable;
}

// Backward compatibility
export const falErrorMapper = {
  mapToErrorInfo: mapFalError,
  isRetryable: isFalErrorRetryable,
  getErrorType: (error: unknown) => categorizeFalError(error).type,
};
