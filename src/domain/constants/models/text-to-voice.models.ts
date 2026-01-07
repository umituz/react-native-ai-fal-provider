/**
 * Text-to-Voice Models
 */

import type { FalModelConfig } from "../default-models.constants";

export const DEFAULT_TEXT_TO_VOICE_MODELS: FalModelConfig[] = [
  {
    id: "fal-ai/playai/tts/v3",
    name: "PlayAI TTS v3",
    type: "text-to-voice",
    isDefault: true,
    isActive: true,
    pricing: { freeUserCost: 1, premiumUserCost: 0.5 },
    description: "High-quality text-to-speech synthesis",
    order: 1,
  },
  {
    id: "fal-ai/eleven-labs/tts",
    name: "ElevenLabs TTS",
    type: "text-to-voice",
    isDefault: false,
    isActive: true,
    pricing: { freeUserCost: 2, premiumUserCost: 1 },
    description: "Premium voice synthesis with multiple voice options",
    order: 2,
  },
];
