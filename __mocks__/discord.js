/**
 * Stub for discord.js — used by vitest so Vite's import analysis can resolve
 * the package without it being installed in the root node_modules.
 * Agent tests mock the real consumers; this file just satisfies the resolver.
 */
module.exports = {
  Client: class Client {},
  GatewayIntentBits: {},
  Partials: {},
  ChannelType: {},
  EmbedBuilder: class EmbedBuilder {
    setTitle() { return this; }
    setDescription() { return this; }
    setColor() { return this; }
    addFields() { return this; }
    setFooter() { return this; }
    setTimestamp() { return this; }
  },
  WebhookClient: class WebhookClient {},
  SlashCommandBuilder: class SlashCommandBuilder {},
  REST: class REST {},
  Routes: {},
  ActionRowBuilder: class ActionRowBuilder {},
  ButtonBuilder: class ButtonBuilder {},
  ButtonStyle: {},
  ComponentType: {},
  PermissionFlagsBits: {},
};
