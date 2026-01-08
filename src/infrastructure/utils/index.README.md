# Utils Index

Central export point for all utility functions and helpers.

**Location:** `src/infrastructure/utils/index.ts`

## Overview

The utils module provides a comprehensive collection of utility functions organized into several categories: error handling, input builders, type guards, helpers, and job metadata management.

## Purpose

Provides utilities by:
- Centralizing utility exports
- Organizing functions by category
- Enabling easy imports
- Maintaining consistency
- Facilitating code reuse

## Import

```typescript
import {
  categorizeFalError,
  mapFalError,
  isFalErrorRetryable,
  buildUpscaleInput,
  isValidBase64Image,
  formatImageDataUri,
  createJobMetadata,
  isJobCompleted
} from '@umituz/react-native-ai-fal-provider';
```

## Export Categories

### Error Handling

Utilities for categorizing, mapping, and handling errors.

**Path:** `src/infrastructure/utils/error-categorizer.ts`, `src/infrastructure/utils/error-mapper.ts`

**Functions:**
- `categorizeFalError` - Categorizes errors by type
- `falErrorMapper` - Maps errors to user-friendly messages
- `mapFalError` - Converts FAL errors to standard format
- `isFalErrorRetryable` - Determines if an error is retryable

### Input Builders

Functions for constructing API-compatible input objects.

**Path:** `src/infrastructure/utils/image-feature-builders.util.ts`, `src/infrastructure/utils/video-feature-builders.util.ts`, `src/infrastructure/utils/base-builders.util.ts`

**Functions:**
- `buildSingleImageInput` - Build input with one image
- `buildDualImageInput` - Build input with two images
- `buildUpscaleInput` - Build upscale operation input
- `buildPhotoRestoreInput` - Build photo restore input
- `buildVideoFromImageInput` - Build video generation input
- `buildFaceSwapInput` - Build face swap input
- `buildImageToImageInput` - Build image-to-image input
- `buildRemoveBackgroundInput` - Build background removal input
- `buildRemoveObjectInput` - Build object removal input
- `buildReplaceBackgroundInput` - Build background replacement input
- `buildHDTouchUpInput` - Build HD enhancement input

### Type Guards

Runtime type validation and checking utilities.

**Path:** `src/infrastructure/utils/type-guards.util.ts`

**Functions:**
- `isFalModelType` - Check if value is a valid FAL model type
- `isModelType` - Check if value is a valid model type
- `isFalErrorType` - Check if value is a valid FAL error type
- `isValidBase64Image` - Validate base64 image data
- `isValidApiKey` - Validate API key format
- `isValidModelId` - Validate model ID format
- `isValidPrompt` - Validate prompt text
- `isValidTimeout` - Validate timeout value
- `isValidRetryCount` - Validate retry count

### Helpers

General-purpose helper functions.

**Path:** `src/infrastructure/utils/helpers.util.ts`

**Functions:**
- `formatImageDataUri` - Format data URI for image
- `extractBase64` - Extract base64 from data URI
- `getDataUriExtension` - Get file extension from data URI
- `isImageDataUri` - Check if string is image data URI
- `calculateTimeoutWithJitter` - Calculate timeout with random jitter
- `formatCreditCost` - Format credit cost for display
- `truncatePrompt` - Truncate prompt to max length
- `sanitizePrompt` - Sanitize prompt text
- `buildErrorMessage` - Build formatted error message
- `isDefined` - Type guard for defined values
- `removeNullish` - Remove null/undefined values
- `debounce` - Debounce function calls
- `throttle` - Throttle function calls

### Job Metadata

Job lifecycle and metadata management functions.

**Path:** `src/infrastructure/utils/job-metadata/index.ts`

**Types:**
- `FalJobMetadata` - Job metadata interface

**Functions:**
- `createJobMetadata` - Create new job metadata
- `updateJobMetadata` - Update existing job metadata
- `isJobCompleted` - Check if job is completed
- `isJobRunning` - Check if job is running
- `isJobStale` - Check if job is stale
- `getJobDuration` - Get job duration in milliseconds
- `formatJobDuration` - Format duration for display
- `calculateJobProgress` - Calculate job progress percentage
- `serializeJobMetadata` - Serialize job to JSON
- `deserializeJobMetadata` - Deserialize JSON to job
- `filterValidJobs` - Filter valid jobs
- `sortJobsByCreation` - Sort jobs by creation time
- `getActiveJobs` - Get active jobs
- `getCompletedJobs` - Get completed jobs

