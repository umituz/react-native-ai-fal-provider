# @umituz/react-native-ai-fal-provider

FAL AI provider for React Native - Unified AI generation with IAIProvider interface implementation.

## Documentation Strategy

**Important:** This documentation follows a code-example-free approach.

- **No Code Examples:** Documentation references file paths instead of showing code
- **Path-Based References:** Always references actual file locations
- **Maintainable:** Documentation stays valid when implementation changes

For detailed guidelines, see: `.docs-template.md`

---

## Features

- **Text-to-Image Generation** - Generate images from text prompts (Flux models)
- **Text-to-Video Generation** - Create videos from text descriptions
- **Image-to-Video Conversion** - Transform images into videos
- **Image Processing** - Advanced image editing capabilities
- **Video Features** - AI-powered video generation
- **Model Management** - Dynamic pricing and model selection
- **Error Handling** - Categorization and retry logic
- **Job Management** - Complete job lifecycle tracking

---

## Installation

```bash
npm install @umituz/react-native-ai-fal-provider @fal-ai/client
```

---

## Quick Start

### 1. Initialize Provider

**Location:** `src/infrastructure/services/fal-provider.ts`

**Import:**
```typescript
import { falProvider } from '@umituz/react-native-ai-fal-provider';
```

**Usage:**
Call `falProvider.initialize()` with your API key and configuration options.

**Implementation:** See `src/infrastructure/services/fal-provider.ts` for complete initialization options.

---

### 2. Use React Hooks

**Locations:**
- `src/presentation/hooks/use-fal-generation.ts` - Generation management
- `src/presentation/hooks/use-models.ts` - Model selection

**Import:**
```typescript
import { useFalGeneration, useModels } from '@umituz/react-native-ai-fal-provider';
```

**Usage:**
- Use `useFalGeneration` hook for managing AI generation operations
- Use `useModels` hook for model selection and management

**Implementation:** See hook files for complete API and options.

---

## Core Features

### Text-to-Image Generation

**Location:** `src/domain/constants/models/text-to-image.models.ts`

**Models:**
- Flux Schnell (1 credit) - Fast generation
- Flux Dev (2 credits) - High quality
- Flux Pro (3 credits) - Professional quality

**Usage:**
Use model IDs from `DEFAULT_TEXT_TO_IMAGE_MODELS` constant with `falProvider.subscribe()`.

**Related:**
- Model definitions: `src/domain/constants/models/text-to-image.models.ts`
- Default models: `src/domain/constants/default-models.constants.ts`

---

### Text-to-Video Generation

**Location:** `src/domain/constants/models/text-to-video.models.ts`

**Models:**
- Hunyuan (10 credits) - Balanced quality/speed
- MiniMax (15 credits) - High quality
- Kling 1.5 (20 credits) - Premium
- Mochi (8 credits) - Fast

**Usage:**
Select model from `DEFAULT_TEXT_TO_VIDEO_MODELS` and pass to provider.

**Related:**
- Video models: `src/domain/constants/models/text-to-video.models.ts`

---

### Image Features

**Location:** `src/infrastructure/builders/image-feature-builder.ts`

**Available Features:**
- Upscale (2x, 4x) - `src/infrastructure/utils/image-feature-builders.util.ts`
- Photo Restore - Enhance old photos
- Face Swap - Swap faces between images
- Remove Background - Clean background removal
- Remove Object - Object removal and inpainting
- Replace Background - Replace image background
- HD Touch Up - Enhance image quality
- Anime Selfie - Transform to anime style

**Usage:**
- Use `buildUpscaleInput()` from `src/infrastructure/utils/image-feature-builders.util.ts`
- Use `buildRemoveBackgroundInput()` for background removal
- Use `buildFaceSwapInput()` for face swapping
- See `src/infrastructure/builders/image-feature-builder.ts` for complete list

**Related:**
- Image builders: `src/infrastructure/utils/image-feature-builders.util.ts`

---

### Video Features

**Location:** `src/infrastructure/builders/video-feature-builder.ts`

**Features:**
- Image-to-Video - Convert images to video
- Text-to-Video - Generate video from text prompts

**Usage:**
Use `buildVideoFromImageInput()` from `src/infrastructure/utils/video-feature-builders.util.ts`

