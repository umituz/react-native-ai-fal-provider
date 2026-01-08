# FAL Types

Core type definitions for FAL AI integration including configuration, models, jobs, and queue status.

**Location:** `src/domain/entities/fal.types.ts`

## Overview

This module contains TypeScript type definitions used throughout the FAL AI provider for configuration, model information, job management, queue status tracking, and subscription handling.

## Purpose

Provides type safety for FAL operations by:
- Defining configuration interfaces for provider initialization
- Specifying model information structures
- Typing job input and result data
- Tracking queue status throughout job lifecycle
- Supporting subscription callbacks with proper typing
- Ensuring type-safe operations across the provider

## Import

```typescript
import type {
  FalConfig,
  FalModel,
  FalModelType,
  FalModelPricing,
  FalJobInput,
  FalJobResult,
  FalLogEntry,
  FalQueueStatus,
  FalSubscribeOptions
} from '@umituz/react-native-ai-fal-provider';
```

## Type Definitions

### FalConfig

FAL provider configuration interface.

**Properties:**
- `apiKey`: FAL API authentication key
- `baseUrl`: Optional custom base URL for API requests
- `maxRetries`: Maximum number of retry attempts (optional)
- `baseDelay`: Base delay for retry logic in milliseconds (optional)
- `maxDelay`: Maximum delay for retry logic in milliseconds (optional)
- `defaultTimeoutMs`: Default timeout for requests in milliseconds (optional)

**Usage:**
Use to configure the FAL provider instance. All properties except `apiKey` are optional with sensible defaults. Initialize provider with this configuration.

**Implementation:** See complete interface definition in `src/domain/entities/fal.types.ts`

**Related:**
- FAL provider: `src/infrastructure/services/fal-provider.ts`

### FalModel

Model information structure.

**Properties:**
- `id`: Unique model identifier (e.g., 'fal-ai/flux/schnell')
- `name`: Human-readable model name
- `description`: Optional model description
- `endpoint`: API endpoint for model invocation
- `type`: Model type from `FalModelType` enum
- `pricing`: Optional pricing information
- `enabled`: Whether model is active
- `order`: Optional ordering for UI display

**Usage:**
Use to represent available FAL models. Returned by model listing operations. Used for model selection in UI.

**Related:**
- Model types: `src/domain/types/model-selection.types.ts`
- useModels hook: `src/presentation/hooks/use-models.ts`

### FalModelType

Enumeration of supported model types.

**Valid Values:**
- `text-to-image`: Text prompt to image generation
- `text-to-video`: Text prompt to video generation
- `text-to-voice`: Text to speech synthesis
- `image-to-video`: Image to video conversion
- `image-to-image`: Image to image transformation
- `text-to-text`: Text processing and generation

**Usage:**
Use to categorize models by their input/output types. Enables filtering models by type. Use with type guards for type-safe operations.

**Related:**
- Model type guards: `src/infrastructure/utils/type-guards.util.ts`
- Model selection types: `src/domain/types/model-selection.types.ts`

### FalModelPricing

Model pricing information structure.

**Properties:**
- `creditsPerGeneration`: Credit cost per generation
- `currency`: Optional currency identifier

**Usage:**
Use to display pricing information to users. Calculate total costs before generation. Show credit cost in UI.

### FalJobInput

Job input data structure.

**Structure:**
- Index signature with string keys and unknown values
- Supports arbitrary model-specific parameters
- Flexible structure for different model requirements

**Usage:**
Use to pass input parameters to FAL models. Structure varies by model type. Include prompt, image data, and model-specific parameters.

**Related:**
- Image feature builders: `src/infrastructure/utils/image-feature-builders.util.ts`
- Video feature builders: `src/infrastructure/utils/video-feature-builders.util.ts`

### FalJobResult

Job result structure with generic data type.

**Properties:**
- `requestId`: Unique identifier for the request
- `data`: Generated data (generic type)
- `logs`: Optional array of log entries

**Usage:**
Use to represent completed job results. Generic type parameter allows type-safe result handling. Access generated data through `data` property.

**Related:**
- Queue status: `FalQueueStatus`
- Log entries: `FalLogEntry`

### FalLogEntry

Individual log entry structure.

