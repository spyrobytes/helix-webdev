import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for Firebase hosting
  output: 'export',

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Strict mode for catching issues early (required for hook cleanup validation)
  reactStrictMode: true,

  // Optional: Add trailing slashes for better compatibility
  trailingSlash: false,
};

export default nextConfig;
