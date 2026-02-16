/**
 * FAL Status Mapper
 * Maps FAL queue status to standardized job status
 */

import type { JobStatus, AIJobStatusType } from "../../domain/types";
import type { FalQueueStatus, FalLogEntry } from "../../domain/entities/fal.types";

export const FAL_QUEUE_STATUSES = {
  IN_QUEUE: "IN_QUEUE",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

export type FalQueueStatusKey = keyof typeof FAL_QUEUE_STATUSES;

const STATUS_MAP = FAL_QUEUE_STATUSES satisfies Record<string, AIJobStatusType>;

const DEFAULT_STATUS: AIJobStatusType = "IN_PROGRESS";

/**
 * Map FAL queue status to standardized job status
 * Provides safe defaults for missing or invalid values
 */
export function mapFalStatusToJobStatus(status: FalQueueStatus): JobStatus {
  const mappedStatus = STATUS_MAP[status.status] ?? DEFAULT_STATUS;

  return {
    status: mappedStatus,
    logs: Array.isArray(status.logs)
      ? status.logs.map((log: FalLogEntry) => ({
          message: log.message,
          level: log.level ?? "info",
          timestamp: log.timestamp ?? new Date().toISOString(),
        }))
      : [],
    queuePosition: status.queuePosition ?? undefined,
    requestId: status.requestId,
  };
}
