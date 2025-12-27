/** @type {import('next').NextConfig} */
// next.config.js
// const withPlugins = require("next-compose-plugins");
// const withBundleAnalyzer = require("next-bundle-analyzer");

// const bundleAnalyzer = withBundleAnalyzer({ enabled: true });

const nextConfig = {
  images: {
    // Allow images from these remote domains
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yookatale.s3.eu-north-1.amazonaws.com",
        port: "",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "",
      },
      {
        protocol: "https",
        hostname: "www.yookatale.app",
        port: "",
      },
      {
        protocol: "https",
        hostname: "yookatale.app",
        port: "",
      },
    ],
    // Disable image optimization to avoid 402 errors (Payment Required)
    // This allows images to load directly without Next.js Image Optimization API
    // Local images will be served from /public directory directly
    unoptimized: true,
  },
  // Ensure static assets are served correctly
  assetPrefix: process.env.NODE_ENV === "production" ? "" : "",
};

module.exports = nextConfig;