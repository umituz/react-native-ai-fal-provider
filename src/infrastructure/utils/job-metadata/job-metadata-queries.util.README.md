# Job Metadata Queries

Serialization, filtering, sorting, and query operations for job metadata.

**Location:** `src/infrastructure/utils/job-metadata/job-metadata-queries.util.ts`

## Overview

The job queries module provides utilities for serializing/deserializing job metadata, filtering valid jobs, sorting by creation time, and querying jobs by status.

## Functions

### serializeJobMetadata

Serialize job metadata to JSON string for storage.

**Parameters:**
- `metadata`: Job metadata to serialize

**Returns:** `string` - JSON string representation of job metadata

**Usage:**
Use this function when storing job metadata to persistent storage (AsyncStorage, database, file system). Converts job metadata object to JSON string for safe storage.

**Related:**
- Job storage utilities: `src/infrastructure/utils/job-metadata/index.ts`

### deserializeJobMetadata

Deserialize job metadata from JSON string.

**Parameters:**
- `data`: JSON string to deserialize

**Returns:** `FalJobMetadata | null` - Parsed job metadata, or `null` if invalid JSON

**Behavior:**
- Returns `null` if JSON parsing fails
- Returns parsed `FalJobMetadata` object if successful
- Handles JSON.parse errors gracefully

**Usage:**
Use this function when loading job metadata from storage. Always check for null return value before using the result.

### filterValidJobs

Filter out stale jobs from an array.

**Parameters:**
- `jobs`: Array of job metadata to filter

**Returns:** `FalJobMetadata[]` - Array of non-stale jobs

