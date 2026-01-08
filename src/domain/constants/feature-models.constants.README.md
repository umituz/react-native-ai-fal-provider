# Feature Models Constants

FAL feature models catalog with model IDs for image and video processing features.

**Location:** `src/domain/constants/feature-models.constants.ts`

## Overview

This module defines the mapping between feature types and their corresponding FAL AI model IDs. It provides a centralized registry for all image and video processing features supported by the FAL provider.

## Purpose

Centralizes feature-to-model mapping by:
- Defining feature types and model IDs
- Providing model lookup by feature
- Supporting image and video features
- Maintaining feature catalog
- Enabling feature-based model selection

## Import

```typescript
import {
  FAL_IMAGE_FEATURE_MODELS,
  FAL_VIDEO_FEATURE_MODELS,
  getImageFeatureModel,
  getVideoFeatureModel,
  getAllFeatureModels
} from '@umituz/react-native-ai-fal-provider';
```

## Constants

### FAL_IMAGE_FEATURE_MODELS

Model IDs for image processing features.

**Feature Mappings:**

| Feature | Model ID | Description |
|---------|----------|-------------|
| `upscale` | `fal-ai/clarity-upscaler` | Upscale images by 2x or 4x with enhancement |
| `photo-restore` | `fal-ai/aura-sr` | Restore old or damaged photos |
| `face-swap` | `fal-ai/face-swap` | Swap faces between images |
| `anime-selfie` | `fal-ai/flux-pro/kontext` | Transform selfie into anime style |
| `remove-background` | `fal-ai/birefnet` | Remove background from images |
| `remove-object` | `fal-ai/fooocus/inpaint` | Remove objects from images |
| `hd-touch-up` | `fal-ai/clarity-upscaler` | Enhance image quality and clarity |
| `replace-background` | `fal-ai/bria/background/replace` | Replace image background |

**Usage:**
Access model ID for specific image feature. Use in feature-based operations. Get model IDs dynamically. Maintain feature-to-model mapping.

**Implementation:** See complete mapping in `src/domain/constants/feature-models.constants.ts`

**Related:**
- Image feature builder: `src/infrastructure/builders/image-feature-builder.ts`
- Image feature builders: `src/infrastructure/utils/image-feature-builders.util.ts`

### FAL_VIDEO_FEATURE_MODELS

Model IDs for video processing features.

**Feature Mappings:**

| Feature | Model ID | Description |
|---------|----------|-------------|
| `ai-hug` | `fal-ai/vidu/q1/reference-to-video` | Generate AI hug video from 2 images |
| `ai-kiss` | `fal-ai/vidu/q1/reference-to-video` | Generate AI kiss video from 2 images |

**Note:** The Vidu Q1 Reference-to-Video model supports up to 7 reference images, making it perfect for multi-person scenarios like kiss/hug with two different people.

**Usage:**
Access model ID for specific video feature. Use in feature-based operations. Support multi-person video generation. Maintain feature-to-model mapping.

**Related:**
- Video feature builder: `src/infrastructure/builders/video-feature-builder.ts`
- Video feature builders: `src/infrastructure/utils/video-feature-builders.util.ts`

## Functions

### getAllFeatureModels

Get all feature model configurations.

**Returns:** Array of all feature-to-model mappings

**Usage:**
Retrieve complete feature catalog. Display all available features. Iterate over feature mappings. Build feature selection UI.

### getImageFeatureModel

Get model ID for image feature.

**Parameters:**
- `feature`: Image feature type

**Returns:** Model ID string or undefined

**Usage:**
Look up model ID by image feature. Validate feature support. Get model for specific image operation. Use in feature-based routing.

**Related:**
- Image feature builder: `src/infrastructure/builders/image-feature-builder.ts`

### getVideoFeatureModel

Get model ID for video feature.

**Parameters:**
- `feature`: Video feature type

**Returns:** Model ID string or undefined

**Usage:**
Look up model ID by video feature. Validate feature support. Get model for specific video operation. Use in feature-based routing.

**Related:**
- Video feature builder: `src/infrastructure/builders/video-feature-builder.ts`

## Usage Guidelines

### For Feature-Based Operations

**Feature Operation Pattern:**
1. Select feature type (image or video)
2. Get model ID using feature constant
3. Build input using feature-specific builder
4. Submit to FAL provider
5. Handle result appropriately

**Best Practices:**
- Use feature constants instead of hardcoded IDs
- Validate feature before use
- Check model availability
- Handle unsupported features
- Provide fallback models

**Related:**
- Image feature builder: `src/infrastructure/builders/image-feature-builder.ts`
- Video feature builder: `src/infrastructure/builders/video-feature-builder.ts`

