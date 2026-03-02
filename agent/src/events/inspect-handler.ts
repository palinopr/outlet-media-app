/**
 * inspect-handler.ts -- On-demand agent internals inspector.
 *
 * Replaces discord-config.ts. Instead of 12 always-on channels,
 * provides a single #agent-internals channel where users can
 * inspect any agent's memory, skills, or prompt on demand.
 *
 * Usage (in #agent-internals):
 *   inspect boss memory
 *   inspect media-buyer skills
 *   inspect creative prompt
 *   inspect all          -- lists all agents with brief status
 */

import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { existsSync } from "node:fs";
import {
  EmbedBuilder,
  type Message,
  type TextChannel,
} from "discord.js";
import { AGENT_INTERNALS } from "../discord/core/router.js";

const AGENT_DIR = process.cwd();
const INTERNALS_CHANNEL = "agent-internals";

/**
 * Handle an inspect command in #agent-internals.
 * Returns true if the message was handled, false otherwise.
 */
export async function handleInspectCommand(
  msg: Message,
  content: string,
): Promise<boolean> {
  const channelName =
    "name" in msg.channel ? (msg.channel as TextChannel).name : "";
  if (channelName !== INTERNALS_CHANNEL) return false;

  const lower = content.toLowerCase().trim();

  // "inspect all" -- list all agents
  if (lower === "inspect all" || lower === "!inspect" || lower === "inspect") {
    await listAllAgents(msg);
    return true;
  }

  // "inspect <agent> <category>"
  const match = lower.match(/^inspect\s+([\w-]+)\s+(memory|skills|prompt)$/);
  if (match) {
    const agentKey = match[1];
    const category = match[2] as "memory" | "skills" | "prompt";
    await inspectAgent(msg, agentKey, category);
    return true;
  }

  // "inspect <agent>" -- show all categories
  const agentMatch = lower.match(/^inspect\s+([\w-]+)$/);
  if (agentMatch) {
    const agentKey = agentMatch[1];
    await inspectAgentOverview(msg, agentKey);
    return true;
  }

  return false;
}

/**
 * List all agents with brief status.
 */
async function listAllAgents(msg: Message): Promise<void> {
  const embed = new EmbedBuilder()
    .setTitle("Agent Internals")
    .setColor(0x5865f2)
    .setDescription(
      "Use `inspect <agent> <memory|skills|prompt>` to view details.",
    )
    .setTimestamp();

  for (const [key, agent] of Object.entries(AGENT_INTERNALS)) {
    const memoryPath = join(AGENT_DIR, agent.memoryFile);
    const skillsDir = join(AGENT_DIR, agent.skillsDir);

    let memorySize = "--";
    try {
      if (existsSync(memoryPath)) {
        const s = await stat(memoryPath);
        memorySize = `${Math.round(s.size / 1024)}KB`;
      }
    } catch {
      /* ignore */
    }

    let skillCount = 0;
    try {
      if (existsSync(skillsDir)) {
        const files = await readdir(skillsDir);
        skillCount = files.filter((f) => f.endsWith(".md")).length;
      }
    } catch {
      /* ignore */
    }

    embed.addFields({
      name: `${agent.name} (${key})`,
      value: `Memory: ${memorySize} | Skills: ${skillCount} | Prompt: ${agent.promptFile}.txt`,
      inline: false,
    });
  }

  await msg.reply({ embeds: [embed] });
}

/**
 * Show overview for a specific agent (all categories).
 */
