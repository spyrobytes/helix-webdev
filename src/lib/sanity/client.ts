/**
 * Sanity Client Configuration
 *
 * This file initializes the Sanity client for fetching CMS content.
 * Configuration is loaded from environment variables.
 * Follows the same singleton pattern as src/lib/firebase/config.ts
 */

import { createClient, type SanityClient } from '@sanity/client';

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '8h7x9tdv',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
};

let client: SanityClient | null = null;

/**
 * Get or create the Sanity client
 * Uses singleton pattern to prevent multiple initializations
 */
export function getSanityClient(): SanityClient {
  if (!client) {
    client = createClient(config);
  }
  return client;
}
