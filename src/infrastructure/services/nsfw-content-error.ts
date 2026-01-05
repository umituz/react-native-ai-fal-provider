/**
 * NSFW Content Error
 * Thrown when AI provider detects NSFW content in generated output
 */

import { FalErrorType } from "../../domain/entities/error.types";

export class NSFWContentError extends Error {
  public readonly type = FalErrorType.CONTENT_POLICY;
  public readonly retryable = false;
  public readonly messageKey = "error.nsfw_content_detected";

  constructor(message?: string) {
    super(
      message ||
        "The generated content was flagged as inappropriate. Please try a different prompt."
    );
    this.name = "NSFWContentError";
  }

  getUserMessage(): string {
    return this.message;
  }
}
