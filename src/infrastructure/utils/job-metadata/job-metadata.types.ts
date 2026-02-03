/**
 * Job Metadata Types
 */

import type { JobStatus } from "../../../domain/types";

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
