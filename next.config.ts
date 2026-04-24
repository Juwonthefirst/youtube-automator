import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "02facda14ba0c8cc2a640e2a039855a6.r2.cloudflarestorage.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
