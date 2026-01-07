/**
 * Job Storage Query Operations
 * Query and batch operations for job metadata
 */

import type { FalJobMetadata } from "../job-metadata";
import type { IJobStorage } from "./job-storage-interface";
import { deleteJobMetadata } from "./job-storage-crud.util";

/**
 * Load all jobs from storage
 */
export async function loadAllJobs(
  storage: IJobStorage
): Promise<FalJobMetadata[]> {
  if (!storage.getAllKeys) {
    return [];
  }

  const keys = await storage.getAllKeys();
  const jobKeys = keys.filter((key) => key.startsWith("fal_job:"));

  const jobs: FalJobMetadata[] = [];
  for (const key of jobKeys) {
    const value = await storage.getItem(key);
    if (value) {
      try {
        const metadata = JSON.parse(value) as FalJobMetadata;
        jobs.push(metadata);
      } catch {
        // Skip invalid entries
        continue;
      }
    }
  }

  return jobs;
}

/**
 * Clean up old jobs from storage
 */
export async function cleanupOldJobs(
  storage: IJobStorage,
  maxAgeMinutes: number = 60
): Promise<number> {
  const jobs = await loadAllJobs(storage);
  const now = Date.now();
  const maxAgeMs = maxAgeMinutes * 60 * 1000;
  let cleanedCount = 0;

  for (const job of jobs) {
    const jobAge = now - new Date(job.createdAt).getTime();
    if (jobAge > maxAgeMs) {
      await deleteJobMetadata(storage, job.requestId);
      cleanedCount++;
    }
  }

  return cleanedCount;
}

/**
 * Get jobs by model
 */
export async function getJobsByModel(
  storage: IJobStorage,
  model: string
): Promise<FalJobMetadata[]> {
  const jobs = await loadAllJobs(storage);
  return jobs.filter((job) => job.model === model);
}

/**
 * Get jobs by status
 */
export async function getJobsByStatus(
  storage: IJobStorage,
  status: FalJobMetadata["status"]
): Promise<FalJobMetadata[]> {
  const jobs = await loadAllJobs(storage);
  return jobs.filter((job) => job.status === status);
}
