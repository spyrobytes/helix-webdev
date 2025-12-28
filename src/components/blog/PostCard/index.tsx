'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useFadeIn } from '@/hooks/useFadeIn';
import type { PostSummary } from '@/lib/sanity';
import { getThumbnailUrl } from '@/lib/sanity';
import styles from './PostCard.module.css';

interface PostCardProps {
  post: PostSummary;
  index?: number;
}

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function PostCard({ post, index = 0 }: PostCardProps): React.JSX.Element {
  const { ref, isVisible } = useFadeIn<HTMLElement>({ delay: index * 100 });

  const imageUrl = post.mainImage ? getThumbnailUrl(post.mainImage, 400) : null;

  return (
    <article
      ref={ref}
      className={`${styles.card} ${isVisible ? styles.visible : ''}`}
    >
      <Link href={`/blog/${post.slug.current}`} className={styles.link}>
        {imageUrl && (
          <div className={styles.imageWrapper}>
            <Image
              src={imageUrl}
              alt={post.mainImage?.alt || post.title}
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 900px) 50vw, 33vw"
              className={styles.image}
            />
          </div>
        )}

        <div className={styles.content}>
          {post.categories && post.categories.length > 0 && (
            <div className={styles.categories} aria-label="Categories">
              {post.categories.slice(0, 2).map((category) => (
                <span key={category} className={styles.category}>
                  {category}
                </span>
              ))}
            </div>
          )}

          <h2 className={styles.title}>{post.title}</h2>

          {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}

          <div className={styles.meta}>
            {post.author?.name && (
              <span className={styles.author}>{post.author.name}</span>
            )}
            <time className={styles.date} dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
          </div>
        </div>
      </Link>
    </article>
  );
}
