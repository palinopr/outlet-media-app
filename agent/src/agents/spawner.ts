/**
 * spawner.ts -- Dynamic agent creation.
 *
 * When a Red-tier "spawn-agent" task is approved, provisions
 * everything a new agent needs: prompt, memory, skills dir,
 * Discord channel, webhook, and router registration.
 */

import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { existsSync } from "node:fs";
import {
  type Client,
  type Guild,
  ChannelType,
  type CategoryChannel,
  EmbedBuilder,
} from "discord.js";
import { taskEvents, type AgentTask } from "../services/queue-service.js";
import { registerAgentWebhook } from "../services/webhook-service.js";
import { sendAsAgent } from "../services/webhook-service.js";

const AGENT_DIR = process.cwd();

interface SpawnSpec {
  /** Agent key (kebab-case, e.g., "seo-agent") */
  key: string;
  /** Display name (e.g., "SEO Agent") */
  name: string;
  /** Avatar URL */
  avatar?: string;
  /** Agent description / purpose */
  description: string;
  /** Initial system prompt content */
  prompt: string;
  /** Channel topic */
  topic?: string;
}

/** Default avatar for spawned agents */
const DEFAULT_AVATAR = "https://i.imgur.com/LqJHpGH.png";

let discordClient: Client | null = null;

/**
 * Initialize spawner. Listens for approved spawn-agent tasks.
 */
export function initSpawner(client: Client): void {
  discordClient = client;

  taskEvents.on("approved", (task: AgentTask) => {
    if (task.action === "spawn-agent") {
      const spec = task.params as unknown as SpawnSpec;
      if (spec.key && spec.name && spec.description) {
        spawnAgent(spec).catch(err => {
          console.error("[spawner] Failed to spawn agent:", err);
        });
      }
    }
  });

  console.log("[spawner] Agent spawner initialized");
}

/**
 * Spawn a new agent. Creates all required files and Discord resources.
 */
export async function spawnAgent(spec: SpawnSpec): Promise<void> {
  const { notifyChannel } = await import("../discord.js");
  const log: string[] = [];

  try {
    // 1. Create prompt file
    const promptPath = join(AGENT_DIR, "prompts", `${spec.key}.txt`);
    if (!existsSync(promptPath)) {
      const promptContent = spec.prompt || buildDefaultPrompt(spec);
      await writeFile(promptPath, promptContent, "utf-8");
      log.push(`Created prompt: prompts/${spec.key}.txt`);
    } else {
      log.push(`Prompt already exists: prompts/${spec.key}.txt`);
    }

    // 2. Create memory file
    const memoryPath = join(AGENT_DIR, "memory", `${spec.key}.md`);
    if (!existsSync(memoryPath)) {
      const memoryContent = `# ${spec.name} Memory\n\nCreated: ${new Date().toISOString()}\nPurpose: ${spec.description}\n\n## Learnings\n\n(none yet)\n`;
      await writeFile(memoryPath, memoryContent, "utf-8");
      log.push(`Created memory: memory/${spec.key}.md`);
    }

    // 3. Create skills directory
    const skillsDir = join(AGENT_DIR, "skills", spec.key);
    if (!existsSync(skillsDir)) {
      await mkdir(skillsDir, { recursive: true });
      await writeFile(join(skillsDir, ".gitkeep"), "", "utf-8");
      log.push(`Created skills dir: skills/${spec.key}/`);
    }

    // 4. Create Discord channel
    if (discordClient) {
      const guild = discordClient.guilds.cache.first();
      if (guild) {
        await createAgentChannel(guild, spec, log);
      }
    }

    // 5. Register webhook
    const avatar = spec.avatar || DEFAULT_AVATAR;
    await registerAgentWebhook(spec.key, spec.name, avatar, [spec.key]);
    log.push(`Registered webhook for ${spec.name}`);

    // 6. Post introduction to #agent-feed
    const intro = new EmbedBuilder()
      .setTitle(`New Agent: ${spec.name}`)
      .setColor(0x4caf50)
      .setDescription(spec.description)
      .addFields(
        { name: "Channel", value: `#${spec.key}`, inline: true },
        { name: "Key", value: spec.key, inline: true },
      )
      .setTimestamp()
      .setFooter({ text: "Agent spawned by Boss" });

    await sendAsAgent("boss", "agent-feed", { embeds: [intro] }).catch(() => {
      notifyChannel("agent-feed", `**New Agent**: ${spec.name} -- ${spec.description}`).catch(() => {});
    });

    // Log to audit
    await notifyChannel("audit-log",
      `Agent spawned: **${spec.name}** (${spec.key})\n${log.map(l => `- ${l}`).join("\n")}`
    ).catch(() => {});

    console.log(`[spawner] Agent ${spec.name} spawned successfully`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[spawner] Failed to spawn ${spec.key}:`, msg);
    await notifyChannel("ops", `**Spawn Failed**: ${spec.key} -- ${msg}`).catch(() => {});
    throw err;
  }
}

/**
 * Create a Discord category + channel for the new agent.
 */
async function createAgentChannel(
  guild: Guild,
  spec: SpawnSpec,
  log: string[],
): Promise<void> {
  // Check if channel already exists
  const existing = guild.channels.cache.find(c => c.name === spec.key);
  if (existing) {
    log.push(`Channel #${spec.key} already exists`);
    return;
  }

  // Create category
  let category = guild.channels.cache.find(
    c => c.name === spec.name && c.type === ChannelType.GuildCategory
  ) as CategoryChannel | undefined;

  if (!category) {
    category = await guild.channels.create({
      name: spec.name,
      type: ChannelType.GuildCategory,
    }) as CategoryChannel;
    log.push(`Created category: ${spec.name}`);
  }

  // Create work channel
  await guild.channels.create({
    name: spec.key,
    type: ChannelType.GuildText,
    parent: category.id,
    topic: spec.topic || `${spec.name} -- ${spec.description}`,
  });
  log.push(`Created channel: #${spec.key}`);
}

/**
 * Build a default prompt for a new agent.
 */
function buildDefaultPrompt(spec: SpawnSpec): string {
  return `You are ${spec.name}, an agent for Outlet Media -- a music promotion media buying agency.

${spec.description}

## Your Identity
- Name: ${spec.name}
- Key: ${spec.key}
- Role: ${spec.description}

## Tools
- **Bash** -- curl commands for APIs
- **Read / Write** -- files in the agent/ directory

## Rules
- Be concise and action-oriented
- Report results to your channel
- Delegate tasks you can't handle by outputting a JSON block:
\`\`\`json
{"delegate": "agent-name", "action": "action-name", "params": {...}}
\`\`\`

## Memory
Read your memory file at memory/${spec.key}.md for persistent context.
Update it when you learn something important.
`;
}
