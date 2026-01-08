import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getSanityClient,
  ALL_POST_SLUGS_QUERY,
  POST_BY_SLUG_QUERY,
  getBlogImageUrl,
} from '@/lib/sanity';
import type { Post } from '@/lib/sanity';
import { PostContent } from '@/components/blog';
import styles from './page.module.css';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate static params for all posts
 * Required for static export with dynamic routes
 */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const client = getSanityClient();
  const slugs = await client.fetch<string[]>(ALL_POST_SLUGS_QUERY);

  return slugs.map((slug) => ({ slug }));
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const client = getSanityClient();
  const post = await client.fetch<Post | null>(POST_BY_SLUG_QUERY, { slug });

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: post.title,
    description: post.excerpt || `Read ${post.title} on the Helixbytes blog.`,
    openGraph: post.mainImage
      ? {
          images: [{ url: getBlogImageUrl(post.mainImage, 1200) }],
        }
      : undefined,
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}

async function getPost(slug: string): Promise<Post | null> {
  const client = getSanityClient();
  return client.fetch<Post | null>(POST_BY_SLUG_QUERY, { slug });
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function PostPage({
  params,
}: PostPageProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const heroImageUrl = post.mainImage
    ? getBlogImageUrl(post.mainImage, 1200)
    : null;

  // BlogPosting structured data for rich results
  const blogPostSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || `Read ${post.title} on the Helixbytes blog.`,
    image: heroImageUrl || undefined,
    datePublished: post.publishedAt,
    author: {
      '@type': post.author ? 'Person' : 'Organization',
      name: post.author?.name || 'Helixbytes Digital Solutions',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Helixbytes Digital Solutions',
      logo: {
        '@type': 'ImageObject',
        url: 'https://helixbytes.com/images/hlx-logo-optimized.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://helixbytes.com/blog/${slug}`,
    },
    url: `https://helixbytes.com/blog/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostSchema),
        }}
      />
      <div className={styles.page}>
        <nav className={styles.nav} aria-label="Breadcrumb">
        <Link href="/blog" className={styles.backLink}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>
      </nav>

      <article className={styles.article}>
        <header className={styles.header}>
          {post.categories && post.categories.length > 0 && (
            <div className={styles.categories}>
              {post.categories.map((category) => (
                <span key={category} className={styles.category}>
                  {category}
                </span>
              ))}
            </div>
          )}

          <h1 className={styles.title}>{post.title}</h1>

          <div className={styles.meta}>
            {post.author && (
              <span className={styles.author}>By {post.author.name}</span>
            )}
            <time className={styles.date} dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
          </div>
        </header>

        {heroImageUrl && (
          <div className={styles.heroImage}>
            <Image
              src={heroImageUrl}
              alt={post.mainImage?.alt || post.title}
              fill
              priority
              sizes="(max-width: 767px) 100vw, 1200px"
              className={styles.image}
            />
          </div>
        )}

        {post.body && post.body.length > 0 ? (
          <PostContent body={post.body} />
        ) : (
          <p className={styles.noContent}>This post has no content yet.</p>
        )}
      </article>
      </div>
    </>
  );
}
