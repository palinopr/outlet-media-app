/**
 * discord-restructure.ts -- Desired-state server restructure.
 *
 * Defines the exact target layout (categories + channels + roles)
 * and a function that enforces it: creates what's missing, deletes
 * everything that's not on the whitelist.
 *
 * Layout: 21 channels, 7 categories.
 * Each agent gets its own category with: work channel, memory, skills.
 */

import {
  type Guild,
  type TextChannel,
  type CategoryChannel,
  ChannelType,
  PermissionFlagsBits,
} from "discord.js";
import { state } from "./state.js";

// --- Target Layout --------------------------------------------------------

/**
 * The ONLY categories and channels that should exist.
 * Everything else gets deleted.
 *
 * 21 channels across 7 categories.
 * Each agent category has: work channel, memory channel, skills channel.
 * HQ has: general chat, agent feed, schedule config.
 */
export const TARGET_LAYOUT: Record<string, { name: string; topic: string }[]> = {
  "Boss": [
    { name: "boss", topic: "Talk to the Boss -- big picture, multi-agent tasks, server management" },
    { name: "boss-memory", topic: "Boss agent persistent memory -- auto-synced from memory/boss.md" },
    { name: "boss-skills", topic: "Boss agent skills and capabilities" },
  ],
  "Media Buyer": [
    { name: "media-buyer", topic: "Talk to the Media Buyer -- Meta Ads, budgets, ROAS, strategy" },
    { name: "mb-memory", topic: "Media Buyer memory -- Meta API patterns, campaign data" },
    { name: "mb-skills", topic: "Media Buyer skills and learned patterns" },
  ],
  "TM Data": [
    { name: "tm-data", topic: "Talk to the TM Agent -- events, tickets, demographics, zip codes" },
    { name: "tm-memory", topic: "TM Agent memory -- events, scraper state, shows" },
    { name: "tm-skills", topic: "TM Agent skills and automation patterns" },
  ],
  "Creative": [
    { name: "creative", topic: "Talk to the Creative Agent -- ad images, videos, copy review" },
    { name: "creative-memory", topic: "Creative agent memory -- top performers, strategies" },
    { name: "creative-skills", topic: "Creative agent skills and creative patterns" },
  ],
  "Reporting": [
    { name: "dashboard", topic: "Talk to the Reporting Agent -- analytics, trends, campaign data" },
    { name: "reporting-memory", topic: "Reporting agent memory -- Supabase schema, pipeline status" },
    { name: "reporting-skills", topic: "Reporting agent skills and analytics patterns" },
  ],
  "Clients": [
    { name: "zamora", topic: "Zamora -- Arjona, Alofoke, Camila campaigns. Use threads per event." },
    { name: "kybba", topic: "KYBBA campaigns. Use threads per city." },
    { name: "clients-memory", topic: "Client Manager memory -- client profiles, budgets, shows" },
    { name: "clients-skills", topic: "Client Manager skills and relationship patterns" },
  ],
  "HQ": [
    { name: "general", topic: "Team chat, announcements, day-to-day discussion" },
    { name: "agent-feed", topic: "All bot output: syncs, alerts, jobs, reports -- unified log" },
    { name: "schedule", topic: "View and configure scheduled jobs -- nothing runs until enabled here" },
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

// --- Roles-Only Function ------------------------------------------------

/**
 * Create target roles without touching channels.
 * Does NOT delete non-whitelisted roles (safe standalone operation).
 */
export async function ensureRoles(guild: Guild): Promise<string> {
  const log: string[] = [];
  await guild.roles.fetch();

  for (const { name, color, perms } of TARGET_ROLES) {
    if (!guild.roles.cache.find(r => r.name === name)) {
      await guild.roles.create({
        name,
        color,
        reason: "Ensure roles",
        permissions: perms,
      });
      log.push(`Created **${name}** role`);
    } else {
      log.push(`${name} role already exists`);
    }
  }

  if (log.every(l => l.includes("already exists"))) {
    return "All roles already exist. No changes needed.";
  }

  return log.join("\n");
}

// --- Restructure Function ------------------------------------------------

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

    // --- Phase 1: Create target categories + channels ---
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

    // --- Phase 2: Delete everything not whitelisted -----
    await g.channels.fetch();

    const allChannels = g.channels.cache.filter(
      c => c.type !== ChannelType.GuildCategory
    );
    for (const [, ch] of allChannels) {
      if (!WHITELISTED_CHANNELS.has(ch.name)) {
        const parent = ch.parent?.name ?? "uncategorized";
        const typeLabel = ChannelType[ch.type] ?? "unknown";
        try {
          await ch.delete();
          log.push(`Deleted ${typeLabel} #${ch.name} (was in ${parent})`);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          log.push(`Failed to delete #${ch.name}: ${msg}`);
        }
      }
    }

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

    await g.channels.fetch();

    // --- Phase 3: Roles -----------------------------
    const targetRoleNames = new Set(TARGET_ROLES.map(r => r.name));

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

    for (const [, role] of g.roles.cache) {
      if (role.name === "@everyone") continue;
      if (role.managed) continue;
      if (targetRoleNames.has(role.name)) continue;

      try {
        await role.delete("Server restructure -- not in target layout");
        log.push(`Deleted role: ${role.name}`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        log.push(`Failed to delete role ${role.name}: ${msg}`);
      }
    }

    // --- Summary ------------------------------------
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
