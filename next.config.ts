import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Enables static export for GitHub Pages
  images: {
    unoptimized: true, // Required for static export
  },
  // If you are deploying to a subfolder (like https://username.github.io/repo-name/), 
  // uncomment and change the following lines:
  // basePath: '/repo-name',
  // assetPrefix: '/repo-name/',
};

export default nextConfig;
