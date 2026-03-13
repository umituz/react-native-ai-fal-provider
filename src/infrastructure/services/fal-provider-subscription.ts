/**
 * FAL Provider Subscription Handlers
 * Handles subscribe, run methods with retry, timeout, and cancellation
 *
 * Retry strategy for subscribe:
 * - Retries on: network errors, timeouts, server errors (5xx)
 * - NO retry on: auth, validation, NSFW, quota, user cancellation
 * - Max 1 retry (2 total attempts) with 3s delay
 * - Upload results are preserved (images already on CDN)
 */

import { fal, ApiError, ValidationError } from "@fal-ai/client";
import type { SubscribeOptions, RunOptions } from "../../domain/types";
import { DEFAULT_FAL_CONFIG } from "./fal-provider.constants";
import { mapFalStatusToJobStatus } from "./fal-status-mapper";
import { validateNSFWContent } from "../validators/nsfw-validator";
import { NSFWContentError } from "./nsfw-content-error";
import { isBase64DataUri } from "../utils/validators/data-uri-validator.util";
import { generationLogCollector } from "../utils/log-collector";

const TAG = 'fal-subscription';

// ─── Helpers ────────────────────────────────────────────────────────────────

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

function formatFalError(error: unknown): string {
  if (error instanceof ValidationError) {
    const details = error.fieldErrors;
    if (details.length > 0) {
      return details.map((d) => d.msg).filter(Boolean).join("; ") || error.message;
    }
    return error.message;
  }

  if (error instanceof ApiError) {
    if (error.status === 401 || error.status === 403) {
      return "Authentication failed. Please check your API key.";
    }
    if (error.status === 429) {
      return "Rate limit exceeded. Please wait and try again.";
    }
    if (error.status === 402) {
      return "Insufficient credits. Please check your billing.";
    }
    return error.message ?? `API error (${error.status})`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  // Handle null/undefined/other types safely
  return error != null ? String(error) : "Unknown error";
}

// ─── Retry Logic ────────────────────────────────────────────────────────────

/**
 * Determine if a subscribe error is retryable.
 *
 * Retryable:  network, timeout, server errors (500-504)
 * NOT:        auth (401/403), validation (400/422), quota (402),
 *             NSFW, user cancellation, rate limit (429 — FAL SDK already retries)
 */
function isRetryableSubscribeError(error: unknown): boolean {
  // Never retry NSFW
  if (error instanceof NSFWContentError) return false;

  // Never retry user cancellation - check Error instance first
  if (error instanceof Error && error.message?.includes("cancelled by user")) return false;

  // ApiError — check status code
  if (error instanceof ApiError) {
    const status = error.status;
    // 5xx server errors are retryable
    if (status >= 500 && status <= 504) return true;
    // Everything else (4xx) is not
    return false;
  }

  // ValidationError is never retryable
  if (error instanceof ValidationError) return false;

  // Generic Error — check message patterns
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("network")) return true;
    if (msg.includes("timeout") || msg.includes("timed out")) return true;
    if (msg.includes("fetch")) return true;
    if (msg.includes("econnrefused") || msg.includes("enotfound")) return true;
  }

  return false;
}

// ─── Single Subscribe Attempt ───────────────────────────────────────────────

async function singleSubscribeAttempt<T = unknown>(
  model: string,
  input: Record<string, unknown>,
  options: SubscribeOptions<T> | undefined,
  signal: AbortSignal | undefined,
  timeoutMs: number,
  attemptStart: number,
  sessionId: string,
): Promise<{ result: T; requestId: string }> {
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
            const elapsed = Date.now() - attemptStart;
            generationLogCollector.log(sessionId, TAG, `[${elapsed}ms] Queue: ${jobStatus.status}${jobStatus.queuePosition ? ` (pos: ${jobStatus.queuePosition})` : ""}`);
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
      // Check for aborted state BEFORE adding listener to prevent race condition
      if (signal.aborted) {
        throw new Error("Request cancelled by user");
      }
      const abortPromise = new Promise<never>((_, reject) => {
        abortHandler = () => reject(new Error("Request cancelled by user"));
        signal.addEventListener("abort", abortHandler, { once: true });
        listenerAdded = true;
      });
      promises.push(abortPromise);
    }

    const rawResult = await Promise.race(promises);
    const { data, requestId } = unwrapFalResult<T>(rawResult);

    validateNoBase64InResponse(data);
    validateNSFWContent(data as Record<string, unknown>);

    options?.onResult?.(data);
    return { result: data, requestId };
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
    if (listenerAdded && abortHandler && signal) {
      signal.removeEventListener("abort", abortHandler);
    }
  }
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Handle FAL subscription with timeout, cancellation, and retry.
 *
 * Retry is safe here because:
 * - Input is already preprocessed (images uploaded to FAL CDN)
 * - fal.subscribe is idempotent (same input → same generation)
 * - Only retries on transient errors (network/timeout/5xx)
 */
