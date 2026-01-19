/**
 * FAL Feature Models Catalog
 * Default model IDs for image processing features
 * Video models are provided by the app via config
 */

import type { ImageFeatureType } from "@umituz/react-native-ai-generation-content";

/**
 * FAL model IDs for IMAGE processing features
 */
export const FAL_IMAGE_FEATURE_MODELS: Record<ImageFeatureType, string> = {
  "upscale": "fal-ai/clarity-upscaler",
  "photo-restore": "fal-ai/aura-sr",
  "face-swap": "fal-ai/face-swap",
  "anime-selfie": "fal-ai/flux-pro/kontext",
  "remove-background": "fal-ai/birefnet",
  "remove-object": "fal-ai/fooocus/inpaint",
  "hd-touch-up": "fal-ai/clarity-upscaler",
  "replace-background": "fal-ai/bria/background/replace",
} as const;
