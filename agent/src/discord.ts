/**
 * discord.ts -- Thin Discord router.
 *
 * discord.js handles the WebSocket connection to receive messages.
 * Each channel routes to a specialist agent via discord-router.ts.
 * Claude CLI calls APIs directly (Meta, Discord REST, Supabase) -- no middleman.
 */

import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  MessageFlags,
  Partials,
  type Message,
  type TextChannel,
} from "discord.js";
import { runClaude } from "./runner.js";
import { state } from "./state.js";
import { getAgentForChannel, matchManualTrigger, isConfigChannel, isInternalChannel } from "./discord-router.js";
import { handleScheduleCommand, initScheduleJobs } from "./discord-schedule.js";
import { handleSuperviseCommand } from "./discord-supervisor.js";
import { handleDashboardCommand } from "./discord-dashboard.js";
import { loadAgentMemory } from "./discord-memory.js";

const token = process.env.DISCORD_BOT_TOKEN;
const channelId = process.env.DISCORD_CHANNEL_ID;

export const discordClient = token
  ? new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
      ],
      partials: [Partials.Channel, Partials.Message, Partials.GuildMember],
    })
  : null;

let agentBusy = false;

/** Per-channel processing lock to prevent concurrent agent calls */
const channelLocks = new Set<string>();

/** Timeout for agent Claude calls -- prevents infinite hangs */
const AGENT_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`Agent timed out after ${Math.round(ms / 1000)}s`)),
      ms,
    );
    promise.then(
      (val) => { clearTimeout(timer); resolve(val); },
      (err) => { clearTimeout(timer); reject(err as Error); },
    );
  });
}

/** Per-channel Claude session IDs (kept for !reset command compatibility) */
export const channelSessions = new Map<string, string>();

/**
 * Dedup guard: prevent the same message from being processed twice.
 * This catches edge cases where discord.js fires messageCreate more than once
 * (e.g., reconnection replay, multiple bot instances, etc.).
 */
const processedMessages = new Set<string>();
const MAX_PROCESSED = 500;

function markProcessed(msgId: string): boolean {
  if (processedMessages.has(msgId)) return false; // already seen
  processedMessages.add(msgId);
  if (processedMessages.size > MAX_PROCESSED) {
    const first = processedMessages.values().next().value;
    if (first) processedMessages.delete(first);
  }
  return true; // first time seeing this message
}

function chunkText(text: string, maxLen: number): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + maxLen));
    i += maxLen;
  }
  return chunks;
}

/** Convert Telegram HTML + markdown to Discord-compatible markdown */
function cleanForDiscord(text: string): string {
  return text
    .replace(/<b>([\s\S]*?)<\/b>/g, "**$1**")
    .replace(/<i>([\s\S]*?)<\/i>/g, "*$1*")
    .replace(/<pre>([\s\S]*?)<\/pre>/g, "```\n$1\n```")
    .replace(/<code>([\s\S]*?)<\/code>/g, "`$1`")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<[^>]+>/g, "")
    .replace(/^\|[-:| ]+\|$/gm, "")
    .replace(/^\|(.+)\|$/gm, (_m, row: string) =>
      row.split("|").map((c) => c.trim()).filter(Boolean).join(" - ")
    )
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** How many recent messages to fetch for conversation context */
const HISTORY_DEPTH = 10;

/**
 * Fetch recent channel messages and format as conversation context.
 * Returns a string like:
 *   [conversation history]
 *   palino: What time it ends Camila Houston
 *   META AGENT: Camila Houston ends today at 6:00 PM EST
 *   ---
 *   palino: What's the cap?
 *
 * This gives Claude context about what was just discussed so follow-up
 * questions like "what's the cap?" resolve correctly.
 */
