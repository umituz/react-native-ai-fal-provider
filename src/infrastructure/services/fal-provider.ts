/**
 * FAL Provider
 * Implements IAIProvider interface for unified AI generation
 */

import { fal } from "@fal-ai/client";
import type {
  IAIProvider,
  AIProviderConfig,
  JobSubmission,
  JobStatus,
  SubscribeOptions,
  RunOptions,
  ImageFeatureType,
  VideoFeatureType,
  ImageFeatureInputData,
  VideoFeatureInputData,
  ProviderCapabilities,
} from "@umituz/react-native-ai-generation-content";
import type { FalQueueStatus } from "../../domain/entities/fal.types";
import { DEFAULT_FAL_CONFIG, FAL_CAPABILITIES } from "./fal-provider.constants";
import { mapFalStatusToJobStatus } from "./fal-status-mapper";
import { FAL_IMAGE_FEATURE_MODELS, FAL_VIDEO_FEATURE_MODELS } from "../../domain/constants/feature-models.constants";
import {
  buildSingleImageInput,
  buildUpscaleInput,
  buildPhotoRestoreInput,
  buildFaceSwapInput,
  buildRemoveBackgroundInput,
  buildRemoveObjectInput,
  buildReplaceBackgroundInput,
  buildImageToImageInput,
  buildVideoFromImageInput,
} from "../utils/input-builders.util";

declare const __DEV__: boolean;

export class FalProvider implements IAIProvider {
  readonly providerId = "fal";
  readonly providerName = "FAL AI";

  private apiKey: string | null = null;
  private config: AIProviderConfig | null = null;
  private initialized = false;

