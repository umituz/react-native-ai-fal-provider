/**
 * Text-to-Video Models
 */

import type { FalModelConfig } from "../default-models.constants";

export const DEFAULT_TEXT_TO_VIDEO_MODELS: FalModelConfig[] = [
  {
    id: "fal-ai/hunyuan-video/1",
    name: "Hunyuan",
    type: "text-to-video",
    isDefault: true,
    isActive: true,
    pricing: { freeUserCost: 10, premiumUserCost: 5 },
    description: "High-quality video generation",
    order: 1,
  },
  {
    id: "fal-ai/minimax-video",
    name: "MiniMax",
    type: "text-to-video",
    isDefault: false,
    isActive: true,
    pricing: { freeUserCost: 15, premiumUserCost: 8 },
    description: "Advanced video generation with better dynamics",
    order: 2,
  },
  {
    id: "fal-ai/kling-video/v1.5/pro/text-to-video",
    name: "Kling 1.5",
    type: "text-to-video",
    isDefault: false,
    isActive: true,
    pricing: { freeUserCost: 20, premiumUserCost: 10 },
    description: "Professional video generation",
    order: 3,
  },
  {
    id: "fal-ai/mochi-v1",
    name: "Mochi",
    type: "text-to-video",
    isDefault: false,
    isActive: true,
    pricing: { freeUserCost: 8, premiumUserCost: 4 },
    description: "Fast video generation",
    order: 4,
  },
];
