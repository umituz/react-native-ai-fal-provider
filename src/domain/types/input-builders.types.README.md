# Input Builders Types

TypeScript type definitions for FAL input builder functions.

**Location:** `src/domain/types/input-builders.types.ts`

## Overview

This module defines TypeScript types used by input builder functions for image and video processing operations.

## Purpose

Provides type safety for input builders by:
- Defining option interfaces for each feature
- Enforcing valid parameter values
- Supporting type-safe input construction
- Documenting builder parameters
- Preventing invalid inputs

## Import

```typescript
import type {
  ImageFeatureType,
  VideoFeatureType,
  UpscaleOptions,
  PhotoRestoreOptions,
  FaceSwapOptions,
  RemoveBackgroundOptions,
  RemoveObjectOptions,
  HDTouchUpOptions,
  ReplaceBackgroundOptions,
  KontextStyleTransferOptions,
  VideoFromImageOptions,
  ImageToImagePromptConfig
} from '@umituz/react-native-ai-fal-provider';
```

## Types

### Image Feature Types

**ImageFeatureType**
Enumeration of all image processing features.

**Valid Values:**
- `upscale` - Image upscaling
- `photo-restore` - Photo restoration
- `face-swap` - Face swapping
- `anime-selfie` - Anime style transfer
- `remove-background` - Background removal
- `remove-object` - Object removal
- `hd-touch-up` - HD enhancement
- `replace-background` - Background replacement

**Usage:**
Use to specify image processing feature type. Enables type-safe feature selection. Used in builder functions.

### Video Feature Types

**VideoFeatureType**
Enumeration of all video processing features.

**Valid Values:**
- `ai-hug` - AI hug video generation
- `ai-kiss` - AI kiss video generation

**Usage:**
Use to specify video processing feature type. Enables type-safe feature selection. Used in builder functions.

### Image Feature Options

#### UpscaleOptions

Options for image upscaling.

**Properties:**
- `scaleFactor`: 2 or 4 - Upscaling factor (optional)
- `enhanceFaces`: boolean - Enable face enhancement (optional)

**Usage:**
Configure image upscaling operations. Set scale factor for output size. Enable face enhancement for portraits.

**Related:**
- Image feature builder: `src/infrastructure/builders/image-feature-builder.ts`

#### PhotoRestoreOptions

Options for photo restoration.

**Properties:**
- `enhanceFaces`: boolean - Enable face enhancement (optional)

**Usage:**
Configure photo restoration operations. Enable face enhancement for portrait restoration.

#### FaceSwapOptions

Options for face swapping.

**Properties:**
- No additional options currently

**Usage:**
Provide type safety for face swap operations. All parameters handled in builder function.

#### RemoveBackgroundOptions

Options for background removal.

**Properties:**
- No additional options currently

**Usage:**
Provide type safety for background removal. All parameters handled in builder function.

#### RemoveObjectOptions

Options for object removal.

**Properties:**
- `mask`: string - Base64 mask of area to remove (optional)
- `prompt`: string - Description for fill content (optional)

**Usage:**
Specify area to remove with mask. Describe fill content with prompt. Control inpaint behavior.

#### HDTouchUpOptions

Options for HD enhancement.

**Properties:**
- `scaleFactor`: 2 or 4 - Upscaling factor (optional)
- `enhanceFaces`: boolean - Enable face enhancement (optional)

**Usage:**
Configure HD enhancement operations. Similar to upscale options. Combine upscaling with quality improvement.

#### ReplaceBackgroundOptions

Options for background replacement.

**Properties:**
- `prompt`: string - Description of new background

**Usage:**
Describe desired new background. AI generates scene based on prompt. Maintain subject consistency.

#### KontextStyleTransferOptions

Options for style transfer.

**Properties:**
- `prompt`: string - Style description
- `guidance_scale`: number - Style strength (optional)

**Usage:**
Describe desired artistic style. Control style adherence with guidance scale. Transform image style.

### Video Feature Options

#### VideoFromImageOptions

Options for video generation from images.

**Properties:**
- `target_image`: string - Second reference image (optional)
- `prompt`: string - Video description (optional)
- `motion_prompt`: string - Movement description (optional, deprecated)
- `duration`: number - Video duration in seconds (optional)
- `aspect_ratio`: "16:9" | "9:16" | "1:1" - Aspect ratio (optional)
- `movement_amplitude`: "auto" | "small" | "medium" | "large" - Movement intensity (optional)

**Parameter Constraints:**

| Parameter | Type | Valid Values | Description |
|-----------|------|-------------|-------------|
| `target_image` | string | Base64 data URI | Second reference image for multi-person videos |
| `aspect_ratio` | string | 16:9, 9:16, 1:1 | Output video aspect ratio |
| `movement_amplitude` | string | auto, small, medium, large | Intensity of motion |

**Usage:**
Configure video generation from reference images. Support single and multi-person videos. Set aspect ratio for platform. Control movement intensity.

**Related:**
- Video feature builder: `src/infrastructure/builders/video-feature-builder.ts`

#### ImageToImagePromptConfig

Options for image-to-image transformation.

**Properties:**
- `prompt`: string - Transformation description
- `negativePrompt`: string - Negative prompts (optional)
- `strength`: number - Transformation strength 0-1 (optional, default: 0.85)
- `guidance_scale`: number - Prompt adherence 1-20 (optional, default: 7.5)
- `num_inference_steps`: number - Inference steps 10-150 (optional, default: 50)

**Parameter Constraints:**