**Related:**
- Video builders: `src/infrastructure/utils/video-feature-builders.util.ts`

---

## API Reference

### FalProvider

**Location:** `src/infrastructure/services/fal-provider.ts`

**Purpose:** Main provider class for FAL AI operations

**Import:**
```typescript
import { falProvider } from '@umituz/react-native-ai-fal-provider';
```

**Key Methods:**
- `initialize()` - Set up provider with API key
- `subscribe()` - Subscribe to generation job with polling
- `run()` - Run generation job
- `submitJob()` - Submit job to queue
- `getJobStatus()` - Check job status
- `getJobResult()` - Get job result
- `cancelCurrentRequest()` - Cancel current request
- `hasRunningRequest()` - Check for active requests

**Implementation:** See `src/infrastructure/services/fal-provider.ts` for complete API

**Related:**
- Provider constants: `src/infrastructure/services/fal-provider.constants.ts`
- Subscription handler: `src/infrastructure/services/fal-provider-subscription.ts`

---

### useFalGeneration Hook

**Location:** `src/presentation/hooks/use-fal-generation.ts`

**Purpose:** React hook for managing AI generation operations

**Import:**
```typescript
import { useFalGeneration } from '@umituz/react-native-ai-fal-provider';
```

**Returns:**
- `data` - Generation result
- `error` - Error information
- `isLoading` - Loading state
- `isRetryable` - Whether error can be retried
- `generate()` - Start generation function
- `retry()` - Retry failed generation
- `cancel()` - Cancel current generation
- `reset()` - Reset state

**Usage Guidelines:**
Use this hook when you need to manage AI generation in React components. It handles loading states, errors, and retries automatically.

**Implementation:** See `src/presentation/hooks/use-fal-generation.ts` for options and callbacks

---

### useModels Hook

**Location:** `src/presentation/hooks/use-models.ts`

**Purpose:** React hook for managing AI model selection

**Import:**
```typescript
import { useModels } from '@umituz/react-native-ai-fal-provider';
```

**Returns:**
- `models` - Available models array
- `selectedModel` - Currently selected model
- `selectModel()` - Select model function
- `creditCost` - Cost in credits
- `modelId` - Selected model ID
- `isLoading` - Loading state
- `error` - Error information
- `refreshModels()` - Refresh models function

**Usage Guidelines:**
Use this hook to provide model selection UI and dynamic pricing information.

**Implementation:** See `src/presentation/hooks/use-models.ts` for configuration options

---

## Type Definitions

### Core Types

**Location:** `src/domain/entities/fal.types.ts`

**Types:**
- `FalConfig` - Provider configuration
- `FalModel` - Model definition
- `FalJobInput` - Job input structure
- `FalJobResult` - Job result structure
- `FalQueueStatus` - Queue status structure

**Import:**
```typescript
import type {
  FalConfig,
  FalModel,
  FalJobInput,
  FalJobResult
} from '@umituz/react-native-ai-fal-provider';
```

---

### Error Types

**Location:** `src/domain/entities/error.types.ts`

**Types:**
- `FalErrorType` - Error type enumeration
- `FalErrorCategory` - Error category
- `FalErrorInfo` - Error information structure

**Usage:**
Use error types from `src/domain/entities/error.types.ts` for type-safe error handling.

**Related:**
- Error mapper: `src/infrastructure/utils/error-mapper.ts`
- Error categorizer: `src/infrastructure/utils/error-categorizer.ts`

---

### Input Builder Types

**Location:** `src/domain/types/input-builders.types.ts`

**Types:**
- `UpscaleOptions` - Upscale operation options
- `PhotoRestoreOptions` - Photo restore options
- `ImageToImagePromptConfig` - Image-to-image configuration
- `VideoFromImageOptions` - Video generation options
- `FaceSwapOptions` - Face swap options

**Usage:**
Use these types when calling input builder functions from `src/infrastructure/utils/`.

---

## Utilities

### Error Handling

**Location:** `src/infrastructure/utils/error-mapper.ts`

**Functions:**
- `mapFalError()` - Map FAL errors to standard format
- `isFalErrorRetryable()` - Check if error can be retried

