# FalProvider

FAL AI provider service class implementing IAIProvider interface.

**Location:** `src/infrastructure/services/fal-provider.ts`

## Overview

The `FalProvider` class is the central service for all interactions with FAL AI. It implements the `IAIProvider` interface to provide a provider-agnostic architecture for AI generation operations.

## Purpose

Manages FAL AI API interactions including:
- Provider initialization and configuration
- Job submission and status tracking
- Image and video feature processing
- Request lifecycle management
- Error handling and retry logic

## Singleton Instance

**Import:**
```typescript
import { falProvider } from '@umituz/react-native-ai-fal-provider';
```

**Usage:**
Use the exported `falProvider` singleton instance. Do not create new instances with `new FalProvider()`.

**Implementation:** See `src/infrastructure/services/fal-provider.ts` for complete class definition

## Initialization Methods

### initialize

Initialize provider with API key and configuration.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `configData` | `AIProviderConfig` | ✅ Yes | Configuration object |

**Config Structure:**
- `apiKey`: FAL API key (required)
- `maxRetries`: Maximum retry attempts (optional)
- `baseDelay`: Base delay for retries in ms (optional)
- `maxDelay`: Maximum delay for retries in ms (optional)

**Usage:**
Call once at application startup with your FAL API key and optional retry configuration.

### isInitialized

Check if provider has been initialized.

**Returns:** `boolean` - True if provider is initialized

**Usage:**
Use this check before calling provider methods to ensure initialization.

### reset

Reset provider to initial state.

**Usage:**
Call this to clear all provider state and configuration. Use for cleanup or reinitialization.

## Capability Methods

### getCapabilities

Get provider capabilities for image and video features.

**Returns:** `ProviderCapabilities` object containing:
- `imageFeatures`: Array of supported image feature types
- `videoFeatures`: Array of supported video feature types

**Usage:**
Use to determine which features are available before attempting to use them.

**Related:**
- Feature model mappings: `src/domain/constants/feature-models.constants.ts`

### isFeatureSupported

Check if a specific feature is supported.

**Parameters:**
- `feature`: Image or video feature type to check

**Returns:** `boolean` - True if feature is supported

**Usage:**
Check feature support before attempting to use image or video features.

### getImageFeatureModel

Get model ID for an image feature.

**Parameters:**
- `feature`: Image feature type

**Returns:** `string` - FAL model ID

**Usage:**
Retrieve the appropriate model ID for image processing features.

**Related:**
- Image feature models: `src/domain/constants/feature-models.constants.ts`
- Image feature builder: `src/infrastructure/builders/image-feature-builder.ts`

### getVideoFeatureModel

Get model ID for a video feature.

**Parameters:**
- `feature`: Video feature type

**Returns:** `string` - FAL model ID

**Usage:**
Retrieve the appropriate model ID for video generation features.

**Related:**
- Video feature models: `src/domain/constants/feature-models.constants.ts`
- Video feature builder: `src/infrastructure/builders/video-feature-builder.ts`

### buildImageFeatureInput

Build input object for image feature.

**Parameters:**
- `feature`: Image feature type
- `data`: Feature-specific input data

**Returns:** `Record<string, unknown>` - Input object for API

**Usage:**
Use to construct properly formatted input objects for image features.

**Related:**
- Input builder utilities: `src/infrastructure/utils/image-feature-builders.util.ts`
- Input types: `src/domain/types/input-builders.types.ts`

### buildVideoFeatureInput

Build input object for video feature.

**Parameters:**
- `feature`: Video feature type
- `data`: Feature-specific input data

**Returns:** `Record<string, unknown>` - Input object for API

**Usage:**
Use to construct properly formatted input objects for video features.

**Related:**
- Input builder utilities: `src/infrastructure/utils/video-feature-builders.util.ts`
- Input types: `src/domain/types/input-builders.types.ts`

## Job Management Methods

### submitJob

Submit job to FAL queue.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | `string` | ✅ Yes | FAL model ID |
| `input` | `Record<string, unknown>` | ✅ Yes | Job input object |

