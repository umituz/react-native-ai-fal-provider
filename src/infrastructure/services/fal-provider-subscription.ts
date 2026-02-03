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

declare const __DEV__: boolean | undefined;

interface FalApiErrorDetail {
  msg?: string;
  type?: string;
  loc?: string[];
}

interface FalApiError {
  body?: { detail?: FalApiErrorDetail[] } | string;
  message?: string;
}

/**
 * Parse FAL API error and extract user-friendly message
 */
function parseFalError(error: unknown): string {
  const fallback = error instanceof Error ? error.message : String(error);

  const falError = error as FalApiError;
  if (!falError?.body) return fallback;

  const body = typeof falError.body === "string"
    ? safeJsonParse(falError.body)
    : falError.body;

  const detail = body?.detail?.[0];
  return detail?.msg ?? falError.message ?? fallback;
}

function safeJsonParse(str: string): { detail?: FalApiErrorDetail[] } | null {
  try {
    return JSON.parse(str) as { detail?: FalApiErrorDetail[] };
  } catch {
    return null;
  }
}

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
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let currentRequestId: string | null = null;
  let abortHandler: (() => void) | null = null;

  if (typeof __DEV__ !== "undefined" && __DEV__) {
    console.log("[FalProvider] Subscribe started:", {
      model,
      timeoutMs,
      inputKeys: Object.keys(input),
      hasImageUrl: !!input.image_url,
      hasPrompt: !!input.prompt,
      promptPreview: input.prompt ? String(input.prompt).substring(0, 50) + "..." : "N/A",
    });
  }

  // Check if already aborted before starting
  if (signal?.aborted) {
    throw new Error("Request cancelled by user");
  }

  let lastStatus = "";

  try {
    const result = await Promise.race([
      fal.subscribe(model, {
        input,
        logs: false,
        pollInterval: DEFAULT_FAL_CONFIG.pollInterval,
        onQueueUpdate: (update: { status: string; logs?: unknown[]; request_id?: string }) => {
          currentRequestId = update.request_id ?? currentRequestId;
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
      // Abort promise with cleanup
      ...(signal ? [
        new Promise<never>((_, reject) => {
          abortHandler = () => {
            reject(new Error("Request cancelled by user"));
          };
          signal.addEventListener("abort", abortHandler);
        }),
      ] as const : []),
    ]);

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log("[FalProvider] Subscribe completed:", {
        model,
        requestId: currentRequestId,
        resultKeys: result ? Object.keys(result as object) : "null",
        hasVideo: !!(result as Record<string, unknown>)?.video,
        hasOutput: !!(result as Record<string, unknown>)?.output,
        hasData: !!(result as Record<string, unknown>)?.data,
      });
      // Log full result structure for debugging
      console.log("[FalProvider] Result structure:", JSON.stringify(result, null, 2).substring(0, 1000));
    }

    validateNSFWContent(result as Record<string, unknown>);

    options?.onResult?.(result as T);
    return { result: result as T, requestId: currentRequestId };
  } catch (error) {
    // Parse FAL error and throw with user-friendly message
    const userMessage = parseFalError(error);
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.error("[FalProvider] Error:", userMessage);
    }
    throw new Error(userMessage);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
    // Clean up abort listener to prevent memory leak
    if (signal && abortHandler) {
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
  options?.onProgress?.({ progress: 10, status: "IN_PROGRESS" as const });

  if (typeof __DEV__ !== "undefined" && __DEV__) {
    console.log("[FalProvider] run() model:", model, "inputKeys:", Object.keys(input));
  }

  try {
    const result = await fal.run(model, { input });

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log("[FalProvider] run() raw result:", JSON.stringify(result, null, 2));
      console.log("[FalProvider] run() result type:", typeof result);
      console.log("[FalProvider] run() result keys:", result ? Object.keys(result as object) : "null");
    }

    validateNSFWContent(result as Record<string, unknown>);

    options?.onProgress?.({ progress: 100, status: "COMPLETED" as const });
    return result as T;
  } catch (error) {
    const userMessage = parseFalError(error);
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.error("[FalProvider] run() Error:", userMessage);
    }
    throw new Error(userMessage);
  }
}
