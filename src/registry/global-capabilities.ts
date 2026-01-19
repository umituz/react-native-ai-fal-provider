/**
 * Global Capabilities
 * Shared capabilities across all AI models
 */

import type {
  AspectRatioOption,
  GlobalCapabilities,
  GlobalDefaults,
} from "./model-registry.types";

// =============================================================================
// VIDEO ASPECT RATIOS (No square - most video models don't support it)
// =============================================================================

export const VIDEO_ASPECT_RATIOS: AspectRatioOption[] = [
  {
    id: "16:9",
    name: "Landscape",
    description: "Best for YouTube, TV",
    icon: "desktop-outline",
  },
  {
    id: "9:16",
    name: "Portrait",
    description: "Best for TikTok, Reels",
    icon: "phone-portrait-outline",
  },
];

// =============================================================================
// IMAGE ASPECT RATIOS (Includes square)
// =============================================================================

export const IMAGE_ASPECT_RATIOS: AspectRatioOption[] = [
  {
    id: "16:9",
    name: "Landscape",
    description: "Wide format",
    icon: "desktop-outline",
  },
  {
    id: "9:16",
    name: "Portrait",
    description: "Tall format",
    icon: "phone-portrait-outline",
  },
  {
    id: "1:1",
    name: "Square",
    description: "Instagram, profile",
    icon: "square-outline",
  },
];

// =============================================================================
// GLOBAL CAPABILITIES
// =============================================================================

export const GLOBAL_CAPABILITIES: GlobalCapabilities = {
  aspectRatios: {
    video: VIDEO_ASPECT_RATIOS,
    image: IMAGE_ASPECT_RATIOS,
  },
};

// =============================================================================
// GLOBAL DEFAULTS
// =============================================================================

export const GLOBAL_DEFAULTS: GlobalDefaults = {
  maxPromptLength: 500,
  supportsSound: false,
  supportsStyle: true,
};
