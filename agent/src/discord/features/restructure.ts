/**
 * discord-restructure.ts -- Desired-state server restructure.
 *
 * Defines the exact target layout (categories + channels + roles)
 * and a function that enforces it: creates what's missing, deletes
 * everything that's not on the whitelist.
 *
 * Layout: 16 channels, 8 categories.
 * Agent categories have a single work channel (threads per task).
 * HQ holds team-wide channels. Ops is private to Admin + Bot.
 */

import {
  type Guild,
  type TextChannel,
  type CategoryChannel,
  type GuildChannelTypes,
  ChannelType,
  OverwriteType,
  PermissionFlagsBits,
} from "discord.js";
import { state } from "../../state.js";

// --- Target Layout --------------------------------------------------------

interface LayoutChannel {
  name: string;
  topic: string;
  type?: GuildChannelTypes;
}

/**
 * The ONLY categories and channels that should exist.
 * Everything else gets deleted.
 *
 * 16 channels across 8 categories.
 * Agent categories have a single work channel (threads per task).
 * HQ holds team-wide channels. Ops is private to Admin + Bot.
 */
export const TARGET_LAYOUT: Record<string, LayoutChannel[]> = {
  "Boss": [
    { name: "boss", topic: "Orchestrator, supervision, delegation" },
  ],
  "Media Buyer": [
    { name: "media-buyer", topic: "Meta Ads work (threads per task)" },
  ],
  "TM Data": [
    { name: "tm-data", topic: "Ticketmaster work (threads per task)" },
  ],
  "Creative": [
    { name: "creative", topic: "Ad creative work (threads per task)" },
  ],
  "Reporting": [
    { name: "dashboard", topic: "Campaign status panel, analytics" },
  ],
  "Clients": [
    { name: "zamora", topic: "Zamora -- per-campaign posts with tags" },
    { name: "kybba", topic: "KYBBA -- per-campaign posts with tags" },
  ],
  "HQ": [
    { name: "general", topic: "Team chat, announcements" },
    { name: "morning-briefing", topic: "Daily summary from Boss" },
    { name: "agent-feed", topic: "Real-time activity stream (silent)" },
    { name: "approvals", topic: "Red/Yellow-tier actions, select menus" },
    { name: "war-room", topic: "Incident threads, multi-agent coordination" },
    { name: "agent-internals", topic: "Inspect any agent's memory/skills/prompt" },
    { name: "schedule", topic: "View and toggle cron jobs" },
  ],
  "Ops": [
    { name: "ops", topic: "Private strategy, escalations, agent issues" },
    { name: "audit-log", topic: "Every action taken, structured entries" },
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

// --- Helpers -------------------------------------------------------------

/** Permission overwrites that restrict Ops channels to Admin + Bot roles. */
function buildOpsOverwrites(guild: Guild) {
  const adminRole = guild.roles.cache.find(r => r.name === "Admin");
  const botRole = guild.roles.cache.find(r => r.name === "Bot");

  const overwrites: {
    id: string;
    type: OverwriteType;
    allow?: bigint[];
    deny?: bigint[];
  }[] = [
    // Deny @everyone
    {
      id: guild.id,
      type: OverwriteType.Role,
      deny: [PermissionFlagsBits.ViewChannel],
    },
  ];

  if (adminRole) {
    overwrites.push({
      id: adminRole.id,
      type: OverwriteType.Role,
      allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
    });
  }
  if (botRole) {
    overwrites.push({
      id: botRole.id,
      type: OverwriteType.Role,
      allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
    });
  }

  return overwrites;
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

      // Build permission overwrites for Ops (Admin + Bot only)
      const isOps = catName === "Ops";
      const opsOverwrites = isOps ? buildOpsOverwrites(g) : undefined;

      for (const ch of channels) {
        const existing = g.channels.cache.find(c => c.name === ch.name);
        if (existing) {
          if (existing.parentId !== cat.id) {
            await (existing as TextChannel).setParent(cat.id).catch(() => {});
            log.push(`Moved #${ch.name} -> ${catName}`);
          }
        } else {
          const chType: GuildChannelTypes = ch.type ?? ChannelType.GuildText;
          await g.channels.create({
            name: ch.name,
            type: chType,
            parent: cat.id,
            topic: ch.topic,
            ...(opsOverwrites ? { permissionOverwrites: opsOverwrites } : {}),
          });
          log.push(`Created #${ch.name} in ${catName}`);
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
