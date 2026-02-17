import type { VideoModelConfig } from "@umituz/react-native-ai-generation-content";

/**
 * FAL AI Pricing Utilities
 * Single Responsibility: Credit calculations for FAL AI generation
 *
 * Pricing:
 * - 480p video: $0.05/sec
 * - 720p video: $0.07/sec
 * - Image with input: +$0.002
 * - Image generation: $0.03
 * Markup: 3.5x, Credit price: $0.10
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

export function calculateVideoCredits(
  duration: number,
  resolution: GenerationResolution,
  hasImageInput: boolean = false,
): number {
  const costPerSec =
    resolution === "480p"
      ? COSTS.VIDEO_480P_PER_SECOND
      : COSTS.VIDEO_720P_PER_SECOND;
  let cost = costPerSec * duration;
  if (hasImageInput) cost += COSTS.IMAGE_INPUT;
  return Math.ceil((cost * MARKUP) / CREDIT_PRICE);
}

export function calculateImageCredits(): number {
  return Math.ceil((COSTS.IMAGE * MARKUP) / CREDIT_PRICE);
}

export function calculateCreditsFromConfig(
  config: VideoModelConfig,
  duration: number,
  resolution: string,
): number {
  const costPerSec = config.pricing.costPerSecond[resolution] ?? 0;
  const cost = costPerSec * duration;
  return Math.max(1, Math.ceil((cost * MARKUP) / CREDIT_PRICE));
}
