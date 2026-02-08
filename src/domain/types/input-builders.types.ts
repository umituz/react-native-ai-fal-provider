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
  /** Video duration in seconds (model-specific, e.g., 4, 8, 12 for Sora 2) */
  readonly duration?: number;
  /** Video resolution */
  readonly resolution?: string;
}

/**
 * Options for text-to-video generation (no image input)
 */
export interface TextToVideoOptions {
  /** Generation prompt (required) */
  readonly prompt: string;
  /** Video duration in seconds */
  readonly duration?: number;
  /** Aspect ratio (e.g., "16:9", "9:16") */
  readonly aspectRatio?: string;
  /** Video resolution */
  readonly resolution?: string;
}

export interface FaceSwapOptions {
  readonly enhanceFaces?: boolean;
}
