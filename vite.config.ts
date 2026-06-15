import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": process.env.VITE_API_PROXY_TARGET || "http://localhost:3000",
      "/sitemap.xml": {
        target: process.env.VITE_API_PROXY_TARGET || "http://localhost:3000",
        rewrite: () => "/api/v1/sitemap.xml",
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
  },
});
