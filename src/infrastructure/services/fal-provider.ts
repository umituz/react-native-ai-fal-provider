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
import type { CostTrackerConfig } from "../../domain/entities/cost-tracking.types";
import { DEFAULT_FAL_CONFIG, FAL_CAPABILITIES } from "./fal-provider.constants";
import { mapFalStatusToJobStatus } from "./fal-status-mapper";
import {
  FAL_IMAGE_FEATURE_MODELS,
  FAL_VIDEO_FEATURE_MODELS,
} from "../../domain/constants/feature-models.constants";
import {
  buildImageFeatureInput as buildImageFeatureInputImpl,
  buildVideoFeatureInput as buildVideoFeatureInputImpl,
} from "../builders";
import {
  handleFalSubscription,
  handleFalRun,
} from "./fal-provider-subscription";
import { CostTracker } from "../utils/cost-tracker";

declare const __DEV__: boolean | undefined;

export class FalProvider implements IAIProvider {
  readonly providerId = "fal";
  readonly providerName = "FAL AI";

  private apiKey: string | null = null;
  private initialized = false;
  private currentAbortController: AbortController | null = null;
  private costTracker: CostTracker | null = null;

  initialize(configData: AIProviderConfig): void {
    this.apiKey = configData.apiKey;

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

  /**
   * Enable cost tracking
   */
  enableCostTracking(config?: CostTrackerConfig): void {
    this.costTracker = new CostTracker(config);
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log("[FalProvider] Cost tracking enabled");
    }
  }

  /**
   * Disable cost tracking
   */
  disableCostTracking(): void {
    this.costTracker = null;
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log("[FalProvider] Cost tracking disabled");
    }
  }

  /**
   * Check if cost tracking is enabled
   */
  isCostTrackingEnabled(): boolean {
    return this.costTracker !== null;
  }

  /**
   * Get cost tracker instance
   */
  getCostTracker(): CostTracker | null {
    return this.costTracker;
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
    this.cancelCurrentRequest();
    this.currentAbortController = new AbortController();

    const operationId = this.costTracker?.startOperation(model, "subscribe");

    const { result, requestId } = await handleFalSubscription<T>(
      model,
      input,
      options,
      this.currentAbortController.signal,
    );

    if (operationId && this.costTracker) {
      this.costTracker.completeOperation(
        operationId,
        model,
        "subscribe",
        requestId ?? undefined,
      );
    }

    return result;
  }

  async run<T = unknown>(
    model: string,
    input: Record<string, unknown>,
    options?: RunOptions,
  ): Promise<T> {
    this.validateInitialization();

    const operationId = this.costTracker?.startOperation(model, "run");

    const result = await handleFalRun<T>(model, input, options);

    if (operationId && this.costTracker) {
      this.costTracker.completeOperation(operationId, model, "run");
    }

    return result;
  }

  reset(): void {
    this.cancelCurrentRequest();
    this.apiKey = null;
    this.initialized = false;
  }

  cancelCurrentRequest(): void {
    if (this.currentAbortController) {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.log("[FalProvider] Cancelling current request");
      }
      this.currentAbortController.abort();
      this.currentAbortController = null;
    }
  }

  hasRunningRequest(): boolean {
    return this.currentAbortController !== null;
  }

  getImageFeatureModel(feature: ImageFeatureType): string {
    return FAL_IMAGE_FEATURE_MODELS[feature];
  }

  buildImageFeatureInput(
    feature: ImageFeatureType,
    data: ImageFeatureInputData,
  ): Record<string, unknown> {
    return buildImageFeatureInputImpl(feature, data);
  }

  getVideoFeatureModel(feature: VideoFeatureType): string {
    return FAL_VIDEO_FEATURE_MODELS[feature];
  }

  buildVideoFeatureInput(
    feature: VideoFeatureType,
    data: VideoFeatureInputData,
  ): Record<string, unknown> {
    return buildVideoFeatureInputImpl(feature, data);
  }
}

export const falProvider = new FalProvider();
