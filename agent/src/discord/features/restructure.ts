/**
 * discord-restructure.ts -- Desired-state server restructure.
 *
 * Defines the target layout (categories + channels + roles) and enforces it.
 * Sensitive channels are protected by explicit role overwrites, not convention.
 */

import {
  type Guild,
  type Role,
  type TextChannel,
  type CategoryChannel,
  type GuildChannelTypes,
  ChannelType,
  PermissionFlagsBits,
} from "discord.js";
import { isAgentBusy, setAgentBusy, clearAgentBusy } from "../../state.js";
import { buildChannelOverwrites, getChannelAccessProfile } from "../core/access.js";

interface LayoutChannel {
  name: string;
  topic: string;
  type?: GuildChannelTypes;
}

/**
 * Private owner surfaces and collaborative team channels.
 * Agent categories keep a single work channel; threads handle task-level detail.
 */
export const TARGET_LAYOUT: Record<string, LayoutChannel[]> = {
  "Owner": [
    { name: "boss", topic: "Private orchestrator, supervision, delegation" },
    { name: "whatsapp-boss", topic: "Private owner lane for WhatsApp approvals, routing, and liaison supervision" },
    { name: "email", topic: "Private owner email operations and drafts" },
    { name: "meetings", topic: "Private owner meeting scheduling and Google Meet control" },
    { name: "email-log", topic: "Silent owner-only log of every email action" },
    { name: "approvals", topic: "Owner approvals for sensitive actions" },
    { name: "schedule", topic: "View and control cron jobs" },
  ],
  "Specialists": [
    { name: "media-buyer", topic: "Meta Ads work (threads per task)" },
    { name: "tm-data", topic: "Ticketmaster work (threads per task)" },
    { name: "creative", topic: "Ad creative work (threads per task)" },
  ],
  "Growth": [
    { name: "growth", topic: "Internal growth orchestration and acquisition planning" },
    { name: "tiktok-ops", topic: "TikTok draft pipeline and supervisor handoffs" },
    { name: "tiktok-publish", topic: "Approval-gated TikTok publishing and manual post packets" },
    { name: "content-lab", topic: "Growth research, hooks, and idea capture" },
    { name: "lead-inbox", topic: "Inbound qualification and next-step triage" },
    { name: "growth-dashboard", topic: "Read-only growth pod updates and queue summaries" },
  ],
  "Clients": [
    { name: "whatsapp-control", topic: "Customer WhatsApp control center and liaison tasks" },
    { name: "zamora", topic: "Zamora -- per-campaign posts with tags" },
    { name: "kybba", topic: "KYBBA -- per-campaign posts with tags" },
    { name: "don-omar-tickets", topic: "Don Omar BCN ticket sales (EATA/Vivaticket)" },
  ],
  "HQ": [
    { name: "general", topic: "Team chat and announcements" },
    { name: "dashboard", topic: "Campaign status panel, analytics" },
    { name: "morning-briefing", topic: "Daily summary from Boss" },
    { name: "agent-feed", topic: "Real-time activity stream (silent)" },
  ],
  "Ops": [
    { name: "ops", topic: "Private strategy, escalations, agent issues" },
    { name: "war-room", topic: "Private incident coordination" },
    { name: "agent-internals", topic: "Inspect agent memory, skills, and prompts" },
    { name: "audit-log", topic: "Structured action log" },
  ],
};

export const WHITELISTED_CHANNELS = new Set(
  Object.values(TARGET_LAYOUT).flatMap((channels) => channels.map((channel) => channel.name)),
);

export const WHITELISTED_CATEGORIES = new Set(Object.keys(TARGET_LAYOUT));

const OWNER_ROLE_NAME = process.env.DISCORD_OWNER_ROLE_NAME ?? "Owner";
const ADMIN_ROLE_NAME = process.env.DISCORD_ADMIN_ROLE_NAME ?? "Admin";
const TEAM_ROLE_NAME = process.env.DISCORD_TEAM_ROLE_NAME ?? "Team";
const VIEWER_ROLE_NAME = process.env.DISCORD_VIEWER_ROLE_NAME ?? "Viewer";
const PRUNE_ON_RESTRUCTURE = process.env.DISCORD_RESTRUCTURE_PRUNE === "true";
const CATEGORY_ALIASES: Record<string, string[]> = {
  Owner: ["Boss"],
  Specialists: ["Media Buyer"],
};

