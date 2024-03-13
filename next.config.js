/** @type {import('next').NextConfig} */
// next.config.js
// const withPlugins = require("next-compose-plugins");
// const withBundleAnalyzer = require("next-bundle-analyzer");

// const bundleAnalyzer = withBundleAnalyzer({ enabled: true });

const nextConfig = {
  images: {
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
    ],
  },

};

module.exports = nextConfig;
