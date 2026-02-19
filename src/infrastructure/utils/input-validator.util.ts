/**
 * Input Validator Utility
 * Validates input parameters before API calls
 */

import { isValidPrompt } from "./type-guards";
import { IMAGE_URL_FIELDS } from './constants/image-fields.constants';
import { isImageDataUri } from './validators/data-uri-validator.util';
import { isNonEmptyString } from './validators/string-validator.util';

/**
 * Detect potentially malicious content in strings
 * Returns true if suspicious patterns are found
 */
function hasSuspiciousContent(value: string): boolean {
  const suspiciousPatterns = [
    /<script/i,                    // Script tags
    /javascript:/i,                // javascript: protocol
    /on\w+\s*=/i,                  // Event handlers (onclick=, onerror=, etc.)
    /<iframe/i,                    // iframes
    /<embed/i,                     // embed tags
    /<object/i,                    // object tags
    /data:(?!image\/)/i,          // data URLs that aren't images
    /vbscript:/i,                  // vbscript protocol
  ];

  return suspiciousPatterns.some(pattern => pattern.test(value));
}

/**
 * Validate URL format and protocol
 * Rejects malicious URLs and unsafe protocols
 */
function isValidAndSafeUrl(value: string): boolean {
  // Allow http/https URLs
  if (value.startsWith('http://') || value.startsWith('https://')) {
    try {
      const url = new URL(value);
      // Reject URLs with @ (potential auth bypass: http://attacker.com@internal.server/)
      const urlAny = url as unknown as { hostname: string; username: string };
      if (url.href.includes('@') && urlAny.username) {
        return false;
      }
      // Ensure domain exists
      if (!urlAny.hostname || urlAny.hostname.length === 0) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  // Allow local file URIs (file://, content://) — preprocessInput uploads them to FAL storage
  if (value.startsWith('file://') || value.startsWith('content://')) {
    return true;
  }

  // Allow base64 image data URIs only
  if (isImageDataUri(value)) {
    // Check for suspicious content in data URI
    const dataContent = value.substring(0, 200); // Check first 200 chars
    if (hasSuspiciousContent(dataContent)) {
      return false;
    }
    return true;
  }

  return false;
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
  _model: string,
  input: Record<string, unknown>
): void {
  const errors: ValidationError[] = [];

  // Validate input is not empty
  if (!input || typeof input !== "object" || Object.keys(input).length === 0) {
    errors.push({ field: "input", message: "Input must be a non-empty object" });
  }

  // BLOCK sync_mode:true — it causes FAL to return base64 data URIs instead of CDN URLs
  if (input.sync_mode === true) {
    errors.push({
      field: "sync_mode",
      message: "sync_mode:true is forbidden. It returns base64 data URIs instead of HTTPS CDN URLs, which breaks Firestore persistence (2048 char limit). Use falProvider.subscribe() for CDN URLs.",
    });
  }

  // Validate and check prompt for malicious content
  if (input.prompt !== undefined) {
    if (!isValidPrompt(input.prompt)) {
      errors.push({
        field: "prompt",
        message: "Prompt must be a non-empty string (max 5000 characters)",
      });
    } else if (typeof input.prompt === "string") {
      // Check for suspicious content (defense in depth)
      if (hasSuspiciousContent(input.prompt)) {
        errors.push({
          field: "prompt",
          message: "Prompt contains potentially unsafe content (script tags, event handlers, or suspicious protocols)",
        });
      }
    }
  }

  // Validate and check negative_prompt for malicious content
  if (input.negative_prompt !== undefined) {
    if (!isValidPrompt(input.negative_prompt)) {
      errors.push({
        field: "negative_prompt",
        message: "Negative prompt must be a non-empty string (max 5000 characters)",
      });
    } else if (typeof input.negative_prompt === "string") {
      // Check for suspicious content (defense in depth)
      if (hasSuspiciousContent(input.negative_prompt)) {
        errors.push({
          field: "negative_prompt",
          message: "Negative prompt contains potentially unsafe content (script tags, event handlers, or suspicious protocols)",
        });
      }
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
        // Explicitly check for empty/whitespace-only strings
        errors.push({
          field,
          message: `${field} cannot be empty`,
        });
      } else if (!isValidAndSafeUrl(value)) {
        errors.push({
          field,
          message: `${field} must be a valid and safe URL (http/https) or image data URI. Suspicious content or unsafe protocols detected.`,
        });
      }
    }
  }

  if (errors.length > 0) {
    throw new InputValidationError(errors);
  }
}
