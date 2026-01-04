/**
 * FAL Feature Models Catalog
 * Provider-specific model IDs for image and video processing features
 */

import type {
  ImageFeatureType,
  VideoFeatureType,
} from "@umituz/react-native-ai-generation-content";

export interface FeatureModelConfig {
  id: string;
  feature: ImageFeatureType | VideoFeatureType;
  description?: string;
}

/**
 * FAL model IDs for IMAGE processing features
 */
export const FAL_IMAGE_FEATURE_MODELS: Record<ImageFeatureType, string> = {
  "upscale": "fal-ai/clarity-upscaler",
  "photo-restore": "fal-ai/aura-sr",
  "face-swap": "fal-ai/face-swap",
  "anime-selfie": "fal-ai/flux/dev/image-to-image",
  "remove-background": "fal-ai/bria/background/remove",
  "remove-object": "fal-ai/flux-kontext-lora/inpaint",
  "hd-touch-up": "fal-ai/clarity-upscaler",
  "replace-background": "fal-ai/bria/background/replace",
};

/**
 * FAL model IDs for VIDEO processing features
 */
export const FAL_VIDEO_FEATURE_MODELS: Record<VideoFeatureType, string> = {
  "ai-hug": "fal-ai/wan-25-preview/image-to-video",
  "ai-kiss": "fal-ai/wan-25-preview/image-to-video",
};

/**
 * Get all feature model configs
 */
export function getAllFeatureModels(): FeatureModelConfig[] {
  const imageModels = Object.entries(FAL_IMAGE_FEATURE_MODELS).map(([feature, id]) => ({
    id,
    feature: feature as ImageFeatureType,
  }));

  const videoModels = Object.entries(FAL_VIDEO_FEATURE_MODELS).map(([feature, id]) => ({
    id,
    feature: feature as VideoFeatureType,
  }));

  return [...imageModels, ...videoModels];
}
