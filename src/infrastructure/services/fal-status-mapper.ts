/**
 * FAL Status Mapper
 * Maps FAL queue status to standardized job status
 */

import type { JobStatus, AIJobStatusType } from "@umituz/react-native-ai-generation-content";
import type { FalQueueStatus, FalLogEntry } from "../../domain/entities/fal.types";

const STATUS_MAP: Record<string, AIJobStatusType> = {
  IN_QUEUE: "IN_QUEUE",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
};

export function mapFalStatusToJobStatus(status: FalQueueStatus): JobStatus {
  return {
    status: STATUS_MAP[status.status] ?? "IN_PROGRESS",
    logs: status.logs?.map((log: FalLogEntry) => ({
      message: log.message,
      level: log.level ?? "info",
      timestamp: log.timestamp,
    })),
    queuePosition: status.queuePosition,
  };
}
