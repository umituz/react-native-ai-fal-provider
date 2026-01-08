# @umituz/react-native-ai-fal-provider

Main package entry point - Central export for all FAL AI provider functionality.

**Location:** `src/index.ts`

## Overview

This is the primary entry point for the `@umituz/react-native-ai-fal-provider` package. It exports all types, services, hooks, utilities, and constants needed to integrate FAL AI capabilities into your React Native application.

## Purpose

Provides centralized package exports by:
- Exporting all public APIs from single entry point
- Organizing exports by category
- Maintaining clean import paths
- Facilitating package usage
- Enabling tree-shaking

## Installation

```bash
npm install @umituz/react-native-ai-fal-provider @fal-ai/client
```

## Import

```typescript
import {
  falProvider,
  useFalGeneration,
  useModels,
  FalErrorType
} from '@umituz/react-native-ai-fal-provider';
```

## Export Categories

### Core Types

Fundamental TypeScript types for FAL AI integration.

**Exports:**
- `FalConfig` - Provider configuration
- `FalModel` - Model definition
- `FalModelType` - Model type enum
- `FalModelPricing` - Pricing information
- `FalJobInput` - Job input structure
- `FalJobResult` - Job result structure
- `FalLogEntry` - Log entry structure
- `FalQueueStatus` - Queue status structure
- `FalSubscribeOptions` - Subscription options

**Documentation:** See `src/domain/entities/fal.types.README.md`

### Error Types

Error handling and categorization types.

**Exports:**
- `FalErrorType` - Error type enumeration
- `FalErrorCategory` - Error category interface
- `FalErrorInfo` - Error information interface
- `FalErrorMessages` - Error messages interface

**Documentation:** See `src/domain/entities/error.types.README.md`

### Model Selection Types

Types for model selection functionality.

**Exports:**
- `ModelType` - Supported model generation types
- `ModelSelectionConfig` - Selection configuration
- `ModelSelectionState` - Selection state interface

**Documentation:** See `src/domain/types/model-selection.types.README.md`

### Input Builders Types

Types for input builder functions.

**Exports:**
- `ImageFeatureType` - Image feature enumeration
- `VideoFeatureType` - Video feature enumeration
- `ImageFeatureOptions` - Image feature options
- `VideoFeatureOptions` - Video feature options

**Documentation:** See `src/domain/types/input-builders.types.README.md`

### Provider & Services

Core provider and service instances.

**Exports:**
- `falProvider` - Main FAL provider instance
- `FalProvider` - Provider class
- `FalProviderType` - Provider type export
- `falModelsService` - Model management service
- `NSFWContentError` - NSFW error class

**Documentation:** See `src/infrastructure/services/index.README.md`

### Feature Model Functions

Utility functions for feature model lookups.

**Exports:**
- `getImageFeatureModel` - Get image feature model ID
- `getVideoFeatureModel` - Get video feature model ID

**Documentation:** See `src/domain/constants/feature-models.constants.README.md`

### Model Constants

Default models and model management utilities.

**Exports:**
- Model lists by type (text-to-image, text-to-video, etc.)
- `getAllDefaultModels` - Get all models
- `getDefaultModelsByType` - Get models by type
- `getDefaultModel` - Get default model
- `findModelById` - Find model by ID
- `FalModelConfig` - Model configuration type

**Documentation:** See `src/domain/constants/default-models.constants.README.md`

### React Hooks

React hooks for FAL AI integration.

**Exports:**
- `useFalGeneration` - Generation operations hook
- `useModels` - Model selection hook

**Documentation:**
- Generation hook: `src/presentation/hooks/use-fal-generation.README.md`
- Models hook: `src/presentation/hooks/use-models.README.md`

### Builder Functions

Input builder functions for FAL AI operations.

**Image Builders:**
- `buildUpscaleInput` - Upscale input builder
- `buildPhotoRestoreInput` - Photo restoration builder
- `buildFaceSwapInput` - Face swap builder
- `buildRemoveBackgroundInput` - Background removal builder
- `buildRemoveObjectInput` - Object removal builder
- `buildHDTouchUpInput` - HD enhancement builder
- `buildReplaceBackgroundInput` - Background replacement builder
- `buildKontextStyleTransferInput` - Style transfer builder

**Video Builders:**
- `buildVideoFromImageInput` - Video from images builder
- `buildImageToImageInput` - Image-to-image transformation builder

**Documentation:**
- Image builders: `src/infrastructure/builders/image-feature-builder.README.md`
- Video builders: `src/infrastructure/builders/video-feature-builder.README.md`

### Utility Functions

Helper and validation functions.

**Helper Utilities:**
- `formatImageDataUri` - Format image data URI
- `extractBase64` - Extract base64 from data URI
- `formatCreditCost` - Format credit cost for display
- `truncatePrompt` - Truncate prompt text
- `sanitizePrompt` - Sanitize prompt for API
- `calculateTimeoutWithJitter` - Add jitter to timeout
- `sleep` - Async sleep function

**Type Guards:**
- `isFalModelType` - Check FAL model type
- `isModelType` - Check model type
- `isFalErrorType` - Check error type
- `isValidBase64Image` - Validate base64 image
- `isValidApiKey` - Validate API key format
- `isValidPrompt` - Validate prompt text

**Error Functions:**
- `mapFalError` - Map error to standard format
- `isFalErrorRetryable` - Check if error is retryable
- `categorizeFalError` - Categorize error by type

