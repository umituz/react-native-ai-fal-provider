/**
 * FAL Queue Operations - Direct FAL API queue interactions
 */

import { fal } from "@fal-ai/client";
import type { JobSubmission, JobStatus } from "../../domain/types";
import type { FalQueueStatus } from "../../domain/entities/fal.types";
import { mapFalStatusToJobStatus, FAL_QUEUE_STATUSES } from "./fal-status-mapper";

const VALID_STATUSES = Object.values(FAL_QUEUE_STATUSES) as string[];

/**
 * Normalize FAL queue status response from snake_case (SDK) to camelCase (internal)
 */
function normalizeFalQueueStatus(value: unknown): FalQueueStatus | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const raw = value as Record<string, unknown>;

  if (typeof raw.status !== "string" || !VALID_STATUSES.includes(raw.status)) {
    return null;
  }

  // FAL SDK returns snake_case (request_id, queue_position)
  const requestId = (raw.request_id ?? raw.requestId) as string | undefined;
  if (typeof requestId !== "string") {
    return null;
  }

  return {
    status: raw.status as FalQueueStatus["status"],
    requestId,
    queuePosition: (raw.queue_position ?? raw.queuePosition) as number | undefined,
    logs: Array.isArray(raw.logs) ? raw.logs : undefined,
  };
}

export async function submitJob(model: string, input: Record<string, unknown>): Promise<JobSubmission> {
  const result = await fal.queue.submit(model, { input });

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
  const raw = await fal.queue.status(model, { requestId, logs: true });

  const status = normalizeFalQueueStatus(raw);
  if (!status) {
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

  if (!('data' in result)) {
    throw new Error(
      `Invalid FAL queue result for model ${model}, requestId ${requestId}: Missing 'data' property`
    );
  }

  return result.data as T;
}
