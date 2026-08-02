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

  /**
   * Opt-in reverse proxy, off unless `API_PROXY_TARGET` is set.
   *
   * It exists for tunnels and demos: served from one hostname, the API is
   * same-origin with the pages, so the refresh cookie — `sameSite:'lax'`
   * outside production — is actually sent, and CORS never comes into it.
   * Gated on the variable so a real deploy, where the API has its own public
   * host, never accidentally proxies to a machine that isn't there.
   */
  async rewrites() {
    const target = process.env.API_PROXY_TARGET?.replace(/\/+$/, '');
    if (!target) return [];
    return [{ source: '/api/:path*', destination: `${target}/api/:path*` }];
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
