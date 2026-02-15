/**
 * Job Metadata Formatting
 * Duration, progress calculation, and formatting utilities
 */

import type { FalJobMetadata } from "./job-metadata.types";

/**
 * Get job duration in milliseconds
 * Returns null if job not completed or if dates are invalid
 */
export function getJobDuration(metadata: FalJobMetadata): number | null {
  if (!metadata.completedAt) {
    return null;
  }

  const completedTime = new Date(metadata.completedAt).getTime();
  const createdTime = new Date(metadata.createdAt).getTime();

  // Validate both dates parsed correctly
  if (isNaN(completedTime) || isNaN(createdTime)) {
    console.warn(
      '[job-metadata] Invalid date(s) in metadata:',
      { completedAt: metadata.completedAt, createdAt: metadata.createdAt }
    );
    return null;
  }

  const duration = completedTime - createdTime;

  // Sanity check: duration should be positive
  if (duration < 0) {
    console.warn(
      '[job-metadata] Negative duration detected (completedAt < createdAt):',
      { duration, completedAt: metadata.completedAt, createdAt: metadata.createdAt }
    );
    return null;
  }

  return duration;
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
