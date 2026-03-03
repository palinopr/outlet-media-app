/**
 * discord-config.ts -- Agent internals deployment.
 *
 * Each agent has memory + skills channels in its category.
 * This module syncs agent memory files and skills directories
 * to their corresponding Discord channels as rich embeds.
 *
 * Memory channels show: the agent's memory file content
 * Skills channels show: prompt overview, skills files, tools list
 *
 * Triggered by: !deploy-internals command
 */

import { readFile, readdir, stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import {
  type Client,
  type TextChannel,
  EmbedBuilder,
  AttachmentBuilder,
} from "discord.js";
import { AGENT_INTERNALS, type AgentInternals } from "./router.js";
import { chunkText } from "../../events/message-handler.js";

const AGENT_DIR = resolve(".");
const PROMPTS_DIR = join(AGENT_DIR, "prompts");

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
    const entries = await readdir(path);
    return entries.filter(f => f !== ".gitkeep");
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

/** Count lines in content */
function lineCount(content: string): number {
  return content.split("\n").length;
}

/** Extract ## section headers from markdown */
function extractSections(content: string): string[] {
  return content
    .split("\n")
    .filter(line => /^##\s/.test(line))
    .map(line => line.replace(/^##\s+/, "").trim());
}

/**
 * Find a text channel by name in the guild.
 */
function findChannel(client: Client, channelName: string): TextChannel | null {
  const guild = client.guilds.cache.first();
  if (!guild) return null;
  const ch = guild.channels.cache.find(
    c => c.name === channelName && c.isTextBased()
  );
  return (ch as TextChannel) ?? null;
}

/**
 * Clear bot messages from a channel (up to 50).
 */
async function clearBotMessages(channel: TextChannel, botId: string): Promise<void> {
  const messages = await channel.messages.fetch({ limit: 50 });
  const botMessages = messages.filter(m => m.author.id === botId);
  for (const [, msg] of botMessages) {
    await msg.delete().catch(() => {});
  }
}

// --- Memory Channel Deployment -------------------------------------------

/**
 * Deploy an agent's memory to its memory channel.
 * Posts the memory file content as an embed + raw .md attachment.
 */
async function deployMemory(
  client: Client,
  agent: AgentInternals,
): Promise<string> {
  const channel = findChannel(client, agent.memoryChannel);
  if (!channel) return `#${agent.memoryChannel}: not found`;

  const memoryPath = join(AGENT_DIR, agent.memoryFile);
  const content = await safeRead(memoryPath);
  const mtime = await fileMtime(memoryPath);

  if (!content) {
    return `#${agent.memoryChannel}: no memory file (${agent.memoryFile})`;
  }

  const botId = client.user?.id ?? "";
  await clearBotMessages(channel, botId);

  const sections = extractSections(content);
  const lines = lineCount(content);

  const embed = new EmbedBuilder()
    .setTitle(`${agent.name} -- Memory`)
    .setColor(0x42a5f5)
    .setDescription(
      `Source: \`${agent.memoryFile}\` (${lines} lines)\n` +
      `Updated: ${mtime ? mtime.toISOString().split("T")[0] : "unknown"}`
    )
    .addFields({
      name: "Sections",
      value: sections.length > 0
        ? sections.map(s => `- ${s}`).join("\n")
        : "No sections",
      inline: false,
    });

  // Post the embed
  await channel.send({ embeds: [embed] });

  // Post the memory content in readable chunks
  const readable = content.trim();
  const chunks = chunkText(readable, 1900);
  for (const chunk of chunks) {
    await channel.send(`\`\`\`md\n${chunk}\n\`\`\``);
  }

  // Attach raw file
  const attachment = new AttachmentBuilder(
    Buffer.from(content, "utf-8"),
    { name: agent.memoryFile.split("/").pop() ?? "memory.md" }
  );
  await channel.send({ files: [attachment] });

  return `#${agent.memoryChannel}: deployed (${lines} lines)`;
}

// --- Skills Channel Deployment -------------------------------------------

/**
 * Deploy an agent's skills + prompt overview to its skills channel.
 * Shows: prompt summary, tools list, skills files.
 */
async function deploySkills(
  client: Client,
  agent: AgentInternals,
): Promise<string> {
  const channel = findChannel(client, agent.skillsChannel);
  if (!channel) return `#${agent.skillsChannel}: not found`;

  const botId = client.user?.id ?? "";
  await clearBotMessages(channel, botId);

  // Read prompt file
  const promptPath = join(PROMPTS_DIR, `${agent.promptFile}.txt`);
  const promptContent = await safeRead(promptPath);
  const promptMtime = await fileMtime(promptPath);
  const promptLines = promptContent ? lineCount(promptContent) : 0;
  const promptSections = promptContent ? extractSections(promptContent) : [];

  // Read skills directory
  const skillsPath = join(AGENT_DIR, agent.skillsDir);
  const skillFiles = await safeReaddir(skillsPath);

  // Build embed
  const embed = new EmbedBuilder()
    .setTitle(`${agent.name} -- Skills & Config`)
    .setColor(0xab47bc)
    .setDescription(
      `Prompt: \`prompts/${agent.promptFile}.txt\` (${promptLines} lines)\n` +
      `Updated: ${promptMtime ? promptMtime.toISOString().split("T")[0] : "unknown"}\n` +
      `Skills dir: \`${agent.skillsDir}/\``
    )
    .addFields(
      {
        name: "Tools",
        value: agent.tools.length > 0
          ? agent.tools.map(t => `- ${t}`).join("\n")
          : "No tools configured",
        inline: false,
      },
      {
        name: "Prompt Sections",
        value: promptSections.length > 0
          ? promptSections.map(s => `- ${s}`).join("\n")
          : "No sections found",
        inline: false,
      },
      {
        name: "Learned Skills",
        value: skillFiles.length > 0
          ? skillFiles.map(f => `- \`${f}\``).join("\n")
          : "No skills yet -- agent will create them as it learns",
        inline: false,
      },
    )
    .setFooter({ text: "Agent can add skills autonomously during operation" });

  await channel.send({ embeds: [embed] });

  // Attach prompt file
  if (promptContent) {
    const attachment = new AttachmentBuilder(
      Buffer.from(promptContent, "utf-8"),
      {
        name: `${agent.promptFile}.txt`,
        description: `${agent.name} prompt (${promptLines} lines)`,
      }
    );
    await channel.send({ files: [attachment] });
  }

  // Attach each skill file
  for (const skillFile of skillFiles) {
    const skillContent = await safeRead(join(skillsPath, skillFile));
    if (skillContent) {
      const attachment = new AttachmentBuilder(
        Buffer.from(skillContent, "utf-8"),
        { name: skillFile }
      );
      await channel.send({ files: [attachment] });
    }
  }

  const total = skillFiles.length;
  return `#${agent.skillsChannel}: deployed (${agent.tools.length} tools, ${total} skills)`;
}

// --- Public API -----------------------------------------------------------

/**
 * Deploy all agent internals (memory + skills) to their Discord channels.
 * Called by !deploy-internals command.
 */
export async function deployAllInternals(client: Client): Promise<string> {
  const results: string[] = [];

  for (const [, agent] of Object.entries(AGENT_INTERNALS)) {
    const memResult = await deployMemory(client, agent);
    const skillResult = await deploySkills(client, agent);
    results.push(memResult, skillResult);
  }

  return results.join("\n");
}

/**
 * Deploy internals for a single agent.
 * @param agentKey - key from AGENT_INTERNALS (e.g., "boss", "media-buyer")
 */
export async function deploySingleAgentInternals(
  client: Client,
  agentKey: string,
): Promise<string> {
  const agent = AGENT_INTERNALS[agentKey];
  if (!agent) return `Unknown agent: ${agentKey}`;

  const memResult = await deployMemory(client, agent);
  const skillResult = await deploySkills(client, agent);
  return `${memResult}\n${skillResult}`;
}
