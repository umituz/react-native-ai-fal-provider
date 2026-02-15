/**
 * Number Formatting Utilities
 * Functions for formatting numbers and quantities
 */

/**
 * Format number with decimal places
 */
export function formatNumber(value: number, decimals: number = 2): string {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return "0";
  }

  // Return integer if no decimal part
  if (value % 1 === 0) {
    return value.toString();
  }

  return value.toFixed(decimals);
}

/**
 * Format bytes to human-readable size
 * Handles edge cases: negative bytes, NaN, Infinity, extremely large values
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  // Handle invalid inputs
  if (!Number.isFinite(bytes) || Number.isNaN(bytes)) {
    return "0 Bytes";
  }

  // Handle negative bytes
  if (bytes < 0) {
    return `-${formatBytes(-bytes, decimals)}`;
  }

  // Handle zero
  if (bytes === 0) {
    return "0 Bytes";
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // Clamp index to valid range
  const index = Math.min(i, sizes.length - 1);

  // For extremely large values beyond our size array
  if (index >= sizes.length - 1 && i > sizes.length - 1) {
    const exponent = i - (sizes.length - 1);
    const value = bytes / Math.pow(k, sizes.length - 1);
    return `${parseFloat(value.toFixed(dm))} ${sizes[sizes.length - 1]} × ${k}^${exponent}`;
  }

  return `${parseFloat((bytes / Math.pow(k, index)).toFixed(dm))} ${sizes[index]}`;
}

/**
 * Format duration in milliseconds to human-readable string
 */
export function formatDuration(milliseconds: number): string {
  if (milliseconds < 1000) {
    return `${milliseconds}ms`;
  }

  const seconds = Math.floor(milliseconds / 1000);
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes < 60) {
    return remainingSeconds > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0
    ? `${hours}h ${remainingMinutes}m`
    : `${hours}h`;
}
