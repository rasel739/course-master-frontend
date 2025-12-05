import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
