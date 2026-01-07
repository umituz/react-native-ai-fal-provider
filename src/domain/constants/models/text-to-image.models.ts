/**
 * Text-to-Image Models
 */

import type { FalModelConfig } from "../default-models.constants";

export const DEFAULT_TEXT_TO_IMAGE_MODELS: FalModelConfig[] = [
  {
    id: "fal-ai/flux/schnell",
    name: "Flux Schnell",
    type: "text-to-image",
    isDefault: true,
    isActive: true,
    pricing: { freeUserCost: 1, premiumUserCost: 0.5 },
    description: "Fast and efficient text-to-image generation",
    order: 1,
  },
  {
    id: "fal-ai/flux/dev",
    name: "Flux Dev",
    type: "text-to-image",
    isDefault: false,
    isActive: true,
    pricing: { freeUserCost: 2, premiumUserCost: 1 },
    description: "High-quality text-to-image generation",
    order: 2,
  },
  {
    id: "fal-ai/flux-pro",
    name: "Flux Pro",
    type: "text-to-image",
    isDefault: false,
    isActive: true,
    pricing: { freeUserCost: 3, premiumUserCost: 1.5 },
    description: "Professional-grade text-to-image generation",
    order: 3,
  },
];
