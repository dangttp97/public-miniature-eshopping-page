import { resolve } from "node:path";

import { defaultClientConditions, defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: { "@": resolve(import.meta.dirname, "src") },
    conditions: ["source", ...defaultClientConditions],
  },
  oxc: {
    jsx: { runtime: "automatic", importSource: "@koniwa/core" },
  },
  server: {
    proxy: { "/api": "http://localhost:8080" },
  },
});
