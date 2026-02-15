/**
 * FAL Queue Operations - Direct FAL API queue interactions
 */

import { fal } from "@fal-ai/client";
import type { JobSubmission, JobStatus } from "../../domain/types";
import type { FalQueueStatus } from "../../domain/entities/fal.types";
import { mapFalStatusToJobStatus } from "./fal-status-mapper";

/**
 * Validate and cast FAL queue status response
 */
function isValidFalQueueStatus(value: unknown): value is FalQueueStatus {
  if (!value || typeof value !== "object") {
    return false;
  }

  const status = value as Partial<FalQueueStatus>;
  const validStatuses = ["IN_QUEUE", "IN_PROGRESS", "COMPLETED", "FAILED"];

  return (
    typeof status.status === "string" &&
    validStatuses.includes(status.status) &&
    typeof status.requestId === "string"
  );
}

export async function submitJob(model: string, input: Record<string, unknown>): Promise<JobSubmission> {
  const result = await fal.queue.submit(model, { input });

  // Validate required fields from FAL API response
  if (!result?.request_id) {
    throw new Error(`FAL API response missing request_id for model ${model}`);
  }

  if (!result?.status_url) {
    throw new Error(`FAL API response missing status_url for model ${model}`);
  }

  return {
    requestId: result.request_id,
    statusUrl: result.status_url,
    responseUrl: result.response_url,
  };
}

export async function getJobStatus(model: string, requestId: string): Promise<JobStatus> {
  const status = await fal.queue.status(model, { requestId, logs: true });

  if (!isValidFalQueueStatus(status)) {
    throw new Error(
      `Invalid FAL queue status response for model ${model}, requestId ${requestId}`
    );
  }

  return mapFalStatusToJobStatus(status);
}

export async function getJobResult<T = unknown>(model: string, requestId: string): Promise<T> {
  const result = await fal.queue.result(model, { requestId });

  if (!result || typeof result !== 'object') {
    throw new Error(
      `Invalid FAL queue result for model ${model}, requestId ${requestId}: Result is not an object`
    );
  }

  // Type guard: ensure result.data exists before casting
  if (!('data' in result)) {
    throw new Error(
      `Invalid FAL queue result for model ${model}, requestId ${requestId}: Missing 'data' property`
    );
  }

  return result.data as T;
}
