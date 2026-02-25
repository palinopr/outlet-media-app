/**
 * discord-commands.ts -- Slash command handlers for the Discord admin bot.
 *
 * Each handler is called from the interactionCreate event in discord-admin.ts.
 * Most are Claude-powered: they build a prompt with server data and let Claude respond.
 */

import {
  type Interaction,
  type TextChannel,
  type CategoryChannel,
  ChannelType,
} from "discord.js";

// These are injected at init time from discord-admin.ts to avoid circular deps
let _guild: import("discord.js").Guild | null = null;
let _channelActivity: Map<string, { messages: number; lastActive: number }>;
let _getServerSnapshot: () => Promise<Record<string, unknown>>;
let _runClaudeForDiscord: (prompt: string, forChannelId?: string) => Promise<string>;
let _runServerRestructure: () => Promise<string>;
let _logAction: (text: string) => Promise<void>;
let _chunkText: (text: string, maxLen: number) => string[];

export function initCommandHandlers(deps: {
  guild: typeof _guild;
  channelActivity: typeof _channelActivity;
  getServerSnapshot: typeof _getServerSnapshot;
  runClaudeForDiscord: typeof _runClaudeForDiscord;
  runServerRestructure: typeof _runServerRestructure;
  logAction: typeof _logAction;
  chunkText: typeof _chunkText;
}): void {
  _guild = deps.guild;
  _channelActivity = deps.channelActivity;
  _getServerSnapshot = deps.getServerSnapshot;
  _runClaudeForDiscord = deps.runClaudeForDiscord;
  _runServerRestructure = deps.runServerRestructure;
  _logAction = deps.logAction;
  _chunkText = deps.chunkText;
}

/** Update guild reference (called if guild changes). */
export function setGuild(g: import("discord.js").Guild | null): void {
  _guild = g;
}

// ─── Handlers ───────────────────────────────────────────────────────────────

export async function handleReport(
  interaction: Interaction & { editReply: Function; channelId: string },
): Promise<void> {
  const snapshot = await _getServerSnapshot();
  const prompt =
    `Generate a server health report for this Discord server. Be concise and actionable.\n\n` +
    `Server data:\n${JSON.stringify(snapshot, null, 2)}`;

  const result = await _runClaudeForDiscord(prompt, interaction.channelId);
  await interaction.editReply(result.slice(0, 2000));
}

export async function handleOptimize(
  interaction: Interaction & { editReply: Function; channelId: string },
): Promise<void> {
  const snapshot = await _getServerSnapshot();
  const prompt =
    `Analyze this Discord server and make improvements. You have full permission to act.\n\n` +
    `Server data:\n${JSON.stringify(snapshot, null, 2)}\n\n` +
    `Suggest and describe what changes should be made. Focus on:\n` +
    `1. Dead channels that should be archived\n` +
    `2. Missing channels that would help the team\n` +
    `3. Role structure improvements\n` +
    `4. Channel organization (categories)\n` +
    `Be specific with channel names and actions.`;

  const result = await _runClaudeForDiscord(prompt, interaction.channelId);
  await interaction.editReply(result.slice(0, 2000));
}

export async function handleCleanup(
  interaction: Interaction & {
    editReply: Function;
    channelId: string;
    options: { getInteger: Function };
  },
): Promise<void> {
  const days = interaction.options.getInteger("days") ?? 30;
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

  if (!_guild) {
    await interaction.editReply("Guild not found.");
    return;
  }

  const deadChannels: string[] = [];
  const textChannels = _guild.channels.cache.filter(
    c => c.type === ChannelType.GuildText,
  );

  for (const [, ch] of textChannels) {
    const textCh = ch as TextChannel;
    const activity = _channelActivity.get(ch.id);
    if (activity && activity.lastActive < cutoff) {
      deadChannels.push(textCh.name);
    } else if (!activity) {
      try {
        const msgs = await textCh.messages.fetch({ limit: 1 });
        const lastMsg = msgs.first();
        if (!lastMsg || lastMsg.createdTimestamp < cutoff) {
          deadChannels.push(textCh.name);
        }
      } catch {
        // Can't fetch messages
      }
    }
  }

  if (deadChannels.length === 0) {
    await interaction.editReply(`No channels inactive for ${days}+ days. Server looks healthy.`);
    return;
  }

  const prompt =
    `These Discord channels have been inactive for ${days}+ days:\n` +
    deadChannels.map(n => `- #${n}`).join("\n") +
    "\n\n" +
    `For each channel, recommend: archive, delete, or keep. Explain briefly.`;

  const result = await _runClaudeForDiscord(prompt, interaction.channelId);
  await interaction.editReply(result.slice(0, 2000));
}

