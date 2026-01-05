/**
 * Services Index
 */

import { FAL_IMAGE_FEATURE_MODELS, FAL_VIDEO_FEATURE_MODELS } from "../../domain/constants/feature-models.constants";
import type { ImageFeatureType, VideoFeatureType } from "@umituz/react-native-ai-generation-content";

export { FalProvider, falProvider } from "./fal-provider";
export { falModelsService, type FalModelConfig, type ModelFetcher } from "./fal-models.service";
export { NSFWContentError } from "./nsfw-content-error";

export function getImageFeatureModel(feature: ImageFeatureType): string {
  return FAL_IMAGE_FEATURE_MODELS[feature];
}

export function getVideoFeatureModel(feature: VideoFeatureType): string {
  return FAL_VIDEO_FEATURE_MODELS[feature];
}
