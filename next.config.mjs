/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "/**",
      },
    ],
    // Image with src "/../../image.png" is using quality "100" which is not configured in images.qualities. This config will be required starting in Next.js 16
    qualities: [25, 50, 75, 100],
  },

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "shubukanindia.org",
          },
        ],
        destination: "https://www.shubukanindia.org/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
