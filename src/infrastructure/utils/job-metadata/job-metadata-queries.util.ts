/**
 * Job Metadata Queries
 * Serialization and array operations
 */

import type { FalJobMetadata } from "./job-metadata.types";
import { isJobStale, isJobRunning, isJobCompleted } from "./job-metadata-lifecycle.util";

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
