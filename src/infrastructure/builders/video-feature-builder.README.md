# Video Features

Input builder functions for video processing and generation features.

**Location:** `src/infrastructure/builders/video-feature-builder.ts`

## Overview

This module provides builder functions for constructing inputs to FAL AI video generation models. It supports various video features including AI hug and AI kiss generation using reference images.

## Purpose

Simplifies video feature integration by:
- Providing type-safe input builders
- Abstracting complex video generation parameters
- Supporting multi-person video generation
- Handling aspect ratio and movement configuration
- Enabling style and motion control

## Supported Features

| Feature | Model ID | Description |
|---------|----------|-------------|
| `ai-hug` | `fal-ai/vidu/q1/reference-to-video` | Generate videos of two people hugging |
| `ai-kiss` | `fal-ai/vidu/q1/reference-to-video` | Generate videos of two people kissing |

**Note:** Vidu Q1 Reference-to-Video model supports multiple reference images (up to 7 images). This is ideal for scenarios with two different people (hugging, kissing, etc.).

## Import

```typescript
import {
  buildVideoFromImageInput,
  buildImageToImageInput
} from '@umituz/react-native-ai-fal-provider';
```

## Builder Functions

### buildVideoFromImageInput

Build input for video generation from reference images.

**Parameters:**
- `sourceImage`: Base64 source image or data URI
- `options`: Video generation options (optional)
  - `target_image`: Second reference image (optional)
  - `prompt`: Video description (optional)
  - `motion_prompt`: Movement description (optional)
  - `aspect_ratio`: Video aspect ratio (optional)
  - `movement_amplitude`: Movement intensity (optional)

**Returns:** Formatted input object for video generation model

**Usage:**
Use to generate videos from reference images. Supports single or multiple people. Configure aspect ratio and movement amplitude for output.

**Related:**
- Video feature builders: `src/infrastructure/utils/video-feature-builders.util.ts`
- useFalGeneration hook: `src/presentation/hooks/use-fal-generation.ts`

### buildImageToImageInput

Build input for image-to-image video generation.

**Parameters:**
- `image`: Base64 source image or data URI
- `options`: Image-to-image options
  - `prompt`: Transformation description
  - `negativePrompt`: Negative prompts (optional)
  - `strength`: Transformation strength 0-1 (optional, default: 0.85)
  - `num_inference_steps`: Inference steps (optional, default: 50)
  - `guidance_scale`: Guidance scale (optional, default: 7.5)

**Returns:** Formatted input object for image-to-image model

**Usage:**
Use to transform images into videos with style and motion control. Prompt describes desired transformation.

## Usage Guidelines

### For AI Hug Generation

**Hug Video Pattern:**
1. Prepare two reference images (people to hug)
2. Use `buildVideoFromImageInput()` with first person image
3. Include second person image in `target_image` option
4. Set prompt describing hugging scene
5. Configure aspect ratio (9:16 for mobile)
6. Set movement amplitude (auto recommended)
7. Submit to video generation model
8. Handle video result

**Best Practices:**
- Use clear portraits with visible faces
- Ensure similar lighting in both images
- Provide warm, embracing prompt descriptions
- Use 9:16 aspect ratio for mobile platforms
- Set movement to auto for natural motion

**Related:**
- useFalGeneration hook: `src/presentation/hooks/use-fal-generation.ts`

### For AI Kiss Generation

**Kiss Video Pattern:**
1. Prepare two reference images (people to kiss)
2. Use `buildVideoFromImageInput()` with first person image
3. Include second person image in `target_image` option
4. Set romantic prompt describing kiss
5. Configure motion prompt for tender movement
6. Set aspect ratio appropriately
7. Set movement amplitude to small for gentle motion
8. Submit to video generation model
9. Handle video result

**Best Practices:**
- Use romantic, tender prompt descriptions
- Set movement amplitude to small
- Ensure faces are clearly visible
- Provide gentle motion prompts
- Consider 9:16 for social media

### For Single Person Videos

**Single Person Pattern:**
1. Prepare single reference image
2. Use `buildVideoFromImageInput()` with image
3. Describe desired motion in prompt
4. Set movement amplitude as needed
5. Configure aspect ratio for platform
6. Submit to model
7. Handle generated video

**Movement Amplitude:**
- `auto`: Automatic (recommended)
- `small`: Subtle movements
- `medium`: Moderate movements
- `large`: Pronounced movements

### For Aspect Ratio Selection

**Platform-Specific Ratios:**
- TikTok/Reels/Shorts: `9:16` (vertical)
- YouTube/Cinema: `16:9` (horizontal)
- Instagram: `1:1` (square)

**Usage:**
Select aspect ratio based on target platform. Consider how video will be viewed and shared.

### For Image-to-Image Generation

**Transformation Pattern:**
1. Prepare base64 source image
2. Write transformation prompt
3. Configure strength (0-1, default 0.85)
4. Set inference steps (default 50)
5. Adjust guidance scale (default 7.5)
6. Use `buildImageToImageInput()` with configuration
7. Submit to model
8. Handle transformed result

