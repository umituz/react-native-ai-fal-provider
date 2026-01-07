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
import { buildImageFeatureInput as buildImageFeatureInputImpl, buildVideoFeatureInput as buildVideoFeatureInputImpl } from "../builders";
import { validateNSFWContent } from "../validators/nsfw-validator";

declare const __DEV__: boolean | undefined;

export class FalProvider implements IAIProvider {
  readonly providerId = "fal";
  readonly providerName = "FAL AI";

  private apiKey: string | null = null;
  private config: AIProviderConfig | null = null;
  private initialized = false;
  private currentAbortController: AbortController | null = null;

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

    // Cancel previous request if exists
    this.cancelCurrentRequest();

    // Create new abort controller
    this.currentAbortController = new AbortController();
    const { signal } = this.currentAbortController;

    const timeoutMs = options?.timeoutMs ?? this.config?.defaultTimeoutMs ?? DEFAULT_FAL_CONFIG.defaultTimeoutMs;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let currentRequestId: string | null = null;

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log("[FalProvider] Subscribe started:", { model, timeoutMs });
    }

    let lastStatus = "";

    try {
      const result = await Promise.race([
        fal.subscribe(model, {
          input,
          logs: false,
          pollInterval: DEFAULT_FAL_CONFIG.pollInterval,
          onQueueUpdate: (update: { status: string; logs?: unknown[]; request_id?: string }) => {
            currentRequestId = update.request_id ?? null;
            const jobStatus = mapFalStatusToJobStatus({
              ...update as unknown as FalQueueStatus,
              requestId: currentRequestId ?? "",
            });
            if (jobStatus.status !== lastStatus) {
              lastStatus = jobStatus.status;
              if (typeof __DEV__ !== "undefined" && __DEV__) {
                console.log("[FalProvider] Status:", jobStatus.status, "RequestId:", currentRequestId);
              }
            }
            options?.onQueueUpdate?.(jobStatus);
          },
        }),
        new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error("FAL subscription timeout"));
          }, timeoutMs);
        }),
        // Abort promise
        new Promise<never>((_, reject) => {
          signal.addEventListener("abort", () => {
            reject(new Error("Request cancelled by user"));
          });
        }),
      ]);

      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.log("[FalProvider] Subscribe completed:", { model, requestId: currentRequestId });
      }

      validateNSFWContent(result as Record<string, unknown>);

      options?.onResult?.(result as T);
      return result as T;
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      this.currentAbortController = null;
    }
  }

  async run<T = unknown>(model: string, input: Record<string, unknown>, options?: RunOptions): Promise<T> {
    this.validateInitialization();
    options?.onProgress?.({ progress: 10, status: "IN_PROGRESS" as const });

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log("[FalProvider] run() model:", model, "inputKeys:", Object.keys(input));
    }

    const result = await fal.run(model, { input });

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log("[FalProvider] run() raw result:", JSON.stringify(result, null, 2));
      console.log("[FalProvider] run() result type:", typeof result);
      console.log("[FalProvider] run() result keys:", result ? Object.keys(result as object) : "null");
    }

    validateNSFWContent(result as Record<string, unknown>);

    options?.onProgress?.({ progress: 100, status: "COMPLETED" as const });
    return result as T;
  }

  reset(): void {
    this.cancelCurrentRequest();
    this.apiKey = null;
    this.config = null;
    this.initialized = false;
  }

  /**
   * Cancel the current running request
   */
  cancelCurrentRequest(): void {
    if (this.currentAbortController) {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.log("[FalProvider] Cancelling current request");
      }
      this.currentAbortController.abort();
      this.currentAbortController = null;
    }
  }

  /**
   * Check if there's a running request
   */
  hasRunningRequest(): boolean {
    return this.currentAbortController !== null;
  }

  getImageFeatureModel(feature: ImageFeatureType): string {
    return FAL_IMAGE_FEATURE_MODELS[feature];
  }

  buildImageFeatureInput(feature: ImageFeatureType, data: ImageFeatureInputData): Record<string, unknown> {
    return buildImageFeatureInputImpl(feature, data);
  }

  getVideoFeatureModel(feature: VideoFeatureType): string {
    return FAL_VIDEO_FEATURE_MODELS[feature];
  }

  buildVideoFeatureInput(feature: VideoFeatureType, data: VideoFeatureInputData): Record<string, unknown> {
    return buildVideoFeatureInputImpl(feature, data);
  }
}

export const falProvider = new FalProvider();