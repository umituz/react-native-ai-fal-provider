/**
 * NSFW Content Validator
 * Validates AI-generated content for NSFW material
 */

import { NSFWContentError } from "../services/nsfw-content-error";

declare const __DEV__: boolean;

export function validateNSFWContent(result: Record<string, unknown>): void {
  const nsfwConcepts = result?.has_nsfw_concepts as boolean[] | undefined;

  if (nsfwConcepts && Array.isArray(nsfwConcepts)) {
    const hasNSFW = nsfwConcepts.some((value) => value === true);

    if (hasNSFW) {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.log("[FalProvider] NSFW content detected, rejecting result");
      }
      throw new NSFWContentError();
    }
  }
}
