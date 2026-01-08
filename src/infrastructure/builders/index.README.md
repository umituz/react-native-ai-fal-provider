# Builders Module

Central export point for all input builder functions.

**Location:** `src/infrastructure/builders/index.ts`

## Overview

The builders module provides a unified interface for constructing API-compatible input objects for FAL AI operations. It exports two main builder functions that handle all image and video processing features.

## Purpose

Provides input builders by:
- Unifying image and video input construction
- Supporting all processing features
- Type-safe input building
- Simplifying API calls
- Handling feature-specific parameters

## Import

```typescript
import {
  buildImageFeatureInput,
  buildVideoFeatureInput
} from '@umituz/react-native-ai-fal-provider';
```

## Exports

### Image Features

Builds input objects for image processing features.

**Supported Features:**
- `upscale` - Upscale images by 2x or 4x
- `photo-restore` - Restore old or damaged photos
- `face-swap` - Swap faces between images
- `anime-selfie` - Transform selfie into anime style
- `remove-background` - Remove background from images
- `remove-object` - Remove objects from images
- `hd-touch-up` - Enhance image quality
- `replace-background` - Replace image background

**Path:** `src/infrastructure/builders/image-feature-builder.ts`

### Video Features

Builds input objects for video processing features.

**Supported Features:**
- `ai-hug` - Generate AI hug video from 2 images
- `ai-kiss` - Generate AI kiss video from 2 images

**Path:** `src/infrastructure/builders/video-feature-builder.ts`

## Usage Guidelines

### For Image Input Building

**Building Pattern:**
1. Select appropriate image feature
2. Prepare base64 image data
3. Configure feature-specific options
4. Call buildImageFeatureInput
5. Use result with provider

**Best Practices:**
- Validate image data before building
- Use correct options for feature
- Handle required parameters
- Check option constraints
- Reference feature documentation

### For Video Input Building

**Building Pattern:**
1. Select video feature type
2. Prepare source and target images
3. Configure video parameters
4. Call buildVideoFeatureInput
5. Use result with provider

**Best Practices:**
- Provide both images for video features
- Set appropriate aspect ratios
- Configure movement parameters
- Handle optional parameters
- Validate image inputs

## Best Practices

### 1. Validate Inputs

Check inputs before building:
- Validate base64 image format
- Check required parameters
- Verify feature support
- Handle missing data
- Provide clear errors

### 2. Use Correct Options

Select appropriate options:
- Match options to feature type
- Check parameter constraints
- Set valid values
- Handle optional parameters
- Refer to feature docs

### 3. Handle Results

Process builder results:
- Use returned input with provider
- Pass correct model ID
- Handle build errors
- Validate output structure
- Track request lifecycle

### 4. Type Safety

Maintain type safety:
- Use TypeScript types
- Import from package root
- Check feature types
- Validate option structures
- Enable autocomplete

### 5. Feature Knowledge

Understand feature behavior:
- Read feature documentation
- Know required parameters
- Understand option effects
- Check model compatibility
- Validate usage patterns

## For AI Agents

### When Using Builder Functions

**DO:**
- Import from package root
- Validate inputs before building
- Use correct options for features
- Handle required parameters
- Check parameter constraints
- Reference feature docs
- Use typed imports

**DON'T:**
- Skip input validation
- Use wrong options for features
- Forget required parameters
- Ignore parameter constraints
- Build without validation
- Use from internal paths
- Create invalid inputs

### When Building Image Features

**DO:**
- Validate base64 image data
- Use appropriate options
- Set valid parameter values
- Handle required options
- Check feature constraints
- Follow feature patterns
- Test built inputs

**DON'T:**
- Skip image validation
- Use invalid options
- Forget required parameters
- Set invalid values
- Ignore constraints
- Create malformed inputs
- Assume valid inputs

### When Building Video Features

**DO:**
- Provide both source and target images
- Set appropriate aspect ratios
- Configure movement parameters
- Validate image inputs
- Check feature requirements
- Handle optional parameters
- Test video inputs

**DON'T:**
- Skip required images
- Use wrong aspect ratios
- Ignore movement settings
- Forget validation
- Create incomplete inputs
- Set invalid parameters
- Assume correct format

## Implementation Notes

**Location:** `src/infrastructure/builders/index.ts`

**Dependencies:**
- Image feature builder: `src/infrastructure/builders/image-feature-builder.ts`
- Video feature builder: `src/infrastructure/builders/video-feature-builder.ts`

**Export Categories:**
- Image input builders
- Video input builders

**Import:**
```typescript
import {
  buildImageFeatureInput,
  buildVideoFeatureInput
} from '@umituz/react-native-ai-fal-provider';
```

**Related:**
- Image feature builder: `src/infrastructure/builders/image-feature-builder.ts`
- Video feature builder: `src/infrastructure/builders/video-feature-builder.ts`
- Image feature utilities: `src/infrastructure/utils/image-feature-builders.util.ts`
- Video feature utilities: `src/infrastructure/utils/video-feature-builders.util.ts`
