/**
 * useFalGeneration Hook
 * React hook for FAL AI generation operations
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { falProvider } from "../../infrastructure/services/fal-provider";
import { mapFalError } from "../../infrastructure/utils/error-mapper";
import { FalGenerationStateManager } from "../../infrastructure/utils/fal-generation-state-manager.util";
import type { FalJobInput, FalQueueStatus } from "../../domain/entities/fal.types";
import type { FalErrorInfo } from "../../domain/entities/error.types";
import type { JobStatus } from "../../domain/types";

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

function convertJobStatusToFalQueueStatus(status: JobStatus, currentRequestId: string | null): FalQueueStatus {
  return {
    status: status.status as FalQueueStatus["status"],
    requestId: status.requestId ?? currentRequestId ?? "",
    logs: status.logs?.map((log) => ({
      message: log.message,
      level: log.level,
      timestamp: log.timestamp,
    })),
    queuePosition: status.queuePosition,
  };
}

export function useFalGeneration<T = unknown>(
  options?: UseFalGenerationOptions
): UseFalGenerationResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<FalErrorInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const stateManagerRef = useRef<FalGenerationStateManager<T> | null>(null);
  const optionsRef = useRef(options);

  // Keep optionsRef updated without causing effect re-runs
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    const stateManager = new FalGenerationStateManager<T>({
      onProgress: (status) => {
        optionsRef.current?.onProgress?.(status);
      },
    });

    stateManager.setIsMounted(true);
    stateManagerRef.current = stateManager;

    return () => {
      // Ensure we have a valid reference before cleanup
      if (stateManagerRef.current) {
        stateManagerRef.current.setIsMounted(false);
        stateManagerRef.current = null;
      }

      // Cancel any running requests
      if (falProvider.hasRunningRequest()) {
        try {
          falProvider.cancelCurrentRequest();
        } catch (error) {
          console.warn('[useFalGeneration] Error cancelling request on unmount:', error);
        }
      }
    };
  }, []); // Empty deps - only run on mount/unmount

  const generate = useCallback(
    async (modelEndpoint: string, input: FalJobInput): Promise<T | null> => {
      const stateManager = stateManagerRef.current;
      if (!stateManager || !stateManager.checkMounted()) return null;

      stateManager.setLastRequest(modelEndpoint, input);
      setIsLoading(true);
      setError(null);
      setData(null);
      stateManager.setCurrentRequestId(null);
      setIsCancelling(false);

      try {
        const result = await falProvider.subscribe<T>(modelEndpoint, input, {
          timeoutMs: optionsRef.current?.timeoutMs,
          onQueueUpdate: (status: JobStatus) => {
            const falStatus = convertJobStatusToFalQueueStatus(
              status,
              stateManager.getCurrentRequestId()
            );
            stateManager.handleQueueUpdate(falStatus);
          },
        });

        if (!stateManager.checkMounted()) return null;
        setData(result);
        return result;
      } catch (err) {
        if (!stateManager.checkMounted()) return null;
        const errorInfo = mapFalError(err);
        setError(errorInfo);
        optionsRef.current?.onError?.(errorInfo);
        return null;
      } finally {
        if (stateManager.checkMounted()) {
          setIsLoading(false);
          setIsCancelling(false);
        }
      }
    },
    [] // No deps - we use optionsRef.current inside
  );

  const retry = useCallback(async (): Promise<T | null> => {
    const stateManager = stateManagerRef.current;
    if (!stateManager) return null;

    const lastRequest = stateManager.getLastRequest();
    if (!lastRequest) return null;

    return generate(lastRequest.endpoint, lastRequest.input);
  }, [generate]);

  const cancel = useCallback(() => {
    if (falProvider.hasRunningRequest()) {
      setIsCancelling(true);
      falProvider.cancelCurrentRequest();
    }
  }, []);

  const reset = useCallback(() => {
    cancel();
    setData(null);
    setError(null);
    setIsLoading(false);
    setIsCancelling(false);
    stateManagerRef.current?.clearLastRequest();
  }, [cancel]);

  const requestId = stateManagerRef.current?.getCurrentRequestId() ?? null;

  return {
    data,
    error,
    isLoading,
    isRetryable: error?.retryable ?? false,
    requestId,
    isCancelling,
    generate,
    retry,
    cancel,
    reset,
  };
}
