/** @type {import('next').NextConfig} */

// Two build shapes from one config.
//
//   npm run build      -> .next/standalone, a Node server (Docker / Fly.io).
//   npm run build:cf   -> out/, plain HTML, CSS and JS with no server at all.
//                         This is what Cloudflare Pages serves.
//
// The site has no server-rendered data: every section reads from src/data, and
// the API client in src/lib/api.ts is a no-op unless NEXT_PUBLIC_API_URL is
// set. So the static build is the same page with nothing left running. The
// contact form's server half lives in functions/api/contact.js, a Cloudflare
// Pages Function.
const staticExport = process.env.STATIC_EXPORT === '1';

const nextConfig = {
  reactStrictMode: true,

  output: staticExport ? 'export' : 'standalone',

  images: {
    formats: ['image/avif', 'image/webp'],
    // A static host has no image optimizer. Sources are served as authored.
    unoptimized: staticExport,
  },

  // Never let a failed lint or a type error ship silently. Both are on by
  // default; they are written out here so nobody "fixes" a red build by
  // turning them off without seeing what that costs.
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
