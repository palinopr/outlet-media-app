import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // discord.js is only installed in agent/node_modules, not the root.
      // Alias it to a stub so Vite's import analysis doesn't fail when
      // transforming agent source files that import it (tests mock it).
      "discord.js": path.resolve(__dirname, "__mocks__/discord.js"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
});
