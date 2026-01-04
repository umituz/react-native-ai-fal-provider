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
import type { FalQueueStatus, FalLogEntry } from "../../domain/entities/fal.types";
import {
  getImageFeatureModel,
  getVideoFeatureModel,
  buildImageFeatureInput,
  buildVideoFeatureInput,
} from "./fal-feature-builder.service";

declare const __DEV__: boolean;

const DEFAULT_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  defaultTimeoutMs: 300000,
  pollInterval: 1000,
};

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

    const timeoutMs = options?.timeoutMs ?? this.config?.defaultTimeoutMs ?? DEFAULT_CONFIG.defaultTimeoutMs;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log("[FalProvider] Subscribe started:", { model, timeoutMs });
    }

    try {
      const result = await Promise.race([
        fal.subscribe(model, {
          input,
          logs: true,
          pollInterval: DEFAULT_CONFIG.pollInterval,
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
      console.log("[FalProvider] run() completed, hasResult:", !!result);
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
    return getImageFeatureModel(feature);
  }

  buildImageFeatureInput(feature: ImageFeatureType, data: ImageFeatureInputData): Record<string, unknown> {
    return buildImageFeatureInput(feature, data);
  }

  getVideoFeatureModel(feature: VideoFeatureType): string {
    return getVideoFeatureModel(feature);
  }

  buildVideoFeatureInput(feature: VideoFeatureType, data: VideoFeatureInputData): Record<string, unknown> {
    return buildVideoFeatureInput(feature, data);
  }
}

export const falProvider = new FalProvider();