async function buildConversationContext(
  msg: Message,
  currentPrompt: string,
): Promise<string> {
  try {
    const channel = msg.channel as TextChannel;
    // Fetch last N+1 messages (includes the current one we're responding to)
    const fetched = await channel.messages.fetch({ limit: HISTORY_DEPTH + 1 });
    // Sort oldest-first, skip the current message (it's the prompt already)
    const history = [...fetched.values()]
      .reverse()
      .filter(m => m.id !== msg.id)
      .slice(-HISTORY_DEPTH);

    if (history.length === 0) return currentPrompt;

    const lines = history.map(m => {
      const name = m.author.bot ? "META AGENT" : m.author.username;
      const text = m.content.slice(0, 500);
      return `${name}: ${text}`;
    });

    return [
      "[conversation history -- use this for context on follow-up questions]",
      ...lines,
      "---",
      `${msg.author.username}: ${currentPrompt}`,
    ].join("\n");
  } catch {
    // If fetch fails, just use the raw prompt
    return currentPrompt;
  }
}

/**
 * Route a message to the correct agent and handle the response.
 */
async function handleMessage(
  msg: Message,
  prompt: string,
  channelName: string,
) {
  if (agentBusy || state.jobRunning || state.thinkRunning || state.discordAdminRunning) {
    await msg.reply("Agent is busy. Try again in a moment.");
    return;
  }

  const agent = getAgentForChannel(channelName);

  // Read-only channels don't get agent responses
  if (agent.readOnly) return;

  agentBusy = true;
  state.discordAdminRunning = true;
  channelLocks.add(msg.channelId);

  const ch = msg.channel;
  if ("sendTyping" in ch) await (ch as TextChannel).sendTyping().catch(() => {});
  const typingInterval = setInterval(() => {
    if ("sendTyping" in ch) (ch as TextChannel).sendTyping().catch(() => {});
  }, 8000);

  const working = await msg.reply("Working on it...");

  // Build prompt with conversation history for context continuity
  const contextualPrompt = await buildConversationContext(msg, prompt);

  let buffer = "";
  let lastEdit = Date.now();

  try {
    // Build system prompt -- inject server snapshot for agents that need it
    let systemPrompt: string | undefined;
    if (agent.injectSnapshot) {
      const { buildAdminPrompt } = await import("./discord-admin.js");
      systemPrompt = await buildAdminPrompt(agent.promptFile);
    }

    // Inject agent memory into system prompt (persisted learnings from past sessions)
    const memory = await loadAgentMemory(agent.promptFile);
    if (memory) {
      if (systemPrompt) {
        // Already have a custom system prompt (e.g. Boss with snapshot) -- append memory
        systemPrompt += memory;
      } else {
        // No custom prompt yet -- read the prompt file and append memory
        const fs = await import("node:fs/promises");
        const path = await import("node:path");
        try {
          const promptPath = path.join(process.cwd(), "prompts", `${agent.promptFile}.txt`);
          const base = await fs.readFile(promptPath, "utf-8");
          systemPrompt = base + memory;
        } catch {
          // Prompt file not found -- let runner handle the fallback
        }
      }
    }

    const result = await withTimeout(
      runClaude({
        prompt: contextualPrompt,
        systemPromptName: agent.promptFile,
        systemPrompt,
        maxTurns: agent.maxTurns,
        // Session resumption disabled: Claude CLI auto-continues the last
        // project session when --resume is used, causing double responses.
        onChunk: async (chunk: string) => {
          buffer += chunk;
          if (Date.now() - lastEdit > 1500 && buffer.trim()) {
            const preview = cleanForDiscord(buffer.slice(-1900));
            await working.edit(preview || "...").catch(() => {});
            lastEdit = Date.now();
          }
        },
      }),
      AGENT_TIMEOUT_MS,
    );

    const responseText = result.text || "Done.";
    const full = cleanForDiscord(responseText);
    const chunks = chunkText(full, 1900);

    await working.edit(chunks[0] || "Done.").catch(() => {});
    for (const chunk of chunks.slice(1)) {
      if ("send" in msg.channel) await (msg.channel as TextChannel).send(chunk);
    }

    // Boss intake: log activity for supervisor review
    logActivity(channelName, msg.author.username, prompt, agent.description, responseText).catch(() => {});

    // Agent memory self-update (fire-and-forget, never blocks response)
    import("./discord-memory.js")
      .then(({ maybeUpdateMemory }) => maybeUpdateMemory(agent.promptFile, prompt, responseText))
      .catch(() => {});

    // Agent skill self-creation (fire-and-forget, checks for reusable patterns)
    import("./discord-skills.js")
      .then(({ maybeCreateSkill }) => maybeCreateSkill(agent.promptFile, prompt, responseText))
      .catch(() => {});

    // Agent-to-agent delegation: any named agent can delegate with @agent-name
    if (discordClient && responseText.includes("@") && agent.promptFile !== "chat") {
      import("./discord-delegate.js")
        .then(({ processDelegations }) => processDelegations(discordClient!, responseText, channelName))
        .catch(() => {});
    }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    await working.edit(`Something went wrong: ${errMsg}`).catch(() => {});
  } finally {
    clearInterval(typingInterval);
    channelLocks.delete(msg.channelId);
    agentBusy = false;
    state.discordAdminRunning = false;
  }
}

