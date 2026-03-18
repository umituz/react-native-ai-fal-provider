/**
 * FAL AI Pricing Utilities (Infrastructure Layer)
 * Delegates to domain PricingService for credit calculation logic
 *
 * This file now serves as a thin adapter layer for backward compatibility.
 * The actual pricing logic has been moved to the domain layer.
 */

import { PricingService } from "../../../domain/services/PricingService";

// Re-export types for backward compatibility
export type { GenerationResolution } from "../../../domain/services/PricingService";

/**
 * Calculate credits for video generation
 * Delegates to domain PricingService
 */
export function calculateVideoCredits(
  duration: number,
  resolution: "480p" | "720p",
  hasImageInput?: boolean
): number {
  return PricingService.calculateVideoCredits(duration, resolution, hasImageInput);
}

/**
 * Calculate credits for image generation
 * Delegates to domain PricingService
 */
export function calculateImageCredits(): number {
  return PricingService.calculateImageCredits();
}

/**
 * Calculate credits from video model config
 * Delegates to domain PricingService
 */
export function calculateCreditsFromConfig(
  config: import("@umituz/react-native-ai-generation-content").VideoModelConfig,
  duration: number,
  resolution: string
): number {
  return PricingService.calculateCreditsFromConfig(config, duration, resolution);
}
