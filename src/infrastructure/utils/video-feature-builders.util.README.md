# Video Feature Builders

Input builder functions for video generation and processing features.

**Location:** `src/infrastructure/utils/video-feature-builders.util.ts`

## Overview

This module provides builder functions for creating input objects for video generation and processing operations including AI hug, AI kiss, and image-to-image transformations.

## Purpose

Simplifies video feature integration by:
- Providing feature-specific input builders
- Handling image formatting automatically
- Supporting video-specific options
- Abstracting FAL API parameter structures
- Enabling type-safe input construction

## Import

```typescript
import {
  buildVideoFromImageInput,
  buildImageToImageInput
} from '@umituz/react-native-ai-fal-provider';
```

## Functions

### buildVideoFromImageInput

Build input for video generation from reference images.

**Parameters:**
- `base64`: Base64 source image or data URI
- `options`: Video generation options (optional)
  - `target_image`: Second reference image (optional)
  - `prompt`: Video description (optional)
  - `motion_prompt`: Movement description (optional)
  - `aspect_ratio`: Video aspect ratio (optional)
  - `movement_amplitude`: Movement intensity (optional)

**Returns:** Formatted input object for video generation

**Usage:**
Use to generate videos from reference images. Supports single or multiple people. Configure aspect ratio and movement amplitude for output.

**Related:**
- Video feature builder: `src/infrastructure/builders/video-feature-builder.ts`
- Base builders: `src/infrastructure/utils/base-builders.util.ts`

### buildImageToImageInput

Build input for image-to-image transformation.

**Parameters:**
- `base64`: Base64 source image or data URI
- `promptConfig`: Transformation configuration
  - `prompt`: Transformation description
  - `negativePrompt`: Negative prompts (optional)
  - `strength`: Transformation strength 0-1 (optional, default: 0.85)
  - `num_inference_steps`: Inference steps (optional, default: 50)
  - `guidance_scale`: Guidance scale (optional, default: 7.5)

**Returns:** Formatted input object for image-to-image transformation

**Usage:**
Use to transform images with style and content control. Prompt describes desired transformation. Configure strength and guidance scale for control.

## Usage Guidelines

### For Video Generation

**Video Generation Pattern:**
1. Prepare reference images (one or two people)
2. Use `buildVideoFromImageInput()` with source image
3. Add second image in `target_image` option for two-person features
4. Set prompt describing desired video
5. Configure aspect ratio (9:16 for mobile)
6. Set movement amplitude appropriately
7. Submit to video generation model
8. Handle video result

**Best Practices:**
- Use clear portraits with visible faces
- Ensure similar lighting across images
- Write descriptive prompts
- Set appropriate aspect ratio for platform
- Configure movement amplitude correctly
- Allow for long processing times (2-4 minutes)

**Related:**
- Video feature builder: `src/infrastructure/builders/video-feature-builder.ts`
- useFalGeneration hook: `src/presentation/hooks/use-fal-generation.ts`

### For AI Hug/Kiss

**Multi-Person Video Pattern:**
1. Prepare two reference images
2. Use `buildVideoFromImageInput()` with first person
3. Include second person in `target_image` option
4. Write descriptive prompt (hugging, kissing)
5. Set motion prompt for movement style
6. Configure aspect ratio (9:16 recommended)
7. Set movement amplitude (small for gentle, auto for natural)
8. Submit to model
9. Handle video result

**Best Practices:**
- Use clear, well-lit portraits
- Ensure faces are visible in both images
- Describe action clearly in prompt
- Set appropriate movement amplitude
- Consider 9:16 for social media
- Inform user about processing time

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

### For Image-to-Image

**Transformation Pattern:**
1. Prepare base64 source image
2. Write transformation prompt
3. Configure strength (0-1, default 0.85)
4. Set inference steps (default 50)
5. Adjust guidance scale (default 7.5)
6. Use `buildImageToImageInput()` with configuration
7. Submit to model
8. Handle transformed result

**Best Practices:**
- Be specific in transformation prompt
- Use negative prompts to avoid unwanted features
- Adjust strength for transformation level
- Higher steps = better quality (slower)
- Tune guidance scale for prompt adherence

### For Aspect Ratio Selection

**Platform-Specific Ratios:**
- TikTok/Reels/Shorts: `9:16` (vertical)
- YouTube/Cinema: `16:9` (horizontal)
- Instagram: `1:1` (square)

**Usage:**
Select aspect ratio based on target platform. Consider how video will be viewed and shared.

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

### 3. Configure Movement Correctly

Set appropriate movement:
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

### When Using Video Feature Builders

**DO:**
- Import from package root
- Use correct builder for feature
- Validate image data before building
- Write descriptive prompts
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
- Use `buildVideoFromImageInput()` for video generation
- Provide second image for two-person features
- Write descriptive prompts
- Set appropriate aspect ratio
- Configure movement amplitude
- Validate image formats
- Test with sample images

**DON'T:**
- Skip second image for multi-person videos
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

### When Adding Builders

**For New Video Feature Builders:**
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

**For New Features:**
1. Research FAL model requirements
2. Design builder interface
3. Implement builder function
4. Test with real API
5. Document usage patterns
6. Update related code

## Implementation Notes

**Location:** `src/infrastructure/utils/video-feature-builders.util.ts`

**Dependencies:**
- Uses base builders from `src/infrastructure/utils/base-builders.util.ts`
- Uses helper utilities from `src/infrastructure/utils/helpers.util.ts`
- No external dependencies

**Builder Categories:**
- Video generation (AI hug, AI kiss)
- Single-person video generation
- Image-to-image transformation

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
- Video feature builder: `src/infrastructure/builders/video-feature-builder.ts`
- Base builders: `src/infrastructure/utils/base-builders.util.ts`
- Helper utilities: `src/infrastructure/utils/helpers.util.ts`
- Type guards: `src/infrastructure/utils/type-guards.util.ts`

## Related Documentation

- [Video Feature Builder](../builders/video-feature-builder.README.md)
- [Base Builders](./base-builders.util.README.md)
- [Helper Utilities](./helpers.util.README.md)
- [Type Guards](./type-guards.util.README.md)
