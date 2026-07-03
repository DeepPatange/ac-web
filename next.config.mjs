/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@splinetool/react-spline", "@splinetool/runtime"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  /* Long-lived caching for the heavy static hero scene + product renders so the
     browser serves them from cache instead of re-downloading on every visit.
     Note: these filenames are fixed, so if you ever swap an asset, rename it (or
     hard-refresh) to bust the cache. */
  async headers() {
    return [
      {
        source: "/spline/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/products/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
