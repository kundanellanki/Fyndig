/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Emits .next/standalone — a self-contained server with only the modules it
  // actually uses. It is what the Dockerfile ships, and it is what lets the
  // site run on any host with Node rather than only on Vercel. Harmless if you
  // deploy to Vercel anyway; that platform ignores it.
  output: 'standalone',

  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Never let a failed lint or a type error ship silently. Both are on by
  // default; they are written out here so nobody "fixes" a red build by
  // turning them off without seeing what that costs.
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
