/**
 * FAL Provider - Implements IAIProvider interface
 * Orchestrates FAL AI operations with Promise Deduplication
 */

import { fal } from "@fal-ai/client";
import type {
  IAIProvider, AIProviderConfig, JobSubmission, JobStatus, SubscribeOptions,
  RunOptions, ProviderCapabilities, ImageFeatureType, VideoFeatureType,
  ImageFeatureInputData, VideoFeatureInputData,
} from "../../domain/types";
import type { CostTrackerConfig } from "../../domain/entities/cost-tracking.types";
import { DEFAULT_FAL_CONFIG, FAL_CAPABILITIES } from "./fal-provider.constants";
import { handleFalSubscription, handleFalRun } from "./fal-provider-subscription";
import { CostTracker, executeWithCostTracking, preprocessInput } from "../utils";
import {
  createRequestKey, getExistingRequest, storeRequest,
  removeRequest, cancelAllRequests, hasActiveRequests,
} from "./request-store";
import * as queueOps from "./fal-queue-operations";
import { validateInput } from "../utils/input-validator.util";

export class FalProvider implements IAIProvider {
  readonly providerId = "fal";
  readonly providerName = "FAL AI";

  private apiKey: string | null = null;
  private initialized = false;
  private costTracker: CostTracker | null = null;

  initialize(config: AIProviderConfig): void {
    this.apiKey = config.apiKey;
    fal.config({
      credentials: config.apiKey,
      retry: {
        maxRetries: config.maxRetries ?? DEFAULT_FAL_CONFIG.maxRetries,
        baseDelay: config.baseDelay ?? DEFAULT_FAL_CONFIG.baseDelay,
        maxDelay: config.maxDelay ?? DEFAULT_FAL_CONFIG.maxDelay,
      },
    });
    this.initialized = true;
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

  isFeatureSupported(_feature: ImageFeatureType | VideoFeatureType): boolean {
    return false;
  }

  getImageFeatureModel(_feature: ImageFeatureType): string {
    throw new Error("Feature-specific models are not supported in this provider. Use the main app's feature implementations.");
  }

  buildImageFeatureInput(_feature: ImageFeatureType, _data: ImageFeatureInputData): Record<string, unknown> {
    throw new Error("Feature-specific input building is not supported in this provider. Use the main app's feature implementations.");
  }

  getVideoFeatureModel(_feature: VideoFeatureType): string {
    throw new Error("Feature-specific models are not supported in this provider. Use the main app's feature implementations.");
  }

  buildVideoFeatureInput(_feature: VideoFeatureType, _data: VideoFeatureInputData): Record<string, unknown> {
    throw new Error("Feature-specific input building is not supported in this provider. Use the main app's feature implementations.");
  }

  private validateInit(): void {
    if (!this.apiKey || !this.initialized) throw new Error("FAL provider not initialized");
  }

  async submitJob(model: string, input: Record<string, unknown>): Promise<JobSubmission> {
    this.validateInit();
    validateInput(model, input);
    return queueOps.submitJob(model, input);
  }

  async getJobStatus(model: string, requestId: string): Promise<JobStatus> {
    this.validateInit();
    validateInput(model, {}); // Validate model ID only
    return queueOps.getJobStatus(model, requestId);
  }

  async getJobResult<T = unknown>(model: string, requestId: string): Promise<T> {
    this.validateInit();
    validateInput(model, {}); // Validate model ID only
    return queueOps.getJobResult<T>(model, requestId);
  }

  async subscribe<T = unknown>(
    model: string,
    input: Record<string, unknown>,
    options?: SubscribeOptions<T>,
  ): Promise<T> {
    this.validateInit();
    validateInput(model, input);

    const processedInput = await preprocessInput(input);
    const key = createRequestKey(model, processedInput);

    const existing = getExistingRequest<T>(key);
    if (existing) {
      return existing.promise;
    }

    const abortController = new AbortController();
    const tracker = this.costTracker;

    const promise = executeWithCostTracking({
      tracker,
      model,
      operation: "subscribe",
      execute: () => handleFalSubscription<T>(model, processedInput, options, abortController.signal),
      getRequestId: (res) => res.requestId ?? undefined,
    }).then((res) => res.result).finally(() => removeRequest(key));

    storeRequest(key, { promise, abortController });
    return promise;
  }

  async run<T = unknown>(model: string, input: Record<string, unknown>, options?: RunOptions): Promise<T> {
    this.validateInit();
    validateInput(model, input);
    const processedInput = await preprocessInput(input);

    const signal = options?.signal;
    if (signal?.aborted) {
      throw new Error("Request cancelled by user");
    }

    return executeWithCostTracking({
      tracker: this.costTracker,
      model,
      operation: "run",
      execute: () => handleFalRun<T>(model, processedInput, options),
    });
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
}

export const falProvider = new FalProvider();
