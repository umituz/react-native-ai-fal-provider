/**
 * NSFW Content Validator
 * Validates AI-generated content for NSFW material
 */

import { NSFWContentError } from "../services/nsfw-content-error";

const NSFW_SCORE_THRESHOLD = 0.5;

/**
 * Check if value indicates NSFW content
 */
function isNSFWIndicator(value: unknown): boolean {
  if (typeof value === "boolean") {
    return value === true;
  }
  if (typeof value === "number") {
    return value > 0;
  }
  if (typeof value === "string") {
    const lower = value.toLowerCase();
    return lower === "true" || lower === "yes" || lower === "nsfw";
  }
  return false;
}

/**
 * Validate result for NSFW content across multiple response formats
 */
export function validateNSFWContent(result: Record<string, unknown>): void {
  // Format 1: has_nsfw_concepts array (FAL standard format)
  const nsfwConcepts = result?.has_nsfw_concepts as boolean[] | undefined;
  if (nsfwConcepts && Array.isArray(nsfwConcepts)) {
    const hasNSFW = nsfwConcepts.some((value) => value === true);
    if (hasNSFW) {
      throw new NSFWContentError();
    }
  }

  // Format 2: nsfw_detected boolean
  const nsfwDetected = result?.nsfw_detected;
  if (nsfwDetected !== undefined && isNSFWIndicator(nsfwDetected)) {
    throw new NSFWContentError();
  }

  // Format 3: is_nsfw boolean
  const isNsfw = result?.is_nsfw;
  if (isNsfw !== undefined && isNSFWIndicator(isNsfw)) {
    throw new NSFWContentError();
  }

  // Format 4: nsfw_score number (> 0.5 threshold)
  const nsfwScore = result?.nsfw_score as number | undefined;
  if (typeof nsfwScore === "number" && nsfwScore > NSFW_SCORE_THRESHOLD) {
    throw new NSFWContentError();
  }

  // Format 5: content_policy_violation object
  const policyViolation = result?.content_policy_violation as { type: string; severity?: string } | undefined;
  if (policyViolation && typeof policyViolation === "object") {
    const type = (policyViolation.type || "").toLowerCase();
    if (type.includes("nsfw") || type.includes("adult") || type.includes("explicit")) {
      throw new NSFWContentError();
    }
  }
}
