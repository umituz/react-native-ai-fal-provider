/**
 * Shared Validation Utilities
 * Consolidated validators for strings, data URIs, and business rules
 *
 * This file consolidates functionality from:
 * - data-uri-validator.util.ts
 * - string-validator.util.ts
 * - validation-guards.util.ts
 */

// ─── Constants ────────────────────────────────────────────────────────────────

const MIN_BASE64_IMAGE_LENGTH = 100;
const MIN_MODEL_ID_LENGTH = 3;
const MAX_PROMPT_LENGTH = 5000;
const MAX_TIMEOUT_MS = 300000; // 5 minutes
const MAX_RETRY_COUNT = 5;

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

const MODEL_ID_PATTERN = /^[a-zA-Z0-9-_]+\/[a-zA-Z0-9-_.]+(\/[a-zA-Z0-9-_.]+)*$/;

// ─── String Validators ─────────────────────────────────────────────────────────

/**
 * Check if string is empty or whitespace-only
 *
 * @param value - Value to check
 * @returns True if the value is an empty string or contains only whitespace
 */
export function isEmptyString(value: unknown): boolean {
  return typeof value === "string" && value.trim().length === 0;
}

/**
 * Check if value is a non-empty string
 * Type guard version for better TypeScript inference
 *
 * @param value - Value to check
 * @returns Type guard indicating if the value is a non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Check if value is a string (empty or non-empty)
 * Basic type guard for string validation
 *
 * @param value - Value to check
 * @returns Type guard indicating if the value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === "string";
}

/**
 * Check if string contains suspicious content
 *
 * @param value - String to check
 * @returns True if suspicious patterns are found
 */
function hasSuspiciousContent(value: string): boolean {
  return SUSPICIOUS_PATTERNS.some((pattern) => pattern.test(value));
}

// ─── Data URI Validators ──────────────────────────────────────────────────────

/**
 * Check if value is a data URI (any type)
 *
 * @param value - Value to check
 * @returns Type guard indicating if the value is a data URI string
 */
export function isDataUri(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("data:");
}

/**
 * Check if value is an image data URI
 *
 * @param value - Value to check
 * @returns Type guard indicating if the value is an image data URI string
 */
export function isImageDataUri(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("data:image/");
}

/**
 * Check if value is a base64-encoded data URI
 *
 * @param value - Value to check
 * @returns Type guard indicating if the value contains base64 encoding
 */
export function isBase64DataUri(value: unknown): value is string {
  return isDataUri(value) && typeof value === "string" && value.includes("base64,");
}

/**
 * Extract MIME type from data URI
 *
 * @param dataUri - Data URI string
 * @returns MIME type or null if not found
 */
export function extractMimeType(dataUri: string): string | null {
  const match = dataUri.match(/^data:([^;,]+)/);
  return match ? match[1] : null;
}

/**
 * Extract base64 content from data URI
 *
 * @param dataUri - Data URI string
 * @returns Base64 content or null if not base64-encoded
 */
export function extractBase64Content(dataUri: string): string | null {
  const parts = dataUri.split("base64,");
  return parts.length === 2 ? parts[1] : null;
}

// ─── Business Validators ───────────────────────────────────────────────────────

/**
 * Validate base64 image string
 *
 * @param value - Value to validate
 * @returns True if value is a valid base64 image
 */
export function isValidBase64Image(value: unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }

  // Check data URI prefix
  if (value.startsWith("data:image/")) {
    const parts = value.split("base64,");
    if (parts.length < 2) return false;
    const base64Part = parts[1];
    if (!base64Part) return false;
    return base64Part.length >= MIN_BASE64_IMAGE_LENGTH;
  }

  // Check if it's a valid base64 string with minimum length
  const base64Pattern = /^[A-Za-z0-9+/]+=*$/;
  return base64Pattern.test(value) && value.length >= MIN_BASE64_IMAGE_LENGTH;
}

/**
 * Validate API key format
 *
 * @param value - Value to validate
 * @returns True if value is a valid API key
 */
export function isValidApiKey(value: unknown): boolean {
  return typeof value === "string" && value.length > 0;
}

/**
 * Validate model ID format
 * Pattern: org/model or org/model/sub1/sub2/... (multiple path segments)
 * Allows dots for versions (e.g., v1.5) but prevents path traversal (..)
 *
 * @param value - Value to validate
 * @returns True if value is a valid model ID
 */
export function isValidModelId(value: unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }

  // Prevent path traversal attacks
  if (value.includes("..")) {
    return false;
  }

  // Ensure it doesn't start or end with dots
  if (value.startsWith(".") || value.endsWith(".")) {
    return false;
  }

  return (
    MODEL_ID_PATTERN.test(value) && value.length >= MIN_MODEL_ID_LENGTH
  );
}

/**
 * Validate prompt string
 *
 * @param value - Value to validate
 * @returns True if value is a valid prompt
 */
export function isValidPrompt(value: unknown): boolean {
  if (!isNonEmptyString(value)) return false;
  return value.length <= MAX_PROMPT_LENGTH && !hasSuspiciousContent(value);
}

/**
 * Validate timeout value
 *
 * @param value - Value to validate
 * @returns True if value is a valid timeout
 */
export function isValidTimeout(value: unknown): boolean {
  return (
    typeof value === "number" &&
    !isNaN(value) &&
    isFinite(value) &&
    value > 0 &&
    value <= MAX_TIMEOUT_MS
  );
}

/**
 * Validate retry count
 *
 * @param value - Value to validate
 * @returns True if value is a valid retry count
 */
export function isValidRetryCount(value: unknown): boolean {
  return (
    typeof value === "number" &&
    !isNaN(value) &&
    isFinite(value) &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= MAX_RETRY_COUNT
  );
}

/**
 * Validate URL format and protocol
 * Rejects malicious URLs and unsafe protocols
 *
 * @param value - URL string to validate
 * @returns True if URL is valid and safe
 */
export function isValidAndSafeUrl(value: string): boolean {
  // Allow http/https URLs
  if (value.startsWith("http://") || value.startsWith("https://")) {
    try {
      const url = new URL(value);
      // Reject URLs with @ (potential auth bypass)
      if (url.href.includes("@") && url.username) {
        return false;
      }
      // Ensure domain exists
      if (!url.hostname || url.hostname.length === 0) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  // Allow local file URIs
  if (value.startsWith("file://") || value.startsWith("content://")) {
    return true;
  }

  // Allow base64 image data URIs only
  if (isImageDataUri(value)) {
    // Check for suspicious content in data URI
    const dataContent = value.substring(0, 200);
    if (hasSuspiciousContent(dataContent)) {
      return false;
    }
    return true;
  }

  return false;
}
