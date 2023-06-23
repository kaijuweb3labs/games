/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: { unoptimized: true },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/2048",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