// --- Boss Intake: Activity Logging ----------------------------------------

interface ActivityEntry {
  ts: string;
  channel: string;
  user: string;
  message: string;
  agent: string;
  responseSummary: string;
}

const ACTIVITY_LOG = "session/activity-log.json";
const MAX_LOG_ENTRIES = 200;

/**
 * Log a conversation to the activity log for Boss supervisor review.
 * The Boss agent reads this file to understand what's happening across all channels.
 * Fire-and-forget -- errors are swallowed silently.
 */
async function logActivity(
  channel: string,
  user: string,
  message: string,
  agent: string,
  response: string,
): Promise<void> {
  const fs = await import("node:fs/promises");

  const entry: ActivityEntry = {
    ts: new Date().toISOString(),
    channel,
    user,
    message: message.slice(0, 200),
    agent,
    responseSummary: response.slice(0, 300),
  };

  let log: ActivityEntry[] = [];
  try {
    const raw = await fs.readFile(ACTIVITY_LOG, "utf-8");
    log = JSON.parse(raw);
  } catch {
    // File doesn't exist yet or parse error -- start fresh
  }

  log.push(entry);

  // Keep only the last N entries to prevent unbounded growth
  if (log.length > MAX_LOG_ENTRIES) {
    log = log.slice(-MAX_LOG_ENTRIES);
  }

  await fs.writeFile(ACTIVITY_LOG, JSON.stringify(log, null, 2));

  // Post compact notification to #agent-feed
  const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });
  const feedMsg = `\`${timestamp}\` **#${channel}** (${agent}) -- ${user}: "${message.slice(0, 80)}"`;
  notifyChannel("agent-feed", feedMsg).catch(() => {});
}

