/**
 * FAL Provider Subscription Handlers
 * Handles subscribe, run methods and cancellation logic
 */

import { fal } from "@fal-ai/client";
import type { SubscribeOptions, RunOptions } from "../../domain/types";
import type { FalQueueStatus } from "../../domain/entities/fal.types";
import { DEFAULT_FAL_CONFIG } from "./fal-provider.constants";
import { mapFalStatusToJobStatus } from "./fal-status-mapper";
import { validateNSFWContent } from "../validators/nsfw-validator";
import { NSFWContentError } from "./nsfw-content-error";
import { parseFalError } from "../utils/fal-error-handler.util";

/**
 * Handle FAL subscription with timeout and cancellation
 */
export async function handleFalSubscription<T = unknown>(
  model: string,
  input: Record<string, unknown>,
  options?: SubscribeOptions<T>,
  signal?: AbortSignal
): Promise<{ result: T; requestId: string | null }> {
  const timeoutMs = options?.timeoutMs ?? DEFAULT_FAL_CONFIG.defaultTimeoutMs;

  // Validate timeout is a positive integer within reasonable bounds
  if (!Number.isInteger(timeoutMs) || timeoutMs <= 0 || timeoutMs > 3600000) {
    throw new Error(
      `Invalid timeout: ${timeoutMs}ms. Must be a positive integer between 1 and 3600000ms (1 hour)`
    );
  }

  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let currentRequestId: string | null = null;
  let abortHandler: (() => void) | null = null;
  let listenerAdded = false;

  let lastStatus = "";

  try {
    // Check if signal is already aborted BEFORE starting any async work
    if (signal?.aborted) {
      throw new Error("Request cancelled by user");
    }

    const promises: Promise<unknown>[] = [
      fal.subscribe(model, {
        input,
        logs: false,
        pollInterval: DEFAULT_FAL_CONFIG.pollInterval,
        onQueueUpdate: (update: { status: string; logs?: unknown[]; request_id?: string }) => {
          currentRequestId = update.request_id ?? currentRequestId;
          const jobStatus = mapFalStatusToJobStatus({
            status: update.status as FalQueueStatus["status"],
            requestId: currentRequestId ?? "",
            logs: update.logs as FalQueueStatus["logs"],
            queuePosition: undefined,
          });
          if (jobStatus.status !== lastStatus) {
            lastStatus = jobStatus.status;

            // Emit status changes without fake progress percentages
            if (options?.onProgress) {
              if (jobStatus.status === "IN_QUEUE" || jobStatus.status === "IN_PROGRESS") {
                // Indeterminate progress - let UI show spinner/loading
                options.onProgress({ progress: -1, status: jobStatus.status });
              } else if (jobStatus.status === "COMPLETED") {
                options.onProgress({ progress: 100, status: "COMPLETED" });
              } else if (jobStatus.status === "FAILED") {
                options.onProgress({ progress: 0, status: "FAILED" });
              }
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
    ];

    // Set up abort listener BEFORE checking aborted state again to avoid race
    if (signal) {
      const abortPromise = new Promise<never>((_, reject) => {
        abortHandler = () => {
          reject(new Error("Request cancelled by user"));
        };
        signal.addEventListener("abort", abortHandler);
        listenerAdded = true;

        // Check again after adding listener to catch signals that arrived during setup
        if (signal.aborted) {
          abortHandler();
        }
      });
      promises.push(abortPromise);
    }

    const result = await Promise.race(promises);

    validateNSFWContent(result as Record<string, unknown>);

    options?.onResult?.(result as T);
    return { result: result as T, requestId: currentRequestId };
  } catch (error) {
    if (error instanceof NSFWContentError) {
      throw error;
    }

    const userMessage = parseFalError(error);
    if (!userMessage || userMessage.trim().length === 0) {
      throw new Error("An unknown error occurred. Please try again.");
    }
    throw new Error(userMessage);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (listenerAdded && abortHandler && signal) {
      signal.removeEventListener("abort", abortHandler);
    }
  }
}

/**
 * Handle FAL run with NSFW validation
 */
export async function handleFalRun<T = unknown>(
  model: string,
  input: Record<string, unknown>,
  options?: RunOptions
): Promise<T> {
  // Indeterminate progress - no fake percentages
  options?.onProgress?.({ progress: -1, status: "IN_PROGRESS" as const });

  try {
    const result = await fal.run(model, { input });

    validateNSFWContent(result as Record<string, unknown>);

    options?.onProgress?.({ progress: 100, status: "COMPLETED" as const });
    return result as T;
  } catch (error) {
    if (error instanceof NSFWContentError) {
      throw error;
    }

    const userMessage = parseFalError(error);
    throw new Error(userMessage);
  }
}