**Documentation:**
- Helper utilities: `src/infrastructure/utils/helpers.util.README.md`
- Type guards: `src/infrastructure/utils/type-guards.util.README.md`
- Error mapper: `src/infrastructure/utils/error-mapper.README.md`

### Validators

Content validation utilities.

**Exports:**
- `validateNSFWContent` - Validate for NSFW content
- `NSFWContentError` - NSFW error class

**Documentation:** See `src/infrastructure/validators/nsfw-validator.README.md`

### Job Metadata Utilities

Job tracking and metadata management.

**Format Utilities:**
- `getJobDuration` - Get job duration
- `formatJobDuration` - Format duration for display
- `calculateJobProgress` - Calculate job progress

**Lifecycle Utilities:**
- `createJobMetadata` - Create job metadata
- `updateJobMetadata` - Update job metadata
- `isJobCompleted` - Check if job completed
- `isJobRunning` - Check if job running
- `isJobStale` - Check if job stale

**Query Utilities:**
- `serializeJobMetadata` - Serialize metadata
- `deserializeJobMetadata` - Deserialize metadata
- `filterValidJobs` - Filter valid jobs
- `sortJobsByCreation` - Sort jobs by creation time
- `getActiveJobs` - Get active jobs
- `getCompletedJobs` - Get completed jobs

**Documentation:**
- Format utilities: `src/infrastructure/utils/job-metadata/job-metadata-format.util.README.md`
- Lifecycle utilities: `src/infrastructure/utils/job-metadata/job-metadata-lifecycle.util.README.md`
- Query utilities: `src/infrastructure/utils/job-metadata/job-metadata-queries.util.README.md`

### Request Management

Request cancellation and state management.

**Exports:**
- `cancelCurrentFalRequest` - Cancel running request
- `hasRunningFalRequest` - Check if request running

**Documentation:** See `src/infrastructure/services/index.README.md`

## Usage Guidelines

### For Basic Setup

**Setup Pattern:**
1. Install package and dependencies
2. Import provider and hooks
3. Initialize provider with API key
4. Use hooks in components
5. Handle errors appropriately

### For Type Safety

**Type Usage Pattern:**
1. Import types from package root
2. Use types for configuration
3. Enable TypeScript strict mode
4. Leverage type inference
5. Handle all type cases

### For Feature Integration

**Integration Pattern:**
1. Import feature builders
2. Get model ID using feature functions
3. Build input using builders
4. Submit to provider
5. Handle results

## Best Practices

### 1. Import from Package Root

Always use package root imports:
- Import from `@umituz/react-native-ai-fal-provider`
- Don't import from internal paths
- Benefit from tree-shaking
- Maintain clean imports

### 2. Use TypeScript

Leverage type system:
- Enable strict mode
- Use type imports
- Handle all type cases
- Avoid type assertions
- Leverage type inference

### 3. Initialize Provider

Set up provider correctly:
- Initialize before using hooks
- Provide valid API key
- Configure appropriately
- Handle initialization errors
- Initialize once in app lifecycle

### 4. Handle Errors

Implement proper error handling:
- Use error types
- Check retryability
- Display user-friendly messages
- Log technical details
- Handle NSFW content errors

### 5. Clean Up Resources

Manage lifecycle properly:
- Cancel requests on unmount
- Clean up subscriptions
- Release resources
- Prevent memory leaks
- Handle cancellation errors

## For AI Agents

### When Using Package

**DO:**
- Import from package root
- Use TypeScript types
- Initialize provider properly
- Handle errors appropriately
- Use provided hooks
- Follow documentation
- Clean up resources

**DON'T:**
- Import from internal paths
- Skip type safety
- Forget initialization
- Ignore error handling
- Create duplicate implementations
- Bypass provided utilities
- Leave resources allocated

### When Structuring Imports

**DO:**
- Group imports logically
- Use type imports for types
- Import from package root
- Keep imports organized
- Remove unused imports
- Follow conventions
- Enable tree-shaking

**DON'T:**
- Import everything indiscriminately
- Mix type and value imports
- Import from internal paths
- Create import chaos
- Keep unused imports
- Ignore conventions
- Prevent tree-shaking

### When Setting Up

**DO:**
- Initialize provider early
- Provide valid API key
- Configure appropriately
- Test integration
- Handle initialization errors
- Follow setup guide
- Document setup choices

**DON'T:**
- Skip initialization
- Use invalid API key
- Misconfigure provider
- Forget testing
- Ignore setup errors
- Rush setup process
- Leave undocumented

## Implementation Notes

**Location:** `src/index.ts`

**Dependencies:**
- Re-exports from all modules
- No external dependencies
- Package entry point

**Export Organization:**
- Core types and entities
- Error handling
- Model management
- Provider and services
- React hooks
- Builder functions
- Utility functions
- Validators
- Job metadata
- Request management

**Import:**
```typescript
import {
  falProvider,
  useFalGeneration,
  useModels,
  FalErrorType
} from '@umituz/react-native-ai-fal-provider';
```

**Related:**
- Main README: `README.md`
- Provider documentation: `src/infrastructure/services/fal-provider.README.md`
- Hooks documentation: `src/presentation/hooks/`

## Related Documentation

- [Main README](../README.md)
- [Provider Documentation](./infrastructure/services/fal-provider.README.md)
- [Generation Hook](./presentation/hooks/use-fal-generation.README.md)
- [Models Hook](./presentation/hooks/use-models.README.md)