export function startDiscordBot(): void {
  if (!discordClient) {
    console.warn("[discord] DISCORD_BOT_TOKEN not set -- Discord bot disabled");
    return;
  }

  discordClient.once("ready", async (c) => {
    console.log(`Discord bot online: ${c.user.tag}`);
    const { initDiscordAdmin } = await import("./discord-admin.js");
    await initDiscordAdmin(discordClient);

    // Wire schedule job runners
    const { getJobRunners } = await import("./scheduler.js");
    initScheduleJobs(getJobRunners());
    console.log("[discord] Schedule job runners initialized");

    // Register interactive button handler
    const { registerButtonHandler } = await import("./discord-buttons.js");
    registerButtonHandler(discordClient!);
    console.log("[discord] Button interaction handler registered");

    // Register slash commands (guild-scoped, instant)
    const { registerSlashCommands, registerSlashHandler } = await import("./discord-slash.js");
    await registerSlashCommands(token!);
    registerSlashHandler(discordClient!);
    console.log("[discord] Slash command handler registered");

    // Auto-deploy internals on startup (one-time, remove after first deploy)
    if (process.env.DEPLOY_INTERNALS_ON_STARTUP === "1") {
      console.log("[discord] Auto-deploying agent internals...");
      const { deployAllInternals } = await import("./discord-config.js");
      const result = await deployAllInternals(discordClient);
      console.log("[discord] Deploy result:", result);
    }
  });

  discordClient.on("messageCreate", async (msg) => {
    if (msg.author.bot) return;

    const content = msg.content.trim();
    if (!content) return;

    // Dedup: skip if we already processed this message ID
    if (!markProcessed(msg.id)) {
      console.log(`[discord] DEDUP blocked msg ${msg.id} from ${msg.author.username}`);
      return;
    }
    console.log(`[discord] Processing msg ${msg.id} from ${msg.author.username}: ${content.slice(0, 60)}`);

    // Run auto-moderation first (fast path, no Claude)
    const { checkAutoMod } = await import("./discord-admin.js");
    const blocked = await checkAutoMod(msg);
    if (blocked) return;

    // Resolve channel name for routing
    const channelName = "name" in msg.channel
      ? (msg.channel as TextChannel).name
      : "";

    // Simple built-in commands
    if (content === "!status" || content === "/status") {
      const busy = agentBusy || state.jobRunning || state.thinkRunning || state.discordAdminRunning;
      await msg.reply(busy ? "Agent is busy running a task." : "Agent is idle and ready.");
      return;
    }

    if (content === "!help" || content === "/help") {
      const helpText = [
        "**META AGENT Commands** (use `/` or `!`)",
        "",
        "`!help` -- this message",
        "`!status` -- check if the agent is idle or busy",
        "`!reset` -- clear conversation context in this channel",
        "",
        "**Agent channels** -- just type naturally:",
        "  #boss -- orchestrator, delegation, supervision",
        "  #media-buyer -- Meta Ads, budgets, ROAS",
        "  #tm-data -- Ticketmaster events, demographics",
        "  #creative -- ad creative, copy, images",
        "  #dashboard -- reporting, analytics, trends",
        "  #zamora / #kybba -- client conversations",
        "  #general -- team chat",
        "",
        "**Manual triggers:**",
        "  `run meta sync` (in #media-buyer)",
        "  `run tm sync` (in #tm-data)",
        "  `run think` (any channel)",
        "",
        "**Threads** (in #zamora, #kybba):",
        "  `thread: Event Name` -- create a thread for a campaign/event",
        "  `!threads` -- list active threads",
        "",
        "**Admin:**",
        "  `!supervise` -- Boss reviews all agent activity",
        "  `!dashboard` -- update campaign status panel",
        "  `!roles` -- ensure Admin/Team/Bot/Viewer roles",
        "  `!restructure` -- enforce full server layout",
        "  `!deploy-internals` -- sync memory + skills to channels",
        "",
        "**Schedule** (in #schedule):",
        "  `!schedule list` -- show all jobs with status + buttons",
        "  `!enable <job>` / `!disable <job>` -- toggle a job",
        "  `!enable-all` / `!disable-all` -- toggle all",
        "  Jobs: `meta-sync`, `tm-sync`, `think`, `heartbeat`, `health-check`",
        "",
        "**Buttons:** Dashboard and schedule embeds have quick-action buttons.",
        "**Memory:** Agents auto-learn from conversations and persist to memory files.",
      ].join("\n");
      await msg.reply(helpText);
      return;
    }

    if (content === "!reset" || content === "/reset") {
      channelSessions.delete(msg.channelId);
      await msg.reply("Conversation reset. Starting fresh.");
      return;
    }

    if (content === "!restructure" || content === "/restructure") {
      const guild = discordClient?.guilds.cache.first();
      if (!guild) { await msg.reply("No guild found."); return; }
      await msg.reply("Running server restructure...");
      const { runServerRestructure } = await import("./discord-restructure.js");
      const result = await runServerRestructure(guild);
      const chunks = chunkText(result, 1900);
      for (const chunk of chunks) {
        if ("send" in msg.channel) await (msg.channel as TextChannel).send(chunk);
      }
      return;
    }

    if (content === "!deploy-internals" || content === "!deploy-configs") {
      if (!discordClient) { await msg.reply("Bot not connected."); return; }
      await msg.reply("Deploying agent memory + skills to all channels...");
      const { deployAllInternals } = await import("./discord-config.js");
      const result = await deployAllInternals(discordClient);
      const chunks = chunkText(result, 1900);
      for (const chunk of chunks) {
        if ("send" in msg.channel) await (msg.channel as TextChannel).send(chunk);
      }
      return;
    }

    // Roles command: !roles
    if (content === "!roles" || content === "/roles") {
      const guild = discordClient?.guilds.cache.first();
      if (!guild) { await msg.reply("No guild found."); return; }
      const { ensureRoles } = await import("./discord-restructure.js");
      const result = await ensureRoles(guild);
      await msg.reply(result);
      return;
    }

    // Boss command: !supervise
    if (content === "!supervise" || content === "/supervise") {
      if (!discordClient) { await msg.reply("Bot not connected."); return; }
      await msg.reply("Running Boss supervision cycle...");
      const result = await handleSuperviseCommand(discordClient);
      if (result.text) await (msg.channel as TextChannel).send(result.text);
      await (msg.channel as TextChannel).send({ embeds: [result.embed] });
      return;
    }

    // Dashboard command: !dashboard
    if (content === "!dashboard" || content === "/dashboard") {
      if (!discordClient) { await msg.reply("Bot not connected."); return; }
      await msg.reply("Updating dashboard...");
      const result = await handleDashboardCommand(discordClient);
      if (result.text) await (msg.channel as TextChannel).send(result.text);
      if (result.embed) await (msg.channel as TextChannel).send({ embeds: [result.embed] });
      return;
    }

    // Schedule channel: handle schedule commands (not agent-routed)
    if (channelName === "schedule") {
      const schedResult = await handleScheduleCommand(content, discordClient!, channelName);
      if (schedResult) {
        if (schedResult.text) await msg.reply(schedResult.text);
        if (schedResult.embed) {
          const sendOpts: Record<string, unknown> = { embeds: [schedResult.embed] };
          if (schedResult.buttons) {
            const { scheduleButtons } = await import("./discord-buttons.js");
            sendOpts.components = [scheduleButtons()];
          }
          await (msg.channel as TextChannel).send(sendOpts);
        }
      }
      return;
    }

    // Internal channels (memory/skills): bot-managed, skip agent routing
    if (isInternalChannel(channelName)) return;

    // Legacy config channels: skip agent routing
    if (isConfigChannel(channelName)) return;

    // Thread commands in client channels
    if (content === "!threads" || content === "/threads") {
      if ("threads" in msg.channel) {
        const { listThreads } = await import("./discord-threads.js");
        const result = await listThreads(msg.channel as TextChannel);
        await msg.reply(result);
      } else {
        await msg.reply("Threads are only available in client channels (#zamora, #kybba).");
      }
      return;
    }

    // Auto-thread creation in client channels ("thread: Event Name")
    if (content.toLowerCase().startsWith("thread:") || content.toLowerCase().startsWith("new thread:")) {
      const { maybeCreateThread } = await import("./discord-threads.js");
      const thread = await maybeCreateThread(msg, channelName);
      if (thread) {
        await msg.reply(`Thread created: **${thread.threadName}** -- continue the conversation there.`);
        return;
      }
    }

    // Check for manual job triggers (e.g., "run meta sync" in #media-buyer)
    const trigger = matchManualTrigger(channelName, content);
    if (trigger) {
      const { triggerManualJob } = await import("./scheduler.js");
      await msg.reply(`Triggering ${trigger}...`);
      triggerManualJob(trigger);
      return;
    }

    // Per-channel lock: prevent concurrent agent calls to same channel
    if (channelLocks.has(msg.channelId)) {
      console.log(`[discord] Channel ${channelName} already processing, skipping msg ${msg.id}`);
      return;
    }

    // Route to the correct agent
    await handleMessage(msg, content, channelName);
  });

  discordClient.login(token).catch((err: unknown) => {
    const m = err instanceof Error ? err.message : String(err);
    console.error("[discord] Login failed:", m);
  });
}

