/**
 * Image-to-Video Models
 */

import type { FalModelConfig } from "../default-models.constants";

export const DEFAULT_IMAGE_TO_VIDEO_MODELS: FalModelConfig[] = [
  {
    id: "fal-ai/kling-video/v1.5/pro/image-to-video",
    name: "Kling I2V",
    type: "image-to-video",
    isDefault: true,
    isActive: true,
    pricing: { freeUserCost: 15, premiumUserCost: 8 },
    description: "High-quality image to video generation",
    order: 1,
  },
];