## Best Practices

### 1. Prepare Quality Reference Images

Ensure image quality:
- Use clear portraits with visible faces
- Maintain similar lighting across images
- Use minimum 512x512 resolution
- Ensure subjects are well-positioned
- Provide high-quality source images

**Related:**
- Helper utilities: `src/infrastructure/utils/helpers.util.ts`
- Type guards: `src/infrastructure/utils/type-guards.util.ts`

### 2. Write Effective Prompts

Craft descriptive prompts:
- Be specific about action (hugging, kissing)
- Describe movement style (gentle, warm, energetic)
- Include atmosphere and mood
- Add emotional context
- Use descriptive adjectives

### 3. Configure Movement Appropriately

Set correct movement amplitude:
- Use `auto` for most cases (recommended)
- Use `small` for subtle, gentle movements
- Use `medium` for moderate motion
- Use `large` for energetic movements
- Match movement to prompt description

### 4. Select Correct Aspect Ratio

Choose ratio based on platform:
- 9:16 for vertical (TikTok, Reels, Shorts)
- 16:9 for horizontal (YouTube)
- 1:1 for square (Instagram)
- Consider how users will view video

### 5. Handle Long Processing Times

Manage user expectations:
- Video generation takes 2-4 minutes
- Show progress indicators
- Provide status updates
- Allow cancellation
- Queue multiple requests appropriately

**Related:**
- useFalGeneration hook: `src/presentation/hooks/use-fal-generation.ts`
- Job lifecycle utilities: `src/infrastructure/utils/job-metadata/job-metadata-lifecycle.util.ts`

## For AI Agents

### When Using Video Builders

**DO:**
- Import from package root
- Use appropriate builder for feature
- Validate image data before building
- Provide clear, descriptive prompts
- Set appropriate aspect ratios
- Configure movement amplitude correctly
- Handle long processing times

**DON'T:**
- Use wrong builder for feature
- Skip image validation
- Use vague prompt descriptions
- Ignore aspect ratio requirements
- Set inappropriate movement levels
- Forget about processing time
- Process low-quality images

### When Building Inputs

**DO:**
- Use `buildVideoFromImageInput()` for AI hug/kiss
- Provide second image for two-person features
- Write descriptive prompts
- Set appropriate aspect ratio
- Configure movement amplitude
- Validate image formats
- Test with sample images

**DON'T:**
- Skip second image for two-person videos
- Use generic prompt descriptions
- Ignore aspect ratio requirements
- Forget movement configuration
- Process invalid image data
- Use wrong builder function
- Mix up parameter order

### When Handling Results

**DO:**
- Handle video URLs appropriately
- Display video players correctly
- Support video controls
- Show progress during generation
- Handle timeouts gracefully
- Validate video output
- Inform user of processing time

**DON'T:**
- Treat video as image
- Display video incorrectly
- Skip progress indicators
- Ignore timeout scenarios
- Forget video controls
- Lose generated videos
- Mislead user about processing time

### When Adding Features

**For New Video Features:**
1. Add builder function to module
2. Define options interface
3. Document feature and model
4. Update exports
5. Add tests with real API
6. Update this README

**For Enhanced Options:**
1. Review existing option interfaces
2. Add new video generation options
3. Set sensible defaults
4. Update TypeScript types
5. Document new options
6. Test with various inputs

**For New Integrations:**
1. Research FAL model requirements
2. Design builder interface
3. Implement builder function
4. Test with real API
5. Document usage patterns
6. Update related code

## Implementation Notes

**Location:** `src/infrastructure/builders/video-feature-builder.ts`

**Dependencies:**
- Uses helper utilities from `src/infrastructure/utils/helpers.util.ts`
- Integrates with FAL provider
- No external dependencies

**Builder Categories:**
- Multi-person video generation (AI hug, AI kiss)
- Single-person video generation
- Image-to-image video generation

**Video Generation Time:**
- AI Hug: 2-4 minutes average
- AI Kiss: 2-4 minutes average
- Times vary based on model load and complexity

**Import:**
```typescript
import {
  buildVideoFromImageInput,
  buildImageToImageInput
} from '@umituz/react-native-ai-fal-provider';
```

**Related:**
- Video feature builders: `src/infrastructure/utils/video-feature-builders.util.ts`
- Helper utilities: `src/infrastructure/utils/helpers.util.ts`
- Type guards: `src/infrastructure/utils/type-guards.util.ts`
- FAL provider: `src/infrastructure/services/fal-provider.ts`

## Related Documentation

- [Video Feature Builders](../utils/video-feature-builders.util.README.md)
- [Helper Utilities](../utils/helpers.util.README.md)
- [Type Guards](../utils/type-guards.util.README.md)
- [useFalGeneration Hook](../../presentation/hooks/use-fal-generation.README.md)
