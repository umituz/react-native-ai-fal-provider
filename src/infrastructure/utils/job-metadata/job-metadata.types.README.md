# Job Metadata Types

Type definitions for FAL AI job metadata tracking and persistence.

## Overview

Job metadata types provide the structure for tracking AI generation jobs throughout their lifecycle. This enables job monitoring, persistence, and status tracking across application sessions.

## Types

### FalJobMetadata

Complete metadata structure for a FAL AI job.

```typescript
interface FalJobMetadata {
  readonly requestId: string;              // Unique job request ID
  readonly model: string;                 // Model ID used for generation
  readonly status: JobStatus["status"];   // Current job status
  readonly createdAt: string;             // ISO 8601 creation timestamp
  readonly updatedAt: string;             // ISO 8601 last update timestamp
  readonly completedAt?: string;          // ISO 8601 completion timestamp
  readonly timeout?: number;              // Timeout in milliseconds
  readonly error?: string;                // Error message if failed
}
```

**Properties:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `requestId` | `string` | ✅ Yes | Unique identifier for the job request |
| `model` | `string` | ✅ Yes | FAL model ID used for generation |
| `status` | `JobStatus["status"]` | ✅ Yes | Current status: `IN_QUEUE`, `IN_PROGRESS`, `COMPLETED`, or `FAILED` |
| `createdAt` | `string` | ✅ Yes | ISO 8601 timestamp when job was created |
| `updatedAt` | `string` | ✅ Yes | ISO 8601 timestamp of last update |
| `completedAt` | `string` | ❌ No | ISO 8601 timestamp when job completed |
| `timeout` | `number` | ❌ No | Job timeout in milliseconds |
| `error` | `string` | ❌ No | Error message if job failed |

**Status Values:**

```typescript
type JobStatus = {
  status: 'IN_QUEUE'      | // Job is queued
           'IN_PROGRESS'  | // Job is actively processing
           'COMPLETED'    | // Job completed successfully
           'FAILED';       | // Job failed
}
```

## Usage

### Creating Job Metadata

```typescript
import { createJobMetadata } from '@umituz/react-native-ai-fal-provider';

const job = createJobMetadata('fal-ai/flux/schnell', {
  prompt: 'A beautiful sunset',
  image_size: 'landscape_16_9',
});

console.log(job);
// {
//   requestId: 'uuid-string',
//   model: 'fal-ai/flux/schnell',
//   status: 'IN_QUEUE',
//   createdAt: '2024-01-08T10:30:00.000Z',
//   updatedAt: '2024-01-08T10:30:00.000Z'
// }
```

### Updating Job Metadata

```typescript
import { updateJobMetadata } from '@umituz/react-native-ai-fal-provider';

const updatedJob = updateJobMetadata(job, {
  status: 'COMPLETED',
  completedAt: new Date().toISOString(),
});

console.log(updatedJob);
// {
//   ...job,
//   status: 'COMPLETED',
//   completedAt: '2024-01-08T10:35:00.000Z',
//   updatedAt: '2024-01-08T10:35:00.000Z'
// }
```

### Checking Job Status

```typescript
import { isJobCompleted, isJobRunning, isJobStale } from '@umituz/react-native-ai-fal-provider';

if (isJobCompleted(job)) {
  console.log('Job completed successfully');
}

if (isJobRunning(job)) {
  console.log('Job is still running');
}

if (isJobStale(job, 3600000)) {
  console.log('Job is stale (older than 1 hour)');
}
```

### Calculating Job Duration

```typescript
import { getJobDuration, formatJobDuration } from '@umituz/react-native-ai-fal-provider';

const durationMs = getJobDuration(job); // milliseconds
const formatted = formatJobDuration(durationMs); // "2m 30s"

console.log(`Job took: ${formatted}`);
```

### Serializing for Storage

