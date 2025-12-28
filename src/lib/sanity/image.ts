/**
 * Sanity Image URL Builder
 *
 * Uses @sanity/image-url for generating optimized image URLs
 * with automatic hotspot/crop support.
 */

import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import { getSanityClient } from './client';

let builder: ReturnType<typeof createImageUrlBuilder> | null = null;

/**
 * Get or create the image URL builder (lazy initialization)
 */
function getBuilder(): ReturnType<typeof createImageUrlBuilder> {
  if (!builder) {
    builder = createImageUrlBuilder(getSanityClient());
  }
  return builder;
}

/**
 * Generate an image URL from a Sanity image reference
 *
 * @param source - Sanity image source (asset reference or image object)
 * @returns Image URL builder for chaining width/height/format options
 */
export function urlFor(source: SanityImageSource) {
  return getBuilder().image(source);
}

/**
 * Generate a responsive image URL with common blog dimensions
 *
 * @param source - Sanity image source
 * @param width - Target width in pixels (default: 800)
 * @returns Optimized image URL string
 */
export function getBlogImageUrl(
  source: SanityImageSource,
  width: number = 800
): string {
  return urlFor(source).width(width).auto('format').fit('max').url();
}

/**
 * Generate a thumbnail URL for post cards
 *
 * @param source - Sanity image source
 * @param width - Target width in pixels (default: 400)
 * @returns Cropped thumbnail URL string
 */
export function getThumbnailUrl(
  source: SanityImageSource,
  width: number = 400
): string {
  return urlFor(source)
    .width(width)
    .height(Math.round(width * 0.625))
    .auto('format')
    .fit('crop')
    .url();
}
