/**
 * Validation Guards
 * Runtime validation for values and formats
 */

import {
  MIN_BASE64_IMAGE_LENGTH,
  MIN_MODEL_ID_LENGTH,
  MAX_PROMPT_LENGTH,
  MAX_TIMEOUT_MS,
  MAX_RETRY_COUNT,
} from './constants';

/**
 * Validate base64 image string
 */
export function isValidBase64Image(value: unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }

  // Check data URI prefix
  if (value.startsWith("data:image/")) {
    const base64Part = value.split("base64,")[1];
    if (!base64Part) return false;
    return base64Part.length >= MIN_BASE64_IMAGE_LENGTH;
  }

  // Check if it's a valid base64 string with minimum length
  const base64Pattern = /^[A-Za-z0-9+/]+=*$/;
  return base64Pattern.test(value) && value.length >= MIN_BASE64_IMAGE_LENGTH;
}

/**
 * Validate API key format
 */
export function isValidApiKey(value: unknown): boolean {
  return typeof value === "string" && value.length > 0;
}

/**
 * Validate model ID format
 */
const MODEL_ID_PATTERN = /^[a-zA-Z0-9-_]+\/[a-zA-Z0-9-_.]+(\/[a-zA-Z0-9-_.]+)?$/;

export function isValidModelId(value: unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }

  return MODEL_ID_PATTERN.test(value) && value.length >= MIN_MODEL_ID_LENGTH;
}

/**
 * Validate prompt string
 */
export function isValidPrompt(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0 && value.length <= MAX_PROMPT_LENGTH;
}

/**
 * Validate timeout value
 */
export function isValidTimeout(value: unknown): boolean {
  return typeof value === "number" && !isNaN(value) && isFinite(value) && value > 0 && value <= MAX_TIMEOUT_MS;
}

/**
 * Validate retry count
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
