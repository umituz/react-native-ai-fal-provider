/**
 * FAL Queue Operations - Direct FAL API queue interactions
 */

import { fal } from "@fal-ai/client";
import type { JobSubmission, JobStatus } from "@umituz/react-native-ai-generation-content";
import type { FalQueueStatus } from "../../domain/entities/fal.types";
import { mapFalStatusToJobStatus } from "./fal-status-mapper";

export async function submitJob(model: string, input: Record<string, unknown>): Promise<JobSubmission> {
  const result = await fal.queue.submit(model, { input });
  return {
    requestId: result.request_id,
    statusUrl: result.status_url,
    responseUrl: result.response_url,
  };
}

export async function getJobStatus(model: string, requestId: string): Promise<JobStatus> {
  const status = await fal.queue.status(model, { requestId, logs: true });
  return mapFalStatusToJobStatus(status as unknown as FalQueueStatus);
}

export async function getJobResult<T = unknown>(model: string, requestId: string): Promise<T> {
  const result = await fal.queue.result(model, { requestId });
  return result.data as T;
}
