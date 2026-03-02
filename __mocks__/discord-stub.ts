/**
 * Minimal discord.js stub for Vitest.
 * The real package lives in agent/node_modules and is NOT available to the
 * root workspace. Tests that import agent code must mock discord.js; this
 * stub satisfies Vite's import-analysis so the mocks can take over at runtime.
 */
export const ChannelType = { GuildText: 0 } as const;
export class WebhookClient {
  constructor(_opts: unknown) {}
  send(_msg: unknown) { return Promise.resolve(); }
}
