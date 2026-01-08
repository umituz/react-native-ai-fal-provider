# FAL Provider Constants

Default configuration values and capability definitions for FAL Provider.

**Location:** `src/infrastructure/services/fal-provider.constants.ts`

## Overview

This module defines the FAL AI provider's default configuration, capabilities, and supported features.

## Purpose

Provides provider configuration by:
- Defining default timeouts
- Specifying retry behavior
- Setting polling intervals
- Declaring supported features
- Documenting capabilities

## Import

```typescript
import {
  DEFAULT_FAL_CONFIG,
  FAL_CAPABILITIES
} from '@umituz/react-native-ai-fal-provider';
```

## Constants

### DEFAULT_FAL_CONFIG

Provider default configuration settings.

**Properties:**
- `maxRetries`: Maximum retry attempts (default: 3)
- `baseDelay`: Base retry delay in milliseconds (default: 1000)
- `maxDelay`: Maximum retry delay in milliseconds (default: 10000)
- `defaultTimeoutMs`: Default operation timeout in milliseconds (default: 300000)
- `pollInterval`: Status polling interval in milliseconds (default: 1000)

**Usage:**
Use for configuring provider behavior. Override defaults as needed. Adjust based on use case.

### FAL_CAPABILITIES

Provider supported features and capabilities.

**Properties:**
- `imageFeatures`: Array of supported image processing features
- `videoFeatures`: Array of supported video processing features
- `textToImage`: Text-to-image generation support (boolean)
- `textToVideo`: Text-to-video generation support (boolean)
- `imageToVideo`: Image-to-video conversion support (boolean)
- `textToVoice`: Text-to-speech support (boolean)
- `textToText`: Text generation support (boolean)

**Usage:**
Check feature availability before use. Display options based on capabilities. Validate feature requests.

## Configuration Details

### Retry Settings

**Retry Behavior:**
- Maximum 3 retry attempts for failed requests
- Exponential backoff starting at 1 second
- Maximum delay of 10 seconds between retries
- Applies to retryable errors only

**Retry Formula:**
```
delay = min(baseDelay * 2^retryAttempt, maxDelay)
```

### Timeout Settings

**Timeout by Model Type:**

| Model Type | Recommended Timeout |
|------------|-------------------|
| text-to-image | 60,000 - 120,000 ms |
| text-to-video | 180,000 - 300,000 ms |
| image-to-video | 180,000 - 300,000 ms |
| text-to-voice | 30,000 - 60,000 ms |

**Default:** 300,000ms (5 minutes)

### Poll Settings

**Polling Behavior:**
- Checks job status every 1 second
- Shorter interval = faster updates, more API calls
- Longer interval = fewer API calls, slower updates
- Balances responsiveness and efficiency

## Supported Features

### Image Features

**Supported Features:**
- `upscale`: Image upscaling (2x/4x)
- `photo-restore`: Photo restoration
- `face-swap`: Face swapping
- `anime-selfie`: Anime style transfer
- `remove-background`: Background removal
- `remove-object`: Object removal
- `hd-touch-up`: HD enhancement
- `replace-background`: Background replacement

**Models:** See `src/domain/constants/feature-models.constants.ts`

### Video Features

**Supported Features:**
- `ai-hug`: AI hug video generation (2 persons)
- `ai-kiss`: AI kiss video generation (2 persons)

**Models:** See `src/domain/constants/feature-models.constants.ts`

### Generation Types

**Supported:**
- ✅ Text-to-image: Generate images from text
- ✅ Text-to-video: Generate videos from text
- ✅ Image-to-video: Convert images to videos
- ✅ Text-to-voice: Generate speech from text
- ❌ Text-to-text: LLM generation (not supported)

## Usage Guidelines

### For Configuration

**Configuration Pattern:**
1. Import DEFAULT_FAL_CONFIG
2. Override specific values as needed
3. Pass to provider initialization
4. Adjust based on use case
5. Test configuration changes

**Best Practices:**
- Use defaults initially
- Adjust timeout for model type
- Configure retry behavior carefully
- Balance polling frequency
- Monitor performance impact

### For Capability Checks

**Capability Pattern:**
1. Import FAL_CAPABILITIES
2. Check feature availability
3. Enable/disable UI accordingly
4. Validate feature requests
5. Handle unsupported features

**Best Practices:**
- Check before using features
- Hide unavailable features
- Provide clear feedback
- Document limitations
- Update capabilities regularly

## Best Practices

### 1. Set Appropriate Timeouts

Configure timeouts based on model:
- Use shorter timeouts for fast models
- Use longer timeouts for video
- Add buffer for queue times
- Consider user experience
- Monitor actual completion times

### 2. Configure Retry Behavior

Adjust retry settings:
- Increase retries for critical operations
- Decrease retries for fast operations
- Balance reliability vs speed
- Consider costs of retries
- Monitor retry success rates

### 3. Optimize Polling

Balance polling frequency:
- More frequent = better UX, more API calls
- Less frequent = fewer API calls, worse UX
- Consider user expectations
- Monitor API usage
- Adjust based on feedback

### 4. Check Capabilities

Validate feature support:
- Check before using features
- Hide unavailable options
- Provide clear feedback
- Document limitations
- Handle unsupported features gracefully

### 5. Monitor Performance

Track configuration impact:
- Measure actual completion times
- Monitor retry rates
- Track API usage
- Collect user feedback
- Adjust configuration as needed

## For AI Agents

### When Using Constants

**DO:**
- Import from package root
- Use DEFAULT_FAL_CONFIG for setup
- Adjust timeouts appropriately
- Check FAL_CAPABILITIES before use
- Override defaults carefully
- Test configuration changes
- Monitor impact

**DON'T:**
- Hardcode configuration values
- Ignore capability checks
- Use inappropriate timeouts
- Skip feature validation
- Override all defaults
- Make arbitrary changes
- Forget testing

### When Checking Capabilities

**DO:**
- Check feature availability
- Validate before using
- Hide unavailable features
- Provide clear feedback
- Document limitations
- Update regularly
- Handle gracefully

**DON'T:**
- Assume all features work
- Show unavailable options
- Skip validation
- Confuse users
- Ignore limitations
- Use outdated info
- Crash on unsupported features

### When Configuring Provider

**DO:**
- Start with defaults
- Adjust for model type
- Consider use case
- Test changes
- Monitor performance
- Document decisions
- Get user feedback

**DON'T:**
- Use arbitrary values
- Copy without understanding
- Skip testing
- Ignore performance
- Make excessive changes
- Forget documentation
- Disregard user experience

## Implementation Notes

**Location:** `src/infrastructure/services/fal-provider.constants.ts`

**Dependencies:**
- No external dependencies
- Pure constant definitions
- Used by provider initialization

**Configuration Categories:**
- Retry behavior settings
- Timeout settings
- Polling settings
- Feature capabilities
- Generation type support

**Import:**
```typescript
import {
  DEFAULT_FAL_CONFIG,
  FAL_CAPABILITIES
} from '@umituz/react-native-ai-fal-provider';
```

**Related:**
- FAL provider: `src/infrastructure/services/fal-provider.ts`
- Feature models: `src/domain/constants/feature-models.constants.ts`
