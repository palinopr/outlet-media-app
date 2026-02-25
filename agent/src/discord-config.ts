/**
 * discord-config.ts -- Control Room: agent config channels.
 *
 * Each agent has a cfg-* channel in the "Control Room" category.
 * These channels display:
 *   1. Embed overview: agent name, prompt file, line count, sections, skills
 *   2. Prompt file attached as .txt
 *   3. MEMORY.md relevant sections
 *   4. Skills directory listing
 *
 * When a prompt file changes, the update is posted to the channel.
 * Boss can read these to supervise all agents.
 */

import { readFile, readdir, stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import {
  type Client,
  type TextChannel,
  EmbedBuilder,
  AttachmentBuilder,
} from "discord.js";
import { CONFIG_CHANNELS, type ConfigChannelInfo } from "./discord-router.js";

const AGENT_DIR = resolve(".");
const PROMPTS_DIR = join(AGENT_DIR, "prompts");
const SKILLS_DIR = join(AGENT_DIR, "skills");
const MEMORY_FILE = join(AGENT_DIR, "MEMORY.md");
const LEARNINGS_FILE = join(AGENT_DIR, "LEARNINGS.md");

// Track file hashes for change detection
const promptHashes = new Map<string, string>();

/** Simple hash for change detection (not crypto, just comparison) */
function quickHash(content: string): string {
  let h = 0;
  for (let i = 0; i < content.length; i++) {
    h = ((h << 5) - h + content.charCodeAt(i)) | 0;
  }
  return h.toString(36);
}

/** Read a file safely, return null on error */
async function safeRead(path: string): Promise<string | null> {
  try {
    return await readFile(path, "utf-8");
  } catch {
    return null;
  }
}

/** List files in a directory safely */
async function safeReaddir(path: string): Promise<string[]> {
  try {
    return await readdir(path);
  } catch {
    return [];
  }
}

/** Get file modification time */
async function fileMtime(path: string): Promise<Date | null> {
  try {
    const s = await stat(path);
    return s.mtime;
  } catch {
    return null;
  }
}

/** Extract section headers (## lines) from a prompt file */
function extractSections(content: string): string[] {
  return content
    .split("\n")
    .filter((line) => /^##\s/.test(line))
    .map((line) => line.replace(/^##\s+/, "").trim());
}

/** Count lines in content */
function lineCount(content: string): number {
  return content.split("\n").length;
}

/** Find skills files relevant to an agent (by prefix or general) */
async function findAgentSkills(promptFile: string): Promise<string[]> {
  const allFiles = await safeReaddir(SKILLS_DIR);
  return allFiles.filter(
    (f) =>
      f.endsWith(".md") &&
      f !== ".gitkeep" &&
      (f.startsWith(promptFile) || f.startsWith("general")),
  );
}

/**
 * Build the embed + attachments for one agent's config channel.
 */
async function buildAgentConfig(
  info: ConfigChannelInfo,
): Promise<{ embed: EmbedBuilder; files: AttachmentBuilder[] }> {
  const promptPath = join(PROMPTS_DIR, `${info.promptFile}.txt`);
  const promptContent = await safeRead(promptPath);
  const memoryContent = await safeRead(MEMORY_FILE);
  const learningsContent = await safeRead(LEARNINGS_FILE);
  const skills = await findAgentSkills(info.promptFile);
  const promptMtime = await fileMtime(promptPath);
  const memoryMtime = await fileMtime(MEMORY_FILE);

  const lines = promptContent ? lineCount(promptContent) : 0;
  const sections = promptContent ? extractSections(promptContent) : [];

  // Build the overview embed
  const embed = new EmbedBuilder()
    .setTitle(`${info.agentName} -- Agent Config`)
    .setColor(0xfdd835)
    .setDescription(
      `Work channel: ${info.workChannel ? `#${info.workChannel}` : "none"}\n` +
        `Prompt: \`prompts/${info.promptFile}.txt\` (${lines} lines)\n` +
        `Last updated: ${promptMtime ? promptMtime.toISOString().split("T")[0] : "unknown"}`,
    )
    .addFields(
      {
        name: "Sections",
        value:
          sections.length > 0
            ? sections.map((s) => `- ${s}`).join("\n")
            : "No sections found",
        inline: false,
      },
      {
        name: "Skills",
        value:
          skills.length > 0
            ? skills.map((s) => `- \`${s}\``).join("\n")
            : "No skills yet -- agent will create them as it learns",
        inline: false,
      },
      {
        name: "Shared Files",
        value:
          `- MEMORY.md (${memoryContent ? lineCount(memoryContent) : 0} lines, ` +
          `updated ${memoryMtime ? memoryMtime.toISOString().split("T")[0] : "never"})\n` +
          `- LEARNINGS.md (${learningsContent ? lineCount(learningsContent) : 0} lines)`,
        inline: false,
      },
    )
    .setFooter({
      text: "Boss can modify this agent by posting instructions here",
    });

  // Attach the prompt file
  const files: AttachmentBuilder[] = [];
  if (promptContent) {
    files.push(
      new AttachmentBuilder(Buffer.from(promptContent, "utf-8"), {
        name: `${info.promptFile}.txt`,
        description: `${info.agentName} prompt file (${lines} lines)`,
      }),
    );
  }

  return { embed, files };
}

/**
 * Resolve a config channel by name from the guild.
 */
function resolveConfigChannel(
  client: Client,
  channelName: string,
): TextChannel | null {
  const guild = client.guilds.cache.first();
  if (!guild) return null;

  const ch = guild.channels.cache.find(
    (c) => c.name === channelName && c.isTextBased(),
  );
  return (ch as TextChannel) ?? null;
}

/**
 * Deploy all agent configs to their Control Room channels.
 * Clears existing messages and posts fresh embed + file.
 *
 * Called by !deploy-configs command.
 */
export async function deployAllConfigs(client: Client): Promise<string> {
  const results: string[] = [];

  for (const [channelName, info] of Object.entries(CONFIG_CHANNELS)) {
    const channel = resolveConfigChannel(client, channelName);
    if (!channel) {
      results.push(`#${channelName}: channel not found (run !restructure first)`);
      continue;
    }

    try {
      // Clear previous config messages from the bot
      const messages = await channel.messages.fetch({ limit: 50 });
      const botMessages = messages.filter((m) => m.author.id === client.user?.id);
      for (const [, msg] of botMessages) {
        await msg.delete().catch(() => {});
      }

      // Build and post new config
      const { embed, files } = await buildAgentConfig(info);
      await channel.send({ embeds: [embed], files });

      // Store hash for change detection
      const promptPath = join(PROMPTS_DIR, `${info.promptFile}.txt`);
      const content = await safeRead(promptPath);
      if (content) {
        promptHashes.set(info.promptFile, quickHash(content));
      }

      results.push(`#${channelName}: deployed`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      results.push(`#${channelName}: error -- ${msg}`);
    }
  }

  return results.join("\n");
}

/**
 * Deploy config for a single agent to its channel.
 */
export async function deploySingleConfig(
  client: Client,
  channelName: string,
): Promise<string> {
  const info = CONFIG_CHANNELS[channelName];
  if (!info) return `Unknown config channel: ${channelName}`;

  const channel = resolveConfigChannel(client, channelName);
  if (!channel) return `#${channelName}: channel not found`;

  try {
    const messages = await channel.messages.fetch({ limit: 50 });
    const botMessages = messages.filter((m) => m.author.id === client.user?.id);
    for (const [, msg] of botMessages) {
      await msg.delete().catch(() => {});
    }

    const { embed, files } = await buildAgentConfig(info);
    await channel.send({ embeds: [embed], files });

    const promptPath = join(PROMPTS_DIR, `${info.promptFile}.txt`);
    const content = await safeRead(promptPath);
    if (content) {
      promptHashes.set(info.promptFile, quickHash(content));
    }

    return `#${channelName}: deployed`;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return `#${channelName}: error -- ${msg}`;
  }
}

/**
 * Check all prompt files for changes since last deploy.
 * If changed, post an update notification to the config channel.
 *
 * Called periodically (e.g., every 5 minutes) or after agent self-improvement.
 */
export async function checkForConfigChanges(client: Client): Promise<void> {
  for (const [channelName, info] of Object.entries(CONFIG_CHANNELS)) {
    const promptPath = join(PROMPTS_DIR, `${info.promptFile}.txt`);
    const content = await safeRead(promptPath);
    if (!content) continue;

    const currentHash = quickHash(content);
    const previousHash = promptHashes.get(info.promptFile);

    // Skip if no previous hash (not yet deployed) or unchanged
    if (!previousHash || currentHash === previousHash) continue;

    // File changed -- post update
    const channel = resolveConfigChannel(client, channelName);
    if (!channel) continue;

    const lines = lineCount(content);
    const sections = extractSections(content);
    const mtime = await fileMtime(promptPath);

    const updateEmbed = new EmbedBuilder()
      .setTitle(`${info.agentName} -- Prompt Updated`)
      .setColor(0x4caf50)
      .setDescription(
        `\`prompts/${info.promptFile}.txt\` was modified\n` +
          `Lines: ${lines}\n` +
          `Updated: ${mtime ? mtime.toISOString() : "now"}`,
      )
      .addFields({
        name: "Current Sections",
        value: sections.map((s) => `- ${s}`).join("\n") || "none",
        inline: false,
      });

    const attachment = new AttachmentBuilder(Buffer.from(content, "utf-8"), {
      name: `${info.promptFile}.txt`,
      description: `Updated prompt (${lines} lines)`,
    });

    await channel
      .send({ embeds: [updateEmbed], files: [attachment] })
      .catch(() => {});
    promptHashes.set(info.promptFile, currentHash);
  }
}