**Returns:** `JobSubmission` object containing:
- `requestId`: Unique job identifier
- `statusUrl`: URL to check job status
- `responseUrl`: URL to get job result

**Usage:**
Use for non-blocking job submission. Combine with status polling for async workflows.

### getJobStatus

Check job status.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | `string` | ✅ Yes | FAL model ID |
| `requestId` | `string` | ✅ Yes | Job request ID |

**Returns:** `JobStatus` object with current status and queue position

**Usage:**
Poll this method to track job progress after submission.

**Related:**
- Status mapper: `src/infrastructure/services/fal-status-mapper.ts`
- Queue status types: `src/domain/entities/fal.types.ts`

### getJobResult

Get completed job result.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | `string` | ✅ Yes | FAL model ID |
| `requestId` | `string` | ✅ Yes | Job request ID |

**Returns:** Job result object (type parameter available for typing)

**Usage:**
Call this after job completes to retrieve the final result.

### subscribe

Submit job and wait for completion with automatic polling.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | `string` | ✅ Yes | FAL model ID |
| `input` | `Record<string, unknown>` | ✅ Yes | Job input object |
| `options` | `SubscribeOptions<T>` | ❌ No | Optional configuration |

**Options Structure:**
- `timeoutMs`: Maximum time to wait for completion
- `onQueueUpdate`: Callback for status updates during polling

**Returns:** Job result object (type parameter available for typing)

**Usage:**
Use for most common use case - submit job and wait for result with automatic retry and polling logic.

**Related:**
- Subscription handler: `src/infrastructure/services/fal-provider-subscription.ts`

### run

Run job synchronously.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | `string` | ✅ Yes | FAL model ID |
| `input` | `Record<string, unknown>` | ✅ Yes | Job input object |
| `options` | `RunOptions` | ❌ No | Optional configuration |

**Returns:** Job result object

**Usage:**
Use for models that support synchronous execution. Faster than subscribe for supported models.

## Request Control Methods

### cancelCurrentRequest

Cancel currently running request.

**Usage:**
Call to abort in-progress requests. Useful for cleanup and user cancellation.

### hasRunningRequest

Check if there's a running request.

**Returns:** `boolean` - True if request is in progress

**Usage:**
Check before starting new requests to prevent conflicts. Use with `cancelCurrentRequest()` for request management.

## Usage Guidelines

### For Application Setup

**Initialization:**
1. Import `falProvider` singleton
2. Call `initialize()` at app startup with API key
3. Check `isInitialized()` before use
4. Configure retry options as needed

**Best Practices:**
- Initialize once at application startup
- Store API key securely (environment variable, secure storage)
- Check initialization status before operations
- Handle initialization errors gracefully

### For Feature Detection

**Capability Checking:**
1. Use `getCapabilities()` to list available features
2. Use `isFeatureSupported()` before using features
3. Check specific feature types for UI display
4. Handle unsupported features gracefully

**Feature Models:**
1. Use `getImageFeatureModel()` for image features
2. Use `getVideoFeatureModel()` for video features
3. Build inputs with `buildImageFeatureInput()` or `buildVideoFeatureInput()`
4. Pass model ID and input to subscribe/run methods

**Related:**
- Feature constants: `src/domain/constants/feature-models.constants.ts`
- Builder utilities: `src/infrastructure/utils/image-feature-builders.util.ts`

### For Job Execution

**Standard Flow:**
1. Build input object for model
2. Call `subscribe()` with model ID and input
3. Handle result or error
4. Update UI with result

**Advanced Flow:**
1. Use `submitJob()` for non-blocking submission
2. Poll `getJobStatus()` for progress updates
3. Call `getJobResult()` when status is COMPLETED
4. Handle errors and timeouts appropriately

**Related:**
- Job metadata: `src/infrastructure/utils/job-metadata/index.ts`
- Status types: `src/domain/entities/fal.types.ts`

### For Request Management

**Cancellation:**
1. Check `hasRunningRequest()` before new requests
2. Call `cancelCurrentRequest()` to abort
3. Wait briefly before starting new request
4. Handle cleanup appropriately

**Cleanup:**
1. Cancel running requests on unmount
2. Call `reset()` if needed to clear state
3. Release resources appropriately
4. Handle state reset errors

