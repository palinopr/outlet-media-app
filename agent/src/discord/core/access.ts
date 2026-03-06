import {
  OverwriteType,
  PermissionFlagsBits,
  type Guild,
  type GuildMember,
} from "discord.js";

export type ChannelAccessProfile = "owner" | "team" | "readonly";

const OWNER_ROLE_NAME = process.env.DISCORD_OWNER_ROLE_NAME ?? "Owner";
const ADMIN_ROLE_NAME = process.env.DISCORD_ADMIN_ROLE_NAME ?? "Admin";
const TEAM_ROLE_NAME = process.env.DISCORD_TEAM_ROLE_NAME ?? "Team";
const VIEWER_ROLE_NAME = process.env.DISCORD_VIEWER_ROLE_NAME ?? "Viewer";
const BOT_ROLE_NAME = process.env.DISCORD_BOT_ROLE_NAME ?? "Bot";

const OWNER_USER_IDS = new Set(
  (process.env.DISCORD_OWNER_USER_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean),
);

const OWNER_ONLY_CHANNELS = new Set([
  "boss",
  "email",
  "meetings",
  "email-log",
  "approvals",
  "war-room",
  "agent-internals",
  "schedule",
  "ops",
  "audit-log",
]);

const READ_ONLY_CHANNELS = new Set([
  "morning-briefing",
  "agent-feed",
  "email-log",
  "audit-log",
]);

const OWNER_ONLY_COMMANDS = new Set([
  "restructure",
  "roles",
  "supervise",
  "dashboard",
  "schedule",
  "inspect",
]);

const OWNER_SEND_PERMS = [
  PermissionFlagsBits.ViewChannel,
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.ReadMessageHistory,
  PermissionFlagsBits.EmbedLinks,
  PermissionFlagsBits.AttachFiles,
  PermissionFlagsBits.AddReactions,
  PermissionFlagsBits.ManageMessages,
  PermissionFlagsBits.ManageWebhooks,
  PermissionFlagsBits.SendMessagesInThreads,
  PermissionFlagsBits.CreatePublicThreads,
  PermissionFlagsBits.CreatePrivateThreads,
];

const TEAM_SEND_PERMS = [
  PermissionFlagsBits.ViewChannel,
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.ReadMessageHistory,
  PermissionFlagsBits.EmbedLinks,
  PermissionFlagsBits.AttachFiles,
  PermissionFlagsBits.AddReactions,
  PermissionFlagsBits.SendMessagesInThreads,
  PermissionFlagsBits.CreatePublicThreads,
  PermissionFlagsBits.CreatePrivateThreads,
];

const READ_ONLY_PERMS = [
  PermissionFlagsBits.ViewChannel,
  PermissionFlagsBits.ReadMessageHistory,
];

function hasRole(member: GuildMember | null | undefined, roleName: string): boolean {
  if (!member) return false;
  return member.roles.cache.some((role) => role.name === roleName);
}

export interface MemberAccess {
  isOwner: boolean;
  isAdmin: boolean;
  isTeam: boolean;
  isViewer: boolean;
}

export function getMemberAccess(
  member: GuildMember | null | undefined,
  userId?: string,
): MemberAccess {
  const isOwner =
    !!userId &&
    !!member?.guild &&
    member.guild.ownerId === userId
      ? true
      : !!userId && OWNER_USER_IDS.size > 0 && OWNER_USER_IDS.has(userId)
      ? true
      : hasRole(member, OWNER_ROLE_NAME);

  const isAdmin =
    !!member &&
    (member.permissions.has(PermissionFlagsBits.Administrator) ||
      hasRole(member, ADMIN_ROLE_NAME));

  const isTeam = hasRole(member, TEAM_ROLE_NAME);
  const isViewer = hasRole(member, VIEWER_ROLE_NAME);

  return { isOwner, isAdmin, isTeam, isViewer };
}

export function isOwnerOnlyChannel(channelName: string): boolean {
  return OWNER_ONLY_CHANNELS.has(channelName);
}