export async function handleRoles(
  interaction: Interaction & { editReply: Function; channelId: string },
): Promise<void> {
  if (!_guild) {
    await interaction.editReply("Guild not found.");
    return;
  }

  const roles = _guild.roles.cache
    .filter(r => r.name !== "@everyone")
    .map(r => ({
      name: r.name,
      color: r.hexColor,
      members: r.members.size,
      permissions: r.permissions.toArray().slice(0, 5),
      position: r.position,
    }))
    .sort((a, b) => b.position - a.position);

  const prompt =
    `Analyze this Discord server's role structure and suggest improvements.\n\n` +
    `Roles:\n${JSON.stringify(roles, null, 2)}\n\n` +
    `Consider: Are there redundant roles? Missing roles? Should permissions be adjusted?`;

  const result = await _runClaudeForDiscord(prompt, interaction.channelId);
  await interaction.editReply(result.slice(0, 2000));
}

export async function handleChannelCommand(
  interaction: Interaction & { editReply: Function; options: { getString: Function } },
): Promise<void> {
  if (!_guild) {
    await interaction.editReply("Guild not found.");
    return;
  }

  const action = interaction.options.getString("action") as string;
  const name = interaction.options.getString("name") as string;

  switch (action) {
    case "create": {
      const channel = await _guild.channels.create({
        name,
        type: ChannelType.GuildText,
      });
      await _logAction(`Created channel #${name} (requested via /channel)`);
      await interaction.editReply(`Created #${channel.name}`);
      break;
    }
    case "archive": {
      const target = _guild.channels.cache.find(
        c => c.name === name && c.type === ChannelType.GuildText,
      );
      if (!target) {
        await interaction.editReply(`Channel #${name} not found.`);
        return;
      }
      let archive = _guild.channels.cache.find(
        c => c.name === "Archive" && c.type === ChannelType.GuildCategory,
      ) as CategoryChannel | undefined;

      if (!archive) {
        archive = (await _guild.channels.create({
          name: "Archive",
          type: ChannelType.GuildCategory,
        })) as CategoryChannel;
      }

      await (target as TextChannel).setParent(archive.id);
      await (target as TextChannel).permissionOverwrites.create(_guild.roles.everyone, {
        SendMessages: false,
      });
      await _logAction(`Archived channel #${name} (requested via /channel)`);
      await interaction.editReply(`Archived #${name} -- moved to Archive category, locked.`);
      break;
    }
    case "rename": {
      await interaction.editReply(
        `To rename a channel, use: \`/ask rename #old-name to ${name}\` and I'll handle it.`,
      );
      break;
    }
  }
}

export async function handleAsk(
  interaction: Interaction & {
    editReply: Function;
    channelId: string;
    options: { getString: Function };
  },
): Promise<void> {
  const question = interaction.options.getString("question") as string;
  const snapshot = await _getServerSnapshot();

  const prompt =
    `The user asked about this Discord server: "${question}"\n\n` +
    `Server data:\n${JSON.stringify(snapshot, null, 2)}\n\n` +
    `Answer concisely. If the question requires an action, describe what you would do.`;

  const result = await _runClaudeForDiscord(prompt, interaction.channelId);
  await interaction.editReply(result.slice(0, 2000));
}

export async function handleRestructure(
  interaction: Interaction & { editReply: Function },
): Promise<void> {
  try {
    const result = await _runServerRestructure();
    const chunks = _chunkText(result, 1900);
    await interaction.editReply(chunks[0] || "Done -- no changes needed.");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await interaction.editReply(`Restructure failed: ${msg}`);
  }
}
