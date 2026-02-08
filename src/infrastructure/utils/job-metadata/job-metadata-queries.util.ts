/**
 * Job Metadata Queries
 * Serialization and array operations
 */

import type { FalJobMetadata } from "./job-metadata.types";
import { isJobStale, isJobRunning, isJobCompleted } from "./job-metadata-lifecycle.util";
import { sortByDateDescending, filterByPredicate } from "../collection-filters.util";
import { safeJsonParseOrNull, validateObjectStructure } from "../data-parsers.util";

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
  const parsed = safeJsonParseOrNull<Record<string, unknown>>(data);

  if (!parsed || !validateObjectStructure<Partial<FalJobMetadata>>(parsed, ["requestId", "model", "status"] as const)) {
    return null;
  }

  return parsed as FalJobMetadata;
}

/**
 * Filter valid job metadata from array
 */
export function filterValidJobs(jobs: FalJobMetadata[]): FalJobMetadata[] {
  return filterByPredicate(jobs, (job) => !isJobStale(job));
}

/**
 * Sort jobs by creation time (newest first)
 */
export function sortJobsByCreation(jobs: FalJobMetadata[]): FalJobMetadata[] {
  return sortByDateDescending(jobs, "createdAt");
}

/**
 * Get active jobs (not completed and not stale)
 */
export function getActiveJobs(jobs: FalJobMetadata[]): FalJobMetadata[] {
  return filterByPredicate(jobs, (job) => isJobRunning(job) && !isJobStale(job));
}

/**
 * Get completed jobs
 */
export function getCompletedJobs(jobs: FalJobMetadata[]): FalJobMetadata[] {
  return filterByPredicate(jobs, isJobCompleted);
}
