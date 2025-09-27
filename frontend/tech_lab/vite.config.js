/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  define: {
    "process.env": {},
  },
  server: {
    port: 5173,
    proxy: {
      "/auth": "http://localhost:4000", // backend proxy
    },
  },
  preview: {
    port: 5173, // build sonrası preview da aynı porttan çalışsın
    proxy: {
      "/auth": "http://localhost:4000", // backend proxy preview için de lazım
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
  },
});
