/** @type {import('next').NextConfig} */
import type { Configuration } from "webpack";
const nextConfig = {
  webpack: (config: Configuration) => {
    if (!config.module) return config;

    config.module.rules?.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: "file-loader",
      },
    });

    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: "via.placeholder.com",
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: "images.clerk.dev",
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
