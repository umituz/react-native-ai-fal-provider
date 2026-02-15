/**
 * Cost Tracking Executor
 * Wraps operations with cost tracking logic
 */

import type { CostTracker } from "./cost-tracker";
import { getErrorMessage } from './helpers/error-helpers.util';

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
      // Cost tracking failure shouldn't break the operation
      // Log for debugging and audit trail
      console.error(
        `[cost-tracking] Failed to complete cost tracking for ${operation} on ${model}:`,
        getErrorMessage(costError),
        { operationId, model, operation }
      );
    }

    return result;
  } catch (error) {
    try {
      tracker.failOperation(operationId);
    } catch (failError) {
      // Cost tracking cleanup failure on error path
      // Log for debugging and audit trail
      console.error(
        `[cost-tracking] Failed to mark operation as failed for ${operation} on ${model}:`,
        getErrorMessage(failError),
        { operationId, model, operation }
      );
    }
    throw error;
  }
}
