import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ipfs.w3s.link',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.io',
      },
    ],
  },
  // Optimize for Vercel deployment
  experimental: {
    optimizePackageImports: ['@coinbase/onchainkit'],
  },
};

export default nextConfig;