**Properties:**
- `message`: Log message content
- `timestamp`: Optional ISO timestamp
- `level`: Optional log level (info, warn, error)

**Usage:**
Use to track job processing progress. Display to users for transparency. Include in job results for debugging.

**Related:**
- Job metadata: `src/infrastructure/utils/job-metadata/`

### FalQueueStatus

Job queue status throughout lifecycle.

**Properties:**
- `status`: Current status value
- `requestId`: Unique request identifier
- `logs`: Optional array of log entries
- `queuePosition`: Optional position in queue

**Valid Status Values:**
- `IN_QUEUE`: Job is queued waiting to start
- `IN_PROGRESS`: Job is currently processing
- `COMPLETED`: Job finished successfully
- `FAILED`: Job failed with error

**Usage:**
Use to track job lifecycle from submission to completion. Monitor queue position for wait times. Display status to users for transparency.

**Related:**
- Job lifecycle utilities: `src/infrastructure/utils/job-metadata/job-metadata-lifecycle.util.ts`
- Job status queries: `src/infrastructure/utils/job-metadata/job-metadata-queries.util.ts`

### FalSubscribeOptions

Subscription callback configuration.

**Properties:**
- `onQueueUpdate`: Optional callback for status updates
- `timeoutMs`: Optional timeout in milliseconds

**Usage:**
Use to configure real-time job monitoring. Receive status updates through callback. Control timeout duration for long-running jobs.

**Related:**
- FAL provider: `src/infrastructure/services/fal-provider.ts`
- Queue status tracking: `src/infrastructure/utils/job-metadata/`

## Usage Guidelines

### For Configuration

**Provider Initialization:**
1. Import `FalConfig` type from package
2. Create configuration object with API key
3. Optionally set retry and timeout parameters
4. Initialize provider with configuration
5. Use provider for generation operations

**Best Practices:**
- Always set API key from secure storage
- Configure appropriate timeouts for your use case
- Set reasonable retry limits to prevent excessive retries
- Use default values for optional properties when unsure

### For Model Information

**Model Selection:**
1. Import `FalModel` and `FalModelType` types
2. Get available models from provider or hook
3. Filter models by type using type guards
4. Display model information in UI
5. Select model for generation

**Related:**
- useModels hook: `src/presentation/hooks/use-models.ts`
- Model type guards: `src/infrastructure/utils/type-guards.util.ts`

### For Job Management

**Job Submission:**
1. Prepare input data using `FalJobInput` structure
2. Include prompt and required parameters
3. Use image builders for image operations
4. Submit job to provider
5. Track status using `FalQueueStatus`

**Result Handling:**
1. Receive result as `FalJobResult<T>` with specific type
2. Access generated data through `data` property
3. Process log entries for progress information
4. Display results to user
5. Handle errors appropriately

**Related:**
- Image feature builders: `src/infrastructure/utils/image-feature-builders.util.ts`
- Video feature builders: `src/infrastructure/utils/video-feature-builders.util.ts`
- Job lifecycle utilities: `src/infrastructure/utils/job-metadata/job-metadata-lifecycle.util.ts`

### For Status Tracking

**Queue Monitoring:**
1. Import `FalQueueStatus` type
2. Subscribe to job with callback
3. Monitor status changes in callback
4. Update UI based on status
5. Display queue position when applicable

**Status Handling:**
- `IN_QUEUE`: Show queue position to user
- `IN_PROGRESS`: Show processing indicator, display logs
- `COMPLETED`: Display result, hide progress
- `FAILED`: Show error message, allow retry

**Related:**
- Job lifecycle utilities: `src/infrastructure/utils/job-metadata/job-metadata-lifecycle.util.ts`
- Job format utilities: `src/infrastructure/utils/job-metadata/job-metadata-format.util.ts`

### For Subscription Configuration

**Callback Setup:**
1. Import `FalSubscribeOptions` type
2. Configure `onQueueUpdate` callback
3. Set appropriate timeout duration
4. Pass options to subscribe method
5. Handle updates in callback

**Timeout Management:**
- Set timeouts based on expected job duration
- Implement timeout error handling
- Allow users to extend timeout if needed
- Consider retry on timeout