### For Feature Discovery

**Discovery Pattern:**
1. Access feature model constants
2. Iterate over available features
3. Display feature catalog
4. Show model IDs and descriptions
5. Enable feature selection

**Usage:**
Build feature selection UI. Display available capabilities. Document supported features. Enable feature filtering.

### For Feature Validation

**Validation Pattern:**
1. Check if feature exists in constants
2. Get corresponding model ID
3. Validate model availability
4. Return feature status
5. Handle invalid features

**Best Practices:**
- Validate features before processing
- Check feature support early
- Provide clear error messages
- Suggest alternative features
- Log unsupported features

### For Feature Extension

**Extension Pattern:**
1. Add new feature to constants
2. Define model ID mapping
3. Update feature types
4. Add builder functions
5. Update documentation

**Best Practices:**
- Follow existing feature patterns
- Use consistent naming
- Update all related files
- Test new features
- Document thoroughly

## Best Practices

### 1. Use Feature Constants

Avoid hardcoded model IDs:
- Import feature constants
- Use feature-based lookups
- Maintain single source of truth
- Update models in one place
- Prevent ID typos

### 2. Validate Features

Check feature support before use:
- Validate feature type
- Check model ID exists
- Verify model availability
- Handle unsupported features
- Provide helpful error messages

### 3. Document Features

Maintain feature documentation:
- List all supported features
- Describe feature behavior
- Show model ID mappings
- Update on feature changes
- Include usage examples (in separate files)

### 4. Handle Missing Features

Graceful degradation for unsupported features:
- Check if feature exists
- Provide alternative features
- Log missing feature warnings
- Inform user of unavailability
- Suggest similar features

### 5. Organize Features Logically

Group features appropriately:
- Image features separate from video
- Related features grouped together
- Consistent naming conventions
- Clear feature descriptions
- Logical feature ordering

## For AI Agents

### When Using Feature Constants

**DO:**
- Import from package root
- Use feature constants for IDs
- Validate features before use
- Check feature support
- Provide fallback options
- Handle missing features
- Follow feature patterns

**DON'T:**
- Hardcode model IDs
- Skip feature validation
- Assume feature exists
- Ignore feature types
- Create duplicate mappings
- Use inconsistent naming
- Forget to update documentation

### When Working with Features

**DO:**
- Look up models by feature
- Use feature-specific builders
- Validate feature support
- Check model availability
- Handle errors appropriately
- Provide feature descriptions
- Test feature operations

**DON'T:**
- Mix image and video features
- Skip feature validation
- Use wrong model IDs
- Ignore feature types
- Handle features generically
- Forget error handling
- Skip feature testing

### When Adding Features

**For New Feature Definitions:**
1. Add feature to appropriate constant
2. Define model ID mapping
3. Update feature types
4. Add builder functions
5. Update this README
6. Test new feature

**For Feature Updates:**
1. Update model ID if changed
2. Modify feature description
3. Update related builders
4. Test with new model
5. Update documentation
6. Communicate changes

**For Enhanced Features:**
1. Review existing feature patterns
2. Add new features following patterns
3. Update TypeScript types
4. Add validation logic
5. Test thoroughly
6. Document additions

## Implementation Notes

**Location:** `src/domain/constants/feature-models.constants.ts`

**Dependencies:**
- Uses feature types from `src/domain/types/model-selection.types.ts`
- No external dependencies
- Pure constant definitions

**Feature Categories:**
- Image features (8 features): upscale, photo-restore, face-swap, anime-selfie, remove-background, remove-object, hd-touch-up, replace-background
- Video features (2 features): ai-hug, ai-kiss

**Import:**
```typescript
import {
  FAL_IMAGE_FEATURE_MODELS,
  FAL_VIDEO_FEATURE_MODELS,
  getImageFeatureModel,
  getVideoFeatureModel,
  getAllFeatureModels
} from '@umituz/react-native-ai-fal-provider';
```

**Related:**
- Model selection types: `src/domain/types/model-selection.types.ts`
- Default models: `src/domain/constants/default-models.constants.ts`
- Image feature builder: `src/infrastructure/builders/image-feature-builder.ts`
- Video feature builder: `src/infrastructure/builders/video-feature-builder.ts`

## Related Documentation

- [Default Models Constants](./default-models.constants.README.md)
- [Model Selection Types](../types/model-selection.types.README.md)
- [Image Feature Builder](../../infrastructure/builders/image-feature-builder.README.md)
- [Video Feature Builder](../../infrastructure/builders/video-feature-builder.README.md)
