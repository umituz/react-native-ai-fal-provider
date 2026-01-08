# Image Features

Input builder functions for image processing and editing features.

**Location:** `src/infrastructure/builders/image-feature-builder.ts`

## Overview

This module provides builder functions for constructing inputs to FAL AI image processing models. It supports various image features including upscaling, restoration, face swapping, background manipulation, and style transfer.

## Purpose

Simplifies image feature integration by:
- Providing type-safe input builders
- Abstracting complex API parameter structures
- Supporting consistent input formatting
- Validating image data requirements
- Enabling feature-specific options

## Supported Features

| Feature | Model ID | Description |
|---------|----------|-------------|
| `upscale` | `fal-ai/clarity-upscaler` | Increase image quality and size |
| `photo-restore` | `fal-ai/aura-sr` | Restore old or low-quality photos |
| `face-swap` | `fal-ai/face-swap` | Swap faces between two images |
| `anime-selfie` | `fal-ai/flux-pro/kontext` | Transform selfie to anime style |
| `remove-background` | `fal-ai/birefnet` | Remove image background |
| `remove-object` | `fal-ai/fooocus/inpaint` | Remove and inpaint objects |
| `hd-touch-up` | `fal-ai/clarity-upscaler` | HD enhancement and improvement |
| `replace-background` | `fal-ai/bria/background/replace` | Replace image background |

## Import

```typescript
import {
  buildUpscaleInput,
  buildPhotoRestoreInput,
  buildFaceSwapInput,
  buildRemoveBackgroundInput,
  buildRemoveObjectInput,
  buildHDTouchUpInput,
  buildReplaceBackgroundInput,
  buildKontextStyleTransferInput
} from '@umituz/react-native-ai-fal-provider';
```

## Builder Functions

### buildUpscaleInput

Build input for image upscaling.

**Parameters:**
- `image`: Base64 image data or data URI
- `options`: Upscale options (optional)
  - `scaleFactor`: 2 or 4 (default: 2)
  - `enhanceFaces`: Enable face enhancement (default: false)

**Returns:** Formatted input object for upscaling model

**Usage:**
Use to increase image resolution and quality. Supports 2x and 4x scaling. Optional face enhancement for portraits.

**Related:**
- Image feature builders: `src/infrastructure/utils/image-feature-builders.util.ts`

### buildPhotoRestoreInput

Build input for photo restoration.

**Parameters:**
- `image`: Base64 image data or data URI
- `options`: Restoration options (optional)
  - `enhanceFaces`: Enable face enhancement (default: false)

**Returns:** Formatted input object for restoration model

**Usage:**
Use to restore old or damaged photos. Enhances quality and sharpness. Optional face enhancement for portrait restoration.

### buildFaceSwapInput

Build input for face swapping.

**Parameters:**
- `sourceImage`: Target image (base64 or data URI)
- `targetImage`: Source image with face to swap (base64 or data URI)

**Returns:** Formatted input object for face swap model

**Usage:**
Use to swap faces between two images. First image is target, second image provides the face.

### buildRemoveBackgroundInput

Build input for background removal.

**Parameters:**
- `image`: Base64 image data or data URI

**Returns:** Formatted input object for background removal model

**Usage:**
Use to remove image background automatically. Returns PNG format with transparent background.

### buildRemoveObjectInput

Build input for object removal.

**Parameters:**
- `image`: Base64 image data or data URI
- `options`: Removal options (optional)
  - `mask`: Base64 mask of area to remove
  - `prompt`: Description for fill content

**Returns:** Formatted input object for object removal model

**Usage:**
Use to remove objects and fill the area. Provide mask to specify removal area. Prompt describes desired fill content.

### buildHDTouchUpInput

Build input for HD enhancement.

**Parameters:**
- `image`: Base64 image data or data URI
- `options`: Enhancement options (optional)
  - `scaleFactor`: 2 or 4 (default: 2)
  - `enhanceFaces`: Enable face enhancement (default: false)

**Returns:** Formatted input object for HD enhancement model

**Usage:**
Use for high-definition image enhancement. Combines upscaling with quality improvements.

### buildReplaceBackgroundInput

Build input for background replacement.

**Parameters:**
- `image`: Base64 image data or data URI
- `options`: Replacement options
  - `prompt`: Description of new background

**Returns:** Formatted input object for background replacement model

**Usage:**
Use to replace image background with AI-generated scene. Prompt describes desired new background.

### buildKontextStyleTransferInput

Build input for style transfer.

**Parameters:**
- `image`: Base64 image data or data URI
- `options`: Style transfer options
  - `prompt`: Style description
  - `guidance_scale`: Style strength (optional)

**Returns:** Formatted input object for style transfer model

**Usage:**
Use to transform image style (e.g., anime conversion). Prompt describes desired artistic style.

## Usage Guidelines

### For Image Processing

**Processing Pattern:**
1. Select appropriate builder function for feature
2. Prepare base64 image data or data URI
3. Configure options for feature
4. Build input using selected function
5. Pass input to FAL provider subscribe method
6. Handle result appropriately

**Best Practices:**
- Use appropriate image format (JPEG/PNG)
- Ensure minimum resolution (512x512 recommended)
- Use data URI format for consistency
- Validate image data before building
- Handle errors appropriately

**Related:**
- Image feature builders: `src/infrastructure/utils/image-feature-builders.util.ts`
- Helper utilities: `src/infrastructure/utils/helpers.util.ts`

### For Face Operations

**Face Swap Usage:**
1. Prepare source and target images
2. Call `buildFaceSwapInput()` with both images
3. Submit to face swap model
4. Handle swapped result