**Import:**
```typescript
import { mapFalError, isFalErrorRetryable } from '@umituz/react-native-ai-fal-provider';
```

**Usage:**
Use these functions to handle errors consistently across your application.

---

### Input Builders

**Locations:**
- `src/infrastructure/utils/image-feature-builders.util.ts` - Image features
- `src/infrastructure/utils/video-feature-builders.util.ts` - Video features
- `src/infrastructure/utils/base-builders.util.ts` - Base builders

**Functions:**
- `buildUpscaleInput()` - Build upscale input
- `buildRemoveBackgroundInput()` - Build background removal input
- `buildFaceSwapInput()` - Build face swap input
- `buildVideoFromImageInput()` - Build video generation input

**Usage:**
Import builder functions and use them to construct API-compatible input objects.

---

### Type Guards

**Location:** `src/infrastructure/utils/type-guards.util.ts`

**Functions:**
- `isValidBase64Image()` - Validate base64 image data
- `isValidApiKey()` - Validate API key format
- `isValidPrompt()` - Validate prompt text
- `isFalModelType()` - Check FAL model type

**Import:**
```typescript
import {
  isValidBase64Image,
  isValidApiKey,
  isFalModelType
} from '@umituz/react-native-ai-fal-provider';
```

**Usage:**
Use these guards to validate inputs before making API calls.

---

### Helper Functions

**Location:** `src/infrastructure/utils/helpers.util.ts`

**Functions:**
- `formatImageDataUri()` - Format image data URI
- `extractBase64()` - Extract base64 from data URI
- `formatCreditCost()` - Format credit cost for display
- `truncatePrompt()` - Truncate prompt to max length
- `sanitizePrompt()` - Sanitize prompt text

**Import:**
```typescript
import {
  formatImageDataUri,
  formatCreditCost,
  truncatePrompt
} from '@umituz/react-native-ai-fal-provider';
```

**Usage:**
Use these helpers for common data formatting operations.

---

### Job Management

**Location:** `src/infrastructure/utils/job-metadata/index.ts`

**Functions:**
- `createJobMetadata()` - Create job tracking metadata
- `updateJobMetadata()` - Update job metadata
- `isJobCompleted()` - Check if job completed
- `getJobDuration()` - Get job duration
- `serializeJobMetadata()` - Serialize for storage
- `deserializeJobMetadata()` - Deserialize from storage

**Import:**
```typescript
import {
  createJobMetadata,
  updateJobMetadata,
  saveJobMetadata,
  loadJobMetadata
} from '@umituz/react-native-ai-fal-provider';
```

**Usage:**
Use these functions to track and persist job state.

---

## Constants

### Default Models

**Location:** `src/domain/constants/default-models.constants.ts`

**Exports:**
- `DEFAULT_TEXT_TO_IMAGE_MODELS` - Text-to-image model list
- `DEFAULT_TEXT_TO_VIDEO_MODELS` - Text-to-video model list
- `DEFAULT_IMAGE_TO_VIDEO_MODELS` - Image-to-video model list
- `DEFAULT_TEXT_TO_VOICE_MODELS` - Text-to-voice model list

**Functions:**
- `getAllDefaultModels()` - Get all models
- `getDefaultModelsByType()` - Get models by type
- `getDefaultModel()` - Get default model for type
- `findModelById()` - Find model by ID

**Import:**
```typescript
import {
  DEFAULT_TEXT_TO_IMAGE_MODELS,
  getDefaultModel
} from '@umituz/react-native-ai-fal-provider';
```

---

### Feature Models

**Location:** `src/domain/constants/feature-models.constants.ts`

**Exports:**
- `FAL_IMAGE_FEATURE_MODELS` - Image feature model mappings
- `FAL_VIDEO_FEATURE_MODELS` - Video feature model mappings

**Functions:**
- `getAllFeatureModels()` - Get all feature models

**Usage:**
Use these constants to find model IDs for specific features.

---

### Provider Constants

**Location:** `src/infrastructure/services/fal-provider.constants.ts`

**Constants:**
- `DEFAULT_FAL_CONFIG` - Default provider configuration
- `FAL_CAPABILITIES` - Provider capabilities

**Usage:**
Reference these constants for configuration options and supported features.

