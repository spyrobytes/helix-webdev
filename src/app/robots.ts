/**
 * Robots.txt Configuration
 *
 * Provides crawling directives for search engines.
 * Disallows indexing of utility pages and API routes.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */

import { MetadataRoute } from 'next';

// Required for static export
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/contact/verified', // Email verification utility page
      ],
    },
    sitemap: 'https://helixbytes.com/sitemap.xml',
  };
}