| Parameter | Range | Default | Description |
|-----------|-------|---------|-------------|
| `strength` | 0-1 | 0.85 | How much to transform (0=min, 1=max) |
| `guidance_scale` | 1-20 | 7.5 | Prompt adherence strength |
| `num_inference_steps` | 10-150 | 50 | Number of inference steps |

**Usage:**
Transform images with style and content control. Describe desired transformation. Use negative prompts to avoid unwanted features. Adjust strength and guidance for control.

**Related:**
- Video feature builder: `src/infrastructure/builders/video-feature-builder.ts`

## Usage Guidelines

### For Image Operations

**Image Operation Pattern:**
1. Import appropriate options type
2. Create options object with desired parameters
3. Validate options if needed
4. Pass to builder function
5. Submit to provider

**Best Practices:**
- Use typed options objects
- Validate parameter ranges
- Set appropriate defaults
- Handle optional parameters
- Check constraints before use

**Related:**
- Image feature builder: `src/infrastructure/builders/image-feature-builder.ts`
- Image feature builders: `src/infrastructure/utils/image-feature-builders.util.ts`

### For Video Operations

**Video Operation Pattern:**
1. Import video options types
2. Create options with configuration
3. Set aspect ratio for platform
4. Configure movement amplitude
5. Build and submit input

**Best Practices:**
- Choose appropriate aspect ratio
- Set correct movement amplitude
- Use `auto` for most cases
- Provide second image for multi-person
- Describe desired motion clearly

**Related:**
- Video feature builder: `src/infrastructure/builders/video-feature-builder.ts`
- Video feature builders: `src/infrastructure/utils/video-feature-builders.util.ts`

### For Type Safety

**Type Safety Pattern:**
1. Use `import type` for types
2. Leverage TypeScript validation
3. Enforce parameter constraints
4. Use discriminated unions
5. Enable autocomplete

**Benefits:**
- Compile-time validation
- IDE autocomplete support
- Parameter type checking
- Prevent invalid inputs
- Self-documenting code

## Best Practices

### 1. Use Type Imports

Import types correctly:
- Use `import type` for type-only imports
- Import from package root
- Maintain type safety
- Enable tree-shaking

### 2. Validate Parameters

Check option validity:
- Validate parameter ranges
- Check valid value sets
- Verify required fields
- Provide helpful errors
- Handle edge cases

### 3. Set Appropriate Defaults

Provide sensible defaults:
- Use recommended values
- Consider use case requirements
- Document default behavior
- Override when needed
- Test default configurations

### 4. Use Option Presets

Create reusable configurations:
- Define common option sets
- Share across application
- Maintain consistency
- Document preset purpose
- Update centrally

### 5. Compose Options

Build complex configurations:
- Start with base options
- Override specific parameters
- Merge option objects
- Validate final result
- Document composition

## For AI Agents

### When Using Input Builder Types

**DO:**
- Import types from package root
- Use `import type` for types
- Validate parameter values
- Check parameter constraints
- Use appropriate types for features
- Enable type safety
- Follow type definitions

**DON'T:**
- Skip type imports
- Use wrong option types
- Ignore parameter validation
- Assume parameter validity
- Mix image/video option types
- Disable type checking
- Create duplicate types

### When Building Inputs

**DO:**
- Use correct option types
- Set valid parameter values
- Check constraints before building
- Handle optional parameters
- Provide all required fields
- Validate option objects
- Follow type definitions

**DON'T:**
- Use wrong option types
- Set invalid parameter values
- Skip validation
- Forget required parameters
- Ignore type errors
- Create type mismatches
- Assume valid inputs

### When Adding Options

**For New Option Types:**
1. Add interface to types file
2. Define properties with correct types
3. Add validation constraints
4. Update TypeScript types
5. Document option behavior
6. Test with builder functions

**For Enhanced Options:**
1. Review existing option interfaces
2. Add new properties appropriately
3. Set valid value constraints
4. Update builder functions
5. Test new options
6. Update documentation

**For Type Validation:**
1. Add parameter validation
2. Check value ranges
3. Verify required fields
4. Provide clear errors
5. Update type guards
6. Test validation logic

## Implementation Notes

**Location:** `src/domain/types/input-builders.types.ts`

**Dependencies:**
- No external dependencies
- Pure TypeScript type definitions
- Used by builder functions

**Type Categories:**
- Image feature types
- Video feature types
- Image option interfaces
- Video option interfaces
- Parameter constraints

**Import:**
```typescript
import type {
  ImageFeatureType,
  VideoFeatureType,
  UpscaleOptions,
  PhotoRestoreOptions,
  FaceSwapOptions,
  RemoveBackgroundOptions,
  RemoveObjectOptions,
  HDTouchUpOptions,
  ReplaceBackgroundOptions,
  KontextStyleTransferOptions,
  VideoFromImageOptions,
  ImageToImagePromptConfig
} from '@umituz/react-native-ai-fal-provider';
```

**Related:**
- Image feature builder: `src/infrastructure/builders/image-feature-builder.ts`
- Video feature builder: `src/infrastructure/builders/video-feature-builder.ts`
- Image feature builders: `src/infrastructure/utils/image-feature-builders.util.ts`
- Video feature builders: `src/infrastructure/utils/video-feature-builders.util.ts`

## Related Documentation

- [Image Feature Builder](../../infrastructure/builders/image-feature-builder.README.md)
- [Video Feature Builder](../../infrastructure/builders/video-feature-builder.README.md)
- [Image Feature Builders](../../infrastructure/utils/image-feature-builders.util.README.md)
- [Video Feature Builders](../../infrastructure/utils/video-feature-builders.util.README.md)
