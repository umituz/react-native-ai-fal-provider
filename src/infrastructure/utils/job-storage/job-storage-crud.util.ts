/**
 * Job Storage CRUD Operations
 * Basic create, read, update, delete operations for job metadata
 */

import type { FalJobMetadata } from "../job-metadata";
import { updateJobMetadata } from "../job-metadata";
import type { IJobStorage } from "./job-storage-interface";

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

  const updated = updateJobMetadata(metadata, status, error);
  await saveJobMetadata(storage, updated);
}
