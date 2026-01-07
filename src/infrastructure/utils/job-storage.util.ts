/**
 * Job Storage Utilities
 * Helper functions for job persistence and storage integration
 */

import type { FalJobMetadata } from "./job-metadata.util";

/**
 * Generic storage interface for job persistence
 * Implement this interface with your preferred storage backend
 */
export interface IJobStorage {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
  getAllKeys?(): Promise<readonly string[]>;
}

/**
 * Save job metadata to storage
 */
export async function saveJobMetadata(
  storage: IJobStorage,
  metadata: FalJobMetadata
): Promise<void> {
  const key = `fal_job:${metadata.requestId}`;
  const value = JSON.stringify(metadata);
  await storage.setItem(key, value);
}

/**
 * Load job metadata from storage
 */
export async function loadJobMetadata(
  storage: IJobStorage,
  requestId: string
): Promise<FalJobMetadata | null> {
  const key = `fal_job:${requestId}`;
  const value = await storage.getItem(key);
  if (!value) return null;

  try {
    return JSON.parse(value) as FalJobMetadata;
  } catch {
    return null;
  }
}

/**
 * Delete job metadata from storage
 */
export async function deleteJobMetadata(
  storage: IJobStorage,
  requestId: string
): Promise<void> {
  const key = `fal_job:${requestId}`;
  await storage.removeItem(key);
}

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

/**
 * Update job status in storage
 */
export async function updateJobStatus(
  storage: IJobStorage,
  requestId: string,
  status: FalJobMetadata["status"],
  error?: string
): Promise<void> {
  const metadata = await loadJobMetadata(storage, requestId);
  if (!metadata) {
    throw new Error(`Job not found: ${requestId}`);
  }

  const updated: FalJobMetadata = {
    ...metadata,
    status,
    updatedAt: new Date().toISOString(),
    ...(status === "COMPLETED" || status === "FAILED" ? { completedAt: new Date().toISOString() } : {}),
    ...(error ? { error } : {}),
  };

  await saveJobMetadata(storage, updated);
}

/**
 * Create a simple in-memory storage for testing
 */
export class InMemoryJobStorage implements IJobStorage {
  private store = new Map<string, string>();

  setItem(key: string, value: string): Promise<void> {
    this.store.set(key, value);
    return Promise.resolve();
  }

  getItem(key: string): Promise<string | null> {
    return Promise.resolve(this.store.get(key) ?? null);
  }

  removeItem(key: string): Promise<void> {
    this.store.delete(key);
    return Promise.resolve();
  }

  getAllKeys(): Promise<readonly string[]> {
    return Promise.resolve(Array.from(this.store.keys()));
  }

  clear(): void {
    this.store.clear();
  }
}
