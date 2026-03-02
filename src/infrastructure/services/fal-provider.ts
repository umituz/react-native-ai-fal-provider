/**
 * FAL Provider - Implements IAIProvider interface
 * Each subscribe/run call creates an isolated log session via sessionId.
 */

import { fal } from "@fal-ai/client";
import type {
  IAIProvider, AIProviderConfig, JobSubmission, JobStatus, SubscribeOptions,
  RunOptions, ProviderCapabilities, ImageFeatureType, VideoFeatureType,
  ImageFeatureInputData, VideoFeatureInputData,
} from "../../domain/types";
import { DEFAULT_FAL_CONFIG, FAL_CAPABILITIES } from "./fal-provider.constants";
import { handleFalSubscription, handleFalRun } from "./fal-provider-subscription";
import { preprocessInput } from "../utils";
import { generationLogCollector } from "../utils/log-collector";
import type { LogEntry } from "../utils/log-collector";
import {
  createRequestKey, getExistingRequest, storeRequest,
  removeRequest, cancelRequest, cancelAllRequests, hasActiveRequests,
} from "./request-store";
import * as queueOps from "./fal-queue-operations";
import { validateInput } from "../utils/input-validator.util";

export class FalProvider implements IAIProvider {
  readonly providerId = "fal";
  readonly providerName = "FAL AI";

  private apiKey: string | null = null;
  private initialized = false;
  private lastRequestKey: string | null = null;

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
    throw new Error("Feature-specific models not supported. Use main app's feature implementations.");
  }

  buildImageFeatureInput(_feature: ImageFeatureType, _data: ImageFeatureInputData): Record<string, unknown> {
    throw new Error("Feature-specific input building not supported. Use main app's feature implementations.");
  }

  getVideoFeatureModel(_feature: VideoFeatureType): string {
    throw new Error("Feature-specific models not supported. Use main app's feature implementations.");
  }

  buildVideoFeatureInput(_feature: VideoFeatureType, _data: VideoFeatureInputData): Record<string, unknown> {
    throw new Error("Feature-specific input building not supported. Use main app's feature implementations.");
  }

  private validateInit(): void {
    if (!this.apiKey || !this.initialized) throw new Error("FAL provider not initialized");
  }

  async submitJob(model: string, input: Record<string, unknown>): Promise<JobSubmission> {
    this.validateInit();
    validateInput(model, input);
    const sessionId = generationLogCollector.startSession();
    generationLogCollector.log(sessionId, 'fal-provider', `submitJob() for model: ${model}`);
    const processedInput = await preprocessInput(input, sessionId);
    return queueOps.submitJob(model, processedInput);
  }

  async getJobStatus(model: string, requestId: string): Promise<JobStatus> {
    this.validateInit();
    return queueOps.getJobStatus(model, requestId);
  }

  async getJobResult<T = unknown>(model: string, requestId: string): Promise<T> {
    this.validateInit();
    return queueOps.getJobResult<T>(model, requestId);
  }

  async subscribe<T = unknown>(
    model: string,
    input: Record<string, unknown>,
    options?: SubscribeOptions<T>,
  ): Promise<T> {
    const TAG = 'fal-provider';
    const totalStart = Date.now();
    this.validateInit();
    validateInput(model, input);

    // Start a fresh log session for this generation
    const sessionId = generationLogCollector.startSession();
    generationLogCollector.log(sessionId, TAG, `subscribe() called for model: ${model}`);

    const preprocessStart = Date.now();
    const processedInput = await preprocessInput(input, sessionId);
    const preprocessElapsed = Date.now() - preprocessStart;
    generationLogCollector.log(sessionId, TAG, `Preprocessing done in ${preprocessElapsed}ms`);

    const key = createRequestKey(model, processedInput);

    const existing = getExistingRequest<T>(key);
    if (existing) {
      generationLogCollector.log(sessionId, TAG, `Dedup hit - returning existing request`);
      return existing.promise;
    }

    const abortController = new AbortController();

    let resolvePromise!: (value: T) => void;
    let rejectPromise!: (error: unknown) => void;
    const promise = new Promise<T>((resolve, reject) => {
      resolvePromise = resolve;
      rejectPromise = reject;
    });

    this.lastRequestKey = key;
    storeRequest(key, { promise, abortController, createdAt: Date.now() });

    handleFalSubscription<T>(model, processedInput, sessionId, options, abortController.signal)
      .then((res) => {
        const totalElapsed = Date.now() - totalStart;
        generationLogCollector.log(sessionId, TAG, `Generation SUCCESS in ${totalElapsed}ms (preprocess: ${preprocessElapsed}ms)`);
        // Attach providerSessionId to result for concurrent-safe log retrieval
        const result = res.result;
        if (result && typeof result === 'object') {
          Object.defineProperty(result, '__providerSessionId', { value: sessionId, enumerable: false });
        }
        resolvePromise(result);
      })
      .catch((error) => {
        const totalElapsed = Date.now() - totalStart;
        generationLogCollector.error(sessionId, TAG, `Generation FAILED in ${totalElapsed}ms: ${error instanceof Error ? error.message : String(error)}`);
        rejectPromise(error);
      })
      .finally(() => {
        try {
          removeRequest(key);
        } catch (cleanupError) {
          generationLogCollector.warn(sessionId, TAG, `Error removing request: ${cleanupError instanceof Error ? cleanupError.message : String(cleanupError)}`);
        }
      });

    return promise;
  }

  async run<T = unknown>(model: string, input: Record<string, unknown>, options?: RunOptions): Promise<T> {
    this.validateInit();
    validateInput(model, input);

    const sessionId = generationLogCollector.startSession();
    generationLogCollector.log(sessionId, 'fal-provider', `run() for model: ${model}`);

    const processedInput = await preprocessInput(input, sessionId);

    const signal = options?.signal;
    if (signal?.aborted) {
      throw new Error("Request cancelled by user");
    }

    const result = await handleFalRun<T>(model, processedInput, sessionId, options);
    // Attach providerSessionId to result for concurrent-safe log retrieval
    if (result && typeof result === 'object') {
      Object.defineProperty(result, '__providerSessionId', { value: sessionId, enumerable: false });
    }
    return result;
  }

  reset(): void {
    cancelAllRequests();
    this.lastRequestKey = null;
    this.apiKey = null;
    this.initialized = false;
  }

  cancelCurrentRequest(): void {
    if (this.lastRequestKey) {
      cancelRequest(this.lastRequestKey);
      this.lastRequestKey = null;
    }
  }

  hasRunningRequest(): boolean {
    return hasActiveRequests();
  }

  /**
   * Get log entries for a specific provider session.
   * Extract sessionId from result.__providerSessionId for concurrent safety.
   */
  getSessionLogs(sessionId?: string): LogEntry[] {
    if (!sessionId) return [];
    return generationLogCollector.getEntries(sessionId);
  }

  /**
   * End a provider log session and return all entries. Clears the buffer.
   * Extract sessionId from result.__providerSessionId for concurrent safety.
   */
  endLogSession(sessionId?: string): LogEntry[] {
    if (!sessionId) return [];
    return generationLogCollector.endSession(sessionId);
  }
}

export const falProvider = new FalProvider();
