import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // discord.js is only in agent/node_modules; point to a lightweight
      // stub so Vite can resolve the import when transforming agent tests.
      "discord.js": path.resolve(__dirname, "__tests__/stubs/discord.js"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    server: {
      deps: {
        // discord.js is only installed in agent/node_modules; mark it
        // external so Vite doesn't fail resolving it for agent tests.
        external: ["discord.js"],
      },
    },
  },
});
