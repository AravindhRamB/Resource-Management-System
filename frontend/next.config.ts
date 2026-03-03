import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Existing settings
  eslint: {
    ignoreDuringBuilds: true,
  },
  // output: 'export', // ✅ enables static export mode
};

export default nextConfig;
