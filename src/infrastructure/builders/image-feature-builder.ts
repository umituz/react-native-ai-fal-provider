/**
 * Image Feature Input Builder
 * Builds inputs for image-based AI features
 */

import type {
  ImageFeatureType,
  ImageFeatureInputData,
} from "@umituz/react-native-ai-generation-content";
import { buildSingleImageInput } from "../utils/base-builders.util";
import {
  buildUpscaleInput,
  buildPhotoRestoreInput,
  buildFaceSwapInput,
  buildRemoveBackgroundInput,
  buildRemoveObjectInput,
  buildReplaceBackgroundInput,
  buildKontextStyleTransferInput,
} from "../utils/image-feature-builders.util";

const DEFAULT_ANIME_SELFIE_PROMPT = "Transform this person into anime style illustration. Keep the same gender, face structure, hair color, eye color, and expression. Make it look like a high-quality anime character portrait with vibrant colors and clean lineart.";

export function buildImageFeatureInput(
  feature: ImageFeatureType,
  data: ImageFeatureInputData,
): Record<string, unknown> {
  const { imageBase64, targetImageBase64, prompt, options } = data;

  switch (feature) {
    case "upscale":
    case "hd-touch-up":
      return buildUpscaleInput(imageBase64, options);

    case "photo-restore":
      return buildPhotoRestoreInput(imageBase64, options);

    case "face-swap":
      if (!targetImageBase64) {
        throw new Error("Face swap requires target image");
      }
      return buildFaceSwapInput(imageBase64, targetImageBase64, options);

    case "remove-background":
      return buildRemoveBackgroundInput(imageBase64, options);

    case "remove-object":
      return buildRemoveObjectInput(imageBase64, { prompt, ...options });

    case "replace-background":
      if (!prompt) {
        throw new Error("Replace background requires prompt");
      }
      return buildReplaceBackgroundInput(imageBase64, { prompt, ...options });

    case "anime-selfie":
      return buildKontextStyleTransferInput(imageBase64, {
        prompt: prompt || (options?.prompt as string) || DEFAULT_ANIME_SELFIE_PROMPT,
        guidance_scale: (options?.guidance_scale as number) ?? 4.0,
      });

    default:
      return buildSingleImageInput(imageBase64, options);
  }
}
