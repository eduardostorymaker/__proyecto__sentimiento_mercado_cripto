import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sitio 100 % estático (SSG). No se usa cacheComponents: prohíbe `dynamic = "force-static"`
  // en la ruta /api/caso-binance y conserva estado entre rutas con <Activity>.
  images: {
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