  initialize(configData: AIProviderConfig): void {
    this.apiKey = configData.apiKey;
    this.config = { ...DEFAULT_FAL_CONFIG, ...configData };

    fal.config({
      credentials: configData.apiKey,
      retry: {
        maxRetries: configData.maxRetries ?? DEFAULT_FAL_CONFIG.maxRetries,
        baseDelay: configData.baseDelay ?? DEFAULT_FAL_CONFIG.baseDelay,
        maxDelay: configData.maxDelay ?? DEFAULT_FAL_CONFIG.maxDelay,
      },
    });

    this.initialized = true;

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log("[FalProvider] Initialized");
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  getCapabilities(): ProviderCapabilities {
    return FAL_CAPABILITIES;
  }

  isFeatureSupported(feature: ImageFeatureType | VideoFeatureType): boolean {
    const capabilities = this.getCapabilities();
    return (
      capabilities.imageFeatures.includes(feature as ImageFeatureType) ||
      capabilities.videoFeatures.includes(feature as VideoFeatureType)
    );
  }

  private validateInitialization(): void {
    if (!this.apiKey || !this.initialized) {
      throw new Error("FAL provider not initialized. Call initialize() first.");
    }
  }

  async submitJob(model: string, input: Record<string, unknown>): Promise<JobSubmission> {
    this.validateInitialization();
    const result = await fal.queue.submit(model, { input });
    return {
      requestId: result.request_id,
      statusUrl: result.status_url,
      responseUrl: result.response_url,
    };
  }

  async getJobStatus(model: string, requestId: string): Promise<JobStatus> {
    this.validateInitialization();
    const status = await fal.queue.status(model, { requestId, logs: true });
    return mapFalStatusToJobStatus(status as unknown as FalQueueStatus);
  }

  async getJobResult<T = unknown>(model: string, requestId: string): Promise<T> {
    this.validateInitialization();
    const result = await fal.queue.result(model, { requestId });
    return result.data as T;
  }

  async subscribe<T = unknown>(
    model: string,
    input: Record<string, unknown>,
    options?: SubscribeOptions<T>,
  ): Promise<T> {
    this.validateInitialization();
    const timeoutMs = options?.timeoutMs ?? this.config?.defaultTimeoutMs ?? DEFAULT_FAL_CONFIG.defaultTimeoutMs;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log("[FalProvider] Subscribe started:", { model, timeoutMs });
    }

    try {
      const result = await Promise.race([
        fal.subscribe(model, {
          input,
          logs: true,
          pollInterval: DEFAULT_FAL_CONFIG.pollInterval,
          onQueueUpdate: (update: { status: string; logs?: unknown[] }) => {
            if (typeof __DEV__ !== "undefined" && __DEV__) {
              console.log("[FalProvider] Queue update:", JSON.stringify(update));
            }
            const jobStatus = mapFalStatusToJobStatus(update as unknown as FalQueueStatus);
            options?.onQueueUpdate?.(jobStatus);
          },
        }),
        new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error("FAL subscription timeout")), timeoutMs);
        }),
      ]);

      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.log("[FalProvider] Subscribe completed:", { model });
      }

      options?.onResult?.(result as T);
      return result as T;
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }

  async run<T = unknown>(model: string, input: Record<string, unknown>, options?: RunOptions): Promise<T> {
    this.validateInitialization();
    options?.onProgress?.({ progress: 10, status: "IN_PROGRESS" });

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log("[FalProvider] run() model:", model, "inputKeys:", Object.keys(input));
    }

    const result = await fal.run(model, { input });

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log("[FalProvider] run() raw result:", JSON.stringify(result, null, 2));
      console.log("[FalProvider] run() result type:", typeof result);
      console.log("[FalProvider] run() result keys:", result ? Object.keys(result as object) : "null");
      const r = result as Record<string, unknown>;
      if (r?.data) {
        console.log("[FalProvider] run() has data property, data keys:", Object.keys(r.data as object));
      }
      if (r?.images) {
        console.log("[FalProvider] run() has images property, images:", JSON.stringify(r.images));
      }
    }

    options?.onProgress?.({ progress: 100, status: "COMPLETED" });
    return result as T;
  }

  reset(): void {
    this.apiKey = null;
    this.config = null;
    this.initialized = false;
  }

  getImageFeatureModel(feature: ImageFeatureType): string {
    return FAL_IMAGE_FEATURE_MODELS[feature];
  }

  buildImageFeatureInput(feature: ImageFeatureType, data: ImageFeatureInputData): Record<string, unknown> {
    const { imageBase64, targetImageBase64, prompt, options } = data;

    switch (feature) {
      case "upscale":
      case "hd-touch-up":
        return buildUpscaleInput(imageBase64, options);

      case "photo-restore":
        return buildPhotoRestoreInput(imageBase64, options);

      case "face-swap":
        if (!targetImageBase64) throw new Error("Face swap requires target image");
        return buildFaceSwapInput(imageBase64, targetImageBase64, options);

      case "remove-background":
        return buildRemoveBackgroundInput(imageBase64, options);

      case "remove-object":
        return buildRemoveObjectInput(imageBase64, options);

      case "replace-background":
        if (!prompt) throw new Error("Replace background requires prompt");
        return buildReplaceBackgroundInput(imageBase64, { prompt, ...options });

      case "anime-selfie":
        return buildImageToImageInput(imageBase64, {
          prompt: prompt || (options?.prompt as string) || "",
          negativePrompt: (options?.negativePrompt as string) || "",
          strength: options?.strength as number,
          num_inference_steps: options?.num_inference_steps as number,
          guidance_scale: options?.guidance_scale as number,
        });

      default:
        return buildSingleImageInput(imageBase64, options);
    }
  }

  getVideoFeatureModel(feature: VideoFeatureType): string {
    return FAL_VIDEO_FEATURE_MODELS[feature];
  }

  buildVideoFeatureInput(_feature: VideoFeatureType, data: VideoFeatureInputData): Record<string, unknown> {
    const { sourceImageBase64, targetImageBase64, prompt, options } = data;

    return buildVideoFromImageInput(sourceImageBase64, {
      motion_prompt: prompt,
      target_image: targetImageBase64,
      duration: options?.duration as number,
      ...options,
    });
  }
}

export const falProvider = new FalProvider();