const TARGET_ROLES: { name: string; color: number; perms: bigint[] }[] = [
  {
    name: "Owner",
    color: 0xf1c40f,
    perms: [
      PermissionFlagsBits.ViewChannel,
      PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.ReadMessageHistory,
    ],
  },
  { name: "Admin", color: 0xe74c3c, perms: [PermissionFlagsBits.Administrator] },
  {
    name: "Team",
    color: 0x5865f2,
    perms: [
      PermissionFlagsBits.ViewChannel,
      PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.ReadMessageHistory,
      PermissionFlagsBits.AddReactions,
      PermissionFlagsBits.AttachFiles,
      PermissionFlagsBits.EmbedLinks,
      PermissionFlagsBits.UseExternalEmojis,
      PermissionFlagsBits.Connect,
      PermissionFlagsBits.Speak,
    ],
  },
  {
    name: "Bot",
    color: 0x99aab5,
    perms: [
      PermissionFlagsBits.ViewChannel,
      PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.ReadMessageHistory,
      PermissionFlagsBits.EmbedLinks,
      PermissionFlagsBits.AddReactions,
    ],
  },
  {
    name: "Viewer",
    color: 0x95a5a6,
    perms: [
      PermissionFlagsBits.ViewChannel,
      PermissionFlagsBits.ReadMessageHistory,
    ],
  },
];

