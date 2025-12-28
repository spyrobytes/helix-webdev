'use client';

import Image from 'next/image';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import type { SanityImageBlock } from '@/lib/sanity';
import { getBlogImageUrl } from '@/lib/sanity';
import styles from './PostContent.module.css';

interface PostContentProps {
  body: (PortableTextBlock | SanityImageBlock)[];
}

/**
 * Custom image component for embedded images in portable text
 */
function ImageBlock({ value }: { value: SanityImageBlock }): React.JSX.Element {
  const imageUrl = getBlogImageUrl(value, 800);
  const alt = value.alt || 'Blog post image';

  return (
    <figure className={styles.figure}>
      <div className={styles.imageWrapper}>
        <Image
          src={imageUrl}
          alt={alt}
          fill
          sizes="(max-width: 767px) 100vw, 800px"
          className={styles.image}
        />
      </div>
      {value.caption && (
        <figcaption className={styles.caption}>{value.caption}</figcaption>
      )}
    </figure>
  );
}

/**
 * Portable text component configuration
 */
const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImageBlock }) => (
      <ImageBlock value={value} />
    ),
  },
  block: {
    h1: ({ children }) => <h1 className={styles.h1}>{children}</h1>,
    h2: ({ children }) => <h2 className={styles.h2}>{children}</h2>,
    h3: ({ children }) => <h3 className={styles.h3}>{children}</h3>,
    h4: ({ children }) => <h4 className={styles.h4}>{children}</h4>,
    normal: ({ children }) => <p className={styles.paragraph}>{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className={styles.blockquote}>{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className={styles.list}>{children}</ul>,
    number: ({ children }) => <ol className={styles.orderedList}>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className={styles.listItem}>{children}</li>,
    number: ({ children }) => <li className={styles.listItem}>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className={styles.strong}>{children}</strong>,
    em: ({ children }) => <em className={styles.em}>{children}</em>,
    code: ({ children }) => <code className={styles.code}>{children}</code>,
    link: ({ value, children }) => {
      const href = value?.href || '#';
      const isExternal = href.startsWith('http');
      return (
        <a
          href={href}
          className={styles.link}
          {...(isExternal && {
            target: '_blank',
            rel: 'noopener noreferrer',
          })}
        >
          {children}
        </a>
      );
    },
  },
};

export function PostContent({ body }: PostContentProps): React.JSX.Element {
  return (
    <div className={styles.content}>
      <PortableText value={body} components={components} />
    </div>
  );
}
