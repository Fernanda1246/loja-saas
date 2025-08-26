import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Evita que o build na Vercel falhe por erros de ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