## Usage Guidelines

### For Error Handling

**Error Pattern:**
1. Catch errors from API calls
2. Categorize error with categorizeFalError
3. Map error with mapFalError
4. Check retryability with isFalErrorRetryable
5. Display appropriate message

**Best Practices:**
- Always validate error types
- Show user-friendly messages
- Check retryability before retry
- Log technical details
- Handle NSFW content errors

### For Input Building

**Builder Pattern:**
1. Import appropriate builder function
2. Validate inputs (images, parameters)
3. Build input with correct options
4. Use result with provider
5. Handle errors

**Best Practices:**
- Validate all inputs before building
- Use correct builder for feature
- Set appropriate option values
- Handle required parameters
- Reference feature documentation

### For Validation

**Validation Pattern:**
1. Use type guards for runtime checks
2. Validate API keys, images, prompts
3. Check parameter constraints
4. Provide helpful error messages
5. Fail fast on invalid input

**Best Practices:**
- Validate all external inputs
- Use specific validation functions
- Check formats and ranges
- Provide clear error messages
- Prevent invalid API calls

### For Job Management

**Job Pattern:**
1. Create job metadata with createJobMetadata
2. Save to storage
3. Update job status as it progresses
4. Check completion with isJobCompleted
5. Calculate duration and progress

**Best Practices:**
- Always save job updates
- Track status changes
- Calculate durations and progress
- Clean up old jobs
- Handle missing jobs

## Best Practices

### 1. Validate Inputs

Check all inputs before use:
- Use type guards for validation
- Check API key format
- Validate image data
- Verify prompt text
- Check model IDs

### 2. Handle Errors Properly

Process errors correctly:
- Categorize errors by type
- Map to user-friendly messages
- Check retryability
- Display appropriate messages
- Log technical details

### 3. Build Inputs Correctly

Construct valid inputs:
- Use appropriate builder functions
- Set correct options
- Handle required parameters
- Validate before building
- Test with provider

### 4. Track Jobs

Manage job lifecycle:
- Create metadata for all jobs
- Update status as jobs progress
- Calculate durations and progress
- Clean up old jobs
- Query job status

### 5. Clean Up Resources

Manage resource lifecycle:
- Clean up old job metadata
- Release references
- Prevent memory leaks
- Handle edge cases
- Schedule cleanup

## For AI Agents

### When Using Utilities

**DO:**
- Import from package root
- Validate inputs before use
- Handle errors appropriately
- Track job lifecycle
- Clean up resources
- Use specific validators
- Follow best practices

**DON'T:**
- Import from internal paths
- Skip input validation
- Ignore error handling
- Forget job tracking
- Leave resources allocated
- Use generic validators
- Create utilities

### When Validating Inputs

**DO:**
- Use specific validation functions
- Check all external inputs
- Validate format and ranges
- Provide clear error messages
- Fail fast on invalid input
- Use type guards

**DON'T:**
- Skip validation
- Accept invalid inputs
- Provide vague errors
- Continue with bad data
- Create security issues
- Assume valid inputs

### When Managing Jobs

**DO:**
- Create job metadata
- Update job status
- Track progress
- Calculate durations
- Clean up old jobs
- Handle errors

**DON'T:**
- Skip job tracking
- Forget status updates
- Lose job information
- Create stale data
- Ignore cleanup
- Handle jobs poorly

## Implementation Notes

**Location:** `src/infrastructure/utils/index.ts`

**Dependencies:**
- Re-exports from all util modules
- No external dependencies (except React Native utilities)

**Utility Categories:**
- Error handling utilities
- Input builder utilities
- Type guard utilities
- Helper utilities
- Job metadata utilities

**Import:**
```typescript
import {
  categorizeFalError,
  mapFalError,
  isFalErrorRetryable,
  buildUpscaleInput,
  isValidBase64Image,
  formatImageDataUri,
  createJobMetadata,
  isJobCompleted
} from '@umituz/react-native-ai-fal-provider';
```

**Related:**
- Error categorizer: `src/infrastructure/utils/error-categorizer.ts`
- Error mapper: `src/infrastructure/utils/error-mapper.ts`
- Image builders: `src/infrastructure/utils/image-feature-builders.util.ts`
- Video builders: `src/infrastructure/utils/video-feature-builders.util.ts`
- Type guards: `src/infrastructure/utils/type-guards.util.ts`
- Helpers: `src/infrastructure/utils/helpers.util.ts`
- Job metadata: `src/infrastructure/utils/job-metadata/`