## Best Practices

### 1. Use Singleton Instance

Always use the exported `falProvider` singleton:
- Import from package root
- Don't create new instances
- Initialize once at startup
- Share across application

### 2. Validate Before Operations

Check initialization and feature support:
- Use `isInitialized()` before operations
- Use `isFeatureSupported()` before features
- Handle unsupported features gracefully
- Provide user feedback for limitations

### 3. Handle Request Lifecycle

Manage requests properly:
- Check `hasRunningRequest()` before starting
- Cancel requests when appropriate
- Clean up on unmount/exit
- Handle timeouts and errors

### 4. Build Inputs Correctly

Use provided builder functions:
- Use `buildImageFeatureInput()` for images
- Use `buildVideoFeatureInput()` for videos
- Follow input type definitions
- Validate input data structure

**Related:**
- Input types: `src/domain/types/input-builders.types.ts`
- Builder utilities: `src/infrastructure/utils/image-feature-builders.util.ts`

### 5. Handle Errors Appropriately

Implement comprehensive error handling:
- Catch and categorize errors
- Retry when appropriate
- Display user-friendly messages
- Log for debugging

**Related:**
- Error mapper: `src/infrastructure/utils/error-mapper.ts`
- Error categorizer: `src/infrastructure/utils/error-categorizer.ts`

## For AI Agents

### When Using FalProvider

**DO:**
- Use the singleton `falProvider` instance
- Initialize at application startup
- Check `isInitialized()` before operations
- Use builder functions for inputs
- Handle errors appropriately
- Cancel running requests when needed
- Use `subscribe()` for most operations

**DON'T:**
- Create new instances with `new FalProvider()`
- Skip initialization check
- Build input objects manually
- Ignore running requests
- Forget error handling
- Use deprecated methods

### When Adding Features

**For New Image Features:**
1. Add feature to `ImageFeatureType` in types
2. Add model mapping to `feature-models.constants.ts`
3. Add builder function to `image-feature-builders.util.ts`
4. Update `buildImageFeatureInput()` if needed
5. Document feature in this README

**For New Video Features:**
1. Add feature to `VideoFeatureType` in types
2. Add model mapping to `feature-models.constants.ts`
3. Add builder function to `video-feature-builders.util.ts`
4. Update `buildVideoFeatureInput()` if needed
5. Document feature in this README

**For New Provider Methods:**
1. Add method to `FalProvider` class
2. Update `IAIProvider` interface if needed
3. Add error handling and validation
4. Update this README with usage guidelines
5. Test with all feature types

## Implementation Notes

**Location:** `src/infrastructure/services/fal-provider.ts`

**Key Methods:**
- `initialize(config: AIProviderConfig): void`
- `isInitialized(): boolean`
- `getCapabilities(): ProviderCapabilities`
- `subscribe<T>(model, input, options?): Promise<T>`
- `run<T>(model, input, options?): Promise<T>`
- `submitJob(model, input): Promise<JobSubmission>`
- `getJobStatus(model, requestId): Promise<JobStatus>`
- `getJobResult<T>(model, requestId): Promise<T>`
- `cancelCurrentRequest(): void`
- `hasRunningRequest(): boolean`
- `reset(): void`

**Dependencies:**
- Implements `IAIProvider` interface
- Uses `@fal-ai/client` for API calls
- Integrates with error handling utilities
- Uses job metadata for tracking

**Related:**
- Subscription handler: `src/infrastructure/services/fal-provider-subscription.ts`
- Provider constants: `src/infrastructure/services/fal-provider.constants.ts`
- Status mapper: `src/infrastructure/services/fal-status-mapper.ts`
- Provider types: `src/domain/entities/fal.types.ts`

## Related Documentation

- [FalProvider Subscription](./fal-provider-subscription.README.md)
- [FalProvider Constants](./fal-provider.constants.README.md)
- [Fal Status Mapper](./fal-status-mapper.README.md)
- [Image Feature Builder](../builders/image-feature-builder.README.md)
- [Video Feature Builder](../builders/video-feature-builder.README.md)
