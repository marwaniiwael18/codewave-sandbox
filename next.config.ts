import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {
        // Ignore backup files by aliasing them to empty modules
        "**/*_backup.tsx": false,
        "**/*_backup.css": false,
      },
    },
  },
};

export default nextConfig;