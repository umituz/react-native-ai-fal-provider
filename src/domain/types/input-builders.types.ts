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
  readonly target_image?: string;
  readonly prompt?: string;
  /** @deprecated Use prompt instead */
  readonly motion_prompt?: string;
  readonly duration?: number;
  /** Vidu Q1: Video aspect ratio - "16:9", "9:16", or "1:1" */
  readonly aspect_ratio?: "16:9" | "9:16" | "1:1";
  /** Vidu Q1: Movement intensity - "auto", "small", "medium", or "large" */
  readonly movement_amplitude?: "auto" | "small" | "medium" | "large";
}

export interface FaceSwapOptions {
  // No additional options
}