```typescript
import {
  serializeJobMetadata,
  deserializeJobMetadata
} from '@umituz/react-native-ai-fal-provider';

// Serialize to JSON string
const json = serializeJobMetadata(job);

// Deserialize from JSON string
const restored = deserializeJobMetadata(json);
```

## Lifecycle Examples

### Complete Job Lifecycle

```typescript
import {
  createJobMetadata,
  updateJobMetadata,
  saveJobMetadata,
  isJobCompleted,
} from '@umituz/react-native-ai-fal-provider';

async function trackJob(modelId: string, input: FalJobInput) {
  // 1. Create job metadata
  const job = createJobMetadata(modelId, input);
  await saveJobMetadata(job);

  console.log(`Job ${job.requestId} created`);

  // 2. Start generation
  updateJobMetadata(job, { status: 'IN_PROGRESS' });
  await saveJobMetadata(job);

  try {
    // 3. Execute generation
    const result = await falProvider.subscribe(modelId, input);

    // 4. Mark as completed
    updateJobMetadata(job, {
      status: 'COMPLETED',
      completedAt: new Date().toISOString(),
    });
    await saveJobMetadata(job);

    return result;
  } catch (error) {
    // 5. Handle failure
    updateJobMetadata(job, {
      status: 'FAILED',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    await saveJobMetadata(job);

    throw error;
  }
}
```

### Job Progress Tracking

```typescript
import {
  createJobMetadata,
  updateJobMetadata,
  calculateJobProgress,
} from '@umituz/react-native-ai-fal-provider';

function trackJobProgress(job: FalJobMetadata) {
  const progress = calculateJobProgress(job);

  console.log(`Job progress: ${progress}%`);

  if (progress === 0) {
    console.log('Job is queued');
  } else if (progress < 100) {
    console.log('Job is in progress');
  } else {
    console.log('Job is complete');
  }
}
```

### Job History Management

```typescript
import {
  createJobMetadata,
  updateJobMetadata,
  filterValidJobs,
  sortJobsByCreation,
  getActiveJobs,
  getCompletedJobs,
} from '@umituz/react-native-ai-fal-provider';

class JobHistory {
  private jobs: FalJobMetadata[] = [];

  add(job: FalJobMetadata) {
    this.jobs.push(job);
  }

  getRecent(count: number = 10) {
    return sortJobsByCreation(this.jobs).slice(0, count);
  }

  getActive() {
    return getActiveJobs(this.jobs);
  }

  getCompleted() {
    return getCompletedJobs(this.jobs);
  }

  cleanup() {
    // Remove invalid jobs
    this.jobs = filterValidJobs(this.jobs);
  }

  getByStatus(status: JobStatus['status']) {
    return this.jobs.filter(job => job.status === status);
  }
}
```

## Best Practices

### 1. Always Timestamp Updates

```typescript
// ✅ Good: Always update timestamp
const updated = updateJobMetadata(job, {
  status: 'COMPLETED',
  completedAt: new Date().toISOString(), // updateJobMetadata handles this
});

// ❌ Bad: Manual timestamp updates
const updated = {
  ...job,
  status: 'COMPLETED',
  updatedAt: new Date().toISOString(), // Duplicate work
};
```

### 2. Store Error Messages

```typescript
try {
  await falProvider.subscribe(modelId, input);
} catch (error) {
  updateJobMetadata(job, {
    status: 'FAILED',
    error: error instanceof Error ? error.message : String(error),
  });
}
```

### 3. Use Type Guards

```typescript
import { isJobCompleted, isJobRunning } from '@umituz/react-native-ai-fal-provider';

function handleJob(job: FalJobMetadata) {
  if (isJobCompleted(job)) {
    // Type narrowing: job.completedAt is defined
    console.log(`Completed at ${job.completedAt}`);
  }

  if (isJobRunning(job)) {
    // Job is actively processing
    console.log('Job is running');
  }
}
```

### 4. Validate Before Storage

