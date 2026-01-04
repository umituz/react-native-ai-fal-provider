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
  motion_prompt?: string;
  duration?: number;
}

export interface FaceSwapOptions {
  // No additional options
}
