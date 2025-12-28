/**
 * Sanity GROQ Queries
 *
 * Centralized queries for blog data fetching.
 * Uses GROQ (Graph-Relational Object Queries) syntax.
 */

/**
 * Query for all published posts (for blog index listing)
 * Returns PostSummary type - excludes body for performance
 */
export const ALL_POSTS_QUERY = `
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    categories,
    mainImage {
      asset,
      alt,
      hotspot,
      crop
    },
    author-> {
      name,
      image {
        asset,
        alt
      }
    }
  }
`;

/**
 * Query for all post slugs (for generateStaticParams)
 * Returns array of slug strings for static generation
 */
export const ALL_POST_SLUGS_QUERY = `
  *[_type == "post" && defined(slug.current)].slug.current
`;

/**
 * Query for a single post by slug
 * Returns full Post type including body content
 */
export const POST_BY_SLUG_QUERY = `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    publishedAt,
    excerpt,
    categories,
    body[] {
      ...,
      _type == "image" => {
        _key,
        asset,
        alt,
        caption,
        hotspot,
        crop
      }
    },
    mainImage {
      asset,
      alt,
      hotspot,
      crop
    },
    author-> {
      _id,
      _type,
      name,
      slug,
      bio,
      image {
        asset,
        alt
      }
    }
  }
`;
