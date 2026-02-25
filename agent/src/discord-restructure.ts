/**
 * discord-restructure.ts -- Desired-state server restructure.
 *
 * Defines the exact target layout (categories + channels + roles)
 * and a function that enforces it: creates what's missing, deletes
 * everything that's not on the whitelist.
 */

import {
  type Guild,
  type TextChannel,
  type CategoryChannel,
  ChannelType,
  PermissionFlagsBits,
} from "discord.js";
import { state } from "./state.js";

// ─── Target Layout ──────────────────────────────────────────────────────────

/**
 * The ONLY categories and channels that should exist.
 * Everything else gets deleted.
 */
export const TARGET_LAYOUT: Record<string, { name: string; topic: string }[]> = {
  "General": [
    { name: "announcements", topic: "Team announcements -- Jaime posts, team reads" },
    { name: "general", topic: "Day-to-day team chat" },
    { name: "standup", topic: "Async daily updates: what you did, what is blocked" },
  ],
  "Campaigns": [
    { name: "campaign-updates", topic: "Campaign status changes, launches, pauses" },
    { name: "performance-reports", topic: "ROAS, spend, daily performance numbers" },
    { name: "ad-creative", topic: "Creative review, video/image approvals" },
    { name: "copy-review", topic: "Ad copy drafts, headlines, CTAs" },
  ],
  "Clients": [
    { name: "zamora", topic: "Arjona, Alofoke, Camila campaigns" },
    { name: "kybba", topic: "KYBBA campaigns" },
    { name: "client-onboarding", topic: "New client setup checklists and docs" },
  ],
  "Agent & Automation": [
    { name: "agent-logs", topic: "Think-loop output, sync results, session logs" },
    { name: "agent-alerts", topic: "Critical/warning alerts from the agent" },
    { name: "meta-api", topic: "Meta API issues, token refreshes, debugging" },
  ],
  "Ticketmaster": [
    { name: "tm-one-data", topic: "Event snapshots, ticket metrics from TM One" },
    { name: "event-updates", topic: "On-sale, off-sale, venue changes" },
  ],
  "Ops": [
    { name: "billing", topic: "Invoices, spend tracking" },
    { name: "dev-logs", topic: "Deploys, Railway, code changes" },
    { name: "admin", topic: "Internal ops, access requests" },
  ],
  "Bot Admin": [
    { name: "bot-admin", topic: "Talk to the server admin bot here" },
    { name: "bot-logs", topic: "Automated moderation logs, reports, bot activity" },
  ],
};

/** All whitelisted channel names. */
export const WHITELISTED_CHANNELS = new Set(
  Object.values(TARGET_LAYOUT).flatMap(chs => chs.map(c => c.name))
);

/** All whitelisted category names. */
export const WHITELISTED_CATEGORIES = new Set(Object.keys(TARGET_LAYOUT));

const TARGET_ROLES: { name: string; color: number; perms: bigint[] }[] = [
  { name: "Admin", color: 0xe74c3c, perms: [PermissionFlagsBits.Administrator] },
  { name: "Team", color: 0x5865f2, perms: [
    PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.AddReactions,
    PermissionFlagsBits.AttachFiles, PermissionFlagsBits.EmbedLinks,
    PermissionFlagsBits.UseExternalEmojis, PermissionFlagsBits.Connect,
    PermissionFlagsBits.Speak,
  ]},
  { name: "Bot", color: 0x99aab5, perms: [
    PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.EmbedLinks,
  ]},
  { name: "Viewer", color: 0x95a5a6, perms: [
    PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory,
  ]},
];

// ─── Restructure Function ───────────────────────────────────────────────────

/**
 * Desired-state restructure:
 * 1. Create categories + channels that should exist but don't.
 * 2. Move misplaced channels to correct category.
 * 3. Delete everything not on the whitelist.
 * 4. Ensure roles exist.
 *
 * Idempotent -- safe to run multiple times.
 */
export async function runServerRestructure(guild: Guild): Promise<string> {
  if (state.discordAdminRunning) return "Another admin task is already running.";

  state.discordAdminRunning = true;
  try {
    const g = guild;
    const log: string[] = [];

    // Refresh cache so we see current state
    await g.channels.fetch();

    // ─── Phase 1: Create target categories + channels ───
    for (const [catName, channels] of Object.entries(TARGET_LAYOUT)) {
      let cat = g.channels.cache.find(
        c => c.name === catName && c.type === ChannelType.GuildCategory
      ) as CategoryChannel | undefined;

      if (!cat) {
        cat = (await g.channels.create({
          name: catName,
          type: ChannelType.GuildCategory,
        })) as CategoryChannel;
        log.push(`Created category: ${catName}`);
      }

      for (const { name, topic } of channels) {
        const existing = g.channels.cache.find(c => c.name === name);
        if (existing) {
          if (existing.parentId !== cat.id) {
            await (existing as TextChannel).setParent(cat.id).catch(() => {});
            log.push(`Moved #${name} -> ${catName}`);
          }
        } else {
          await g.channels.create({
            name,
            type: ChannelType.GuildText,
            parent: cat.id,
            topic,
          });
          log.push(`Created #${name} in ${catName}`);
        }
      }
    }

    // ─── Phase 2: Delete everything not whitelisted ─────
    await g.channels.fetch();

    // Delete non-whitelisted text channels
    const allTextChannels = g.channels.cache.filter(
      c => c.type === ChannelType.GuildText
    );
    for (const [, ch] of allTextChannels) {
      if (!WHITELISTED_CHANNELS.has(ch.name)) {
        const parent = ch.parent?.name ?? "uncategorized";
        try {
          await ch.delete();
          log.push(`Deleted #${ch.name} (was in ${parent})`);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          log.push(`Failed to delete #${ch.name}: ${msg}`);
        }
      }
    }

    // Delete non-whitelisted categories + any remaining children
    const allCategories = g.channels.cache.filter(
      c => c.type === ChannelType.GuildCategory
    );
    for (const [, cat] of allCategories) {
      if (!WHITELISTED_CATEGORIES.has(cat.name)) {
        const children = g.channels.cache.filter(c => c.parentId === cat.id);
        for (const [, child] of children) {
          try {
            await child.delete();
            log.push(`Deleted #${child.name} (child of ${cat.name})`);
          } catch {
            // Already deleted or permission issue
          }
        }
        try {
          await cat.delete();
          log.push(`Deleted category: ${cat.name}`);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          log.push(`Failed to delete category ${cat.name}: ${msg}`);
        }
      }
    }

    // ─── Phase 3: Roles ─────────────────────────────────
    for (const { name, color, perms } of TARGET_ROLES) {
      if (!g.roles.cache.find(r => r.name === name)) {
        await g.roles.create({
          name,
          color,
          reason: "Server restructure",
          permissions: perms,
        });
        log.push(`Created ${name} role`);
      }
    }

    // ─── Summary ────────────────────────────────────────
    if (log.length === 0) return "Server matches target layout. No changes needed.";

    return (
      `**Server Restructure Complete**\n` +
      `${log.length} actions performed:\n\n` +
      log.map(l => `- ${l}`).join("\n")
    );
  } finally {
    state.discordAdminRunning = false;
  }
}
