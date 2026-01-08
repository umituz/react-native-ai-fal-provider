# Text-to-Voice Generation

Converts text to spoken audio (Text-to-Speech).

**Location:** `src/domain/constants/models/text-to-voice.ts`

## Overview

Text-to-voice generation synthesizes natural speech from text using AI models. This module provides model configurations for various TTS capabilities with different voice options, speeds, and quality levels.

## Purpose

Provides TTS models by:
- Supporting multiple voice options
- Enabling speed and pitch control
- Offering various quality tiers
- Providing natural speech synthesis
- Supporting multiple languages

## Import

```typescript
import {
  falProvider,
  useFalGeneration
} from '@umituz/react-native-ai-fal-provider';
```

## Available Models

### PlayAI TTS v3
- **Model ID:** `fal-ai/playai/tts/v3`
- **Cost:** 1 credit (Free), 0.5 credits (Premium)
- **Description:** High-quality text-to-speech (Default)
- **Use Cases:** Standard TTS, cost-effective synthesis

### ElevenLabs TTS
- **Model ID:** `fal-ai/eleven-labs/tts`
- **Cost:** 2 credits (Free), 1 credit (Premium)
- **Description:** Premium speech synthesis with multiple voice options
- **Use Cases:** Professional TTS, custom voices, enhanced quality

## Parameters

### Common Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `text` | `string` | Text to speak | - |
| `voice_id` | `string` | Voice identifier | `default` |

### PlayAI TTS v3 Parameters

**Configuration:**
- `text`: Input text
- `voice_id`: Voice selection
- `speed`: Playback speed (0.5 - 2.0)
- `pitch`: Pitch adjustment (0.5 - 2.0)

### ElevenLabs TTS Parameters

**Configuration:**
- `text`: Input text
- `voice_id`: ElevenLabs voice ID
- `voice_settings`:
  - `stability`: 0.0 - 1.0
  - `similarity_boost`: 0.0 - 1.0
  - `style`: 0.0 - 1.0
  - `use_speaker_boost`: boolean

## Voice Options

### PlayAI TTS Voices

- `default`: Default voice
- `male-1`: Male voice 1
- `female-1`: Female voice 1
- `male-2`: Male voice 2
- `female-2`: Female voice 2

### ElevenLabs Voices

Custom voices from ElevenLabs dashboard:
1. Access [ElevenLabs Dashboard](https://elevenlabs.io/app)
2. Select voice from Voice Settings
3. Copy Voice ID

## Usage Guidelines

### For Speech Generation

**Generation Pattern:**
1. Prepare input text
2. Select appropriate voice
3. Configure speed and pitch (PlayAI)
4. Set voice settings (ElevenLabs)
5. Generate audio
6. Handle playback

**Best Practices:**
- Keep text segments manageable (500 chars max recommended)
- Use appropriate voice for content
- Test speed/pitch settings
- Cache frequently used audio
- Handle playback appropriately

### For Voice Selection

**Selection Pattern:**
1. Identify use case (narration, dialogue, etc.)
2. Test available voices
3. Configure voice settings
4. Validate audio quality
5. Implement in application

**Voice Guidelines:**
- Use default for general use
- Select gender-appropriate voices for content
- Test custom voices thoroughly
- Consider voice consistency
- Match voice to content tone

## Best Practices

### 1. Manage Text Length

Optimize text segments:
- Split long texts into chunks
- Keep segments under 500 characters
- Break at natural pauses
- Use sentence boundaries
- Maintain context across chunks

### 2. Configure Audio Parameters

Adjust sound characteristics:
- Test speed settings for natural delivery
- Adjust pitch for voice character
- Balance stability vs expression
- Use speaker boost for clarity
- Iterate on settings

### 3. Handle Playback

Manage audio playback:
- Use appropriate audio libraries (expo-av)
- Handle loading states
- Implement playback controls
- Manage audio lifecycle
- Handle errors gracefully

### 4. Optimize Performance

Improve efficiency:
- Cache frequently generated audio
- Use appropriate model for use case
- Batch similar generations
- Minimize redundant requests
- Monitor credit usage

### 5. Handle Errors

Manage failure scenarios:
- Validate text before generation
- Check quota limits
- Handle network errors
- Provide fallback options
- Inform users of issues

## For AI Agents

### When Using TTS Models

**DO:**
- Validate text before generation
- Split long texts into chunks
- Select appropriate voice for content
- Test audio parameters
- Cache generated audio
- Handle playback properly
- Monitor credit usage
- Use appropriate model tier

**DON'T:**
- Exceed recommended text length
- Skip voice testing
- Forget parameter validation
- Ignore playback handling
- Generate redundant audio
- Waste credits on repeats
- Skip error handling
- Use wrong model for use case

### When Configuring Audio

**DO:**
- Test speed settings
- Adjust pitch appropriately
- Balance voice settings
- Use speaker boost for clarity
- Iterate on parameters
- Consider content type
- Test audio quality

**DON'T:**
- Use extreme speed values
- Skip parameter testing
- Ignore voice settings
- Forget audio quality
- Set arbitrary values
- Skip quality checks
- Use one-size-fits-all settings

### When Managing Playback

**DO:**
- Use proper audio libraries
- Handle loading states
- Implement playback controls
- Manage audio lifecycle
- Handle errors gracefully
- Test on target platforms
- Consider background audio

**DON'T:**
- Skip loading states
- Forget playback controls
- Ignore audio cleanup
- Handle errors poorly
- Skip platform testing
- Create audio conflicts
- Leave resources allocated

## Implementation Notes

**Location:** `src/domain/constants/models/text-to-voice.ts`

**Dependencies:**
- FAL provider service
- useFalGeneration hook
- Audio playback libraries (expo-av)
- Text processing utilities

**Supported Languages:**
- Turkish
- English (US, UK)
- German
- French
- Spanish
- Italian
- And more...

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
