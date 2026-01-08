# Job Metadata Lifecycle

Create, update, and manage job lifecycle operations.

**Location:** `src/infrastructure/utils/job-metadata/job-metadata-lifecycle.util.ts`

## Overview

The job lifecycle utilities provide functions for creating new job metadata, updating job status, and checking job state throughout the generation process.

## Functions

### createJobMetadata

Create new job metadata with initial values.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `requestId` | `string` | ✅ Yes | Unique identifier for the job request |
| `model` | `string` | ✅ Yes | FAL model ID to use for generation |
| `timeout` | `number` | ❌ No | Optional timeout in milliseconds |

**Returns:** `FalJobMetadata` - New job metadata object

**Initial Values:**
- `status`: Set to `"IN_QUEUE"`
- `createdAt`: Set to current ISO 8601 timestamp
- `updatedAt`: Set to current ISO 8601 timestamp
- `completedAt`: Not set (undefined)
- `error`: Not set (undefined)

**Usage:**
Call this function when starting a new generation job. The returned metadata object should be stored and updated throughout the job lifecycle.

**Related:**
- Job metadata types: `src/infrastructure/utils/job-metadata/job-metadata.types.ts`

### updateJobMetadata

Update job metadata with new status and error information.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `metadata` | `FalJobMetadata` | ✅ Yes | Existing job metadata to update |
| `status` | `JobStatus["status"]` | ✅ Yes | New status: `IN_QUEUE`, `IN_PROGRESS`, `COMPLETED`, or `FAILED` |
| `error` | `string` | ❌ No | Error message if status is `FAILED` |

**Returns:** `FalJobMetadata` - Updated job metadata

**Behavior:**
- Always updates `updatedAt` to current timestamp
- Sets `completedAt` when status is `COMPLETED` or `FAILED`
- Includes `error` field if provided
- Preserves all other fields from input metadata

**Usage:**
Call this function whenever job status changes. Use immutable pattern - the function returns a new metadata object rather than modifying the input.

### isJobCompleted

Check if a job has completed (successfully or failed).

**Parameters:**
- `metadata`: Job metadata to check

**Returns:** `true` if status is `COMPLETED` or `FAILED`

**Usage:**
Use this type guard to check if a job has finished processing, regardless of success or failure. Useful for conditional logic and cleanup operations.

### isJobRunning

Check if a job is currently running or queued.

**Parameters:**
- `metadata`: Job metadata to check

**Returns:** `true` if status is `IN_QUEUE` or `IN_PROGRESS`

**Usage:**
Use this type guard to check if a job is still active. Useful for polling loops, timeout handling, and preventing duplicate job submissions.

### isJobStale

Check if a job is stale (older than specified age).

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `metadata` | `FalJobMetadata` | - | Job metadata to check |
| `maxAgeMinutes` | `number` | `60` | Maximum age in minutes before considered stale |

**Returns:** `true` if job is older than `maxAgeMinutes`

**Usage:**
Use this function for cleanup operations, stale job detection, and data retention policies. Check jobs periodically and remove or archive stale ones.

## Usage Guidelines

### For Job Creation

**Initial Setup:**
1. Generate or obtain unique `requestId`
2. Identify FAL `model` ID for generation
3. Determine optional `timeout` duration
4. Call `createJobMetadata()` to get initial metadata
5. Store metadata for persistence and tracking

**Best Practices:**
- Use UUID or similar for requestId to ensure uniqueness
- Validate model ID against available models
- Set reasonable timeout based on expected generation time
- Store metadata immediately after creation

### For Job Updates

**Status Transitions:**
1. **IN_QUEUE → IN_PROGRESS**: Job processing started
2. **IN_PROGRESS → COMPLETED**: Job succeeded
3. **IN_PROGRESS → FAILED**: Job failed with error
4. **IN_QUEUE → FAILED**: Job failed before starting

**Update Pattern:**
1. Load existing metadata
2. Determine new status based on job state
3. Provide error message if status is FAILED
4. Call `updateJobMetadata()` with current metadata
5. Store updated metadata (immutable pattern)

**Related:**
- Queue status types: `src/domain/entities/fal.types.ts`

### For Job State Checking

**Completion Checks:**
- Use `isJobCompleted()` for conditional logic
- Use `isJobRunning()` for active job detection
- Combine both for complete state coverage

**Stale Job Detection:**
- Use `isJobStale()` for cleanup operations
- Choose appropriate `maxAgeMinutes` for use case
- Run periodic cleanup tasks
- Archive or delete stale jobs

### For Error Handling