export function isReadOnlyChannel(channelName: string): boolean {
  return READ_ONLY_CHANNELS.has(channelName);
}

export function canUseChannel(
  channelName: string,
  member: GuildMember | null | undefined,
  userId?: string,
): boolean {
  if (!channelName) return true;
  if (!isOwnerOnlyChannel(channelName)) return true;

  const access = getMemberAccess(member, userId);
  return access.isOwner;
}

export function canRunCommand(
  commandName: string,
  member: GuildMember | null | undefined,
  userId?: string,
): boolean {
  if (!OWNER_ONLY_COMMANDS.has(commandName)) return true;

  const access = getMemberAccess(member, userId);
  return access.isOwner;
}

export function getAccessDeniedMessage(channelName: string): string {
  if (channelName === "email") {
    return "Access denied. Email is owner-only.";
  }
  if (OWNER_ONLY_CHANNELS.has(channelName)) {
    return `Access denied. #${channelName} is owner-only.`;
  }
  return "Access denied.";
}

export function getChannelAccessProfile(channelName: string): ChannelAccessProfile {
  if (OWNER_ONLY_CHANNELS.has(channelName)) return "owner";
  if (READ_ONLY_CHANNELS.has(channelName)) return "readonly";
  return "team";
}

export function buildChannelOverwrites(
  guild: Guild,
  profile: ChannelAccessProfile,
): Array<{
  id: string;
  type: OverwriteType;
  allow?: bigint[];
  deny?: bigint[];
}> {
  const ownerRole = guild.roles.cache.find((role) => role.name === OWNER_ROLE_NAME);
  const adminRole = guild.roles.cache.find((role) => role.name === ADMIN_ROLE_NAME);
  const teamRole = guild.roles.cache.find((role) => role.name === TEAM_ROLE_NAME);
  const viewerRole = guild.roles.cache.find((role) => role.name === VIEWER_ROLE_NAME);
  const botRole = guild.roles.cache.find((role) => role.name === BOT_ROLE_NAME);

  const overwrites: Array<{
    id: string;
    type: OverwriteType;
    allow?: bigint[];
    deny?: bigint[];
  }> = [
    {
      id: guild.id,
      type: OverwriteType.Role,
      deny: [PermissionFlagsBits.ViewChannel],
    },
  ];

  if (guild.members.me) {
    overwrites.push({
      id: guild.members.me.id,
      type: OverwriteType.Member,
      allow: OWNER_SEND_PERMS,
    });
  }

  if (botRole) {
    overwrites.push({
      id: botRole.id,
      type: OverwriteType.Role,
      allow: OWNER_SEND_PERMS,
    });
  }

  if (ownerRole) {
    overwrites.push({
      id: ownerRole.id,
      type: OverwriteType.Role,
      allow: OWNER_SEND_PERMS,
    });
  }

  if (profile === "team") {
    if (adminRole) {
      overwrites.push({
        id: adminRole.id,
        type: OverwriteType.Role,
        allow: TEAM_SEND_PERMS,
      });
    }
    if (teamRole) {
      overwrites.push({
        id: teamRole.id,
        type: OverwriteType.Role,
        allow: TEAM_SEND_PERMS,
      });
    }
    if (viewerRole) {
      overwrites.push({
        id: viewerRole.id,
        type: OverwriteType.Role,
        allow: READ_ONLY_PERMS,
      });
    }
  }

  if (profile === "readonly") {
    if (adminRole) {
      overwrites.push({
        id: adminRole.id,
        type: OverwriteType.Role,
        allow: READ_ONLY_PERMS,
      });
    }
    if (teamRole) {
      overwrites.push({
        id: teamRole.id,
        type: OverwriteType.Role,
        allow: READ_ONLY_PERMS,
      });
    }
    if (viewerRole) {
      overwrites.push({
        id: viewerRole.id,
        type: OverwriteType.Role,
        allow: READ_ONLY_PERMS,
      });
    }
  }

  return overwrites;
}
