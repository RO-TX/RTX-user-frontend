import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Product/category art comes back from the API as absolute URLs, so
  // next/image needs the hosts allow-listed or it refuses to optimise them.
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' }, // seed data
      { protocol: 'https', hostname: '*.s3.ap-south-1.amazonaws.com' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
    // The seeded catalogue points at placehold.co, which answers with SVG —
    // and next/image refuses SVG by default because it can carry script. The
    // documented escape hatch is to allow it behind a locked-down CSP, which
    // sandboxes the document and blocks every script. Real product photos
    // (JPEG/PNG from S3) never touch this path.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Both of these were the home screen at some point during the rebuild.
  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: false },
      { source: '/about', destination: '/', permanent: false },
    ];
  },
};

export default nextConfig;
