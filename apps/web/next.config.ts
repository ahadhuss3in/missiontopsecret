import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@fashion/shared"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.zara.com" },
      { protocol: "https", hostname: "**.hm.com" },
      { protocol: "https", hostname: "**.asos.com" },
      { protocol: "https", hostname: "**.shein.com" },
      { protocol: "https", hostname: "**.nike.com" },
    ],
  },
};

export default nextConfig;
