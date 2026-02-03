/**
 * Cost Tracking Executor
 * Wraps operations with cost tracking logic
 */

import type { CostTracker } from "./cost-tracker";

declare const __DEV__: boolean | undefined;

interface ExecuteWithCostTrackingOptions<T> {
  tracker: CostTracker | null;
  model: string;
  operation: string;
  execute: () => Promise<T>;
  getRequestId?: (result: T) => string | undefined;
}

/**
 * Execute an operation with cost tracking
 * Handles start, complete, and fail operations automatically
 */
export async function executeWithCostTracking<T>(
  options: ExecuteWithCostTrackingOptions<T>
): Promise<T> {
  const { tracker, model, operation, execute, getRequestId } = options;

  if (!tracker) {
    return execute();
  }

  const operationId = tracker.startOperation(model, operation);

  try {
    const result = await execute();

    try {
      const requestId = getRequestId?.(result);
      tracker.completeOperation(operationId, model, operation, requestId);
    } catch (costError) {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.warn("[CostTracking] Failed:", costError);
      }
    }

    return result;
  } catch (error) {
    try {
      tracker.failOperation(operationId);
    } catch {
      // Silently ignore cost tracking errors on failure path
    }
    throw error;
  }
}