**Face Enhancement:**
- Use `enhanceFaces` option in upscaling
- Use `enhanceFaces` option in photo restoration
- Best results with clear portrait images
- May not work well with group photos

### For Background Operations

**Background Removal:**
1. Use `buildRemoveBackgroundInput()` with image
2. Submit to background removal model
3. Receive PNG with transparent background
4. Compose over new background if needed

**Background Replacement:**
1. Use `buildReplaceBackgroundInput()` with image and prompt
2. Describe desired background clearly
3. Submit to background replacement model
4. Receive image with new background

**Related:**
- Image feature builders: `src/infrastructure/utils/image-feature-builders.util.ts`

### For Object Removal

**Removal Pattern:**
1. Create mask for area to remove (white = remove, black = keep)
2. Prepare base64 image data
3. Use `buildRemoveObjectInput()` with image and mask
4. Optionally provide prompt for fill content
5. Submit to object removal model
6. Receive result with object removed and filled

**Mask Creation:**
- Binary mask where white (255) indicates removal area
- Black (0) indicates area to preserve
- Can be created programmatically or manually
- Size must match input image

### For Style Transfer

**Style Transfer Pattern:**
1. Prepare base64 source image
2. Write clear style description prompt
3. Use `buildKontextStyleTransferInput()` with image and prompt
4. Optionally set guidance scale for style strength
5. Submit to style transfer model
6. Receive stylized result

**Prompt Writing:**
- Be specific about desired style
- Include artistic details and colors
- Mention mood or atmosphere
- Reference art styles if applicable

## Best Practices

### 1. Prepare Images Properly

Ensure image quality:
- Use minimum 512x512 resolution when possible
- Provide clear, well-lit source images
- Use appropriate image format (JPEG/PNG)
- Convert to data URI format
- Validate base64 encoding

**Related:**
- Helper utilities: `src/infrastructure/utils/helpers.util.ts`
- Type guards: `src/infrastructure/utils/type-guards.util.ts`

### 2. Use Appropriate Options

Configure features correctly:
- Select correct scale factor for upscaling
- Enable face enhancement for portraits
- Provide clear prompts for AI generation
- Create accurate masks for object removal
- Set appropriate guidance scales

### 3. Handle Results Appropriately

Process feature results:
- Handle PNG format for transparent backgrounds
- Compose images for background replacement
- Display swapped images correctly
- Show before/after comparisons
- Save processed images appropriately

### 4. Validate Before Processing

Check input data:
- Validate base64 image format
- Check image resolution requirements
- Verify image data is not corrupted
- Ensure correct image format
- Test with sample images

**Related:**
- Type guards: `src/infrastructure/utils/type-guards.util.ts`

### 5. Consider Processing Time

Manage user expectations:
- Inform users about processing time
- Show progress indicators
- Handle timeouts appropriately
- Queue multiple operations
- Provide cancellation options

## For AI Agents

### When Using Image Builders

**DO:**
- Import from package root
- Use appropriate builder for each feature
- Validate image data before building
- Use data URI format consistently
- Handle feature-specific options
- Check model requirements
- Format images properly

**DON'T:**
- Use wrong builder for feature
- Skip image validation
- Ignore format requirements
- Forget optional parameters
- Assume all features same options
- Process invalid images
- Mix up source and target images

### When Building Inputs

**DO:**
- Use correct builder function
- Provide required parameters
- Configure options appropriately
- Validate image format
- Check resolution requirements
- Handle base64 encoding
- Test with sample images

**DON'T:**
- Use generic builders
- Skip required parameters
- Ignore model requirements
- Forget data URI format
- Process corrupted images
- Assume default options
- Mix up parameter order

### When Handling Results

**DO:**
- Handle PNG format for transparency
- Display results appropriately
- Save processed images
- Show before/after when applicable
- Handle errors gracefully
- Validate result format
- Inform user of processing time

**DON'T:**
- Assume JPEG format always
- Display invalid results
- Forget to handle transparency
- Ignore feature-specific formats
- Skip error handling
- Lose original images
- Mislead user about capabilities

### When Adding Features

**For New Image Features:**
1. Add builder function to module
2. Define options interface
3. Document feature and model
4. Update exports
5. Add tests
6. Update this README

**For Enhanced Options:**
1. Review existing option interfaces
2. Add new options appropriately
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

**Location:** `src/infrastructure/builders/image-feature-builder.ts`

**Dependencies:**
- Uses helper utilities from `src/infrastructure/utils/helpers.util.ts`
- Integrates with FAL provider
- No external dependencies

**Builder Categories:**
- Image enhancement (upscale, photo restore, HD touch-up)
- Face manipulation (face swap)
- Background operations (remove, replace)
- Object manipulation (remove object)
- Style transfer (anime selfie)

**Import:**
```typescript
import {
  buildUpscaleInput,
  buildPhotoRestoreInput,
  buildFaceSwapInput,
  buildRemoveBackgroundInput,
  buildRemoveObjectInput,
  buildHDTouchUpInput,
  buildReplaceBackgroundInput,
  buildKontextStyleTransferInput
} from '@umituz/react-native-ai-fal-provider';
```

**Related:**
- Image feature builders: `src/infrastructure/utils/image-feature-builders.util.ts`
- Helper utilities: `src/infrastructure/utils/helpers.util.ts`
- Type guards: `src/infrastructure/utils/type-guards.util.ts`
- FAL provider: `src/infrastructure/services/fal-provider.ts`

## Related Documentation

- [Image Feature Builders](../utils/image-feature-builders.util.README.md)
- [Helper Utilities](../utils/helpers.util.README.md)
- [Type Guards](../utils/type-guards.util.README.md)
- [FAL Provider](../services/fal-provider.README.md)
