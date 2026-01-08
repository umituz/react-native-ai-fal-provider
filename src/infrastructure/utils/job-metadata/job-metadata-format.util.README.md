# Job Metadata Format

Duration calculation, progress tracking, and formatting utilities for job metadata.

**Location:** `src/infrastructure/utils/job-metadata/job-metadata-format.util.ts`

## Overview

The job format utilities provide functions for calculating job duration, formatting time durations for display, and estimating job progress based on status.

## Functions

### getJobDuration

Calculate job duration in milliseconds.

**Parameters:**
- `metadata`: Job metadata to calculate duration for

**Returns:** `number | null` - Duration in milliseconds, or `null` if job hasn't completed

**Behavior:**
- Returns `null` if `completedAt` is not set (job still running)
- Calculates difference between `completedAt` and `createdAt` timestamps

**Usage:**
Call this function to get the raw duration in milliseconds for completed jobs. Always check for null before using the returned value.

### formatJobDuration

Format job duration for human-readable display.

**Parameters:**
- `metadata`: Job metadata to format duration for

**Returns:** `string` - Formatted duration string

**Format Rules:**
- Returns `"In progress"` if job hasn't completed
- Returns `"Xs"` for durations under 1 minute (e.g., `"30s"`)
- Returns `"Xm Ys"` for durations over 1 minute (e.g., `"2m 30s"`)
- Returns `"Xm"` for exact minute durations (e.g., `"5m"`)

**Usage:**
Use this function for displaying job duration in UI components. It handles all formatting logic automatically.

### calculateJobProgress

Estimate job progress percentage based on status.

**Parameters:**
- `metadata`: Job metadata to calculate progress for

**Returns:** `number` - Progress percentage (0-100)

**Progress Values:**

| Status | Progress | Description |
|--------|----------|-------------|
| `IN_QUEUE` | 10% | Job is queued |
| `IN_PROGRESS` | 50% | Job is actively processing |
| `COMPLETED` | 100% | Job completed successfully |
| `FAILED` | 0% | Job failed |

**Usage:**
Use this function for progress bars and status indicators. Provides estimated progress based on job status.

## Usage Guidelines

### For Display Components

**Duration Display:**
1. Use `getJobDuration()` to get raw milliseconds
2. Use `formatJobDuration()` to get human-readable string
3. Always check for null on duration before displaying raw value

**Progress Display:**
1. Use `calculateJobProgress()` to get percentage
2. Display progress value in progress bars or percentage indicators
3. Combine with job status for complete information

**Related:**
- Job metadata types: `src/infrastructure/utils/job-metadata/job-metadata.types.ts`
- Job lifecycle: `src/infrastructure/utils/job-metadata/job-metadata-lifecycle.util.ts`
- Job index: `src/infrastructure/utils/job-metadata/index.ts`

### For Analytics

**Duration Calculation:**
1. Filter jobs by completed status
2. Map `getJobDuration()` to get durations array
3. Filter out null values
4. Calculate statistics (average, min, max)

**Progress Tracking:**
1. Use `calculateJobProgress()` for real-time progress
2. Poll job status for running jobs
3. Update progress display on status changes

### For Storage Operations

**When Saving:**
- Use raw duration from `getJobDuration()` for storage
- Store as number or null in database/async storage

**When Loading:**
- Recalculate `formatJobDuration()` from stored data
- Recalculate `calculateJobProgress()` from job status

## Best Practices

### 1. Always Check Duration Before Display

Use the return value safely:
- `getJobDuration()` returns `number | null`
- Always validate for null before using
- Use `formatJobDuration()` for display (handles null internally)

### 2. Use Formatted Duration for UI

Use `formatJobDuration()` for user-facing displays. Use `getJobDuration()` only for calculations or storage.

### 3. Combine Progress with Status

Show both status and progress for complete information:
- Status shows current state
- Progress shows estimated completion
- Together provide better UX

### 4. Handle In-Progress Jobs

Handle incomplete jobs appropriately:
- `getJobDuration()` returns null for running jobs
- `formatJobDuration()` returns "In progress"
- `calculateJobProgress()` returns 10-50% for active jobs

## For AI Agents

### When Working with Job Duration

**DO:**
- Read the implementation in `src/infrastructure/utils/job-metadata/job-metadata-format.util.ts`
- Check for null when using `getJobDuration()`
- Use `formatJobDuration()` for UI display
- Use `getJobDuration()` for calculations/storage

**DON'T:**
- Assume `getJobDuration()` always returns a number
- Manually calculate duration differences
- Duplicate the formatting logic
- Ignore null checks

### When Working with Progress

**DO:**
- Use `calculateJobProgress()` for progress bars
- Combine with job status for complete info
- Update progress when job status changes
- Understand progress is estimated, not exact

**DON'T:**
- Assume progress is real-time (it's status-based)
- Manually calculate progress percentages
- Show progress without status context
- Assume progress maps to actual completion time

### When Adding Features

**For New Time Formats:**
1. Add new formatting function to same file
2. Follow existing pattern with clear parameter types
3. Document format rules in this README
4. Export from index if needed

**For New Progress Calculations:**
1. Create separate function if logic differs
2. Maintain consistent return type (number 0-100)
3. Document progress values in table format
4. Consider queue position, timing, etc.

## Implementation Notes

**Location:** `src/infrastructure/utils/job-metadata/job-metadata-format.util.ts`

**Functions:**
- `getJobDuration(metadata: FalJobMetadata): number | null`
- `formatJobDuration(metadata: FalJobMetadata): string`
- `calculateJobProgress(metadata: FalJobMetadata): number`

**Dependencies:**
- Uses `FalJobMetadata` type from `job-metadata.types.ts`
- Uses ISO 8601 timestamp format for date calculations
- No external dependencies

**Import:**
```typescript
import {
  getJobDuration,
  formatJobDuration,
  calculateJobProgress
} from '@umituz/react-native-ai-fal-provider';
```

## Related Documentation

- [Job Metadata Types](./job-metadata.types.README.md)
- [Job Lifecycle](./job-metadata-lifecycle.util.README.md)
- [Job Queries](./job-metadata-queries.util.README.md)
- [Job Metadata Index](./index.README.md)
