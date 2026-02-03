/**
 * FAL Feature Models - Model resolution and input building
 */

import type {
  ImageFeatureType,
  VideoFeatureType,
  ImageFeatureInputData,
  VideoFeatureInputData,
} from "../../domain/types";
import {
  buildImageFeatureInput as buildImageFeatureInputImpl,
  buildVideoFeatureInput as buildVideoFeatureInputImpl,
} from "../builders";

export function getImageFeatureModel(
  imageFeatureModels: Record<string, string>,
  feature: ImageFeatureType,
): string {
  const model = imageFeatureModels[feature];
  if (!model) throw new Error(`No model for image feature: ${feature}`);
  return model;
}

export function getVideoFeatureModel(
  videoFeatureModels: Record<string, string>,
  feature: VideoFeatureType,
): string {
  const model = videoFeatureModels[feature];
  if (!model) throw new Error(`No model for video feature: ${feature}`);
  return model;
}

export function buildImageFeatureInput(
  feature: ImageFeatureType,
  data: ImageFeatureInputData,
): Record<string, unknown> {
  return buildImageFeatureInputImpl(feature, data);
}

export function buildVideoFeatureInput(
  feature: VideoFeatureType,
  data: VideoFeatureInputData,
): Record<string, unknown> {
  return buildVideoFeatureInputImpl(feature, data);
}