## Best Practices

### 1. Use Type Generics

Leverage generic types for type safety:
- Specify result type in `FalJobResult<T>`
- Use model-specific result interfaces
- Enable TypeScript type checking
- Prevent type errors at compile time

### 2. Respect Readonly Properties

Maintain immutability of type properties:
- Don't modify readonly properties
- Create copies when transformations needed
- Use spread operator for updates
- Maintain type safety

### 3. Handle All Status Values

Prepare for every queue status:
- Implement handlers for all four status values
- Show appropriate UI for each status
- Handle status transitions smoothly
- Consider edge cases in status changes

### 4. Validate Input Data

Ensure input data correctness:
- Check required parameters before submission
- Validate parameter types and ranges
- Use type guards for runtime validation
- Sanitize user input appropriately

**Related:**
- Type guards: `src/infrastructure/utils/type-guards.util.ts`
- Helper utilities: `src/infrastructure/utils/helpers.util.ts`

### 5. Use Type Guards

Implement runtime type checking:
- Validate model types before use
- Check queue status values
- Guard against invalid data
- Enable type narrowing

**Related:**
- Type guards: `src/infrastructure/utils/type-guards.util.ts`

## For AI Agents

### When Using FAL Types

**DO:**
- Import types from package root
- Use proper TypeScript type annotations
- Leverage generic types for type safety
- Respect readonly property modifiers
- Validate data before use
- Handle all possible type values
- Use type guards for runtime checks

**DON'T:**
- Import from internal paths
- Ignore type annotations
- Modify readonly properties
- Assume type correctness
- Skip type guards
- Handle only some type values
- Use type assertions unnecessarily
- Cast to wrong types

### When Working with Configuration

**DO:**
- Set API key from secure storage
- Configure appropriate timeouts
- Set reasonable retry limits
- Use default values appropriately
- Validate configuration before use
- Store configuration securely
- Document configuration choices

**DON'T:**
- Hardcode API keys
- Set unreasonable timeouts
- Allow infinite retries
- Ignore optional properties
- Skip configuration validation
- Store API keys in plain text
- Use arbitrary configuration values

### When Handling Jobs

**DO:**
- Type job inputs properly
- Use specific result types
- Handle all status values
- Process log entries appropriately
- Validate job data
- Handle errors gracefully
- Display progress to users

**DON'T::**
- Use loose input types
- Ignore result typing
- Skip status values
- Discard log information
- Assume data validity
- Ignore error cases
- Hide progress information

### When Adding Types

**For New Type Definitions:**
1. Add type to appropriate file
2. Export from package root
3. Update TypeScript types
4. Document type purpose
5. Add usage examples (in separate files)
6. Update this README

**For New Type Properties:**
1. Add property to interface
2. Mark readonly if appropriate
3. Make optional with good reason
4. Document property purpose
5. Update type definitions
6. Test type usage

**For Enhanced Type Safety:**
1. Review existing types
2. Add stricter types where needed
3. Use discriminated unions
4. Improve type coverage
5. Document type changes
6. Update related code

## Implementation Notes

**Location:** `src/domain/entities/fal.types.ts`

**Dependencies:**
- No external dependencies
- Pure TypeScript type definitions
- Used throughout FAL provider

**Type Categories:**
- Configuration types
- Model information types
- Job management types
- Queue status types
- Subscription types

**Import:**
```typescript
import type {
  FalConfig,
  FalModel,
  FalModelType,
  FalModelPricing,
  FalJobInput,
  FalJobResult,
  FalLogEntry,
  FalQueueStatus,
  FalSubscribeOptions
} from '@umituz/react-native-ai-fal-provider';
```

**Related:**
- Error types: `src/domain/entities/error.types.ts`
- Model selection types: `src/domain/types/model-selection.types.ts`
- FAL provider: `src/infrastructure/services/fal-provider.ts`
- Type guards: `src/infrastructure/utils/type-guards.util.ts`

## Related Documentation

- [Error Types](./error.types.README.md)
- [Model Selection Types](../types/model-selection.types.README.md)
- [FAL Provider](../../infrastructure/services/fal-provider.README.md)
- [Type Guards](../../infrastructure/utils/type-guards.util.README.md)
