import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: "export", // Enables static export for GitHub Pages
  images: {
    unoptimized: true, // Required for static export
  },
  // Apply basePath only in production (GitHub Pages), keep root '/' for local dev
  basePath: isProd ? '/if' : '',
  assetPrefix: isProd ? '/if/' : '',
};

export default nextConfig;
