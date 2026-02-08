/**
 * Input Validator Utility
 * Validates input parameters before API calls
 */

import { isValidModelId, isValidPrompt } from "./type-guards.util";

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
 * Validate model and input parameters
 */
export function validateInput(
  model: string,
  input: Record<string, unknown>
): void {
  const errors: ValidationError[] = [];

  // Validate model ID
  if (!model || typeof model !== "string") {
    errors.push({ field: "model", message: "Model ID is required and must be a string" });
  } else if (!isValidModelId(model)) {
    errors.push({ field: "model", message: `Invalid model ID format: ${model}` });
  }

  // Validate input is not empty
  if (!input || typeof input !== "object" || Object.keys(input).length === 0) {
    errors.push({ field: "input", message: "Input must be a non-empty object" });
  }

  // Validate prompt if present
  if (input.prompt !== undefined) {
    if (!isValidPrompt(input.prompt)) {
      errors.push({
        field: "prompt",
        message: "Prompt must be a non-empty string (max 5000 characters)",
      });
    }
  }

  // Validate negative_prompt if present
  if (input.negative_prompt !== undefined) {
    if (!isValidPrompt(input.negative_prompt)) {
      errors.push({
        field: "negative_prompt",
        message: "Negative prompt must be a non-empty string (max 5000 characters)",
      });
    }
  }

  // Validate image_url fields if present
  const imageFields = [
    "image_url",
    "second_image_url",
    "base_image_url",
    "swap_image_url",
    "mask_url",
  ];

  for (const field of imageFields) {
    const value = input[field];
    if (value !== undefined) {
      if (typeof value !== "string") {
        errors.push({
          field,
          message: `${field} must be a string`,
        });
      } else if (value.length > 0) {
        const isValidUrl = value.startsWith('http://') || value.startsWith('https://');
        const isValidBase64 = value.startsWith('data:image/');
        if (!isValidUrl && !isValidBase64) {
          errors.push({
            field,
            message: `${field} must be a valid URL or base64 data URI`,
          });
        }
      }
    }
  }

  if (errors.length > 0) {
    throw new InputValidationError(errors);
  }
}
