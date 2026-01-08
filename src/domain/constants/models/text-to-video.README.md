# Text-to-Video Generation

Generates high-quality videos from text-based prompts.

**Location:** `src/domain/constants/models/text-to-video.ts`

## Overview

Text-to-video generation creates video content from textual descriptions using AI models. This module provides model configurations for various video generation capabilities with different quality levels, durations, and aspect ratios.

## Purpose

Provides video generation models by:
- Supporting multiple quality tiers
- Offering flexible aspect ratios
- Enabling configurable video durations
- Providing various camera movements
- Supporting batch video generation

## Import

```typescript
import {
  falProvider,
  useFalGeneration
} from '@umituz/react-native-ai-fal-provider';
```

## Available Models

### Hunyuan
- **Model ID:** `fal-ai/hunyuan-video/1`
- **Cost:** 10 credits (Free), 5 credits (Premium)
- **Description:** High-quality video generation (Default)
- **Use Cases:** Standard video generation, balanced quality

### MiniMax
- **Model ID:** `fal-ai/minimax-video`
- **Cost:** 15 credits (Free), 8 credits (Premium)
- **Description:** Advanced video generation with better dynamics
- **Use Cases:** Enhanced motion, improved dynamics

### Kling 1.5
- **Model ID:** `fal-ai/kling-video/v1.5/pro/text-to-video`
- **Cost:** 20 credits (Free), 10 credits (Premium)
- **Description:** Professional video generation
- **Use Cases:** Professional work, highest quality

### Mochi
- **Model ID:** `fal-ai/mochi-v1`
- **Cost:** 8 credits (Free), 4 credits (Premium)
- **Description:** Fast video generation
- **Use Cases:** Quick generation, cost-effective

## Parameters

### Common Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `prompt` | `string` | Description of video to generate | - |
| `aspect_ratio` | `string` | Video aspect ratio | `16:9` |
| `duration` | `number` | Video duration in seconds | 4 |
| `num_videos` | `number` | Number of videos to generate | 1 |

### Aspect Ratios

- `16:9`: Horizontal (landscape)
- `9:16`: Vertical (portrait)
- `1:1`: Square

### Model-Specific Parameters

**Hunyuan:**
- `video_size`: Video resolution
- `num_inference_steps`: Inference step count

**MiniMax:**
- `enhance_prompt`: Prompt enhancement (true/false)

**Kling 1.5:**
- `camera_movement`: Camera movement (pan, tilt, zoom)
- `fps`: Frame rate

**Mochi:**
- `guidance_scale`: Guidance scale (1-10)
- `negative_prompt`: Negative prompts

## Usage Guidelines

### For Video Generation

**Generation Pattern:**
1. Select model based on quality needs
2. Construct descriptive prompt with motion
3. Set appropriate aspect ratio for platform
4. Configure duration
5. Handle generation result

**Best Practices:**
- Describe motion clearly in prompt
- Match aspect ratio to target platform
- Use appropriate duration for content
- Consider cost vs quality
- Plan for longer generation times

### For Platform Optimization

**Platform Pattern:**
1. Identify target platform (YouTube, TikTok, etc.)
2. Select corresponding aspect ratio
3. Optimize duration for platform
4. Style prompt for platform audience
5. Test and iterate

**Platform Guidelines:**
- YouTube: 16:9, 5-10 seconds
- TikTok/Reels: 9:16, 3-6 seconds
- Instagram: 1:1, 3-5 seconds

## Best Practices

### 1. Write Motion-Focused Prompts

Create dynamic descriptions:
- Describe camera movements explicitly
- Include motion and action details
- Specify pace and timing
- Describe transitions
- Focus on movement over static elements

### 2. Choose Right Aspect Ratio

Select appropriate format:
- 16:9 for landscape content
- 9:16 for mobile-first platforms
- 1:1 for social media posts
- Consider platform requirements
- Test different ratios

### 3. Optimize Duration

Balance length and engagement:
- Shorter for social media (3-5s)
- Longer for detailed scenes (5-10s)
- Consider attention spans
- Match content complexity
- Test different durations

### 4. Manage Generation Time

Plan for processing:
- Video generation takes time
- Higher quality = longer wait
- Set appropriate timeouts
- Inform users of progress
- Handle queue positions

### 5. Control Costs

Optimize credit usage:
- Start with lower tier models
- Limit duration during testing
- Use Mochi for cost-effective generation
- Batch similar generations
- Monitor credit consumption

## For AI Agents

### When Using Text-to-Video Models

**DO:**
- Select appropriate model for task
- Write motion-focused prompts
- Set correct aspect ratios
- Configure appropriate durations
- Handle long generation times
- Monitor credit usage
- Plan for queue times
- Test with shorter durations first

**DON'T:**
- Use highest tier for testing
- Write static descriptions
- Ignore platform requirements
- Set excessive durations
- Forget timeout handling
- Waste credits on iterations
- Rush generation process
- Skip quality checks

### When Writing Prompts

**DO:**
- Focus on motion and action
- Describe camera movements
- Include timing and pace
- Specify scene transitions
- Reference cinematography techniques
- Be specific about dynamics
- Include atmospheric details

**DON'T:**
- Write static scene descriptions
- Forget motion details
- Ignore camera movement
- Use vague action descriptions
- Skip timing information
- Overcomplicate prompts
- Include contradictory motions

### When Selecting Models

**DO:**
- Start with Hunyuan for balance
- Use MiniMax for better dynamics
- Choose Kling for professional work
- Use Mochi for cost efficiency
- Consider time constraints
- Test before final generation
- Scale appropriately

**DON'T:**
- Always use most expensive model
- Ignore cost implications
- Skip testing phase
- Use Kling for quick tests
- Forget generation times
- Waste credits on learning
- Select model without planning

## Implementation Notes

**Location:** `src/domain/constants/models/text-to-video.ts`

**Dependencies:**
- FAL provider service
- useFalGeneration hook
- Video format utilities
- Progress tracking utilities

**Model Categories:**
- Standard quality (Hunyuan)
- Enhanced dynamics (MiniMax)
- Professional quality (Kling 1.5)
- Fast generation (Mochi)

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
- Default models: `src/domain/constants/default-models.constants.ts`