async function inspectAgentOverview(
  msg: Message,
  agentKey: string,
): Promise<void> {
  const agent = AGENT_INTERNALS[agentKey];
  if (!agent) {
    await msg.reply(
      `Unknown agent: ${agentKey}. Use \`inspect all\` to see available agents.`,
    );
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle(`${agent.name} -- Overview`)
    .setColor(0x5865f2)
    .setTimestamp();

  // Memory preview
  const memoryPath = join(AGENT_DIR, agent.memoryFile);
  try {
    if (existsSync(memoryPath)) {
      const raw = await readFile(memoryPath, "utf-8");
      const lines = raw.split("\n").length;
      const size = Math.round(raw.length / 1024);
      embed.addFields({
        name: "Memory",
        value: `${lines} lines, ${size}KB -- \`inspect ${agentKey} memory\` for full content`,
        inline: false,
      });
    } else {
      embed.addFields({
        name: "Memory",
        value: "No memory file",
        inline: false,
      });
    }
  } catch {
    embed.addFields({
      name: "Memory",
      value: "Error reading memory",
      inline: false,
    });
  }

  // Skills list
  const skillsDir = join(AGENT_DIR, agent.skillsDir);
  try {
    if (existsSync(skillsDir)) {
      const files = await readdir(skillsDir);
      const skills = files.filter((f) => f.endsWith(".md"));
      embed.addFields({
        name: "Skills",
        value:
          skills.length > 0
            ? skills.map((s) => `\`${s}\``).join(", ")
            : "No skills yet",
        inline: false,
      });
    } else {
      embed.addFields({
        name: "Skills",
        value: "No skills directory",
        inline: false,
      });
    }
  } catch {
    embed.addFields({
      name: "Skills",
      value: "Error reading skills",
      inline: false,
    });
  }

  // Tools
  embed.addFields({
    name: "Tools",
    value: agent.tools.join(", "),
    inline: false,
  });

  await msg.reply({ embeds: [embed] });
}

/**
 * Inspect a specific category for an agent.
 */
async function inspectAgent(
  msg: Message,
  agentKey: string,
  category: "memory" | "skills" | "prompt",
): Promise<void> {
  const agent = AGENT_INTERNALS[agentKey];
  if (!agent) {
    await msg.reply(
      `Unknown agent: ${agentKey}. Use \`inspect all\` to see available agents.`,
    );
    return;
  }

  switch (category) {
    case "memory":
      await inspectMemory(msg, agent.name, join(AGENT_DIR, agent.memoryFile));
      break;
    case "skills":
      await inspectSkills(msg, agent.name, join(AGENT_DIR, agent.skillsDir));
      break;
    case "prompt":
      await inspectPrompt(msg, agent.name, agent.promptFile);
      break;
  }
}

/**
 * Show agent memory content as embed.
 */
async function inspectMemory(
  msg: Message,
  agentName: string,
  filePath: string,
): Promise<void> {
  try {
    if (!existsSync(filePath)) {
      await msg.reply(`${agentName} has no memory file.`);
      return;
    }

    const raw = await readFile(filePath, "utf-8");
    const truncated = raw.slice(0, 4000);

    const embed = new EmbedBuilder()
      .setTitle(`${agentName} -- Memory`)
      .setColor(0x4caf50)
      .setDescription(`\`\`\`md\n${truncated}\n\`\`\``)
      .setTimestamp();

    if (raw.length > 4000) {
      embed.setFooter({
        text: `Showing first 4000 of ${raw.length} characters`,
      });
    }

    await msg.reply({ embeds: [embed] });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    await msg.reply(`Error reading memory: ${errMsg}`);
  }
}

/**
 * Show agent skills as embed.
 */
async function inspectSkills(
  msg: Message,
  agentName: string,
  dirPath: string,
): Promise<void> {
  try {
    if (!existsSync(dirPath)) {
      await msg.reply(`${agentName} has no skills directory.`);
      return;
    }

    const files = await readdir(dirPath);
    const skills = files.filter((f) => f.endsWith(".md"));

    if (skills.length === 0) {
      await msg.reply(`${agentName} has no skills yet.`);
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(`${agentName} -- Skills (${skills.length})`)
      .setColor(0xff9800)
      .setTimestamp();

    for (const skill of skills.slice(0, 10)) {
      try {
        const raw = await readFile(join(dirPath, skill), "utf-8");
        const preview = raw.slice(0, 200).replace(/\n/g, " ");
        embed.addFields({
          name: skill.replace(".md", ""),
          value: preview || "(empty)",
          inline: false,
        });
      } catch {
        embed.addFields({
          name: skill,
          value: "Error reading skill",
          inline: false,
        });
      }
    }

    if (skills.length > 10) {
      embed.setFooter({ text: `Showing 10 of ${skills.length} skills` });
    }

    await msg.reply({ embeds: [embed] });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    await msg.reply(`Error reading skills: ${errMsg}`);
  }
}

/**
 * Show agent prompt as embed.
 */
async function inspectPrompt(
  msg: Message,
  agentName: string,
  promptFile: string,
): Promise<void> {
  try {
    const filePath = join(AGENT_DIR, "prompts", `${promptFile}.txt`);
    if (!existsSync(filePath)) {
      await msg.reply(
        `${agentName} has no prompt file (${promptFile}.txt).`,
      );
      return;
    }

    const raw = await readFile(filePath, "utf-8");
    const truncated = raw.slice(0, 4000);

    const embed = new EmbedBuilder()
      .setTitle(`${agentName} -- Prompt`)
      .setColor(0x2196f3)
      .setDescription(`\`\`\`\n${truncated}\n\`\`\``)
      .setTimestamp();

    if (raw.length > 4000) {
      embed.setFooter({
        text: `Showing first 4000 of ${raw.length} characters`,
      });
    }

    await msg.reply({ embeds: [embed] });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    await msg.reply(`Error reading prompt: ${errMsg}`);
  }
}
