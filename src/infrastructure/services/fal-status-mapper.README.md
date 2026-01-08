# FAL Status Mapper

Maps FAL queue status to standard job status format.

**Location:** `src/infrastructure/services/fal-status-mapper.ts`

## Overview

This module converts status objects from the FAL API into the standard `JobStatus` format, providing consistency across different AI providers.

## Purpose

Provides status mapping by:
- Converting FAL status to standard format
- Normalizing log entries
- Providing safe defaults
- Maintaining consistency
- Supporting status tracking

## Import

```typescript
import {
  mapFalStatusToJobStatus
} from '@umituz/react-native-ai-fal-provider';
```

## Functions

### mapFalStatusToJobStatus

Converts FAL queue status to JobStatus format.

**Parameters:**
- `status`: FAL queue status object

**Returns:** Standardized job status object

**Input Structure (FalQueueStatus):**
- `status`: FAL status string
- `requestId`: Request identifier
- `logs`: Array of log entries (optional)
- `queuePosition`: Position in queue (optional)

**Output Structure (JobStatus):**
- `status`: Standardized status enum
- `logs`: Array of standardized log entries
- `queuePosition`: Position in queue (optional)

## Status Mapping

### Mapping Table

| FAL Status | JobStatus | Description |
|------------|-----------|-------------|
| `IN_QUEUE` | `IN_QUEUE` | Job is queued |
| `IN_PROGRESS` | `IN_PROGRESS` | Job is processing |
| `COMPLETED` | `COMPLETED` | Job completed successfully |
| `FAILED` | `FAILED` | Job failed |
| *(invalid)* | `IN_PROGRESS` | Default fallback |

## Log Mapping

FAL log entries are mapped to JobLogEntry format:

**Transformation:**
- `message`: Preserved as-is
- `level`: Defaults to 'info' if missing
- `timestamp`: Defaults to current time if missing

**Safe Defaults:**
- Missing level → 'info'
- Missing timestamp → current ISO time
- Missing logs → empty array
- Invalid status → 'IN_PROGRESS'

## Usage Guidelines

### For Status Conversion

**Conversion Pattern:**
1. Receive FAL status from API
2. Call mapFalStatusToJobStatus
3. Use standardized status
4. Display in UI components
5. Track status changes

**Best Practices:**
- Always map FAL status before use
- Handle missing log fields
- Check for invalid status
- Use safe defaults
- Validate output if needed

### For Status Tracking

**Tracking Pattern:**
1. Map status on each update
2. Compare with previous status
3. Detect status changes
4. Update UI accordingly
5. Track transitions

**Best Practices:**
- Store mapped status
- Compare for changes
- Track status history
- Calculate durations
- Update state appropriately

## Best Practices

### 1. Always Map Status

Convert FAL status immediately:
- Map before storing in state
- Map before displaying in UI
- Map before comparing
- Use mapped status consistently
- Don't use raw FAL status

### 2. Handle Missing Fields

Account for optional fields:
- Check for missing logs
- Handle missing timestamps
- Validate log levels
- Provide safe defaults
- Don't assume fields exist

### 3. Validate Status

Check for invalid values:
- Handle unknown status strings
- Use fallback for invalid status
- Log validation failures
- Provide safe defaults
- Don't crash on bad data

### 4. Track Changes

Monitor status transitions:
- Compare current with previous
- Detect status changes
- Calculate transition times
- Update UI on changes
- Maintain status history

### 5. Use Type Safety

Leverage TypeScript types:
- Use proper type definitions
- Check instanceof for errors
- Use type guards
- Validate input types
- Maintain type safety

## For AI Agents

### When Mapping Status

**DO:**
- Map all FAL status objects
- Handle missing log fields
- Provide safe defaults
- Validate output status
- Use mapped status consistently
- Check for invalid values
- Handle errors gracefully

**DON'T:**
- Use raw FAL status
- Assume all fields exist
- Skip validation
- Ignore missing data
- Use inconsistent formats
- Create type mismatches
- Crash on bad data

### When Tracking Status

**DO:**
- Store mapped status
- Compare for changes
- Track transitions
- Update UI appropriately
- Calculate durations
- Maintain history
- Handle updates properly

**DON'T:**
- Store raw FAL status
- Skip comparison logic
- Ignore transitions
- Update UI inconsistently
- Lose status information
- Create memory leaks
- Handle updates poorly

### When Processing Logs

**DO:**
- Handle missing logs array
- Provide default timestamps
- Default log level to 'info'
- Validate log structure
- Process logs safely
- Display log information
- Handle empty logs

**DON'T:**
- Assume logs exist
- Skip log processing
- Ignore missing fields
- Create unsafe defaults
- Process logs inconsistently
- Hide log information
- Crash on bad logs

## Implementation Notes

**Location:** `src/infrastructure/services/fal-status-mapper.ts`

**Dependencies:**
- FAL types
- Job status types
- No external dependencies

**Mapping Logic:**
- Status string mapping
- Log entry transformation
- Safe defaults
- Fallback handling
- Type validation

**Import:**
```typescript
import {
  mapFalStatusToJobStatus
} from '@umituz/react-native-ai-fal-provider';
```

**Related:**
- FAL types: `src/domain/entities/fal.types.ts`
- Job status: Provider-agnostic job status types
- Subscription handler: `src/infrastructure/services/fal-provider-subscription.ts`
