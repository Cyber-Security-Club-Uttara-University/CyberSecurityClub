import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // Next 16 only serves quality 75 unless it is listed here; avatars opt in
    // to 90 so small profile pictures stay crisp after downscaling.
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
