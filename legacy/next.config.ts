/** @type {import('next').NextConfig} */
import { NextConfig } from 'next';
const nextConfig: NextConfig = {
  serverExternalPackages: ['@node-rs/argon2'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        pathname: '/f/*',
      },
    ],
  },

  experimental: {
    reactCompiler: true,
  },
};

export default nextConfig;