**Behavior:**
- Removes jobs older than 60 minutes (default `isJobStale` threshold)
- Keeps all other jobs regardless of status
- Creates new array (doesn't modify original)

**Usage:**
Use this function to clean up job lists before display or processing. Removes stale jobs that may be expired or no longer relevant.

**Related:**
- Stale check function: `src/infrastructure/utils/job-metadata/job-metadata-lifecycle.util.ts`

### sortJobsByCreation

Sort jobs by creation time (newest first).

**Parameters:**
- `jobs`: Array of job metadata to sort

**Returns:** `FalJobMetadata[]` - New array sorted by creation time (descending)

**Behavior:**
- Creates new array (doesn't modify original)
- Sorts with newest jobs first
- Uses `createdAt` timestamp for sorting

**Usage:**
Use this function to display jobs in reverse chronological order. Useful for job lists, dashboards, and history views.

### getActiveJobs

Get jobs that are actively running or queued.

**Parameters:**
- `jobs`: Array of job metadata to filter

**Returns:** `FalJobMetadata[]` - Array of active jobs

**Behavior:**
- Includes jobs with status `IN_QUEUE` or `IN_PROGRESS`
- Excludes stale jobs (older than 60 minutes)
- Filters both conditions automatically

**Usage:**
Use this function to get all currently active jobs. Useful for dashboard displays, active job counts, and preventing duplicate submissions.

### getCompletedJobs

Get jobs that have completed (successfully or failed).

**Parameters:**
- `jobs`: Array of job metadata to filter

**Returns:** `FalJobMetadata[]` - Array of completed jobs

**Behavior:**
- Includes jobs with status `COMPLETED` or `FAILED`
- Includes both successful and failed jobs
- Doesn't filter by age (includes old completed jobs)

**Usage:**
Use this function to get job history and completed jobs. Useful for analytics, success rate calculations, and job history displays.

## Usage Guidelines

### For Storage Operations

**Saving Jobs:**
1. Use `serializeJobMetadata()` to convert job to JSON string
2. Store JSON string in persistent storage
3. Use consistent key format (e.g., `job:${requestId}`)
4. Handle storage errors gracefully

**Loading Jobs:**
1. Retrieve JSON string from storage
2. Use `deserializeJobMetadata()` to convert back to object
3. Always check for null return value
4. Handle corrupted data gracefully

**Related:**
- Job storage implementation: `src/infrastructure/utils/job-metadata/index.ts`

### For Job Lists

**Display Preparation:**
1. Load all jobs from storage
2. Use `filterValidJobs()` to remove stale jobs
3. Use `sortJobsByCreation()` for chronological order
4. Apply additional filters if needed

**Active Job Display:**
1. Use `getActiveJobs()` to get running jobs
2. Display in dashboard or job list
3. Update display on status changes
4. Show job count to user

**Completed Job Display:**
1. Use `getCompletedJobs()` for job history
2. Separate successful from failed jobs
3. Calculate success rates
4. Show analytics

### For Analytics

**Job Statistics:**
1. Filter valid jobs with `filterValidJobs()`
2. Use `getActiveJobs()` and `getCompletedJobs()` for counts
3. Calculate success rate from completed jobs
4. Group by model, status, or time period

**Performance Metrics:**
1. Sort jobs by creation time
2. Calculate duration for completed jobs
3. Identify slow or failed jobs
4. Track patterns over time

### For Cleanup Operations

**Stale Job Removal:**
1. Load all jobs from storage
2. Use `filterValidJobs()` to identify stale jobs
3. Delete stale jobs from storage
4. Run periodically (e.g., on app start)

**Storage Management:**
1. Monitor total job count
2. Remove old completed jobs
3. Keep recent active jobs
4. Implement retention policies

## Best Practices

### 1. Always Handle Deserialization Errors

Check for null when deserializing:
- `deserializeJobMetadata()` returns `null` on failure
- Always validate return value before using
- Handle corrupted data gracefully
- Provide fallback or error message

### 2. Validate Before Filtering

Validate input arrays before processing:
- Check if input is actually an array
- Handle empty arrays
- Return empty array for invalid input
- Don't assume valid data structure

### 3. Create New Arrays When Sorting

Use provided sorting function:
- `sortJobsByCreation()` creates new array
- Original array remains unchanged
- Prevents accidental mutation
- Maintains data integrity

### 4. Filter Before Querying

Apply filters before status queries:
- Use `filterValidJobs()` first to remove stale jobs
- Then apply `getActiveJobs()` or `getCompletedJobs()`
- Ensures clean data for queries
- More accurate results

### 5. Chain Operations Appropriately

Chain functions in logical order:
1. Deserialize from storage
2. Filter valid jobs
3. Sort by creation time
4. Apply status filters
5. Display or analyze results

## For AI Agents

### When Working with Serialization

**DO:**
- Use `serializeJobMetadata()` before storage
- Use `deserializeJobMetadata()` after loading
- Always check for null on deserialization
- Handle JSON parsing errors gracefully
- Validate data after deserialization

**DON'T:**
- Store raw objects without serialization
- Assume deserialization always succeeds
- Skip null checks on deserialized data
- Use JSON.stringify/parse directly
- Ignore corrupted data handling

### When Working with Filters

**DO:**
- Filter valid jobs before display
- Remove stale jobs regularly
- Use `getActiveJobs()` for active job lists
- Use `getCompletedJobs()` for job history
- Combine filters for specific queries

**DON'T:**
- Display stale or invalid jobs
- Skip validation before filtering
- Manually implement filter logic
- Forget to handle empty arrays
- Query without filtering first

### When Working with Sorting

**DO:**
- Use `sortJobsByCreation()` for chronological display
- Display newest jobs first
- Use sorted copy for display
- Keep original array unmodified
- Sort after filtering

**DON'T:**
- Sort in-place (modifies original)
- Sort before filtering (inefficient)
- Assume array is sorted
- Implement custom sort logic
- Skip sorting for user displays

### When Adding Features

**For New Query Functions:**
1. Add to same file for consistency
2. Follow existing function patterns
3. Return new arrays (don't mutate)
4. Document filtering/sorting logic
5. Export from index if needed

**For New Storage Backends:**
1. Use serialize/deserialize functions
2. Implement consistent key format
3. Handle storage errors gracefully
4. Add batch operations if needed
5. Document storage schema

## Implementation Notes

**Location:** `src/infrastructure/utils/job-metadata/job-metadata-queries.util.ts`

**Functions:**
- `serializeJobMetadata(metadata: FalJobMetadata): string`
- `deserializeJobMetadata(data: string): FalJobMetadata | null`
- `filterValidJobs(jobs: FalJobMetadata[]): FalJobMetadata[]`
- `sortJobsByCreation(jobs: FalJobMetadata[]): FalJobMetadata[]`
- `getActiveJobs(jobs: FalJobMetadata[]): FalJobMetadata[]`
- `getCompletedJobs(jobs: FalJobMetadata[]): FalJobMetadata[]`

**Dependencies:**
- Uses `FalJobMetadata` type from `job-metadata.types.ts`
- Uses `isJobStale()` from `job-metadata-lifecycle.util.ts`
- Uses JSON.stringify/JSON.parse for serialization
- No external dependencies

**Import:**
```typescript
import {
  serializeJobMetadata,
  deserializeJobMetadata,
  filterValidJobs,
  sortJobsByCreation,
  getActiveJobs,
  getCompletedJobs
} from '@umituz/react-native-ai-fal-provider';
```

**Related:**
- Job metadata types: `src/infrastructure/utils/job-metadata/job-metadata.types.ts`
- Job lifecycle: `src/infrastructure/utils/job-metadata/job-metadata-lifecycle.util.ts`
- Job storage: `src/infrastructure/utils/job-metadata/index.ts`

## Related Documentation

- [Job Metadata Types](./job-metadata.types.README.md)
- [Job Lifecycle](./job-metadata-lifecycle.util.README.md)
- [Job Format](./job-metadata-format.util.README.md)
- [Job Metadata Index](./index.README.md)
