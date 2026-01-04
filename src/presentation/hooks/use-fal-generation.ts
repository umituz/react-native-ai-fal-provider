/**
 * useFalGeneration Hook
 * React hook for FAL AI generation operations
 */

import { useState, useCallback, useRef } from "react";
import { falProvider } from "../../infrastructure/services/fal-provider";
import { mapFalError, isFalErrorRetryable } from "../../infrastructure/utils/error-mapper";
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
  generate: (modelEndpoint: string, input: FalJobInput) => Promise<T | null>;
  retry: () => Promise<T | null>;
  reset: () => void;
}

export function useFalGeneration<T = unknown>(
  options?: UseFalGenerationOptions
): UseFalGenerationResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<FalErrorInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const lastRequestRef = useRef<{ endpoint: string; input: FalJobInput } | null>(null);

  const generate = useCallback(
    async (modelEndpoint: string, input: FalJobInput): Promise<T | null> => {
      lastRequestRef.current = { endpoint: modelEndpoint, input };
      setIsLoading(true);
      setError(null);
      setData(null);

      try {
        const result = await falProvider.subscribe<T>(modelEndpoint, input, {
          timeoutMs: options?.timeoutMs,
          onQueueUpdate: (status) => {
            // Map JobStatus to FalQueueStatus for backward compatibility
            options?.onProgress?.({
              status: status.status,
              requestId: "",
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
      }
    },
    [options]
  );

  const retry = useCallback(async (): Promise<T | null> => {
    if (!lastRequestRef.current) return null;
    const { endpoint, input } = lastRequestRef.current;
    return generate(endpoint, input);
  }, [generate]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
    lastRequestRef.current = null;
  }, []);

  return {
    data,
    error,
    isLoading,
    isRetryable: error ? isFalErrorRetryable(error.originalError) : false,
    generate,
    retry,
    reset,
  };
}
