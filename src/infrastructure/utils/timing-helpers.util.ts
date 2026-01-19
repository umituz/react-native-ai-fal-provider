/**
 * Timing Helper Utilities
 * Functions for timing, debouncing, and throttling
 */

/**
 * Calculate timeout with jitter to avoid thundering herd
 */
export function calculateTimeoutWithJitter(
  baseTimeout: number,
  jitterPercent: number = 0.1
): number {
  const jitter = baseTimeout * jitterPercent;
  const randomJitter = Math.random() * jitter - jitter / 2;
  return Math.max(1000, baseTimeout + randomJitter);
}

/**
 * Debounce function (for rate limiting)
 */
export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Simple throttle function
 */
export function throttle<T extends (...args: never[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
