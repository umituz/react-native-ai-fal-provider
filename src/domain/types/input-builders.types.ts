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
  /** Video duration in seconds (5 or 10 for Wan 2.5) */
  readonly duration?: 5 | 10;
  /** Video resolution (480p, 720p, or 1080p) */
  readonly resolution?: "480p" | "720p" | "1080p";
}

export interface FaceSwapOptions {
  // No additional options
}