// --- Channel Router (outbound notifications) ---

const CHANNEL_ROUTES: Record<string, string> = {
  // Work channels
  "general":       "general",
  "dashboard":     "dashboard",
  "media-buyer":   "media-buyer",
  "tm-data":       "tm-data",
  "creative":      "creative",
  "boss":          "boss",
  "zamora":        "zamora",
  "kybba":         "kybba",
  "agent-feed":    "agent-feed",
  "schedule":      "schedule",

  // Aliases for scheduler convenience
  "performance":   "dashboard",
  "alerts":        "agent-feed",
  "logs":          "agent-feed",
  "active-jobs":   "agent-feed",
  "agent-alerts":  "agent-feed",
  "agent-logs":    "agent-feed",
  "bot-logs":      "agent-feed",
  "meta-api":      "media-buyer",
};

const channelIdCache = new Map<string, string>();

async function resolveChannelId(channelName: string): Promise<string | null> {
  if (channelIdCache.has(channelName)) return channelIdCache.get(channelName)!;
  if (!discordClient) return channelId || null;

  const guild = discordClient.guilds.cache.first();
  if (!guild) return channelId || null;

  const ch = guild.channels.cache.find(
    c => c.name === channelName && c.isTextBased()
  );
  if (ch) {
    channelIdCache.set(channelName, ch.id);
    return ch.id;
  }

  return channelId || null;
}

