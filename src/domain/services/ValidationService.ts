/**
 * Domain Service: Validation
 * Pure business logic for input validation
 * No infrastructure dependencies
 */

import { IMAGE_URL_FIELDS } from "../../infrastructure/utils/constants/image-fields.constants";
import {
  isValidPrompt,
  isNonEmptyString,
  isValidAndSafeUrl,
  isImageDataUri,
} from "../../shared/validators";

const SUSPICIOUS_PATTERNS = [
  /<script/i,
  /javascript:/i,
  /on\w+\s*=/i,
  /<iframe/i,
  /<embed/i,
  /<object/i,
  /data:(?!image\/)/i,
  /vbscript:/i,
] as const;

function hasSuspiciousContent(value: string): boolean {
  return SUSPICIOUS_PATTERNS.some((pattern) => pattern.test(value));
}

export interface ValidationError {
  field: string;
  message: string;
}

export class InputValidationError extends Error {
  public readonly errors: readonly ValidationError[];

  constructor(errors: ValidationError[]) {
    const message = errors.map((e) => `${e.field}: ${e.message}`).join("; ");
    super(`Input validation failed: ${message}`);
    this.name = "InputValidationError";
    this.errors = errors;
  }
}

/**
 * Domain service for input validation
 * Single responsibility: validate all inputs before API calls
 */
export class ValidationService {
  /**
   * Validate model and input parameters
   *
   * @param model - Model ID (unused in validation but kept for API compatibility)
   * @param input - Input parameters to validate
   * @throws InputValidationError if validation fails
   */
  static validateInput(_model: string, input: Record<string, unknown>): void {
    const errors: ValidationError[] = [];

    // Validate input is not empty
    if (!input || typeof input !== "object" || Object.keys(input).length === 0) {
      errors.push({ field: "input", message: "Input must be a non-empty object" });
    }

    // BLOCK sync_mode:true
    if (input.sync_mode === true) {
      errors.push({
        field: "sync_mode",
        message:
          "sync_mode:true is forbidden. It returns base64 data URIs instead of HTTPS CDN URLs.",
      });
    }

    // Validate prompt
    if (input.prompt !== undefined) {
      if (!isValidPrompt(input.prompt)) {
        errors.push({
          field: "prompt",
          message: "Prompt must be a non-empty string (max 5000 characters)",
        });
      } else if (typeof input.prompt === "string" && hasSuspiciousContent(input.prompt)) {
        errors.push({
          field: "prompt",
          message: "Prompt contains potentially unsafe content",
        });
      }
    }

    // Validate negative_prompt
    if (input.negative_prompt !== undefined) {
      if (!isValidPrompt(input.negative_prompt)) {
        errors.push({
          field: "negative_prompt",
          message: "Negative prompt must be a non-empty string (max 5000 characters)",
        });
      } else if (typeof input.negative_prompt === "string" && hasSuspiciousContent(input.negative_prompt)) {
        errors.push({
          field: "negative_prompt",
          message: "Negative prompt contains potentially unsafe content",
        });
      }
    }

    // Validate all image_url fields
    for (const field of IMAGE_URL_FIELDS) {
      const value = input[field];
      if (value !== undefined) {
        if (typeof value !== "string") {
          errors.push({
            field,
            message: `${field} must be a string`,
          });
        } else if (!isNonEmptyString(value)) {
          errors.push({
            field,
            message: `${field} cannot be empty`,
          });
        } else if (!isValidAndSafeUrl(value)) {
          errors.push({
            field,
            message: `${field} must be a valid URL or image data URI`,
          });
        }
      }
    }

    if (errors.length > 0) {
      throw new InputValidationError(errors);
    }
  }
}
