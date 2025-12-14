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