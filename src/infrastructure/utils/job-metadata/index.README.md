# Job Metadata Utilities

Comprehensive job lifecycle management and metadata tracking utilities.

**Location:** `src/infrastructure/utils/job-metadata/index.ts`

## Overview

The job metadata module provides a complete toolkit for creating, updating, querying, and managing FAL AI generation jobs throughout their lifecycle. This enables robust job tracking, persistence, and monitoring capabilities.

## Purpose

Provides job management by:
- Creating job metadata
- Updating job status
- Tracking job lifecycle
- Calculating durations and progress
- Querying job states
- Serializing/deserializing jobs

## Import

```typescript
import {
  createJobMetadata,
  updateJobMetadata,
  isJobCompleted,
  isJobRunning,
  getJobDuration,
  formatJobDuration,
  calculateJobProgress
} from '@umituz/react-native-ai-fal-provider';
```

## Export Categories

### Types

**FalJobMetadata** - Job metadata interface
**Path:** `src/infrastructure/utils/job-metadata/job-metadata.types.ts`

### Lifecycle Management

**Functions:**
- `createJobMetadata` - Create new job metadata
- `updateJobMetadata` - Update existing job metadata
- `isJobCompleted` - Check if job is completed
- `isJobRunning` - Check if job is running
- `isJobStale` - Check if job is stale

**Path:** `src/infrastructure/utils/job-metadata/job-metadata-lifecycle.util.ts`

### Formatting & Calculation

**Functions:**
- `getJobDuration` - Get job duration in milliseconds
- `formatJobDuration` - Format duration for display
- `calculateJobProgress` - Calculate job progress percentage

**Path:** `src/infrastructure/utils/job-metadata/job-metadata-format.util.ts`

### Queries & Serialization

**Functions:**
- `serializeJobMetadata` - Serialize job to JSON
- `deserializeJobMetadata` - Deserialize JSON to job
- `filterValidJobs` - Filter valid jobs
- `sortJobsByCreation` - Sort jobs by creation time
- `getActiveJobs` - Get active (running/queued) jobs
- `getCompletedJobs` - Get completed jobs

**Path:** `src/infrastructure/utils/job-metadata/job-metadata-queries.util.ts`

## Usage Guidelines

### For Job Creation

**Creation Pattern:**
1. Call createJobMetadata with model and input
2. Receive FalJobMetadata object
3. Save to storage
4. Track throughout lifecycle
5. Update as status changes

**Best Practices:**
- Create jobs before API calls
- Save immediately to storage
- Track all status changes
- Update timestamps appropriately
- Calculate durations on completion

### For Status Tracking

**Tracking Pattern:**
1. Create job with initial status
2. Update status as job progresses
3. Check completion with isJobCompleted
4. Calculate durations and progress
5. Update final state

**Best Practices:**
- Update status on all changes
- Save updates to storage
- Calculate metrics on completion
- Track timestamps accurately
- Query job states efficiently

### For Job Queries

**Query Pattern:**
1. Load jobs from storage
2. Filter valid jobs with filterValidJobs
3. Sort by creation time
4. Query active/completed jobs
5. Calculate statistics

**Best Practices:**
- Always filter before querying
- Sort for consistent ordering
- Use specific query functions
- Handle missing jobs gracefully
- Aggregate job statistics

## Best Practices

### 1. Always Save Updates

Persist job changes:
- Save after every update
- Maintain storage consistency
- Update timestamps correctly
- Handle save failures
- Verify persistence

### 2. Handle Missing Jobs

Manage job lifecycle:
- Check if job exists before operations
- Handle missing job errors
- Provide default values
- Log missing job warnings
- Create error handlers

### 3. Clean Up Old Jobs

Maintain storage efficiency:
- Remove stale jobs regularly
- Implement cleanup schedules
- Check job age before cleanup
- Log cleanup operations
- Balance retention vs cleanup

### 4. Use Type Guards

Ensure type safety:
- Use isJobCompleted for completion checks
- Use isJobRunning for active checks
- Leverage type narrowing
- Check job states explicitly
- Enable autocomplete

### 5. Calculate Metrics

Track job performance:
- Calculate durations accurately
- Compute progress percentages
- Aggregate job statistics
- Monitor success rates
- Track model performance

## For AI Agents

### When Managing Jobs

**DO:**
- Create jobs before operations
- Update status on changes
- Save all updates to storage
- Calculate durations and progress
- Clean up old jobs regularly
- Handle missing jobs gracefully
- Track job lifecycle

**DON'T:**
- Skip job creation
- Forget status updates
- Lose job information
- Create stale data
- Ignore cleanup
- Handle jobs inconsistently
- Create memory leaks

### When Tracking Status

**DO:**
- Update status on all changes
- Check completion status
- Calculate durations accurately
- Compute progress percentages
- Query job states efficiently
- Use type guard functions
- Monitor job lifecycle

**DON'T:**
- Skip status updates
- Forget completion checks
- Calculate durations incorrectly
- Compute wrong progress
- Query jobs inefficiently
- Use unsafe type operations
- Create tracking bugs

### When Querying Jobs

**DO:**
- Filter jobs before querying
- Sort jobs by creation
- Use specific query functions
- Handle missing jobs
- Calculate statistics
- Aggregate job data
- Handle empty results

**DON'T:**
- Skip filtering
- Use inconsistent ordering
- Use generic queries
- Crash on missing jobs
- Create inefficient queries
- Forget aggregation
- Handle errors poorly

## Implementation Notes

**Location:** `src/infrastructure/utils/job-metadata/index.ts`

**Dependencies:**
- Job types: `src/infrastructure/utils/job-metadata/job-metadata.types.ts`
- Lifecycle utilities: `src/infrastructure/utils/job-metadata/job-metadata-lifecycle.util.ts`
- Format utilities: `src/infrastructure/utils/job-metadata/job-metadata-format.util.ts`
- Query utilities: `src/infrastructure/utils/job-metadata/job-metadata-queries.util.ts`

**Function Categories:**
- Lifecycle management
- Formatting and calculation
- Queries and serialization
- Type definitions
- Storage operations

**Import:**
```typescript
import {
  createJobMetadata,
  updateJobMetadata,
  isJobCompleted,
  isJobRunning,
  getJobDuration,
  formatJobDuration,
  calculateJobProgress
} from '@umituz/react-native-ai-fal-provider';
```

**Related:**
- Job types: `src/infrastructure/utils/job-metadata/job-metadata.types.README.md`
- Job lifecycle: `src/infrastructure/utils/job-metadata/job-metadata-lifecycle.util.README.md`
- Job format: `src/infrastructure/utils/job-metadata/job-metadata-format.util.README.md`
- Job queries: `src/infrastructure/utils/job-metadata/job-metadata-queries.util.README.md`
