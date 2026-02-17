/**
 * FAL Queue Operations - Direct FAL API queue interactions
 * No silent fallbacks - throws descriptive errors on unexpected responses
 */

import { fal } from "@fal-ai/client";
import type { JobSubmission, JobStatus } from "../../domain/types";
import { mapFalStatusToJobStatus } from "./fal-status-mapper";

/**
 * Submit job to FAL queue
 * @throws {Error} if response is missing required fields
 */
export async function submitJob(model: string, input: Record<string, unknown>): Promise<JobSubmission> {
  const result = await fal.queue.submit(model, { input });

  if (!result?.request_id) {
    throw new Error(
      `FAL queue.submit response missing request_id for model ${model}. Response keys: ${Object.keys(result ?? {}).join(", ")}`
    );
  }

  if (!result?.status_url) {
    throw new Error(
      `FAL queue.submit response missing status_url for model ${model}. Response keys: ${Object.keys(result).join(", ")}`
    );
  }

  return {
    requestId: result.request_id,
    statusUrl: result.status_url,
    responseUrl: result.response_url,
  };
}

/**
 * Get job status from FAL queue
 * @throws {Error} if response format is invalid or status is unrecognized
 */
export async function getJobStatus(model: string, requestId: string): Promise<JobStatus> {
  const raw = await fal.queue.status(model, { requestId, logs: true });

  if (!raw || typeof raw !== "object") {
    throw new Error(
      `FAL queue.status returned non-object for model ${model}, requestId ${requestId}: ${typeof raw}`
    );
  }

  const response = raw as unknown as Record<string, unknown>;

  if (typeof response.status !== "string") {
    throw new Error(
      `FAL queue.status response missing 'status' field for model ${model}, requestId ${requestId}. Keys: ${Object.keys(response).join(", ")}`
    );
  }

  // FAL SDK returns snake_case (request_id, queue_position)
  const resolvedRequestId = (response.request_id ?? response.requestId) as string | undefined;
  if (typeof resolvedRequestId !== "string") {
    throw new Error(
      `FAL queue.status response missing request_id for model ${model}, requestId ${requestId}. Keys: ${Object.keys(response).join(", ")}`
    );
  }

  return mapFalStatusToJobStatus(
    response.status,
    resolvedRequestId,
    (response.queue_position ?? response.queuePosition) as number | undefined,
    Array.isArray(response.logs) ? response.logs : undefined,
  );
}

/**
 * Get job result from FAL queue
 * fal.queue.result returns Result<T> = { data: T, requestId: string }
 * @throws {Error} if response format is unexpected
 */
export async function getJobResult<T = unknown>(model: string, requestId: string): Promise<T> {
  const result = await fal.queue.result(model, { requestId });

  if (!result || typeof result !== 'object') {
    throw new Error(
      `FAL queue.result returned non-object for model ${model}, requestId ${requestId}: ${typeof result}`
    );
  }

  if (!('data' in result)) {
    throw new Error(
      `FAL queue.result response missing 'data' property for model ${model}, requestId ${requestId}. Keys: ${Object.keys(result).join(", ")}`
    );
  }

  return result.data as T;
}
