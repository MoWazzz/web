import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Ensure turbopack/root is the project folder so Next infers config correctly
    root: './',
  },
};

export default nextConfig;
