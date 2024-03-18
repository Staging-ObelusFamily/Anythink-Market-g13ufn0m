/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {},
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  eslint: {
    dirs: ['app'],
  },
  images: {
    domains: ['static.wixstatic.com', 'hnbgu.net', 'pbs.twimg.com', 'static01.nyt.com'],
    formats: ['image/webp'],
  },
};

module.exports = nextConfig;
