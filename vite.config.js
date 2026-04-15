import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom", // Tells Vitest to run in a browser-like environment
    setupFiles: "./setupTests.js", // We will create this file next
    globals: true,
  },
});
