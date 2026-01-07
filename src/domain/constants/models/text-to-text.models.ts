/**
 * Text-to-Text Models
 */

import type { FalModelConfig } from "../default-models.constants";

export const DEFAULT_TEXT_TO_TEXT_MODELS: FalModelConfig[] = [
  {
    id: "fal-ai/llama-3-8b-instruct",
    name: "Llama 3 8B Instruct",
    type: "text-to-text",
    isDefault: true,
    isActive: true,
    pricing: { freeUserCost: 0.1, premiumUserCost: 0.05 },
    description: "Fast and reliable text generation",
    order: 1,
  },
];
