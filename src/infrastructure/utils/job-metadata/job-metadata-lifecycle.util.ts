/**
 * Job Metadata Lifecycle
 * Create, update, and status check operations
 */

import type { JobStatus } from "@umituz/react-native-ai-generation-content";
import type { FalJobMetadata } from "./job-metadata.types";

/**
 * Create job metadata
 */
export function createJobMetadata(
  requestId: string,
  model: string,
  timeout?: number
): FalJobMetadata {
  const now = new Date().toISOString();
  return {
    requestId,
    model,
    status: "IN_QUEUE",
    createdAt: now,
    updatedAt: now,
    timeout,
  };
}

/**
 * Update job metadata status
 */
export function updateJobMetadata(
  metadata: FalJobMetadata,
  status: JobStatus["status"],
  error?: string
): FalJobMetadata {
  return {
    ...metadata,
    status,
    updatedAt: new Date().toISOString(),
    ...(status === "COMPLETED" || status === "FAILED" ? { completedAt: new Date().toISOString() } : {}),
    ...(error ? { error } : {}),
  };
}

/**
 * Check if job is completed (success or failure)
 */
export function isJobCompleted(metadata: FalJobMetadata): boolean {
  return metadata.status === "COMPLETED" || metadata.status === "FAILED";
}

/**
 * Check if job is running
 */
export function isJobRunning(metadata: FalJobMetadata): boolean {
  return metadata.status === "IN_QUEUE" || metadata.status === "IN_PROGRESS";
}

/**
 * Check if job is stale (older than specified minutes)
 */
export function isJobStale(metadata: FalJobMetadata, maxAgeMinutes: number = 60): boolean {
  const age = Date.now() - new Date(metadata.createdAt).getTime();
  const maxAgeMs = maxAgeMinutes * 60 * 1000;
  return age > maxAgeMs;
}
