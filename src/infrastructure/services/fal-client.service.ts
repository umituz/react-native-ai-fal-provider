/**
 * FAL Client Service
 * Wrapper for FAL AI client operations
 */

import { fal } from "@fal-ai/client";
import type {
  FalConfig,
  FalJobInput,
  FalSubscribeOptions,
} from "../../domain/entities/fal.types";

declare const __DEV__: boolean;

const DEFAULT_CONFIG: Partial<FalConfig> = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  defaultTimeoutMs: 300000,
};

class FalClientService {
  private apiKey: string | null = null;
  private config: FalConfig | null = null;
  private initialized = false;

  initialize(config: FalConfig): void {
    this.apiKey = config.apiKey;
    this.config = { ...DEFAULT_CONFIG, ...config };

    fal.config({
      credentials: config.apiKey,
      retry: {
        maxRetries: this.config.maxRetries ?? 3,
        baseDelay: this.config.baseDelay ?? 1000,
        maxDelay: this.config.maxDelay ?? 10000,
      },
    });

    this.initialized = true;

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[FAL] Client initialized");
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  getConfig(): FalConfig | null {
    return this.config;
  }

  private validateInitialization(): void {
    if (!this.apiKey || !this.initialized) {
      throw new Error("FAL client not initialized. Call initialize() first.");
    }
  }

  async submitJob(modelEndpoint: string, input: FalJobInput) {
    this.validateInitialization();
    return fal.queue.submit(modelEndpoint, { input });
  }

  async getJobStatus(modelEndpoint: string, requestId: string) {
    this.validateInitialization();
    return fal.queue.status(modelEndpoint, { requestId, logs: true });
  }

  async getJobResult(modelEndpoint: string, requestId: string) {
    this.validateInitialization();
    return fal.queue.result(modelEndpoint, { requestId });
  }

  async subscribe<T = unknown>(
    modelEndpoint: string,
    input: FalJobInput,
    options?: FalSubscribeOptions
  ): Promise<T> {
    this.validateInitialization();

    const timeoutMs = options?.timeoutMs ?? this.config?.defaultTimeoutMs ?? 300000;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[FAL] Subscribe started:", { modelEndpoint, timeoutMs });
    }

    try {
      const result = await Promise.race([
        fal.subscribe(modelEndpoint, {
          input,
          onQueueUpdate: (update) => {
            if (typeof __DEV__ !== "undefined" && __DEV__) {
              // eslint-disable-next-line no-console
              console.log("[FAL] Queue update:", { status: update.status });
            }
            options?.onQueueUpdate?.(update as never);
          },
        }),
        new Promise<never>((_, reject) => {
          timeoutId = setTimeout(
            () => reject(new Error("FAL subscription timeout")),
            timeoutMs
          );
        }),
      ]);

      if (typeof __DEV__ !== "undefined" && __DEV__) {
        // eslint-disable-next-line no-console
        console.log("[FAL] Subscribe completed:", { modelEndpoint });
      }

      return result as T;
    } catch (error) {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        // eslint-disable-next-line no-console
        console.error("[FAL] Subscribe error:", {
          modelEndpoint,
          error: error instanceof Error ? error.message : error,
        });
      }
      throw error;
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }

  async run<T = unknown>(modelEndpoint: string, input: FalJobInput): Promise<T> {
    this.validateInitialization();
    return fal.run(modelEndpoint, { input }) as Promise<T>;
  }

  reset(): void {
    this.apiKey = null;
    this.config = null;
    this.initialized = false;
  }
}

export const falClientService = new FalClientService();
