/**
 * Job Metadata Utilities
 * Helper functions for job metadata and management
 */

import type { JobStatus } from "@umituz/react-native-ai-generation-content";

/**
 * Job metadata for tracking and persistence
 */
export interface FalJobMetadata {
  readonly requestId: string;
  readonly model: string;
  readonly status: JobStatus["status"];
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly completedAt?: string;
  readonly timeout?: number;
  readonly error?: string;
}

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

/**
 * Get job duration in milliseconds
 */
export function getJobDuration(metadata: FalJobMetadata): number | null {
  if (!metadata.completedAt) {
    return null;
  }
  return new Date(metadata.completedAt).getTime() - new Date(metadata.createdAt).getTime();
}

/**
 * Format job duration for display
 */
export function formatJobDuration(metadata: FalJobMetadata): string {
  const duration = getJobDuration(metadata);
  if (!duration) {
    return "In progress";
  }

  const seconds = Math.floor(duration / 1000);
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
}

/**
 * Calculate job progress percentage
 */
export function calculateJobProgress(metadata: FalJobMetadata): number {
  switch (metadata.status) {
    case "IN_QUEUE":
      return 10;
    case "IN_PROGRESS":
      return 50;
    case "COMPLETED":
      return 100;
    case "FAILED":
      return 0;
    default:
      return 0;
  }
}

/**
 * Serialize job metadata for storage
 */
export function serializeJobMetadata(metadata: FalJobMetadata): string {
  return JSON.stringify(metadata);
}

/**
 * Deserialize job metadata from storage
 */
export function deserializeJobMetadata(data: string): FalJobMetadata | null {
  try {
    return JSON.parse(data) as FalJobMetadata;
  } catch {
    return null;
  }
}

/**
 * Filter valid job metadata from array
 */
export function filterValidJobs(jobs: FalJobMetadata[]): FalJobMetadata[] {
  return jobs.filter((job) => !isJobStale(job));
}

/**
 * Sort jobs by creation time (newest first)
 */
export function sortJobsByCreation(jobs: FalJobMetadata[]): FalJobMetadata[] {
  return [...jobs].sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return timeB - timeA;
  });
}

/**
 * Get active jobs (not completed and not stale)
 */
export function getActiveJobs(jobs: FalJobMetadata[]): FalJobMetadata[] {
  return jobs.filter((job) => isJobRunning(job) && !isJobStale(job));
}

/**
 * Get completed jobs
 */
export function getCompletedJobs(jobs: FalJobMetadata[]): FalJobMetadata[] {
  return jobs.filter((job) => isJobCompleted(job));
}
