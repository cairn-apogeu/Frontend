/** @type {import('next').NextConfig} */
const nextConfig = {
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
        hostname: 'images.clerk.dev',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
