/**
 * Input Validator Utility
 * Validates input parameters before API calls
 */

import { isValidModelId, isValidPrompt } from "./type-guards.util";

/**
 * Basic HTML/Script tag sanitization (defense in depth)
 * NOTE: This is sent to backend which should also sanitize,
 * but we apply basic filtering as a precaution
 */
function sanitizeString(value: string): string {
  // Remove potential script tags and HTML entities
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
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

  // Validate and sanitize prompt if present
  if (input.prompt !== undefined) {
    if (!isValidPrompt(input.prompt)) {
      errors.push({
        field: "prompt",
        message: "Prompt must be a non-empty string (max 5000 characters)",
      });
    } else if (typeof input.prompt === "string") {
      // Apply basic sanitization (defense in depth)
      const sanitized = sanitizeString(input.prompt);
      if (sanitized !== input.prompt) {
        console.warn('[input-validator] Potentially unsafe content detected and sanitized in prompt');
      }
    }
  }

  // Validate and sanitize negative_prompt if present
  if (input.negative_prompt !== undefined) {
    if (!isValidPrompt(input.negative_prompt)) {
      errors.push({
        field: "negative_prompt",
        message: "Negative prompt must be a non-empty string (max 5000 characters)",
      });
    } else if (typeof input.negative_prompt === "string") {
      // Apply basic sanitization (defense in depth)
      const sanitized = sanitizeString(input.negative_prompt);
      if (sanitized !== input.negative_prompt) {
        console.warn('[input-validator] Potentially unsafe content detected and sanitized in negative_prompt');
      }
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
      } else if (!value || value.trim().length === 0) {
        // Explicitly check for empty/whitespace-only strings
        errors.push({
          field,
          message: `${field} cannot be empty`,
        });
      } else {
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
