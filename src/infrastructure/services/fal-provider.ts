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
  AIJobStatusType,
  SubscribeOptions,
  RunOptions,
  ImageFeatureType,
  VideoFeatureType,
  ImageFeatureInputData,
  VideoFeatureInputData,
  ProviderCapabilities,
} from "@umituz/react-native-ai-generation-content";
import type {
  FalQueueStatus,
  FalLogEntry,
} from "../../domain/entities/fal.types";
import {
  FAL_IMAGE_FEATURE_MODELS,
  FAL_VIDEO_FEATURE_MODELS,
} from "../../domain/constants/feature-models.constants";
import {
  buildUpscaleInput,
  buildPhotoRestoreInput,
  buildVideoFromImageInput,
  buildFaceSwapInput,
  buildAnimeSelfieInput,
  buildRemoveBackgroundInput,
  buildRemoveObjectInput,
  buildReplaceBackgroundInput,
  buildHDTouchUpInput,
} from "../utils/input-builders.util";

declare const __DEV__: boolean;

const DEFAULT_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  defaultTimeoutMs: 300000,
};

/**
 * FAL provider capabilities
 */
const FAL_CAPABILITIES: ProviderCapabilities = {
  imageFeatures: [
    "upscale",
    "photo-restore",
    "face-swap",
    "anime-selfie",
    "remove-background",
    "remove-object",
    "hd-touch-up",
    "replace-background",
  ] as const,
  videoFeatures: ["ai-hug", "ai-kiss"] as const,
  textToImage: true,
  textToVideo: true,
  imageToVideo: true,
  textToVoice: true,
  textToText: true,
};

function mapFalStatusToJobStatus(status: FalQueueStatus): JobStatus {
  const statusMap: Record<string, AIJobStatusType> = {
    IN_QUEUE: "IN_QUEUE",
    IN_PROGRESS: "IN_PROGRESS",
    COMPLETED: "COMPLETED",
    FAILED: "FAILED",
  };

  return {
    status: statusMap[status.status] ?? "IN_PROGRESS",
    logs: status.logs?.map((log: FalLogEntry) => ({
      message: log.message,
      level: log.level ?? "info",
      timestamp: log.timestamp,
    })),
    queuePosition: status.queuePosition,
  };
}

export class FalProvider implements IAIProvider {
  readonly providerId = "fal";
  readonly providerName = "FAL AI";

  private apiKey: string | null = null;
  private config: AIProviderConfig | null = null;
  private initialized = false;

  initialize(config: AIProviderConfig): void {
    this.apiKey = config.apiKey;
    this.config = { ...DEFAULT_CONFIG, ...config };

    fal.config({
      credentials: config.apiKey,
      retry: {
        maxRetries: config.maxRetries ?? DEFAULT_CONFIG.maxRetries,
        baseDelay: config.baseDelay ?? DEFAULT_CONFIG.baseDelay,
        maxDelay: config.maxDelay ?? DEFAULT_CONFIG.maxDelay,
      },
    });

    this.initialized = true;

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
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

  async submitJob(
    model: string,
    input: Record<string, unknown>,
  ): Promise<JobSubmission> {
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

  async getJobResult<T = unknown>(
    model: string,
    requestId: string,
  ): Promise<T> {
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

    const timeoutMs =
      options?.timeoutMs ??
      this.config?.defaultTimeoutMs ??
      DEFAULT_CONFIG.defaultTimeoutMs;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[FalProvider] Subscribe started:", { model, timeoutMs });
    }

    try {
      const result = await Promise.race([
        fal.subscribe(model, {
          input,
          onQueueUpdate: (update) => {
            const jobStatus = mapFalStatusToJobStatus(
              update as unknown as FalQueueStatus,
            );
            options?.onQueueUpdate?.(jobStatus);
          },
        }),
        new Promise<never>((_, reject) => {
          timeoutId = setTimeout(
            () => reject(new Error("FAL subscription timeout")),
            timeoutMs,
          );
        }),
      ]);

      if (typeof __DEV__ !== "undefined" && __DEV__) {
        // eslint-disable-next-line no-console
        console.log("[FalProvider] Subscribe completed:", { model });
      }

      options?.onResult?.(result as T);

      return result as T;
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }

  async run<T = unknown>(
    model: string,
    input: Record<string, unknown>,
    options?: RunOptions,
  ): Promise<T> {
    this.validateInitialization();

    options?.onProgress?.({ progress: 10, status: "IN_PROGRESS" });

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[FalProvider] run() input:", { model, input });
    }

    const result = await fal.run(model, { input });

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log(
        "[FalProvider] run() raw result:",
        JSON.stringify(result, null, 2),
      );
    }

    options?.onProgress?.({ progress: 100, status: "COMPLETED" });

    return result as T;
  }

  reset(): void {
    this.apiKey = null;
    this.config = null;
    this.initialized = false;
  }

  /**
   * Get model ID for an IMAGE feature
   */
  getImageFeatureModel(feature: ImageFeatureType): string {
    return FAL_IMAGE_FEATURE_MODELS[feature];
  }

  /**
   * Build input for an IMAGE feature
   */
  buildImageFeatureInput(
    feature: ImageFeatureType,
    data: ImageFeatureInputData,
  ): Record<string, unknown> {
    const { imageBase64, targetImageBase64, prompt, options } = data;

    switch (feature) {
      case "upscale":
        return buildUpscaleInput(imageBase64, options);
      case "photo-restore":
        return buildPhotoRestoreInput(imageBase64, options);
      case "face-swap":
        if (!targetImageBase64) {
          throw new Error("Face swap requires target image");
        }
        return buildFaceSwapInput(imageBase64, targetImageBase64, options);
      case "anime-selfie":
        return buildAnimeSelfieInput(imageBase64, options);
      case "remove-background":
        return buildRemoveBackgroundInput(imageBase64, options);
      case "remove-object":
        return buildRemoveObjectInput(imageBase64, { prompt, ...options });
      case "hd-touch-up":
        return buildHDTouchUpInput(imageBase64, options);
      case "replace-background":
        if (!prompt) {
          throw new Error("Replace background requires prompt");
        }
        return buildReplaceBackgroundInput(imageBase64, { prompt });
      default:
        throw new Error(`Unknown image feature: ${String(feature)}`);
    }
  }

  /**
   * Get model ID for a VIDEO feature
   */
  getVideoFeatureModel(feature: VideoFeatureType): string {
    return FAL_VIDEO_FEATURE_MODELS[feature];
  }

  /**
   * Build input for a VIDEO feature
   */
  buildVideoFeatureInput(
    feature: VideoFeatureType,
    data: VideoFeatureInputData,
  ): Record<string, unknown> {
    const { sourceImageBase64, targetImageBase64, prompt, options } = data;

    switch (feature) {
      case "ai-hug":
      case "ai-kiss":
        return buildVideoFromImageInput(sourceImageBase64, {
          target_image: targetImageBase64,
          motion_prompt: prompt,
          ...options,
        });
      default:
        throw new Error(`Unknown video feature: ${String(feature)}`);
    }
  }
}

export const falProvider = new FalProvider();