function getConfiguredOwnerIds(guild: Guild): string[] {
  const configured = (process.env.DISCORD_OWNER_USER_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  return Array.from(new Set([guild.ownerId, ...configured]));
}

async function syncOwnerRoleAssignments(guild: Guild, ownerRole: Role, log: string[]): Promise<void> {
  for (const ownerId of getConfiguredOwnerIds(guild)) {
    try {
      const member = await guild.members.fetch(ownerId);
      if (member.roles.cache.has(ownerRole.id)) continue;

      await member.roles.add(ownerRole, "Ensure owner role assignment");
      log.push(`Assigned ${OWNER_ROLE_NAME} role to ${member.user.username}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      log.push(`Failed to assign ${OWNER_ROLE_NAME} role to ${ownerId}: ${msg}`);
    }
  }
}

async function syncTeamRoleAssignments(guild: Guild, teamRole: Role, log: string[]): Promise<void> {
  const members = await guild.members.list({ limit: 1000 });

  for (const [, member] of members) {
    if (member.user.bot) continue;
    if (getConfiguredOwnerIds(guild).includes(member.id)) continue;

    const roleNames = new Set(member.roles.cache.map((role) => role.name));
    if (
      roleNames.has(OWNER_ROLE_NAME) ||
      roleNames.has(ADMIN_ROLE_NAME) ||
      roleNames.has(TEAM_ROLE_NAME) ||
      roleNames.has(VIEWER_ROLE_NAME)
    ) {
      continue;
    }

    try {
      await member.roles.add(teamRole, "Ensure employee workspace access");
      log.push(`Assigned ${TEAM_ROLE_NAME} role to ${member.user.username}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      log.push(`Failed to assign ${TEAM_ROLE_NAME} role to ${member.user.username}: ${msg}`);
    }
  }
}

async function ensureTargetRoles(guild: Guild, reason: string, log: string[]): Promise<void> {
  for (const { name, color, perms } of TARGET_ROLES) {
    if (!guild.roles.cache.find((role) => role.name === name)) {
      await guild.roles.create({
        name,
        color,
        reason,
        permissions: perms,
      });
      log.push(`Created ${name} role`);
    }
  }

  const ownerRole = guild.roles.cache.find((role) => role.name === OWNER_ROLE_NAME);
  if (ownerRole) {
    await syncOwnerRoleAssignments(guild, ownerRole, log);
  }

  const teamRole = guild.roles.cache.find((role) => role.name === TEAM_ROLE_NAME);
  if (teamRole) {
    await syncTeamRoleAssignments(guild, teamRole, log);
  }
}

function getCategoryCandidates(guild: Guild, categoryName: string): CategoryChannel[] {
  const aliases = new Set([categoryName, ...(CATEGORY_ALIASES[categoryName] ?? [])]);
  return guild.channels.cache
    .filter((channel) => channel.type === ChannelType.GuildCategory && aliases.has(channel.name))
    .map((channel) => channel as CategoryChannel)
    .sort((a, b) => a.rawPosition - b.rawPosition);
}

function formatNameList(names: string[]): string {
  return names.map((name) => `\`${name}\``).join(", ");
}

export async function ensureRoles(guild: Guild): Promise<string> {
  const log: string[] = [];
  await guild.roles.fetch();
  const existingRoles = new Set(guild.roles.cache.map((role) => role.name));

  await ensureTargetRoles(guild, "Ensure roles", log);

  for (const { name } of TARGET_ROLES) {
    if (existingRoles.has(name)) {
      log.push(`${name} role already exists`);
    }
  }

  if (log.every((entry) => entry.includes("already exists"))) {
    return "All roles already exist. No changes needed.";
  }

  return log.join("\n");
}

/**
 * Desired-state restructure:
 * 1. Ensure roles exist.
 * 2. Create categories + channels that should exist.
 * 3. Move misplaced channels and re-apply permission overwrites.
 * 4. Optionally prune unmanaged channels/categories/roles when explicitly enabled.
 */
export async function runServerRestructure(guild: Guild): Promise<string> {
  if (isAgentBusy("discord-admin")) return "Another admin task is already running.";

  setAgentBusy("discord-admin");
  try {
    const g = guild;
    const log: string[] = [];
    const targetRoleNames = new Set(TARGET_ROLES.map((role) => role.name));

    await g.roles.fetch();
    await ensureTargetRoles(g, "Server restructure", log);

    await g.channels.fetch();

    for (const [categoryName, channels] of Object.entries(TARGET_LAYOUT)) {
      let category = getCategoryCandidates(g, categoryName)[0];

      if (!category) {
        category = (await g.channels.create({
          name: categoryName,
          type: ChannelType.GuildCategory,
        })) as CategoryChannel;
        log.push(`Created category: ${categoryName}`);
      } else if (category.name !== categoryName) {
        const previousName = category.name;
        await category.setName(categoryName).catch(() => {});
        log.push(`Renamed category ${previousName} -> ${categoryName}`);
      }

      for (const channelConfig of channels) {
        const existing = g.channels.cache.find((channel) => channel.name === channelConfig.name);
        const permissionOverwrites = buildChannelOverwrites(
          g,
          getChannelAccessProfile(channelConfig.name),
        );

        if (existing) {
          if (existing.parentId !== category.id) {
            await (existing as TextChannel).setParent(category.id).catch(() => {});
            log.push(`Moved #${channelConfig.name} -> ${categoryName}`);
          }

          await (existing as TextChannel).setTopic(channelConfig.topic).catch(() => {});
          await (existing as TextChannel).permissionOverwrites
            .set(permissionOverwrites)
            .catch(() => {});
          continue;
        }

        const channelType: GuildChannelTypes = channelConfig.type ?? ChannelType.GuildText;
        await g.channels.create({
          name: channelConfig.name,
          type: channelType,
          parent: category.id,
          topic: channelConfig.topic,
          permissionOverwrites,
        });
        log.push(`Created #${channelConfig.name} in ${categoryName}`);
      }
    }

    await g.channels.fetch();

    const liveChannels = g.channels.cache.filter(
      (channel) => channel.type !== ChannelType.GuildCategory,
    );
    const unmanagedChannels = liveChannels
      .filter((channel) => !WHITELISTED_CHANNELS.has(channel.name))
      .map((channel) => channel);

    if (PRUNE_ON_RESTRUCTURE) {
      for (const channel of unmanagedChannels) {
        const parent = channel.parent?.name ?? "uncategorized";
        const typeLabel = ChannelType[channel.type] ?? "unknown";
        try {
          await channel.delete();
          log.push(`Deleted ${typeLabel} #${channel.name} (was in ${parent})`);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          log.push(`Failed to delete #${channel.name}: ${msg}`);
        }
      }
    } else if (unmanagedChannels.length > 0) {
      log.push(`Skipped pruning unmanaged channels: ${formatNameList(unmanagedChannels.map((channel) => channel.name))}`);
    }

    const liveCategories = g.channels.cache.filter(
      (channel) => channel.type === ChannelType.GuildCategory,
    );
    const unmanagedCategories = liveCategories
      .filter((channel) => !WHITELISTED_CATEGORIES.has(channel.name))
      .map((channel) => channel as CategoryChannel);

    if (PRUNE_ON_RESTRUCTURE) {
      for (const category of unmanagedCategories) {
        const children = g.channels.cache.filter((channel) => channel.parentId === category.id);
        for (const [, child] of children) {
          try {
            await child.delete();
            log.push(`Deleted #${child.name} (child of ${category.name})`);
          } catch {
            // Ignore already-deleted children.
          }
        }
        try {
          await category.delete();
          log.push(`Deleted category: ${category.name}`);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          log.push(`Failed to delete category ${category.name}: ${msg}`);
        }
      }
    } else if (unmanagedCategories.length > 0) {
      log.push(`Skipped pruning unmanaged categories: ${formatNameList(unmanagedCategories.map((category) => category.name))}`);
    }

    const unmanagedRoles = g.roles.cache
      .filter((role) => role.name !== "@everyone" && !role.managed && !targetRoleNames.has(role.name))
      .map((role) => role);

    if (PRUNE_ON_RESTRUCTURE) {
      for (const role of unmanagedRoles) {
        try {
          await role.delete("Server restructure -- not in target layout");
          log.push(`Deleted role: ${role.name}`);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          log.push(`Failed to delete role ${role.name}: ${msg}`);
        }
      }
    } else if (unmanagedRoles.length > 0) {
      log.push(`Skipped pruning unmanaged roles: ${formatNameList(unmanagedRoles.map((role) => role.name))}`);
    }

    if (log.length === 0) return "Server matches target layout. No changes needed.";

    return (
      `**Server Restructure Complete**\n` +
      `${log.length} actions performed:\n\n` +
      log.map((entry) => `- ${entry}`).join("\n") +
      (PRUNE_ON_RESTRUCTURE ? "" : "\n\nPrune mode is OFF. Set `DISCORD_RESTRUCTURE_PRUNE=true` to delete unmanaged channels, categories, and roles.")
    );
  } finally {
    clearAgentBusy("discord-admin");
  }
}