**Failed Jobs:**
1. Capture error message from exception
2. Update job status to FAILED
3. Include error message in metadata
4. Store for debugging and analytics

**Error Information:**
- Error message is preserved in metadata
- Can be retrieved for user display
- Useful for debugging and support
- Track failure patterns over time

## Best Practices

### 1. Always Update Metadata on Status Change

Update metadata whenever job status changes:
- Call `updateJobMetadata()` on each transition
- Preserve metadata throughout job lifecycle
- Store updates immediately
- Use immutable pattern (function returns new object)

### 2. Use Type Guards for Conditional Logic

Use provided type guards for safe status checks:
- `isJobCompleted()` for finished jobs
- `isJobRunning()` for active jobs
- Avoid manual status comparisons
- Type guards provide compile-time safety

### 3. Set Completion Time Automatically

Let `updateJobMetadata()` handle timestamps:
- Don't manually set `completedAt`
- Function handles it automatically
- Consistent timestamp format
- Reduces code duplication

### 4. Include Error Messages for Failures

Always provide error context for failures:
- Include error message when status is FAILED
- Helps with debugging and support
- Provides user-facing error information
- Enables error tracking and analytics

### 5. Use Immutable Update Pattern

Treat metadata as immutable:
- `updateJobMetadata()` returns new object
- Don't modify input metadata directly
- Replace stored metadata with updated version
- Prevents state inconsistency

## For AI Agents

### When Creating Jobs

**DO:**
- Generate unique requestId for each job
- Validate model ID before creating metadata
- Set appropriate timeout for expected duration
- Store metadata immediately after creation
- Follow the immutable pattern

**DON'T:**
- Create multiple jobs with same requestId
- Use invalid or undefined model IDs
- Skip timeout configuration
- Forget to store metadata
- Modify metadata object directly

### When Updating Jobs

**DO:**
- Always use `updateJobMetadata()` for changes
- Provide error messages for failed jobs
- Store updated metadata (replace old version)
- Follow proper status transitions
- Update metadata on every status change

**DON'T:**
- Manually modify metadata fields
- Skip error messages on failures
- Store updates in wrong order
- Make invalid status transitions
- Forget to store updated metadata

### When Checking Job State

**DO:**
- Use `isJobCompleted()` for finished jobs
- Use `isJobRunning()` for active jobs
- Use `isJobStale()` for cleanup operations
- Combine type guards for complete coverage
- Handle all possible status values

**DON'T:**
- Manually check status values
- Skip type guard functions
- Forget null/undefined checks
- Assume job is running without checking
- Ignore stale job detection

### When Adding Features

**For New Status Values:**
1. Update type definition in `job-metadata.types.ts`
2. Update `updateJobMetadata()` if needed
3. Update type guards if logic changes
4. Document new status in this README
5. Update all status transition logic

**For New Lifecycle Functions:**
1. Add to same file for consistency
2. Follow existing function signature patterns
3. Return new metadata object (immutable)
4. Update this README with usage guidelines
5. Export from index if needed

## Implementation Notes

**Location:** `src/infrastructure/utils/job-metadata/job-metadata-lifecycle.util.ts`

**Functions:**
- `createJobMetadata(requestId: string, model: string, timeout?: number): FalJobMetadata`
- `updateJobMetadata(metadata: FalJobMetadata, status: JobStatus["status"], error?: string): FalJobMetadata`
- `isJobCompleted(metadata: FalJobMetadata): boolean`
- `isJobRunning(metadata: FalJobMetadata): boolean`
- `isJobStale(metadata: FalJobMetadata, maxAgeMinutes?: number): boolean`

**Dependencies:**
- Uses `FalJobMetadata` type from `job-metadata.types.ts`
- Uses `JobStatus` type from `src/domain/entities/fal.types.ts`
- Uses Date.now() for timestamp generation
- No external dependencies

**Import:**
```typescript
import {
  createJobMetadata,
  updateJobMetadata,
  isJobCompleted,
  isJobRunning,
  isJobStale
} from '@umituz/react-native-ai-fal-provider';
```

**Related:**
- Job metadata types: `src/infrastructure/utils/job-metadata/job-metadata.types.ts`
- Job format utilities: `src/infrastructure/utils/job-metadata/job-metadata-format.util.ts`
- Job queries: `src/infrastructure/utils/job-metadata/job-metadata-queries.util.ts`

## Related Documentation

- [Job Metadata Types](./job-metadata.types.README.md)
- [Job Format](./job-metadata-format.util.README.md)
- [Job Queries](./job-metadata-queries.util.README.md)
- [Job Metadata Index](./index.README.md)