export async function handleFalSubscription<T = unknown>(
  model: string,
  input: Record<string, unknown>,
  sessionId: string,
  options?: SubscribeOptions<T>,
  signal?: AbortSignal,
): Promise<{ result: T; requestId: string }> {
  const overallStart = Date.now();
  const timeoutMs = options?.timeoutMs ?? DEFAULT_FAL_CONFIG.defaultTimeoutMs;
  const maxRetries = DEFAULT_FAL_CONFIG.subscribeMaxRetries;
  const retryDelay = DEFAULT_FAL_CONFIG.subscribeRetryDelayMs;

  generationLogCollector.log(sessionId, TAG, `Starting subscription for model: ${model}`, {
    timeoutMs,
    maxRetries,
    inputKeys: Object.keys(input),
  });

  if (!Number.isInteger(timeoutMs) || timeoutMs <= 0 || timeoutMs > 3600000) {
    throw new Error(
      `Invalid timeout: ${timeoutMs}ms. Must be a positive integer between 1 and 3600000ms (1 hour)`
    );
  }

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const attemptStart = Date.now();

    if (attempt > 0) {
      generationLogCollector.warn(sessionId, TAG, `Retry ${attempt}/${maxRetries} after ${retryDelay}ms delay...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));

      // Check if cancelled during delay
      if (signal?.aborted) {
        throw new Error("Request cancelled by user");
      }
    }

    try {
      generationLogCollector.log(sessionId, TAG, `Attempt ${attempt + 1}/${maxRetries + 1} starting...`);

      const result = await singleSubscribeAttempt<T>(
        model, input, options, signal, timeoutMs, attemptStart, sessionId,
      );

      const totalElapsed = Date.now() - overallStart;
      const suffix = attempt > 0 ? ` (succeeded on retry ${attempt})` : '';
      generationLogCollector.log(sessionId, TAG, `Subscription completed in ${totalElapsed}ms${suffix}. Request ID: ${result.requestId}`);

      return result;
    } catch (error) {
      lastError = error;
      const attemptElapsed = Date.now() - attemptStart;

      // NSFW errors never retry — re-throw immediately
      if (error instanceof NSFWContentError) {
        generationLogCollector.warn(sessionId, TAG, `NSFW content detected after ${attemptElapsed}ms`);
        throw error;
      }

      const message = formatFalError(error);

      // Check if retryable and we have attempts left
      if (attempt < maxRetries && isRetryableSubscribeError(error)) {
        generationLogCollector.warn(sessionId, TAG, `Attempt ${attempt + 1} failed after ${attemptElapsed}ms (retryable): ${message}`);
        continue;
      }

      // Not retryable or no retries left
      const totalElapsed = Date.now() - overallStart;
      const retryInfo = attempt > 0 ? ` after ${attempt + 1} attempts` : '';
      generationLogCollector.error(sessionId, TAG, `Subscription FAILED in ${totalElapsed}ms${retryInfo}: ${message}`);
      // Re-throw original error to preserve type info (ApiError, ValidationError, etc.)
      // so downstream mapFalError() can categorize by HTTP status code
      throw error;
    }
  }

  // Should never reach here, but TypeScript needs it
  throw lastError;
}

/**
 * Handle FAL run with NSFW validation (no retry — runs are fast/synchronous)
 */
export async function handleFalRun<T = unknown>(
  model: string,
  input: Record<string, unknown>,
  sessionId: string,
  options?: RunOptions,
): Promise<T> {
  const runTag = 'fal-run';
  const startTime = Date.now();
  generationLogCollector.log(sessionId, runTag, `Starting run for model: ${model}`);

  options?.onProgress?.({ progress: -1, status: "IN_PROGRESS" as const });

  try {
    const rawResult = await fal.run(model, {
      input,
      ...(options?.signal && { abortSignal: options.signal }),
    });
    const { data } = unwrapFalResult<T>(rawResult);

    validateNoBase64InResponse(data);
    validateNSFWContent(data as Record<string, unknown>);

    const elapsed = Date.now() - startTime;
    generationLogCollector.log(sessionId, runTag, `Run completed in ${elapsed}ms`);

    options?.onProgress?.({ progress: 100, status: "COMPLETED" as const });
    return data;
  } catch (error) {
    const elapsed = Date.now() - startTime;

    if (error instanceof NSFWContentError) {
      generationLogCollector.warn(sessionId, runTag, `NSFW content detected after ${elapsed}ms`);
      throw error;
    }

    const message = formatFalError(error);
    generationLogCollector.error(sessionId, runTag, `Run FAILED after ${elapsed}ms for model ${model}: ${message}`);
    // Re-throw original error to preserve type info for downstream mapFalError()
    throw error;
  }
}
