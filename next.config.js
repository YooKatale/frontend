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
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.yookatale.app",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "yookatale.app",
        port: "",
        pathname: "/**",
      },
    ],
    // Enable image optimization for better performance
    // Next.js will optimize images automatically on Vercel
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    // Image optimization enabled (included free on Vercel)
    // On Vercel, Next.js Image Optimization API is included - no 402 errors
    unoptimized: false,
  },
  // Ensure static assets are served correctly
  assetPrefix: process.env.NODE_ENV === "production" ? "" : "",
  // Enable compression
  compress: true,
  // Performance optimizations
  poweredByHeader: false,
  reactStrictMode: true,
};

module.exports = nextConfig;