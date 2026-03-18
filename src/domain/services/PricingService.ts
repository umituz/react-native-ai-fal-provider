/**
 * Domain Service: Pricing
 * Pure business logic for credit calculations
 * No infrastructure dependencies
 */

import type { VideoModelConfig } from "@umituz/react-native-ai-generation-content";

/**
 * Pricing constants
 * FAL AI pricing with markup and credit conversion
 */
const COSTS = {
  VIDEO_480P_PER_SECOND: 0.05,
  VIDEO_720P_PER_SECOND: 0.07,
  IMAGE_INPUT: 0.002,
  IMAGE: 0.03,
} as const;

const MARKUP = 3.5;
const CREDIT_PRICE = 0.1;

export type GenerationResolution = "480p" | "720p";

/**
 * Domain service for pricing calculations
 * Single responsibility: calculate credit costs for generations
 */
export class PricingService {
  /**
   * Calculate credits for video generation
   *
   * @param duration - Video duration in seconds
   * @param resolution - Video resolution (480p or 720p)
   * @param hasImageInput - Whether an image input is provided
   * @returns Number of credits required
   */
  static calculateVideoCredits(
    duration: number,
    resolution: GenerationResolution,
    hasImageInput: boolean = false
  ): number {
    const costPerSec =
      resolution === "480p"
        ? COSTS.VIDEO_480P_PER_SECOND
        : COSTS.VIDEO_720P_PER_SECOND;
    let cost = costPerSec * duration;
    if (hasImageInput) cost += COSTS.IMAGE_INPUT;
    return Math.max(1, Math.ceil((cost * MARKUP) / CREDIT_PRICE));
  }

  /**
   * Calculate credits for image generation
   *
   * @returns Number of credits required
   */
  static calculateImageCredits(): number {
    return Math.max(1, Math.ceil((COSTS.IMAGE * MARKUP) / CREDIT_PRICE));
  }

  /**
   * Calculate credits from video model config
   *
   * @param config - Video model configuration with pricing info
   * @param duration - Video duration in seconds
   * @param resolution - Video resolution string
   * @returns Number of credits required
   * @throws Error if config structure is invalid
   */
  static calculateCreditsFromConfig(
    config: VideoModelConfig,
    duration: number,
    resolution: string
  ): number {
    // Validate config structure
    if (
      !config ||
      typeof config !== "object" ||
      !config.pricing ||
      typeof config.pricing !== "object" ||
      !config.pricing.costPerSecond ||
      typeof config.pricing.costPerSecond !== "object"
    ) {
      throw new Error(
        "Invalid VideoModelConfig: pricing structure is missing or invalid"
      );
    }

    const costPerSecondMap = config.pricing.costPerSecond;
    const costPerSec = costPerSecondMap[resolution] ?? 0;

    if (typeof costPerSec !== "number" || costPerSec < 0) {
      throw new Error(
        `Invalid cost per second for resolution "${resolution}": must be a non-negative number`
      );
    }

    const cost = costPerSec * duration;
    return Math.max(1, Math.ceil((cost * MARKUP) / CREDIT_PRICE));
  }
}
