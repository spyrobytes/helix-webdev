/**
 * Dynamic Sitemap Generation
 *
 * Generates XML sitemap with:
 * - Static pages (home, services, approach, etc.)
 * - Dynamic blog posts from Sanity CMS
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import { MetadataRoute } from 'next';
import { getSanityClient, ALL_POSTS_QUERY } from '@/lib/sanity';
import type { PostSummary } from '@/lib/sanity';

// Required for static export
export const dynamic = 'force-static';

const BASE_URL = 'https://helixbytes.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages with their change frequencies and priorities
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/approach`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/why-helixbytes`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Fetch blog posts from Sanity CMS
  let blogRoutes: MetadataRoute.Sitemap = [];

  try {
    const client = getSanityClient();
    const posts = await client.fetch<PostSummary[]>(ALL_POSTS_QUERY);

    blogRoutes = posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug.current}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    // Log error but don't fail sitemap generation
    console.error('Failed to fetch blog posts for sitemap:', error);
  }

  return [...staticRoutes, ...blogRoutes];
}
