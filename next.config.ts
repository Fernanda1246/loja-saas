import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // não derruba o build por erros de lint
  eslint: { ignoreDuringBuilds: true },

  // não derruba o build por erros de TypeScript
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
