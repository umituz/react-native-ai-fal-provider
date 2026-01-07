/**
 * FAL Provider Subscription Handlers
 * Handles subscribe, run methods and cancellation logic
 */

import { fal } from "@fal-ai/client";
import type { SubscribeOptions, RunOptions } from "@umituz/react-native-ai-generation-content";
import type { FalQueueStatus } from "../../domain/entities/fal.types";
import { DEFAULT_FAL_CONFIG } from "./fal-provider.constants";
import { mapFalStatusToJobStatus } from "./fal-status-mapper";
import { validateNSFWContent } from "../validators/nsfw-validator";

declare const __DEV__: boolean | undefined;

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
      ...(signal ? [
        new Promise<never>((_, reject) => {
          signal.addEventListener("abort", () => {
            reject(new Error("Request cancelled by user"));
          });
        }),
      ] as const : []),
    ]);

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log("[FalProvider] Subscribe completed:", { model, requestId: currentRequestId });
    }

    validateNSFWContent(result as Record<string, unknown>);

    options?.onResult?.(result as T);
    return { result: result as T, requestId: currentRequestId };
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
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
