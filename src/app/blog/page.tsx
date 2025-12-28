import { Metadata } from 'next';
import { getSanityClient, ALL_POSTS_QUERY } from '@/lib/sanity';
import type { PostSummary } from '@/lib/sanity';
import { PostCard } from '@/components/blog';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Insights on software engineering, AI integration, and digital transformation from the Helixbytes team.',
};

async function getPosts(): Promise<PostSummary[]> {
  const client = getSanityClient();
  return client.fetch<PostSummary[]>(ALL_POSTS_QUERY);
}

export default async function BlogPage(): Promise<React.JSX.Element> {
  const posts = await getPosts();

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.kicker}>Blog</span>
          <h1 className={styles.title}>
            Insights & <span className={styles.highlight}>Ideas</span>
          </h1>
          <p className={styles.subtitle}>
            Thoughts on software engineering, AI integration, and building
            technology that makes a difference.
          </p>
        </div>
      </section>

      <section className={styles.postsSection}>
        {posts.length > 0 ? (
          <div className={styles.grid}>
            {posts.map((post, index) => (
              <PostCard key={post._id} post={post} index={index} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>
              No posts yet. Check back soon for insights from our team.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
