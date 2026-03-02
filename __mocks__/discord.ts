/**
 * Minimal discord.js stub for vitest.
 *
 * The agent/ sub-package depends on discord.js but it is not installed at the
 * root.  Vite's import-analysis plugin resolves transitive imports even for
 * modules that are vi.mock()-ed, so we provide this stub via resolve.alias in
 * vitest.config.ts to satisfy the resolution without installing the full
 * package.
 */

export const ChannelType = { GuildText: 0 } as const;
export class WebhookClient {
  constructor(_opts: unknown) {}
  send(_msg: unknown) {
    return Promise.resolve();
  }
}
