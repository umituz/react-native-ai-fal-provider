/**
 * FAL Provider Subscription Handlers
 * Handles subscribe, run methods and cancellation logic
 */

import { fal, ApiError, ValidationError } from "@fal-ai/client";
import type { SubscribeOptions, RunOptions } from "../../domain/types";
import { DEFAULT_FAL_CONFIG } from "./fal-provider.constants";
import { mapFalStatusToJobStatus } from "./fal-status-mapper";
import { validateNSFWContent } from "../validators/nsfw-validator";
import { NSFWContentError } from "./nsfw-content-error";
import { isBase64DataUri } from "../utils/validators/data-uri-validator.util";

/**
 * Validate that FAL response images contain HTTPS URLs, never base64 data URIs.
 * FAL models should always return CDN URLs. If base64 is returned, it means the model
 * was called with sync_mode:true or wrong parameters. Throw an explicit error to catch early.
 */
function validateNoBase64InResponse(data: unknown): void {
  if (!data || typeof data !== "object") return;
  const record = data as Record<string, unknown>;

  const checkUrl = (url: unknown, field: string) => {
    if (typeof url === "string" && isBase64DataUri(url)) {
      throw new Error(
        `[fal-provider] Model returned base64 data URI in '${field}' instead of an HTTPS URL. ` +
        `Do not use sync_mode:true. Use falProvider.subscribe() to get CDN URLs.`
      );
    }
  };

  if (Array.isArray(record.images)) {
    for (const img of record.images) {
      if (img && typeof img === "object") {
        checkUrl((img as Record<string, unknown>).url, "images[].url");
      }
    }
  }
  if (record.image && typeof record.image === "object") {
    checkUrl((record.image as Record<string, unknown>).url, "image.url");
  }
}

/**
 * Unwrap fal.subscribe / fal.run Result<T> = { data: T, requestId: string }
 * Throws if response format is unexpected - no silent fallbacks
 */
function unwrapFalResult<T>(rawResult: unknown): { data: T; requestId: string } {
  if (!rawResult || typeof rawResult !== "object") {
    throw new Error(
      `Unexpected fal response: expected object, got ${typeof rawResult}`
    );
  }

  const result = rawResult as Record<string, unknown>;

  if (!("data" in result)) {
    throw new Error(
      `Unexpected fal response format: missing 'data' property. Keys: ${Object.keys(result).join(", ")}`
    );
  }

  if (!("requestId" in result) || typeof result.requestId !== "string") {
    throw new Error(
      `Unexpected fal response format: missing or invalid 'requestId'. Keys: ${Object.keys(result).join(", ")}`
    );
  }

  return { data: result.data as T, requestId: result.requestId };
}

/**
 * Format fal-ai SDK errors into user-readable messages
 * Uses proper @fal-ai/client error types (ApiError, ValidationError)
 */
function formatFalError(error: unknown): string {
  if (error instanceof ValidationError) {
    const details = error.fieldErrors;
    if (details.length > 0) {
      return details.map((d) => d.msg).filter(Boolean).join("; ") || error.message;
    }
    return error.message;
  }

  if (error instanceof ApiError) {
    // ApiError has .status, .body, .message
    if (error.status === 401 || error.status === 403) {
      return "Authentication failed. Please check your API key.";
    }
    if (error.status === 429) {
      return "Rate limit exceeded. Please wait and try again.";
    }
    if (error.status === 402) {
      return "Insufficient credits. Please check your billing.";
    }
    return error.message || `API error (${error.status})`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

/**
 * Handle FAL subscription with timeout and cancellation
 */
export async function handleFalSubscription<T = unknown>(
  model: string,
  input: Record<string, unknown>,
  options?: SubscribeOptions<T>,
  signal?: AbortSignal
): Promise<{ result: T; requestId: string }> {
  const timeoutMs = options?.timeoutMs ?? DEFAULT_FAL_CONFIG.defaultTimeoutMs;

  if (!Number.isInteger(timeoutMs) || timeoutMs <= 0 || timeoutMs > 3600000) {
    throw new Error(
      `Invalid timeout: ${timeoutMs}ms. Must be a positive integer between 1 and 3600000ms (1 hour)`
    );
  }

  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let abortHandler: (() => void) | null = null;
  let listenerAdded = false;
  let lastStatus = "";

  try {
    if (signal?.aborted) {
      throw new Error("Request cancelled by user");
    }

    const promises: Promise<unknown>[] = [
      fal.subscribe(model, {
        input,
        logs: false,
        pollInterval: DEFAULT_FAL_CONFIG.pollInterval,
        onQueueUpdate: (update: { status: string; logs?: unknown[]; request_id?: string; queue_position?: number }) => {
          const jobStatus = mapFalStatusToJobStatus(
            update.status,
            update.request_id,
            update.queue_position,
            Array.isArray(update.logs) ? update.logs : undefined,
          );

          const statusWithPosition = `${jobStatus.status}:${jobStatus.queuePosition ?? ""}`;
          if (statusWithPosition !== lastStatus) {
            lastStatus = statusWithPosition;
            if (typeof __DEV__ !== "undefined" && __DEV__) {
              console.log(`[fal-provider] Job Status Update: ${jobStatus.status}${jobStatus.queuePosition ? ` (Position: ${jobStatus.queuePosition})` : ""}`);
            }
            if (options?.onProgress) {
              if (jobStatus.status === "IN_QUEUE" || jobStatus.status === "IN_PROGRESS") {
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
          reject(new Error(`FAL subscription timeout after ${timeoutMs}ms for model ${model}`));
        }, timeoutMs);
      }),
    ];

    if (signal) {
      const abortPromise = new Promise<never>((_, reject) => {
        abortHandler = () => reject(new Error("Request cancelled by user"));
        signal.addEventListener("abort", abortHandler, { once: true });
        listenerAdded = true;
      });
      promises.push(abortPromise);
      // Check after listener is attached to close the race window
      if (signal.aborted) {
        throw new Error("Request cancelled by user");
      }
    }

    const rawResult = await Promise.race(promises);
    const { data, requestId } = unwrapFalResult<T>(rawResult);

    // Validate response for base64 data URIs
    // Since we use subscribe, we should always get CDN URLs, not base64 data URIs
    validateNoBase64InResponse(data);
    validateNSFWContent(data as Record<string, unknown>);

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log(`[fal-provider] Subscription completed successfully. Request ID: ${requestId}`);
    }

    options?.onResult?.(data);
    return { result: data, requestId };
  } catch (error) {
    if (error instanceof NSFWContentError) {
      throw error;
    }

    const message = formatFalError(error);
    throw new Error(message);
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
  options?.onProgress?.({ progress: -1, status: "IN_PROGRESS" as const });

  try {
    const rawResult = await fal.run(model, { input });
    const { data } = unwrapFalResult<T>(rawResult);

    validateNoBase64InResponse(data);
    validateNSFWContent(data as Record<string, unknown>);

    options?.onProgress?.({ progress: 100, status: "COMPLETED" as const });
    return data;
  } catch (error) {
    if (error instanceof NSFWContentError) {
      throw error;
    }

    const message = formatFalError(error);
    throw new Error(message);
  }
}
