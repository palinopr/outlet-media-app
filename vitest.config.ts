import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // discord.js lives in agent/node_modules, not the root.  Vite's
      // import-analysis still resolves transitive imports of vi.mock()-ed
      // modules, so we point it at a lightweight stub.
      "discord.js": path.resolve(__dirname, "__mocks__/discord.ts"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
});
