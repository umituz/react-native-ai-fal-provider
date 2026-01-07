/**
 * Job Metadata Formatting
 * Duration, progress calculation, and formatting utilities
 */

import type { FalJobMetadata } from "./job-metadata.types";

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
