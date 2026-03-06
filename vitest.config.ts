import { configDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // discord.js lives in agent/node_modules, not the root workspace.
      // Point it to a minimal stub so Vite's import-analysis doesn't fail;
      // tests still vi.mock() the modules that use it.
      "discord.js": path.resolve(__dirname, "__mocks__/discord-stub.ts"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    exclude: [
      ...configDefaults.exclude,
      "**/.claude/**",
      ".claude/**",
      ".worktrees/**",
      "agent/dist/**",
      "agent/node_modules/**",
      ".opencode/**",
    ],
  },
});
