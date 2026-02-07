/**
 * useFalGeneration Hook
 * React hook for FAL AI generation operations
 */

import { useState, useCallback, useRef } from "react";
import { falProvider } from "../../infrastructure/services/fal-provider";
import { mapFalError } from "../../infrastructure/utils/error-mapper";
import type { FalJobInput, FalQueueStatus, FalLogEntry } from "../../domain/entities/fal.types";
import type { FalErrorInfo } from "../../domain/entities/error.types";

export interface UseFalGenerationOptions {
  timeoutMs?: number;
  onProgress?: (status: FalQueueStatus) => void;
  onError?: (error: FalErrorInfo) => void;
}

export interface UseFalGenerationResult<T> {
  data: T | null;
  error: FalErrorInfo | null;
  isLoading: boolean;
  isRetryable: boolean;
  requestId: string | null;
  isCancelling: boolean;
  generate: (modelEndpoint: string, input: FalJobInput) => Promise<T | null>;
  retry: () => Promise<T | null>;
  cancel: () => void;
  reset: () => void;
}

export function useFalGeneration<T = unknown>(
  options?: UseFalGenerationOptions
): UseFalGenerationResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<FalErrorInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const lastRequestRef = useRef<{ endpoint: string; input: FalJobInput } | null>(null);
  const currentRequestIdRef = useRef<string | null>(null);

  const generate = useCallback(
    async (modelEndpoint: string, input: FalJobInput): Promise<T | null> => {
      lastRequestRef.current = { endpoint: modelEndpoint, input };
      setIsLoading(true);
      setError(null);
      setData(null);
      currentRequestIdRef.current = null;
      setIsCancelling(false);

      try {
        const result = await falProvider.subscribe<T>(modelEndpoint, input, {
          timeoutMs: options?.timeoutMs,
          onQueueUpdate: (status) => {
            // Note: requestId is tracked internally by falProvider subscribe
            // and exposed via the requestId ref, not from status object
            const currentRequestId = currentRequestIdRef.current ?? "";
            // Map JobStatus to FalQueueStatus for backward compatibility
            options?.onProgress?.({
              status: status.status,
              requestId: currentRequestId,
              logs: status.logs?.map((log: FalLogEntry) => ({
                message: log.message,
                level: log.level,
                timestamp: log.timestamp,
              })),
              queuePosition: status.queuePosition,
            });
          },
        });

        setData(result);
        return result;
      } catch (err) {
        const errorInfo = mapFalError(err);
        setError(errorInfo);
        options?.onError?.(errorInfo);
        return null;
      } finally {
        setIsLoading(false);
        setIsCancelling(false);
      }
    },
    [options]
  );

  const retry = useCallback(async (): Promise<T | null> => {
    if (!lastRequestRef.current) return null;
    const { endpoint, input } = lastRequestRef.current;
    return generate(endpoint, input);
  }, [generate]);

  const cancel = useCallback(() => {
    if (falProvider.hasRunningRequest()) {
      setIsCancelling(true);
      falProvider.cancelCurrentRequest();
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.log("[useFalGeneration] Request cancelled");
      }
    }
  }, []);

  const reset = useCallback(() => {
    cancel();
    setData(null);
    setError(null);
    setIsLoading(false);
    setIsCancelling(false);
    lastRequestRef.current = null;
    currentRequestIdRef.current = null;
  }, [cancel]);

  return {
    data,
    error,
    isLoading,
    isRetryable: error?.retryable ?? false,
    requestId: currentRequestIdRef.current,
    isCancelling,
    generate,
    retry,
    cancel,
    reset,
  };
}
