/**
 * Image Feature Input Builders
 * Builder functions for specific image features
 */

import type {
  UpscaleOptions,
  PhotoRestoreOptions,
  RemoveBackgroundOptions,
  RemoveObjectOptions,
  ReplaceBackgroundOptions,
  FaceSwapOptions,
} from "../../domain/types";
import { buildSingleImageInput } from "./base-builders.util";
import { formatImageDataUri } from "./image-helpers.util";

export function buildUpscaleInput(
  base64: string,
  options?: UpscaleOptions,
): Record<string, unknown> {
  return buildSingleImageInput(base64, {
    scale: options?.scaleFactor ?? 2,
    face_enhance: options?.enhanceFaces ?? false,
  });
}

export function buildPhotoRestoreInput(
  base64: string,
  options?: PhotoRestoreOptions,
): Record<string, unknown> {
  return buildSingleImageInput(base64, {
    face_enhance: options?.enhanceFaces ?? true,
  });
}

export function buildFaceSwapInput(
  sourceBase64: string,
  targetBase64: string,
  options?: FaceSwapOptions,
): Record<string, unknown> {
  return {
    base_image_url: formatImageDataUri(sourceBase64),
    swap_image_url: formatImageDataUri(targetBase64),
    ...(options?.enhanceFaces !== undefined && { enhance_faces: options.enhanceFaces }),
  };
}

export function buildRemoveBackgroundInput(
  base64: string,
  options?: RemoveBackgroundOptions & {
    model?: string;
    operating_resolution?: string;
    output_format?: string;
    refine_foreground?: boolean;
  },
): Record<string, unknown> {
  return buildSingleImageInput(base64, {
    model: options?.model ?? "General Use (Light)",
    operating_resolution: options?.operating_resolution ?? "1024x1024",
    output_format: options?.output_format ?? "png",
    refine_foreground: options?.refine_foreground ?? true,
  });
}

export function buildRemoveObjectInput(
  base64: string,
  options?: RemoveObjectOptions,
): Record<string, unknown> {
  return buildSingleImageInput(base64, {
    mask_url: options?.mask,
    prompt: options?.prompt || "Remove the object and fill with background",
  });
}

export function buildReplaceBackgroundInput(
  base64: string,
  options: ReplaceBackgroundOptions,
): Record<string, unknown> {
  return buildSingleImageInput(base64, {
    prompt: options.prompt,
  });
}

export function buildHDTouchUpInput(
  base64: string,
  options?: UpscaleOptions,
): Record<string, unknown> {
  return buildUpscaleInput(base64, options);
}

export interface KontextStyleTransferOptions {
  prompt: string;
  guidance_scale?: number;
}

export function buildKontextStyleTransferInput(
  base64: string,
  options: KontextStyleTransferOptions,
): Record<string, unknown> {
  return buildSingleImageInput(base64, {
    prompt: options.prompt,
    guidance_scale: options.guidance_scale ?? 3.5,
  });
}
