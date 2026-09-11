/** @type {import('next').NextConfig} */

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "img-src 'self' data: blob: https://images.unsplash.com",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' https://plausible.io",
  "connect-src 'self' https://plausible.io https://qkmyzbqhepapiowrttpz.supabase.co",
  "upgrade-insecure-requests",
].join('; ');

const cspHeader =
  process.env.VERCEL_ENV === 'production' || process.env.CSP_ENFORCE === 'true'
    ? 'Content-Security-Policy'
    : 'Content-Security-Policy-Report-Only';

const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [320, 375, 390, 430, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: cspHeader,
          value: contentSecurityPolicy,
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()',
        },
        {
          key: 'Cross-Origin-Opener-Policy',
          value: 'same-origin',
        },
        {
          key: 'X-Permitted-Cross-Domain-Policies',
          value: 'none',
        },
      ],
    },
  ],
};

module.exports = nextConfig;
