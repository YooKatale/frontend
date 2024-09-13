/** @type {import('next').NextConfig} */
// next.config.js
// const withPlugins = require("next-compose-plugins");
// const withBundleAnalyzer = require("next-bundle-analyzer");

// const bundleAnalyzer = withBundleAnalyzer({ enabled: true });

// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "yookatale.s3.eu-north-1.amazonaws.com",
//         port: "",
//       },
//       {
//         protocol: "http",
//         hostname: "localhost",
//         port: "",
//       },
//     ],
//   },

// };

//module.exports = nextConfig;

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
  webpack: (config) => {
    config.module.rules.push({
      test: /\.js$/,
      exclude: /node_modules\/(?!undici)/, 
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          compact: true,
          babelrc: false,
          cacheDirectory: true,
          ignore: [
            /node_modules\/react-dom\/cjs\/react-dom.development.js/,
            /node_modules\/next\/dist\/compiled\/react-dom\/cjs\/react-dom.development.js/,
            /node_modules\/lucide-react\/dist\/cjs\/lucide-react.js/,
            /node_modules\/react-icons\/ai\/index.esm.js/,
            /node_modules\/react-icons\/fa\/index.esm.js/
          ]
        },
      },
    });
    return config;
  },
};

module.exports = nextConfig;

