import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    // Silence the "multiple lockfiles" workspace root warning
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
