/**
 * FAL Status Mapper
 * Maps FAL queue status to standardized job status
 * Validates status values - throws on unknown status instead of silent fallback
 */

import type { JobStatus, AIJobStatusType } from "../../domain/types";
import type { FalLogEntry } from "../../domain/entities/fal.types";

const VALID_STATUSES: Record<string, AIJobStatusType> = {
  IN_QUEUE: "IN_QUEUE",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
};

/**
 * Map raw FAL status values to standardized JobStatus
 * Validates all inputs - no unsafe casts
 *
 * @throws {Error} if status is not a recognized FAL queue status
 */
export function mapFalStatusToJobStatus(
  rawStatus: string,
  requestId?: string,
  queuePosition?: number,
  logs?: unknown[],
): JobStatus {
  const mappedStatus = VALID_STATUSES[rawStatus];
  if (!mappedStatus) {
    throw new Error(
      `Unknown FAL queue status: "${rawStatus}". Expected one of: ${Object.keys(VALID_STATUSES).join(", ")}`
    );
  }

  return {
    status: mappedStatus,
    logs: Array.isArray(logs)
      ? logs.map((log) => {
          const entry = log as FalLogEntry;
          return {
            message: typeof entry?.message === "string" ? entry.message : String(log),
            level: typeof entry?.level === "string" ? entry.level : "info",
            timestamp: typeof entry?.timestamp === "string" ? entry.timestamp : new Date().toISOString(),
          };
        })
      : [],
    queuePosition: typeof queuePosition === "number" ? queuePosition : undefined,
    requestId: typeof requestId === "string" ? requestId : "",
  };
}
