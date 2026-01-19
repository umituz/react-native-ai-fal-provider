/**
 * FAL Input Builder Types
 */

export interface UpscaleOptions {
  readonly scaleFactor?: number;
  readonly enhanceFaces?: boolean;
}

export interface PhotoRestoreOptions {
  readonly enhanceFaces?: boolean;
}

export interface ImageToImagePromptConfig {
  readonly prompt: string;
  readonly negativePrompt: string;
  readonly strength?: number;
  readonly guidance_scale?: number;
  readonly num_inference_steps?: number;
}

export interface RemoveBackgroundOptions {
  // No additional options
}

export interface RemoveObjectOptions {
  readonly mask?: string;
  readonly prompt?: string;
}

export interface ReplaceBackgroundOptions {
  readonly prompt: string;
}

export interface VideoFromImageOptions {
  readonly prompt?: string;
  /** @deprecated Use prompt instead */
  readonly motion_prompt?: string;
  /** Video duration in seconds (model-specific, e.g., 4, 8, 12 for Sora 2) */
  readonly duration?: number;
  /** Video resolution */
  readonly resolution?: string;
}

export interface FaceSwapOptions {
  // No additional options
}
