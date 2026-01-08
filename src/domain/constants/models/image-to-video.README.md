# Image-to-Video Generation

Transforms static images into moving videos.

**Location:** `src/domain/constants/models/image-to-video.ts`

## Overview

Image-to-video generation animates static images to create video content using AI models. This module provides model configurations for converting images into videos with various camera movements and durations.

## Purpose

Provides image-to-video models by:
- Animating static images
- Supporting camera movements
- Enabling configurable durations
- Providing various aspect ratios
- Maintaining image quality in video

## Import

```typescript
import {
  falProvider,
  useFalGeneration
} from '@umituz/react-native-ai-fal-provider';
```

## Available Models

### Kling I2V
- **Model ID:** `fal-ai/kling-video/v1.5/pro/image-to-video`
- **Cost:** 15 credits (Free), 8 credits (Premium)
- **Description:** High-quality image-to-video generation (Default)
- **Use Cases:** Professional image animation, high-quality output

## Parameters

### Common Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `image_url` | `string` | Source image (base64 or URL) | - |
| `prompt` | `string` | Description of desired motion/action | - |
| `aspect_ratio` | `string` | Video aspect ratio | `16:9` |
| `duration` | `number` | Video duration in seconds | 5 |
| `fps` | `number` | Frame rate | 24 |

### Aspect Ratios

- `16:9`: Horizontal (landscape)
- `9:16`: Vertical (portrait)
- `1:1`: Square

### Camera Movements

**Movement Types:**
- `pan`: Horizontal panning
- `tilt`: Vertical tilting
- `zoom`: Zoom in/out
- `dolly`: Forward/backward movement
- `static`: Fixed camera

## Usage Guidelines

### For Image Animation

**Animation Pattern:**
1. Select high-quality source image
2. Describe desired motion in prompt
3. Set appropriate aspect ratio
4. Configure duration and frame rate
5. Specify camera movement type
6. Handle generation result

**Best Practices:**
- Use high-resolution source images (min 512x512)
- Focus on specific, achievable motions
- Describe subtle movements
- Match camera movement to subject
- Keep prompts concise

### For Image Selection

**Selection Pattern:**
1. Evaluate image quality
2. Check resolution and clarity
3. Identify focal point
4. Assess lighting conditions
5. Verify suitability for animation

**Image Guidelines:**
- Minimum 512x512 resolution
- Well-lit and clear focus
- Distinct subject or focal point
- Good contrast
- Appropriate composition

## Best Practices

### 1. Select Quality Source Images

Choose appropriate images:
- Use high-resolution images
- Ensure good lighting
- Check focus clarity
- Verify distinct subjects
- Assess composition quality

### 2. Write Concise Motion Prompts

Describe movement effectively:
- Focus on one or two actions
- Use movement-oriented language
- Describe subtle changes
- Include atmospheric details
- Keep prompts brief

**Prompt Guidelines:**
- Be specific: "Person slowly smiling" not "Person happy"
- Add atmosphere: "Wind blowing", "Light changing"
- Focus on achievable motions
- Describe natural movements

### 3. Choose Appropriate Camera Movements

Select movement types carefully:
- Static: Portraits, subtle expressions
- Pan: Landscapes, wide scenes
- Zoom: Focusing on subjects
- Tilt: Vertical scans
- Dolly: Forward/backward motion

### 4. Optimize Parameters

Balance quality and performance:
- Shorter durations (3-5s) for quick results
- Standard fps (24) for most use cases
- Higher fps (30) for smooth motion
- Match aspect ratio to platform
- Adjust duration to content

### 5. Handle Edge Cases

Manage challenging scenarios:
- NSFW content detection
- Invalid image formats
- Unsupported resolutions
- Generation failures
- Timeout handling

## For AI Agents

### When Using Image-to-Video Models

**DO:**
- Validate source image quality
- Check image resolution
- Write concise motion prompts
- Select appropriate camera movements
- Handle NSFW content errors
- Validate image format
- Check aspect ratio compatibility
- Test with shorter durations

**DON'T:**
- Use low-resolution images
- Write complex multi-action prompts
- Ignore camera movement selection
- Skip image validation
- Forget error handling
- Use excessive durations
- Ignore aspect ratios
- Assume all images work

### When Writing Prompts

**DO:**
- Keep prompts concise (1-2 actions)
- Focus on specific movements
- Use descriptive motion language
- Include subtle atmospheric details
- Describe natural movements
- Be explicit about pace
- Reference subject features

**DON'T:**
- Write long complex prompts
- Describe multiple simultaneous actions
- Use vague motion descriptions
- Skip movement details
- Include contradictory elements
- Overcomplicate descriptions
- Forget subject specifics

### When Selecting Images

**DO:**
- Check minimum resolution (512x512)
- Verify image quality
- Ensure good lighting
- Identify clear focal point
- Assess composition
- Validate image format
- Test image suitability

**DON'T:**
- Use low-quality images
- Skip resolution checks
- Ignore lighting conditions
- Use blurry images
- Forget focal point
- Use unsupported formats
- Assume any image works

### When Configuring Parameters

**DO:**
- Start with shorter durations (3-5s)
- Use standard fps (24) initially
- Match aspect ratio to platform
- Test camera movement types
- Adjust based on content
- Consider file size
- Optimize for use case

**DON'T:**
- Use maximum duration initially
- Skip camera movement selection
- Ignore aspect ratio requirements
- Set excessive frame rates
- Forget platform constraints
- Use one-size-fits-all approach
- Waste credits on long tests

## Implementation Notes

**Location:** `src/domain/constants/models/image-to-video.ts`

**Dependencies:**
- FAL provider service
- useFalGeneration hook
- Image format utilities
- NSFW validators
- Progress tracking utilities

**Supported Operations:**
- Single image animation
- Camera movement control
- Duration and fps configuration
- Aspect ratio selection
- Format validation

**Import:**
```typescript
import {
  falProvider,
  useFalGeneration
} from '@umituz/react-native-ai-fal-provider';
```

**Related:**
- FAL provider: `src/infrastructure/services/fal-provider.ts`
- Generation hook: `src/presentation/hooks/use-fal-generation.ts`
- Image utilities: `src/infrastructure/utils/helpers.util.ts`
- NSFW validator: `src/infrastructure/validators/nsfw-validator.ts`
