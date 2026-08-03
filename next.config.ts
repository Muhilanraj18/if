import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Enables static export for GitHub Pages
  images: {
    unoptimized: true, // Required for static export
  },
  // Since the repository is named "if", we need to set the basePath
  basePath: '/if',
  assetPrefix: '/if/',
};

export default nextConfig;
