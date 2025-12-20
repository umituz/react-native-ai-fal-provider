/**
 * FAL Error Mapper
 * Maps FAL errors to user-friendly information
 */

import type { FalErrorInfo, FalErrorMessages } from "../../domain/entities/error.types";
import { categorizeFalError } from "./error-categorizer";

const DEFAULT_MESSAGE_PREFIX = "fal.errors";

class FalErrorMapper {
  private messagePrefix = DEFAULT_MESSAGE_PREFIX;
  private customMessages?: FalErrorMessages;

  setMessagePrefix(prefix: string): void {
    this.messagePrefix = prefix;
  }

  setCustomMessages(messages: FalErrorMessages): void {
    this.customMessages = messages;
  }

  mapToErrorInfo(error: unknown): FalErrorInfo {
    const category = categorizeFalError(error);
    const originalError = error instanceof Error ? error.message : String(error);

    const messageKey = this.customMessages?.[category.messageKey as keyof FalErrorMessages]
      ? category.messageKey
      : `${this.messagePrefix}.${category.messageKey}`;

    return {
      type: category.type,
      messageKey,
      retryable: category.retryable,
      originalError,
      statusCode: this.extractStatusCode(originalError),
    };
  }

  isRetryable(error: unknown): boolean {
    const category = categorizeFalError(error);
    return category.retryable;
  }

  getErrorType(error: unknown) {
    return categorizeFalError(error).type;
  }

  private extractStatusCode(errorString: string): number | undefined {
    const codes = ["400", "401", "402", "403", "404", "422", "429", "500", "502", "503", "504"];
    for (const code of codes) {
      if (errorString.includes(code)) {
        return parseInt(code, 10);
      }
    }
    return undefined;
  }
}

export const falErrorMapper = new FalErrorMapper();

export const mapFalError = (error: unknown): FalErrorInfo => {
  return falErrorMapper.mapToErrorInfo(error);
};

export const isFalErrorRetryable = (error: unknown): boolean => {
  return falErrorMapper.isRetryable(error);
};
