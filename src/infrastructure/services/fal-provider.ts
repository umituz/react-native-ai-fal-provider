/**
 * FAL Provider - Implements IAIProvider interface
 * Orchestrates FAL AI operations with Promise Deduplication
 */

import { fal } from "@fal-ai/client";
import type {
  IAIProvider, AIProviderConfig, JobSubmission, JobStatus, SubscribeOptions,
  RunOptions, ImageFeatureType, VideoFeatureType, ImageFeatureInputData,
  VideoFeatureInputData, ProviderCapabilities,
} from "@umituz/react-native-ai-generation-content";
import type { CostTrackerConfig } from "../../domain/entities/cost-tracking.types";
import { DEFAULT_FAL_CONFIG, FAL_CAPABILITIES } from "./fal-provider.constants";
import { handleFalSubscription, handleFalRun } from "./fal-provider-subscription";
import { CostTracker } from "../utils/cost-tracker";
import {
  createRequestKey, getExistingRequest, storeRequest,
  removeRequest, cancelAllRequests, hasActiveRequests,
} from "./request-store";
import {
  submitJob as submitJobImpl,
  getJobStatus as getJobStatusImpl,
  getJobResult as getJobResultImpl,
} from "./fal-queue-operations";
import {
  getImageFeatureModel as getImageFeatureModelImpl,
  getVideoFeatureModel as getVideoFeatureModelImpl,
  buildImageFeatureInput as buildImageFeatureInputImpl,
  buildVideoFeatureInput as buildVideoFeatureInputImpl,
} from "./fal-feature-models";

declare const __DEV__: boolean | undefined;

export class FalProvider implements IAIProvider {
  readonly providerId = "fal";
  readonly providerName = "FAL AI";

  private apiKey: string | null = null;
  private initialized = false;
  private costTracker: CostTracker | null = null;
  private videoFeatureModels: Record<string, string> = {};
  private imageFeatureModels: Record<string, string> = {};

  initialize(config: AIProviderConfig): void {
    this.apiKey = config.apiKey;
    this.videoFeatureModels = config.videoFeatureModels ?? {};
    this.imageFeatureModels = config.imageFeatureModels ?? {};
    fal.config({
      credentials: config.apiKey,
      retry: {
        maxRetries: config.maxRetries ?? DEFAULT_FAL_CONFIG.maxRetries,
        baseDelay: config.baseDelay ?? DEFAULT_FAL_CONFIG.baseDelay,
        maxDelay: config.maxDelay ?? DEFAULT_FAL_CONFIG.maxDelay,
      },
    });
    this.initialized = true;
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log("[FalProvider] Initialized");
    }
  }

  enableCostTracking(config?: CostTrackerConfig): void {
    this.costTracker = new CostTracker(config);
  }

  disableCostTracking(): void {
    this.costTracker = null;
  }

  isCostTrackingEnabled(): boolean {
    return this.costTracker !== null;
  }

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
    const caps = this.getCapabilities();
    return caps.imageFeatures.includes(feature as ImageFeatureType) ||
           caps.videoFeatures.includes(feature as VideoFeatureType);
  }

  private validateInit(): void {
    if (!this.apiKey || !this.initialized) throw new Error("FAL provider not initialized");
  }

  async submitJob(model: string, input: Record<string, unknown>): Promise<JobSubmission> {
    this.validateInit();
    return submitJobImpl(model, input);
  }

  async getJobStatus(model: string, requestId: string): Promise<JobStatus> {
    this.validateInit();
    return getJobStatusImpl(model, requestId);
  }

  async getJobResult<T = unknown>(model: string, requestId: string): Promise<T> {
    this.validateInit();
    return getJobResultImpl<T>(model, requestId);
  }

  async subscribe<T = unknown>(
    model: string,
    input: Record<string, unknown>,
    options?: SubscribeOptions<T>,
  ): Promise<T> {
    this.validateInit();
    const key = createRequestKey(model, input);

    const existing = getExistingRequest<T>(key);
    if (existing) {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.log(`[FalProvider] Dedup: returning existing promise for ${model}`);
      }
      return existing.promise;
    }

    const abortController = new AbortController();
    const operationId = this.costTracker?.startOperation(model, "subscribe");

    const promise = handleFalSubscription<T>(model, input, options, abortController.signal)
      .then(({ result, requestId }) => {
        if (operationId && this.costTracker) {
          this.costTracker.completeOperation(operationId, model, "subscribe", requestId ?? undefined);
        }
        return result;
      })
      .finally(() => removeRequest(key));

    storeRequest(key, { promise, abortController });
    return promise;
  }

  async run<T = unknown>(model: string, input: Record<string, unknown>, options?: RunOptions): Promise<T> {
    this.validateInit();
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
    cancelAllRequests();
  }

  hasRunningRequest(): boolean {
    return hasActiveRequests();
  }

  getImageFeatureModel(feature: ImageFeatureType): string {
    return getImageFeatureModelImpl(this.imageFeatureModels, feature);
  }

  buildImageFeatureInput(feature: ImageFeatureType, data: ImageFeatureInputData): Record<string, unknown> {
    return buildImageFeatureInputImpl(feature, data);
  }

  getVideoFeatureModel(feature: VideoFeatureType): string {
    return getVideoFeatureModelImpl(this.videoFeatureModels, feature);
  }

  buildVideoFeatureInput(feature: VideoFeatureType, data: VideoFeatureInputData): Record<string, unknown> {
    return buildVideoFeatureInputImpl(feature, data);
  }
}

export const falProvider = new FalProvider();