---

## Services

### FalProvider Service

**Location:** `src/infrastructure/services/fal-provider.ts`

**Purpose:** Main service class implementing IAIProvider interface

**Import:**
```typescript
import { falProvider } from '@umituz/react-native-ai-fal-provider';
```

**Singleton:** Use the exported `falProvider` instance

---

### FalModelsService

**Location:** `src/infrastructure/services/fal-models.service.ts`

**Purpose:** Model management service

**Import:**
```typescript
import { falModelsService } from '@umituz/react-native-ai-fal-provider';
```

**Usage:**
Use this service for advanced model management operations.

---

## Validators

### NSFW Content Validator

**Location:** `src/infrastructure/validators/nsfw-validator.ts`

**Function:** `validateNSFWContent()`

**Import:**
```typescript
import { validateNSFWContent } from '@umituz/react-native-ai-fal-provider';
```

**Purpose:** Validate AI-generated content for inappropriate material

**Usage:**
Call this function on generation results to ensure content safety.

**Throws:** `NSFWContentError` if NSFW content detected

**Related:**
- Error class: `src/infrastructure/services/nsfw-content-error.ts`

---

## Documentation Index

### Models
- [Text-to-Image](src/domain/constants/models/text-to-image.README.md)
- [Text-to-Video](src/domain/constants/models/text-to-video.README.md)
- [Image-to-Video](src/domain/constants/models/image-to-video.README.md)
- [Text-to-Voice](src/domain/constants/models/text-to-voice.README.md)
- [Text-to-Text](src/domain/constants/models/text-to-text.README.md)

### Features
- [Image Features](src/infrastructure/builders/image-feature-builder.README.md)
- [Video Features](src/infrastructure/builders/video-feature-builder.README.md)

### Core Services
- [FalProvider](src/infrastructure/services/fal-provider.README.md)
- [Model Management](src/infrastructure/services/fal-models-service.README.md)

### Error Handling
- [Error Mapper](src/infrastructure/utils/error-mapper.README.md)
- [Error Categorizer](src/infrastructure/utils/error-categorizer.README.md)
- [NSFW Content Error](src/infrastructure/services/nsfw-content-error.README.md)

### Utilities
- [Type Guards](src/infrastructure/utils/type-guards.util.README.md)
- [Helper Functions](src/infrastructure/utils/helpers.util.README.md)
- [Job Metadata](src/infrastructure/utils/job-metadata/index.README.md)

### React Integration
- [React Hooks](src/presentation/hooks/index.README.md)
- [useFalGeneration Hook](src/presentation/hooks/use-fal-generation.README.md)
- [useModels Hook](src/presentation/hooks/use-models.README.md)

### Types
- [FAL Types](src/domain/entities/fal.types.README.md)
- [Error Types](src/domain/entities/error.types.README.md)
- [Input Builders Types](src/domain/types/input-builders.types.README.md)
- [Model Selection Types](src/domain/types/model-selection.types.README.md)

---

## For AI Agents

### When Working with This Codebase

**DO:**
- Read the actual source files before writing code
- Follow existing patterns in the codebase
- Use types from `src/domain/types/`
- Respect the architecture (domain/infrastructure/presentation)
- Maintain type safety
- Update documentation when adding features

**DON'T:**
- Write code without reading existing implementations
- Make assumptions about code structure
- Skip type definitions
- Ignore documentation paths
- Create parallel implementations

### File Finding

When documentation mentions a file path:
1. Navigate to that exact path
2. Read the file completely
3. Understand exports and types
4. Follow the implementation pattern
5. Apply to your use case

### Implementation Patterns

**For New Features:**
1. Define types in `src/domain/types/`
2. Implement in appropriate layer (domain/infrastructure/presentation)
3. Export from `src/index.ts`
4. Update documentation
5. Follow existing patterns

**For Modifications:**
1. Read the complete file first
2. Understand dependencies
3. Make changes while maintaining patterns
4. Update type definitions if needed
5. Test thoroughly

---

## Support

**Documentation:** See individual README files in each directory

**Issues:** Report issues at https://github.com/umituz/react-native-ai-fal-provider/issues

**Author:** Umit UZ <umit@umituz.com>

**License:** MIT