/** Channels that send silent (no push/desktop notification) */
const SILENT_CHANNELS = new Set(["agent-feed"]);

/**
 * Send a message to a specific channel by route name.
 * Messages to #agent-feed are sent with SuppressNotifications so the channel
 * acts as a quiet log -- visible when you look, but never pings.
 */
export async function notifyChannel(target: string, text: string): Promise<void> {
  if (!discordClient) return;

  const channelName = CHANNEL_ROUTES[target] || target;
  const resolvedId = await resolveChannelId(channelName);
  if (!resolvedId) return;

  const silent = SILENT_CHANNELS.has(channelName);

  try {
    const channel = await discordClient.channels.fetch(resolvedId);
    if (channel && channel.isTextBased()) {
      const chunks = chunkText(cleanForDiscord(text), 1900);
      for (const chunk of chunks) {
        await (channel as TextChannel).send(
          silent
            ? { content: chunk, flags: [MessageFlags.SuppressNotifications] }
            : chunk
        );
      }
    }
  } catch (err) {
    const m = err instanceof Error ? err.message : String(err);
    console.warn(`[discord] Failed to send to #${channelName}:`, m);
  }
}

/** Legacy: send to the configured default channel */
export async function notifyDiscord(text: string): Promise<void> {
  if (!discordClient || !channelId) return;
  try {
    const channel = await discordClient.channels.fetch(channelId);
    if (channel && channel.isTextBased()) {
      const chunks = chunkText(cleanForDiscord(text), 1900);
      for (const chunk of chunks) {
        await (channel as TextChannel).send(chunk);
      }
    }
  } catch (err) {
    const m = err instanceof Error ? err.message : String(err);
    console.warn("[discord] Failed to send notification:", m);
  }
}