```typescript
import { filterValidJobs } from '@umituz/react-native-ai-fal-provider';

// Validate jobs before saving
const validJobs = filterValidJobs(allJobs);

if (validJobs.length !== allJobs.length) {
  console.warn(`Filtered ${allJobs.length - validJobs.length} invalid jobs`);
}

await Promise.all(validJobs.map(saveJobMetadata));
```

## Integration Examples

### With React State

```typescript
import { useState, useEffect } from 'react';
import type { FalJobMetadata } from '@umituz/react-native-ai-fal-provider';

function JobTracker({ requestId }: { requestId: string }) {
  const [job, setJob] = useState<FalJobMetadata | null>(null);

  useEffect(() => {
    const loadJob = async () => {
      const loadedJob = await loadJobMetadata(requestId);
      setJob(loadedJob);
    };

    loadJob();

    // Poll for updates
    const interval = setInterval(async () => {
      const updatedJob = await loadJobMetadata(requestId);
      setJob(updatedJob);

      if (updatedJob?.status === 'COMPLETED' || updatedJob?.status === 'FAILED') {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [requestId]);

  if (!job) return <Text>Loading job info...</Text>;

  return (
    <View>
      <Text>Status: {job.status}</Text>
      <Text>Created: {new Date(job.createdAt).toLocaleString()}</Text>
      {job.completedAt && (
        <Text>Completed: {new Date(job.completedAt).toLocaleString()}</Text>
      )}
      {job.error && <Text style={{ color: 'red' }}>Error: {job.error}</Text>}
    </View>
  );
}
```

### With Redux

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { FalJobMetadata } from '@umituz/react-native-ai-fal-provider';

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: [] as FalJobMetadata[],
  reducers: {
    addJob: (state, action: PayloadAction<FalJobMetadata>) => {
      state.push(action.payload);
    },
    updateJob: (state, action: PayloadAction<FalJobMetadata>) => {
      const index = state.findIndex(j => j.requestId === action.payload.requestId);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    removeJob: (state, action: PayloadAction<string>) => {
      return state.filter(j => j.requestId !== action.payload);
    },
  },
});
```

## Testing

```typescript
import type { FalJobMetadata } from '@umituz/react-native-ai-fal-provider';

describe('FalJobMetadata', () => {
  it('should create valid metadata', () => {
    const job: FalJobMetadata = {
      requestId: 'test-123',
      model: 'fal-ai/flux/schnell',
      status: 'IN_QUEUE',
      createdAt: '2024-01-08T10:30:00.000Z',
      updatedAt: '2024-01-08T10:30:00.000Z',
    };

    expect(job.requestId).toBe('test-123');
    expect(job.model).toBe('fal-ai/flux/schnell');
    expect(job.status).toBe('IN_QUEUE');
  });

  it('should include optional fields', () => {
    const job: FalJobMetadata = {
      requestId: 'test-123',
      model: 'fal-ai/flux/schnell',
      status: 'COMPLETED',
      createdAt: '2024-01-08T10:30:00.000Z',
      updatedAt: '2024-01-08T10:35:00.000Z',
      completedAt: '2024-01-08T10:35:00.000Z',
      timeout: 120000,
    };

    expect(job.completedAt).toBeDefined();
    expect(job.timeout).toBe(120000);
  });

  it('should handle failed job', () => {
    const job: FalJobMetadata = {
      requestId: 'test-123',
      model: 'fal-ai/flux/schnell',
      status: 'FAILED',
      createdAt: '2024-01-08T10:30:00.000Z',
      updatedAt: '2024-01-08T10:35:00.000Z',
      error: 'Generation failed: NSFW content detected',
    };

    expect(job.status).toBe('FAILED');
    expect(job.error).toBe('Generation failed: NSFW content detected');
  });
});
```

## See Also

- [Job Metadata Index](./index.README.md)
- [Job Lifecycle](./job-metadata-lifecycle.util.README.md)
- [Job Format](./job-metadata-format.util.README.md)
- [Job Queries](./job-metadata-queries.util.README.md)
- [Job Storage](../job-storage/index.README.md)
