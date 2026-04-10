/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "WTerm",
      formats: ["es"],
      fileName: () => "wterm.js",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "cmdk"],
    },
  },
});
