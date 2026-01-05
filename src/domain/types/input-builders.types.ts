/**
 * FAL Input Builder Types
 */

export interface UpscaleOptions {
  scaleFactor?: number;
  enhanceFaces?: boolean;
}

export interface PhotoRestoreOptions {
  enhanceFaces?: boolean;
}

export interface ImageToImagePromptConfig {
  prompt: string;
  negativePrompt: string;
  strength?: number;
  guidance_scale?: number;
  num_inference_steps?: number;
}

export interface RemoveBackgroundOptions {
  // No additional options
}

export interface RemoveObjectOptions {
  mask?: string;
  prompt?: string;
}

export interface ReplaceBackgroundOptions {
  prompt: string;
}

export interface VideoFromImageOptions {
  target_image?: string;
  prompt?: string;
  /** @deprecated Use prompt instead */
  motion_prompt?: string;
  duration?: number;
  /** Vidu Q1: Video aspect ratio - "16:9", "9:16", or "1:1" */
  aspect_ratio?: "16:9" | "9:16" | "1:1";
  /** Vidu Q1: Movement intensity - "auto", "small", "medium", or "large" */
  movement_amplitude?: "auto" | "small" | "medium" | "large";
}

export interface FaceSwapOptions {
  // No additional options
}
