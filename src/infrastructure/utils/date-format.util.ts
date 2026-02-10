/**
 * Date Formatting Utilities
 * Functions for formatting dates and times
 */

/**
 * Format date to locale string
 */
export function formatDate(date: Date | string, locale: string = "en-US"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format date and time to locale string
 */
export function formatDateTime(date: Date | string, locale: string = "en-US"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string, locale: string = "en-US"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (diffSec < 60) {
    return rtf.format(-diffSec, "second");
  }
  if (diffMin < 60) {
    return rtf.format(-diffMin, "minute");
  }
  if (diffHour < 24) {
    return rtf.format(-diffHour, "hour");
  }
  if (diffDay < 30) {
    return rtf.format(-diffDay, "day");
  }
  if (diffDay < 365) {
    const months = Math.floor(diffDay / 30);
    return rtf.format(-months, "month");
  }
  const years = Math.floor(diffDay / 365);
  return rtf.format(-years, "year");
}
