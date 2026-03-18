---
name: setup-react-native-ai-fal-provider
description: Sets up FAL AI provider for React Native apps with automated installation and configuration. Triggers on: Setup FAL AI, install FAL provider, AI generation, FAL AI, text-to-image, image-to-image, image-to-video, face swap, background removal, AI upscaling, useFalGeneration.
---

# Setup React Native AI - FAL Provider

Comprehensive automated setup for `@umituz/react-native-ai-fal-provider` - FAL.ai integration for React Native.

## Overview

This skill handles everything needed to integrate FAL.ai AI generation into your React Native or Expo app:
- Package installation and updates
- API key configuration
- Provider setup
- AI generation hooks (text-to-image, image-to-video, face swap, etc.)
- Error handling and retries
- Cost tracking integration

## Quick Start

Just say: **"Setup FAL AI in my app"** and this skill will handle everything.

**Supported AI Features:**
- Text-to-image generation
- Image-to-image transformation
- Image-to-video generation
- Face swap
- Background removal
- Image upscaling
- And more FAL.ai models

## When to Use

Invoke this skill when you need to:
- Install @umituz/react-native-ai-fal-provider in a new project
- Set up FAL.ai API integration
- Configure AI generation features
- Add image/video generation capabilities
- Implement face swap or background removal
- Track AI generation costs

## Step 1: Analyze the Project

### Check package.json

```bash
# Check if package is installed
cat package.json | grep "@umituz/react-native-ai-fal-provider"

# Check current version
npm list @umituz/react-native-ai-fal-provider
```

### Detect Project Type

```bash
# Check for Expo
cat app.json | grep -q "expo" && echo "Expo project" || echo "Bare React Native"
```

## Step 2: Install Package

### Install or Update

```bash
# Install latest
npm install @umituz/react-native-ai-fal-provider@latest

# Update if outdated
npm install @umituz/react-native-ai-fal-provider@latest
```

### Install Dependencies

```bash
# Required core dependencies
npm install @umituz/react-native-ai-generation-content

# Design system
npm install @umituz/react-native-design-system
```

## Step 3: Configure FAL.ai API Key

### Get FAL.ai API Key

1. Go to https://fal.ai/
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key

### Add to Environment Variables

Create or update `.env`:

```bash
cat > .env.example << 'EOF'
# FAL.ai Configuration
EXPO_PUBLIC_FAL_API_KEY=your_fal_api_key_here
EOF

touch .env
```

Add your actual API key to `.env`:

```bash
EXPO_PUBLIC_FAL_API_KEY=fal_xxxxxxxxxxxxxxxx
```

### Verify API Key

```bash
grep EXPO_PUBLIC_FAL_API_KEY .env
```

## Step 4: Initialize FAL Provider

### Set Up Provider

In your app entry point (`app/_layout.tsx` or `App.tsx`):

```typescript
import { FalProvider } from '@umituz/react-native-ai-fal-provider';
import { ConfigProvider } from '@umituz/react-native-ai-generation-content';

export default function RootLayout() {
  const falConfig = {
    apiKey: process.env.EXPO_PUBLIC_FAL_API_KEY!,
  };

  return (
    <FalProvider config={falConfig}>
      <ConfigProvider>
        <Stack>{/* your screens */}</Stack>
      </ConfigProvider>
    </FalProvider>
  );
}
```

### Check If Already Configured

```bash
grep -r "FalProvider" app/ App.tsx 2>/dev/null
```

If found, skip this step.

## Step 5: Use AI Generation Hooks

### Text-to-Image Generation

```typescript
import { useFalGeneration } from '@umituz/react-native-ai-fal-provider';
import { useState } from 'react';

export function TextToImageScreen() {
  const [prompt, setPrompt] = useState('');

  const { generate, result, isLoading, error } = useFalGeneration({
    modelId: 'fal-ai/flux-pro-v1.1-ultra',
  });

  const handleGenerate = async () => {
    try {
      const imageUrl = await generate({
        prompt: prompt,
        imageSize: 'square_1024x1024',
        numInferenceSteps: 28,
      });

      console.log('Generated image:', imageUrl);
    } catch (err) {
      console.error('Generation failed:', err);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Enter your prompt..."
        value={prompt}
        onChangeText={setPrompt}
      />

      {isLoading && <ActivityIndicator />}

      {result && (
        <Image
          source={{ uri: result.images[0].url }}
          style={{ width: 300, height: 300 }}
        />
      )}

      <Button
        title="Generate"
        onPress={handleGenerate}
        disabled={isLoading || !prompt}
      />
    </View>
  );
}
```

### Image-to-Video Generation

```typescript
import { useFalGeneration } from '@umituz/react-native-ai-fal-provider';

export function ImageToVideoScreen() {
  const { generate, result, isLoading } = useFalGeneration({
    modelId: 'fal-ai/fast-svd',
  });

  const handleGenerate = async (imageUrl: string) => {
    const videoUrl = await generate({
      imagePath: imageUrl,
      motionBucketId: 127,
      condAug: 0.02,
    });

    return videoUrl;
  };

  return (
    <View>
      {/* Your UI */}
    </View>
  );
}
```

### Face Swap

