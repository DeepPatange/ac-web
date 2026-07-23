/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@splinetool/react-spline", "@splinetool/runtime"],
  images: {
    /* images.unsplash.com is called out explicitly because every remote photo
       on the site comes from it — next/image will only resize + re-encode a
       remote file whose host is listed here. The wildcard stays for anything
       else that gets added later. */
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "**" },
    ],
    /* AVIF first, WebP as the fallback — roughly a quarter smaller than WebP
       alone on photographic content, which is nearly all of it here. */
    formats: ["image/avif", "image/webp"],
    /* The remote photos never change, so keep the optimised variants for a year
       instead of re-fetching the origin every 60s (the default). */
    minimumCacheTTL: 31536000,
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
