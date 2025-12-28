/**
 * Sanity CMS Types
 *
 * These types match the schema defined in the Sanity Studio:
 * /scratch/Programming/workspace-nextjs/sanity-studio/studio-helix-blog/schemaTypes/
 */

import type { PortableTextBlock } from '@portabletext/types';

/**
 * Sanity image asset reference
 */
export interface SanityImageAsset {
  _ref: string;
  _type: 'reference';
}

/**
 * Sanity image hotspot for focal point
 */
export interface SanityImageHotspot {
  x: number;
  y: number;
  height: number;
  width: number;
}

/**
 * Sanity image crop data
 */
export interface SanityImageCrop {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/**
 * Base Sanity image type with hotspot support
 */
export interface SanityImage {
  _type: 'image';
  asset: SanityImageAsset;
  alt?: string;
  hotspot?: SanityImageHotspot;
  crop?: SanityImageCrop;
}

/**
 * Image block for body content (extends SanityImage with caption)
 */
export interface SanityImageBlock extends SanityImage {
  _key: string;
  caption?: string;
}

/**
 * Sanity slug type
 */
export interface SanitySlug {
  _type: 'slug';
  current: string;
}

/**
 * Author document type
 * Matches: schemaTypes/authorType.ts
 */
export interface Author {
  _id: string;
  _type: 'author';
  name: string;
  slug: SanitySlug;
  image?: SanityImage;
  bio?: PortableTextBlock[];
}

/**
 * Post document type (full)
 * Matches: schemaTypes/postType.ts
 */
export interface Post {
  _id: string;
  _type: 'post';
  title: string;
  slug: SanitySlug;
  author: Author;
  mainImage?: SanityImage;
  publishedAt: string;
  excerpt?: string;
  body?: (PortableTextBlock | SanityImageBlock)[];
  categories?: string[];
}

/**
 * Simplified post for listings (without full body content)
 * Used in blog index for performance
 */
export interface PostSummary {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  author: {
    name: string;
    image?: SanityImage;
  };
  mainImage?: SanityImage;
  publishedAt: string;
  excerpt?: string;
  categories?: string[];
}
