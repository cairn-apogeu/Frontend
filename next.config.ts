/** @type {import('next').NextConfig} */
const nextConfig = {
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