```typescript
import { useFalGeneration } from '@umituz/react-native-ai-fal-provider';

export function FaceSwapScreen() {
  const { generate, result, isLoading } = useFalGeneration({
    modelId: 'fal-ai/faceswap',
  });

  const handleFaceSwap = async (sourceImage: string, targetImage: string) => {
    const result = await generate({
      sourceImagePath: sourceImage,
      targetImagePath: targetImage,
    });

    return result;
  };

  return (
    <View>
      {/* Your UI */}
    </View>
  );
}
```

### Background Removal

```typescript
import { useFalGeneration } from '@umituz/react-native-ai-fal-provider';

export function BackgroundRemovalScreen() {
  const { generate, result, isLoading } = useFalGeneration({
    modelId: 'fal-ai/imageutils/rembg',
  });

  const handleRemoveBackground = async (imageUrl: string) => {
    const result = await generate({
      imagePath: imageUrl,
    });

    return result;
  };

  return (
    <View>
      {/* Your UI */}
    </View>
  );
}
```

## Step 6: Configure Cost Tracking (Optional)

### Enable Credit Tracking

```typescript
import { useFalGeneration } from '@umituz/react-native-ai-fal-provider';

export function GenerativeScreen() {
  const { generate, getCredits, resetCredits } = useFalGeneration({
    modelId: 'fal-ai/flux-pro-v1.1-ultra',
    enableCostTracking: true,
  });

  const checkCredits = async () => {
    const credits = await getCredits();
    console.log('Credits used:', credits.used);
    console.log('Estimated cost:', credits.estimatedCostUSD);
  };

  return (
    <View>
      <Button title="Check Credits" onPress={checkCredits} />
    </View>
  );
}
```

## Step 7: Error Handling

### Handle Common Errors

```typescript
import { FalErrorType, useFalGeneration } from '@umituz/react-native-ai-fal-provider';

export function GenerativeScreen() {
  const { generate, error, isLoading } = useFalGeneration({
    modelId: 'fal-ai/flux-pro-v1.1-ultra',
  });

  const handleGenerate = async () => {
    try {
      const result = await generate({ prompt: 'A beautiful sunset' });
      return result;
    } catch (err) {
      if (error?.type === FalErrorType.QUOTA_EXCEEDED) {
        Alert.alert('Quota Exceeded', 'You have exceeded your API quota.');
      } else if (error?.type === FalErrorType.INVALID_API_KEY) {
        Alert.alert('Invalid API Key', 'Please check your FAL.ai API key.');
      } else if (error?.type === FalErrorType.NETWORK_ERROR) {
        Alert.alert('Network Error', 'Please check your internet connection.');
      } else {
        Alert.alert('Error', error?.message || 'Generation failed.');
      }
    }
  };

  return <View>{/* Your UI */}</View>;
}
```

## Step 8: Verify Setup

### Run the App

```bash
# For Expo
npx expo start

# For bare React Native
npx react-native run-ios
# or
npx react-native run-android
```

### Verification Checklist

- ✅ Package installed correctly
- ✅ API key configured in .env
- ✅ FalProvider wraps the app
- ✅ Text-to-image generation works
- ✅ Images display correctly
- ✅ Error handling works
- ✅ Cost tracking active (if enabled)

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Missing API key | Add EXPO_PUBLIC_FAL_API_KEY to .env |
| Invalid API key format | FAL keys start with `fal_` |
| Not wrapping with FalProvider | FalProvider must wrap app |
| Missing peer dependencies | Install @umituz/react-native-ai-generation-content and design system |
| Large image timeouts | Increase timeout in model config |
| Memory issues with generations | Limit concurrent generations |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **"Invalid API key"** | Check API key format and verify in FAL.ai dashboard |
| **"Quota exceeded"** | Check your FAL.ai credits and usage |
| **"Generation timeout"** | Increase timeout or reduce image size |
| **"Provider not found"** | Ensure FalProvider wraps the app |
| **"Network error"** | Check internet connection and API status |
| **"Out of memory"** | Limit concurrent requests or reduce image resolution |

## Supported Models

### Text-to-Image
- `fal-ai/flux-pro-v1.1-ultra` - High quality image generation
- `fal-ai/flux-pro-v1.1` - Standard quality
- `fal-ai/flux-schnell` - Fast generation

### Image-to-Video
- `fal-ai/fast-svd` - Image to video
- `fal-ai/animate-diff-lightning` - Animated video

### Image Processing
- `fal-ai/faceswap` - Face swapping
- `fal-ai/imageutils/rembg` - Background removal
- `fal-ai/imageutils/inpaint` - Image inpainting
- `fal-ai/imageutils/gfpgan` - Image enhancement

### Upscaling
- `fal-ai/esrgan` - Image upscaling
- `fal-ai/fast-real-esrgan` - Fast upscaling

## Pricing and Credits

FAL.ai uses a credit-based system:

| Model | Credits per Request |
|-------|-------------------|
| Flux Pro Ultra | ~15 credits |
| Flux Pro | ~7 credits |
| Flux Schnell | ~1 credit |
| Fast SVD | ~10 credits |
| Face Swap | ~1 credit |

Check https://fal.ai/pricing for current rates.

## Summary

After setup, provide:

1. ✅ Package version installed
2. ✅ API key configured
3. ✅ Provider location
4. ✅ Generation features implemented
5. ✅ Error handling configured
6. ✅ Verification status

---

**Compatible with:** @umituz/react-native-ai-fal-provider@latest
**Platforms:** React Native (Expo & Bare)
**API:** FAL.ai (https://fal.ai/)
**Cost:** Pay-per-use credit system
