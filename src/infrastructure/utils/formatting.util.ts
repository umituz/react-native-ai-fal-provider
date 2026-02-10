/**
 * Formatting Utilities
 * Common formatting functions for display and data presentation
 *
 * This module re-exports formatting utilities from specialized modules
 * for better organization and maintainability.
 */

export {
  formatDate,
  formatDateTime,
  formatRelativeTime,
} from "./date-format.util";

export {
  formatNumber,
  formatCurrency,
  formatBytes,
  formatDuration,
  formatPercentage,
} from "./number-format.util";

export {
  truncateText,
  capitalize,
  toTitleCase,
  toSlug,
  formatList,
  pluralize,
  formatCount,
} from "./string-format.util";
