# Discord Multi-Agent Architecture Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor the Discord agent system from a single-threaded monolith into a concurrent multi-agent architecture with webhooks, structured task queues, three-tier approval, and autonomous operation.

**Architecture:** Single bot process, per-agent webhooks for identity, in-memory job queue with Supabase ledger, three-tier approval (Green/Yellow/Red), cron + event-driven autonomy, dynamic agent spawning. See `docs/plans/2026-02-26-discord-agent-architecture-design.md` for full design.

**Tech Stack:** discord.js 14.25, TypeScript strict, node-cron, Supabase, Claude CLI via runner.ts

---

## Phase 1: Foundation (Queue, Webhooks, Code Split)

Core infrastructure that everything else builds on. After this phase, the bot works like before but with concurrent execution and agent identities.

### Task 1: Create `agent_tasks` Supabase table

**Files:**
- Supabase migration (run via dashboard or CLI)

**Step 1: Create the table**

Run this SQL in Supabase dashboard:

```sql
CREATE TABLE IF NOT EXISTS agent_tasks (
  id text PRIMARY KEY DEFAULT 'task_' || substr(gen_random_uuid()::text, 1, 12),
  from_agent text NOT NULL,
  to_agent text NOT NULL,
  action text NOT NULL,
  params jsonb DEFAULT '{}',
  tier text NOT NULL DEFAULT 'green' CHECK (tier IN ('green', 'yellow', 'red')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'escalated', 'approved', 'rejected', 'expired')),
  result jsonb,
  error text,
  created_at timestamptz DEFAULT now(),
  started_at timestamptz,
  completed_at timestamptz,
  approved_by text,
  discord_message_id text
);

CREATE INDEX idx_agent_tasks_status ON agent_tasks(status);
CREATE INDEX idx_agent_tasks_to_agent ON agent_tasks(to_agent);
CREATE INDEX idx_agent_tasks_created ON agent_tasks(created_at DESC);
```

**Step 2: Verify the table exists**

Run: `curl` to Supabase REST API to confirm table is queryable.

**Step 3: Commit**

No code file changes yet -- this is infrastructure only.

---

### Task 2: Create `agent/src/services/webhook-service.ts`

**Files:**
- Create: `agent/src/services/webhook-service.ts`

**Step 1: Create the webhook service**

This module manages per-agent Discord webhooks. Creates them on startup, caches ID+token, sends messages with agent identity.

```typescript
/**
 * webhook-service.ts -- Per-agent webhook management.
 *
 * Creates/finds webhooks per agent channel on startup.
 * Caches webhook ID + token. Sends messages with custom name/avatar.
 * Fallback: if cached webhook is invalid, creates a new one.
 */

import {
  type Client,
  type TextChannel,
  WebhookClient,
  type WebhookMessageCreateOptions,
  ChannelType,
} from "discord.js";

interface AgentWebhook {
  id: string;
  token: string;
  client: WebhookClient;
  name: string;
  avatarURL: string;
}

/** Agent display config: name, avatar, primary channel */
const AGENT_PROFILES: Record<string, { name: string; avatar: string; channels: string[] }> = {
  boss:            { name: "Boss",           avatar: "https://i.imgur.com/7ZGDfqr.png", channels: ["boss"] },
  "media-buyer":   { name: "Media Buyer",    avatar: "https://i.imgur.com/Qj8YXBK.png", channels: ["media-buyer"] },
  "tm-agent":      { name: "TM Data",        avatar: "https://i.imgur.com/3JzGKvN.png", channels: ["tm-data"] },
  creative:        { name: "Creative",       avatar: "https://i.imgur.com/WfVlJEK.png", channels: ["creative"] },
  reporting:       { name: "Reporting",      avatar: "https://i.imgur.com/NqRPmBL.png", channels: ["dashboard"] },
  "client-manager":{ name: "Client Manager", avatar: "https://i.imgur.com/8FxTGnA.png", channels: ["zamora", "kybba"] },
};

/** channelName -> agentKey -> AgentWebhook */
const webhookCache = new Map<string, Map<string, AgentWebhook>>();

let discordClient: Client | null = null;

/**
 * Initialize webhooks for all agents in their primary channels.
 * Call once on bot startup after "ready" event.
 */
export async function initWebhooks(client: Client): Promise<void> {
  discordClient = client;
  const guild = client.guilds.cache.first();
  if (!guild) {
    console.warn("[webhooks] No guild found -- skipping webhook init");
    return;
  }

  for (const [agentKey, profile] of Object.entries(AGENT_PROFILES)) {
    for (const channelName of profile.channels) {
      const channel = guild.channels.cache.find(
        c => c.name === channelName && c.type === ChannelType.GuildText
      ) as TextChannel | undefined;

      if (!channel) {
        console.warn(`[webhooks] Channel #${channelName} not found for ${agentKey}`);
        continue;
      }

      await ensureWebhook(channel, agentKey, profile.name, profile.avatar);
    }
  }

  console.log(`[webhooks] Initialized ${webhookCache.size} channel webhook caches`);
}

/**
 * Find or create a webhook for an agent in a channel.
 */
async function ensureWebhook(
  channel: TextChannel,
  agentKey: string,
  name: string,
  avatarURL: string,
): Promise<AgentWebhook | null> {
  try {
    const webhooks = await channel.fetchWebhooks();
    // Look for existing webhook with our naming convention
    const existing = webhooks.find(wh => wh.name === `agent-${agentKey}` && wh.token);

    let id: string;
    let token: string;

    if (existing && existing.token) {
      id = existing.id;
      token = existing.token;
    } else {
      const created = await channel.createWebhook({
        name: `agent-${agentKey}`,
        reason: `Agent webhook for ${name}`,
      });
      if (!created.token) return null;
      id = created.id;
      token = created.token;
    }

    const wh: AgentWebhook = {
      id,
      token,
      client: new WebhookClient({ id, token }),
      name,
      avatarURL,
    };

    // Cache by channel
    if (!webhookCache.has(channel.name)) {
      webhookCache.set(channel.name, new Map());
    }
    webhookCache.get(channel.name)!.set(agentKey, wh);

    return wh;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[webhooks] Failed to init webhook for ${agentKey} in #${channel.name}: ${msg}`);
    return null;
  }
}

/**
 * Send a message as a specific agent to a channel.
 * Falls back to regular bot message if webhook unavailable.
 */
export async function sendAsAgent(
  agentKey: string,
  channelName: string,
  options: string | WebhookMessageCreateOptions,
): Promise<void> {
  const channelWebhooks = webhookCache.get(channelName);
  const wh = channelWebhooks?.get(agentKey);

  const content: WebhookMessageCreateOptions = typeof options === "string"
    ? { content: options }
    : options;

  if (wh) {
    try {
      await wh.client.send({
        ...content,
        username: wh.name,
        avatarURL: wh.avatarURL,
      });
      return;
    } catch {
      // Webhook invalid -- try to recreate
      channelWebhooks?.delete(agentKey);
    }
  }

  // Fallback: create webhook on the fly for this channel
  if (discordClient) {
    const guild = discordClient.guilds.cache.first();
    const channel = guild?.channels.cache.find(
      c => c.name === channelName && c.type === ChannelType.GuildText
    ) as TextChannel | undefined;

    if (channel) {
      const profile = AGENT_PROFILES[agentKey];
      if (profile) {
        const newWh = await ensureWebhook(channel, agentKey, profile.name, profile.avatar);
        if (newWh) {
          await newWh.client.send({
            ...content,
            username: newWh.name,
            avatarURL: newWh.avatarURL,
          });
          return;
        }
      }

      // Last resort: send as bot
      await channel.send(content.content ?? "").catch(() => {});
    }
  }
}

/**
 * Register a dynamic agent's webhook (for spawned agents).
 */
export async function registerAgentWebhook(
  agentKey: string,
  name: string,
  avatarURL: string,
  channelNames: string[],
): Promise<void> {
  AGENT_PROFILES[agentKey] = { name, avatar: avatarURL, channels: channelNames };

  if (!discordClient) return;
  const guild = discordClient.guilds.cache.first();
  if (!guild) return;

  for (const channelName of channelNames) {
    const channel = guild.channels.cache.find(
      c => c.name === channelName && c.type === ChannelType.GuildText
    ) as TextChannel | undefined;

    if (channel) {
      await ensureWebhook(channel, agentKey, name, avatarURL);
    }
  }
}

/** Get list of registered agent keys */
export function getAgentKeys(): string[] {
  return Object.keys(AGENT_PROFILES);
}

/** Get agent profile by key */
export function getAgentProfile(key: string) {
  return AGENT_PROFILES[key] ?? null;
}
```

**Step 2: Verify it compiles**

Run: `cd /Users/jaimeortiz/outlet-media-app/agent && npx tsc --noEmit`

**Step 3: Commit**

```bash
git add agent/src/services/webhook-service.ts
git commit -m "feat: add webhook service for per-agent Discord identities"
```

---

### Task 3: Create `agent/src/services/queue-service.ts`

**Files:**
- Create: `agent/src/services/queue-service.ts`

**Step 1: Create the queue service**

In-memory task queue with per-agent slots, max concurrency, Supabase ledger writes.

```typescript
/**
 * queue-service.ts -- In-memory task queue with per-agent slots.
 *
 * Replaces the global agentBusy lock. Each agent gets its own slot.
 * Max concurrent Claude calls configurable (default 3).
 * Every task is also written to Supabase agent_tasks for audit trail.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { EventEmitter } from "node:events";

export interface AgentTask {
  id: string;
  from: string;
  to: string;
  action: string;
  params: Record<string, unknown>;
  tier: "green" | "yellow" | "red";
  status: "pending" | "running" | "completed" | "failed" | "escalated" | "approved" | "rejected" | "expired";
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  result?: unknown;
  error?: string;
  discordMessageId?: string;
}

const MAX_CONCURRENT = 3;
let taskCounter = 0;

/** Active tasks per agent (agent key -> task or null) */
const activeSlots = new Map<string, AgentTask | null>();

/** Pending queue per agent */
const pendingQueues = new Map<string, AgentTask[]>();

/** All tasks (for lookup) */
const taskRegistry = new Map<string, AgentTask>();

/** Event bus for task lifecycle events */
export const taskEvents = new EventEmitter();

let supabase: SupabaseClient | null = null;

export function initQueue(): void {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) {
    supabase = createClient(url, key);
    console.log("[queue] Supabase ledger connected");
  } else {
    console.warn("[queue] Supabase not configured -- tasks will not be persisted");
  }
}

function generateTaskId(): string {
  taskCounter++;
  const ts = Date.now().toString(36);
  return `task_${ts}_${taskCounter}`;
}

function countActive(): number {
  let count = 0;
  for (const [, task] of activeSlots) {
    if (task) count++;
  }
  return count;
}

/**
 * Enqueue a task for an agent. Returns the task object.
 * The task starts immediately if the agent's slot is free and
 * we're under the max concurrency limit.
 */
export function enqueueTask(
  from: string,
  to: string,
  action: string,
  params: Record<string, unknown> = {},
  tier: "green" | "yellow" | "red" = "green",
): AgentTask {
  const task: AgentTask = {
    id: generateTaskId(),
    from,
    to,
    action,
    params,
    tier,
    status: "pending",
    createdAt: new Date(),
  };

  taskRegistry.set(task.id, task);

  // Write to Supabase ledger (fire-and-forget)
  persistTask(task).catch(() => {});

  // Check if we can run immediately
  const agentSlot = activeSlots.get(to);
  if (!agentSlot && countActive() < MAX_CONCURRENT) {
    startTask(task);
  } else {
    // Queue it
    if (!pendingQueues.has(to)) pendingQueues.set(to, []);
    pendingQueues.get(to)!.push(task);
    taskEvents.emit("queued", task);
  }

  return task;
}

/**
 * Mark a task as started. Sets it in the agent's active slot.
 */
function startTask(task: AgentTask): void {
  task.status = "running";
  task.startedAt = new Date();
  activeSlots.set(task.to, task);
  persistTask(task).catch(() => {});
  taskEvents.emit("started", task);
}

/**
 * Complete a task. Clears the agent's slot and processes the next queued task.
 */
export function completeTask(taskId: string, result: unknown): void {
  const task = taskRegistry.get(taskId);
  if (!task) return;

  task.status = "completed";
  task.completedAt = new Date();
  task.result = result;
  activeSlots.set(task.to, null);
  persistTask(task).catch(() => {});
  taskEvents.emit("completed", task);

  // Process next in queue
  processNextForAgent(task.to);
}

/**
 * Fail a task. Clears the slot and processes next.
 */
export function failTask(taskId: string, error: string): void {
  const task = taskRegistry.get(taskId);
  if (!task) return;

  task.status = "failed";
  task.completedAt = new Date();
  task.error = error;
  activeSlots.set(task.to, null);
  persistTask(task).catch(() => {});
  taskEvents.emit("failed", task);

  processNextForAgent(task.to);
}

/**
 * Escalate a task (Yellow -> Red, or mark for manual review).
 */
export function escalateTask(taskId: string): void {
  const task = taskRegistry.get(taskId);
  if (!task) return;

  task.status = "escalated";
  task.tier = "red";
  persistTask(task).catch(() => {});
  taskEvents.emit("escalated", task);
}

/**
 * Approve a task (from #approvals).
 */
export function approveTask(taskId: string, approvedBy: string): void {
  const task = taskRegistry.get(taskId);
  if (!task) return;

  task.status = "approved";
  persistTask(task).catch(() => {});
  taskEvents.emit("approved", task);

  // Re-enqueue as green tier for execution
  const execTask = enqueueTask(task.from, task.to, task.action, task.params, "green");
  execTask.params._approvedBy = approvedBy;
  execTask.params._originalTaskId = taskId;
}

/**
 * Reject a task (from #approvals).
 */
export function rejectTask(taskId: string): void {
  const task = taskRegistry.get(taskId);
  if (!task) return;

  task.status = "rejected";
  task.completedAt = new Date();
  persistTask(task).catch(() => {});
  taskEvents.emit("rejected", task);
}

/**
 * Process the next pending task for an agent.
 */
function processNextForAgent(agentKey: string): void {
  const queue = pendingQueues.get(agentKey);
  if (!queue || queue.length === 0) return;
  if (countActive() >= MAX_CONCURRENT) return;

  const next = queue.shift()!;
  startTask(next);
}

/**
 * Get a task by ID.
 */
export function getTask(id: string): AgentTask | undefined {
  return taskRegistry.get(id);
}

/**
 * Check if an agent's slot is free.
 */
export function isAgentFree(agentKey: string): boolean {
  return !activeSlots.get(agentKey);
}

/**
 * Get queue depth for an agent.
 */
export function getQueueDepth(agentKey: string): number {
  return pendingQueues.get(agentKey)?.length ?? 0;
}

/**
 * Get all active tasks.
 */
export function getActiveTasks(): AgentTask[] {
  const tasks: AgentTask[] = [];
  for (const [, task] of activeSlots) {
    if (task) tasks.push(task);
  }
  return tasks;
}

/**
 * Write task state to Supabase.
 */
async function persistTask(task: AgentTask): Promise<void> {
  if (!supabase) return;

  const row = {
    id: task.id,
    from_agent: task.from,
    to_agent: task.to,
    action: task.action,
    params: task.params,
    tier: task.tier,
    status: task.status,
    result: task.result ?? null,
    error: task.error ?? null,
    created_at: task.createdAt.toISOString(),
    started_at: task.startedAt?.toISOString() ?? null,
    completed_at: task.completedAt?.toISOString() ?? null,
    discord_message_id: task.discordMessageId ?? null,
  };

  await supabase
    .from("agent_tasks")
    .upsert(row, { onConflict: "id" })
    .then(
      () => {},
      (err) => console.warn("[queue] Persist failed:", err.message),
    );
}

/**
 * Clean old tasks from memory (keep last 500).
 */
export function pruneTaskRegistry(): void {
  if (taskRegistry.size <= 500) return;
  const entries = [...taskRegistry.entries()]
    .sort((a, b) => b[1].createdAt.getTime() - a[1].createdAt.getTime());
  const toDelete = entries.slice(500);
  for (const [id] of toDelete) {
    taskRegistry.delete(id);
  }
}
```

**Step 2: Verify it compiles**

Run: `cd /Users/jaimeortiz/outlet-media-app/agent && npx tsc --noEmit`

**Step 3: Commit**

```bash
git add agent/src/services/queue-service.ts
git commit -m "feat: add task queue service with per-agent slots and Supabase ledger"
```

---

### Task 4: Create `agent/src/services/approval-service.ts`

**Files:**
- Create: `agent/src/services/approval-service.ts`
- Create: `agent/rules.json`

**Step 1: Create rules.json**

```json
{
  "yellow": {
    "max_budget_change_cents": 5000,
    "auto_pause_below_roas": 1.0,
    "auto_resume_above_roas": 2.0,
    "allow_creative_swap": true,
    "allow_templated_client_update": true,
    "allow_agent_delegation": true
  },
  "red_always": [
    "create-campaign",
    "delete-campaign",
    "client-freeform-message",
    "spawn-agent",
    "modify-agent-prompt",
    "modify-rules"
  ]
}
```

**Step 2: Create the approval service**

```typescript
/**
 * approval-service.ts -- Three-tier approval engine.
 *
 * Green: execute immediately.
 * Yellow: Boss auto-approves if within rules.json thresholds.
 * Red: post to #approvals with select menu, wait for user tap.
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  type Client,
  type TextChannel,
  ChannelType,
} from "discord.js";
import {
  type AgentTask,
  approveTask,
  rejectTask,
  escalateTask,
  taskEvents,
} from "./queue-service.js";

const RULES_PATH = join(process.cwd(), "rules.json");
const APPROVALS_CHANNEL = "approvals";
const APPROVAL_TIMEOUT_MS = 4 * 60 * 60 * 1000; // 4 hours reminder
const APPROVAL_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours expiry

interface Rules {
  yellow: {
    max_budget_change_cents: number;
    auto_pause_below_roas: number;
    auto_resume_above_roas: number;
    allow_creative_swap: boolean;
    allow_templated_client_update: boolean;
    allow_agent_delegation: boolean;
  };
  red_always: string[];
}

let rules: Rules | null = null;
let client: Client | null = null;

/** Pending approval tasks (task ID -> timeout handle) */
const pendingApprovals = new Map<string, ReturnType<typeof setTimeout>>();

export async function initApprovals(c: Client): Promise<void> {
  client = c;
  await loadRules();

  // Listen for task events that need approval
  taskEvents.on("queued", (task: AgentTask) => {
    if (task.tier === "red") {
      postApprovalRequest(task).catch(err => {
        console.error("[approvals] Failed to post approval:", err);
      });
    }
  });

  // Register select menu interaction handler
  c.on("interactionCreate", async (interaction) => {
    if (!interaction.isStringSelectMenu()) return;
    if (!interaction.customId.startsWith("approval_")) return;

    const taskId = interaction.customId.replace("approval_", "");
    const value = interaction.values[0];

    if (value === "approve") {
      approveTask(taskId, interaction.user.username);
      await interaction.update({
        content: `Approved by ${interaction.user.username}`,
        components: [],
      });
      pendingApprovals.delete(taskId);
    } else if (value === "reject") {
      rejectTask(taskId);
      await interaction.update({
        content: `Rejected by ${interaction.user.username}`,
        components: [],
      });
      pendingApprovals.delete(taskId);
    }
  });

  console.log("[approvals] Approval service initialized");
}

async function loadRules(): Promise<void> {
  try {
    const raw = await readFile(RULES_PATH, "utf-8");
    rules = JSON.parse(raw);
    console.log("[approvals] Rules loaded from rules.json");
  } catch {
    console.warn("[approvals] rules.json not found -- using defaults");
    rules = {
      yellow: {
        max_budget_change_cents: 5000,
        auto_pause_below_roas: 1.0,
        auto_resume_above_roas: 2.0,
        allow_creative_swap: true,
        allow_templated_client_update: true,
        allow_agent_delegation: true,
      },
      red_always: [
        "create-campaign", "delete-campaign", "client-freeform-message",
        "spawn-agent", "modify-agent-prompt", "modify-rules",
      ],
    };
  }
}

/**
 * Evaluate a task's tier and decide what to do.
 * Returns "execute" if the task can proceed, "escalate" if it needs approval.
 */
export function evaluateTier(task: AgentTask): "execute" | "escalate" {
  if (task.tier === "green") return "execute";

  if (!rules) return "escalate";

  // Red-always actions
  if (rules.red_always.includes(task.action)) {
    task.tier = "red";
    return "escalate";
  }

  // Yellow tier: check rules
  if (task.tier === "yellow") {
    const params = task.params;

    // Budget change check
    if (task.action === "change-budget") {
      const amount = (params.amount_cents as number) ?? 0;
      if (Math.abs(amount) <= rules.yellow.max_budget_change_cents) {
        return "execute";
      }
      task.tier = "red";
      return "escalate";
    }

    // Delegation check
    if (task.action === "delegate" && rules.yellow.allow_agent_delegation) {
      return "execute";
    }

    // Creative swap check
    if (task.action === "swap-creative" && rules.yellow.allow_creative_swap) {
      return "execute";
    }

    // Default: execute yellow if not explicitly red
    return "execute";
  }

  return "escalate";
}

/**
 * Post an approval request to #approvals with a select menu.
 */
async function postApprovalRequest(task: AgentTask): Promise<void> {
  if (!client) return;

  const guild = client.guilds.cache.first();
  if (!guild) return;

  const channel = guild.channels.cache.find(
    c => c.name === APPROVALS_CHANNEL && c.type === ChannelType.GuildText
  ) as TextChannel | undefined;

  if (!channel) {
    console.warn("[approvals] #approvals channel not found");
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle("Approval Required")
    .setColor(0xf44336)
    .addFields(
      { name: "From", value: task.from, inline: true },
      { name: "To", value: task.to, inline: true },
      { name: "Action", value: task.action, inline: true },
      { name: "Tier", value: task.tier.toUpperCase(), inline: true },
      { name: "Details", value: JSON.stringify(task.params, null, 2).slice(0, 1000), inline: false },
    )
    .setTimestamp()
    .setFooter({ text: `Task: ${task.id} | Expires in 24h` });

  const select = new StringSelectMenuBuilder()
    .setCustomId(`approval_${task.id}`)
    .setPlaceholder("Choose action...")
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel("Approve")
        .setDescription("Execute this action as requested")
        .setValue("approve"),
      new StringSelectMenuOptionBuilder()
        .setLabel("Reject")
        .setDescription("Deny this action")
        .setValue("reject"),
    );

  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);

  const msg = await channel.send({ embeds: [embed], components: [row] });
  task.discordMessageId = msg.id;

  // Set expiry timeout
  const timeout = setTimeout(() => {
    rejectTask(task.id);
    msg.edit({
      content: "Expired (no response in 24h)",
      components: [],
    }).catch(() => {});
    pendingApprovals.delete(task.id);
  }, APPROVAL_EXPIRY_MS);

  pendingApprovals.set(task.id, timeout);
}
```

**Step 2: Verify it compiles**

Run: `cd /Users/jaimeortiz/outlet-media-app/agent && npx tsc --noEmit`

**Step 3: Commit**

```bash
git add agent/src/services/approval-service.ts agent/rules.json
git commit -m "feat: add three-tier approval service with rules.json"
```

---

### Task 5: Refactor `discord.ts` into thin entry point + message handler

**Files:**
- Modify: `agent/src/discord.ts` (keep as thin entry point)
- Create: `agent/src/events/message-handler.ts`

**Step 1: Extract message handling to events/message-handler.ts**

Move the `handleMessage()` function, `buildConversationContext()`, `logActivity()`, and the `messageCreate` event body out of discord.ts into a dedicated handler. The handler imports webhook-service to send as the correct agent identity.

Key changes:
- `handleMessage()` uses `sendAsAgent()` instead of `msg.reply()` for agent responses
- Per-channel slot check via `isAgentFree()` instead of global `agentBusy`
- Task delegation uses structured JSON parsing instead of `@agent-name` regex
- After response, fire-and-forget: memory update, skill extraction, delegation scan

**Step 2: Slim down discord.ts**

discord.ts becomes ~100 lines: client creation, `ready` event that wires all services (webhooks, queue, approvals, buttons, slash), `messageCreate` that delegates to message-handler, `notifyChannel()`, and exports.

**Step 3: Verify it compiles**

Run: `cd /Users/jaimeortiz/outlet-media-app/agent && npx tsc --noEmit`

**Step 4: Test manually**

Start the bot: `cd /Users/jaimeortiz/outlet-media-app/agent && npm run dev`
Send a message in #general -- verify the response comes via webhook with agent identity.

**Step 5: Commit**

```bash
git add agent/src/discord.ts agent/src/events/message-handler.ts
git commit -m "refactor: extract message handler, wire webhook identities"
```

---

### Task 6: Create structured task delegation (replace @agent-name regex)

**Files:**
- Create: `agent/src/agents/delegate.ts` (replaces `discord-delegate.ts`)

**Step 1: Create the new delegation module**

Parses structured JSON task blocks from Claude output:
```json
{"delegate": "media-buyer", "action": "check-roas", "params": {"threshold": 2.0}}
```

Runner strips these blocks from the display text and enqueues them via queue-service. Each delegation creates a proper AgentTask that goes through the tier evaluation.

**Step 2: Update runner.ts to strip delegation blocks**

After Claude response is assembled, scan for ```json blocks containing `"delegate"` key. Parse them, enqueue via queue-service, remove from the text that gets posted to Discord.

**Step 3: Update agent prompts**

Add delegation instructions to `prompts/boss.txt` and other agent prompts:
```
To delegate a task to another agent, include a JSON block:
\```json
{"delegate": "agent-name", "action": "action-name", "params": {...}}
\```
```

**Step 4: Verify it compiles and test**

Run: `cd /Users/jaimeortiz/outlet-media-app/agent && npx tsc --noEmit`

**Step 5: Commit**

```bash
git add agent/src/agents/delegate.ts agent/src/runner.ts agent/prompts/boss.txt
git commit -m "feat: structured task delegation via JSON blocks"
```

---

### Task 7: Update server layout (restructure.ts + new channels)

**Files:**
- Modify: `agent/src/discord-restructure.ts`

**Step 1: Update TARGET_LAYOUT**

New layout with 16 channels, 8 categories:
- Remove all memory/skills channels (12 channels gone)
- Add #morning-briefing, #approvals, #war-room, #agent-internals to HQ
- Add Ops category with #ops, #audit-log
- Convert #zamora and #kybba to forum channels (ChannelType.GuildForum)
- Keep agent work channels as-is

**Step 2: Update WHITELISTED_CHANNELS and WHITELISTED_CATEGORIES**

Match the new layout.

**Step 3: Test with !restructure**

Start bot, run `!restructure` in Discord. Verify old channels deleted, new channels created.

**Step 4: Commit**

```bash
git add agent/src/discord-restructure.ts
git commit -m "feat: update server layout to 16 channels, add approvals and ops"
```

---

## Phase 2: Autonomy & Intelligence

After Phase 1, you have concurrent agents with identities, a task queue, and approval flow. Phase 2 adds proactive behavior.

### Task 8: Create `agent/src/jobs/cron-sweeps.ts`

**Files:**
- Create: `agent/src/jobs/cron-sweeps.ts`
- Modify: `agent/src/discord-schedule.ts` (add new jobs to JOBS registry)

**Step 1: Consolidate routines into cron-sweeps.ts**

Move the routines from `discord-routines.ts` into `cron-sweeps.ts`, but refactored to use the task queue instead of direct `runClaude()` calls. Each sweep creates an `AgentTask` via `enqueueTask()`, which goes through the queue's concurrency management.

**Step 2: Add new sweeps**

- TM Agent: ticket velocity check (every 4h)
- Client Manager: client pulse (daily 9am CST)
- Boss: supervision (every 4h)

**Step 3: Update discord-schedule.ts JOBS registry**

Add all new routine jobs to the JOBS object so they appear in `!schedule list` and can be toggled.

**Step 4: Commit**

```bash
git add agent/src/jobs/cron-sweeps.ts agent/src/discord-schedule.ts
git commit -m "feat: add cron sweep jobs using task queue for concurrency"
```

---

### Task 9: Create `agent/src/jobs/briefing.ts`

**Files:**
- Create: `agent/src/jobs/briefing.ts`

**Step 1: Create morning briefing job**

Runs daily at 7am CST. Reads campaign and event data, generates a summary via Boss agent, posts to #morning-briefing. Uses task queue for execution.

**Step 2: Wire into schedule**

Add to JOBS in discord-schedule.ts.

**Step 3: Commit**

```bash
git add agent/src/jobs/briefing.ts agent/src/discord-schedule.ts
git commit -m "feat: add morning briefing job to #morning-briefing"
```

---

### Task 10: Create `agent/src/events/trigger-handler.ts`

**Files:**
- Create: `agent/src/events/trigger-handler.ts`

**Step 1: Create event-driven reaction handler**

Watches for data changes and triggers agent tasks:
- After Meta sync: check if any campaign ROAS dropped below threshold
- After TM sync: check for new events, ticket velocity changes
- After task completion: check if follow-up tasks are needed

Uses `taskEvents` from queue-service to listen for completed tasks and dispatch reactions.

**Step 2: Wire into discord.ts startup**

**Step 3: Commit**

```bash
git add agent/src/events/trigger-handler.ts agent/src/discord.ts
git commit -m "feat: add event-driven trigger handler for reactive autonomy"
```

---

## Phase 3: Agent Spawning & Inspector

### Task 11: Create `agent/src/agents/spawner.ts`

**Files:**
- Create: `agent/src/agents/spawner.ts`

**Step 1: Create agent spawner**

When a Red-tier "spawn-agent" task is approved:
1. Create prompt file in `prompts/<name>.txt`
2. Create memory file in `memory/<name>.md`
3. Create skills directory `skills/<name>/`
4. Create Discord channel in a new category
5. Register webhook via webhook-service
6. Update router config
7. Post introduction to #agent-feed

**Step 2: Add spawn-agent as a recognized action in approval-service**

**Step 3: Commit**

```bash
git add agent/src/agents/spawner.ts
git commit -m "feat: add dynamic agent spawner with auto-provisioning"
```

---

### Task 12: Create `agent/src/events/inspect-handler.ts` (replaces discord-config.ts)

**Files:**
- Create: `agent/src/events/inspect-handler.ts`
- Remove: `agent/src/discord-config.ts` (replaced)

**Step 1: Create inspector**

Handles `/inspect <agent> <memory|skills|prompt>` slash command and select menu in #agent-internals. Posts the requested file as an embed on demand instead of maintaining 12 always-on channels.

**Step 2: Register slash command**

Add `inspect` to discord-slash.ts with agent name and category options.

**Step 3: Commit**

```bash
git add agent/src/events/inspect-handler.ts agent/src/discord-slash.ts
git commit -m "feat: add agent inspector replacing per-agent display channels"
```

---

## Phase 4: Shared Context & Polish

### Task 13: Create shared client context files

**Files:**
- Create: `agent/context/zamora.md`
- Create: `agent/context/kybba.md`
- Modify: agent prompts to reference shared context

**Step 1: Create context files**

Seed each with current client data from MEMORY.md. These files are read by all agents that work on a client's campaigns.

**Step 2: Update agent prompts**

Add to Media Buyer, Creative, TM, Client Manager, and Reporting prompts:
```
Read context/<client>.md for shared client state before answering client-specific questions.
```

**Step 3: Commit**

```bash
git add agent/context/ agent/prompts/
git commit -m "feat: add shared client context files for cross-agent state"
```

---

### Task 14: Add bot presence and pinned status embeds

**Files:**
- Modify: `agent/src/discord.ts` (add presence rotation)
- Create: `agent/src/services/status-service.ts`

**Step 1: Create status service**

- Sets bot presence to show current activity (e.g., "Working: Meta sync")
- Rotates through active tasks every 15 seconds
- Creates/updates a pinned status embed in each agent work channel showing: current task, queue depth, last active, memory size, skills count

**Step 2: Wire into discord.ts startup**

**Step 3: Commit**

```bash
git add agent/src/services/status-service.ts agent/src/discord.ts
git commit -m "feat: add bot presence rotation and agent status embeds"
```

---

### Task 15: Clean up old files

**Files:**
- Remove: `agent/src/discord-delegate.ts` (replaced by agents/delegate.ts)
- Remove: `agent/src/discord-routines.ts` (replaced by jobs/cron-sweeps.ts)
- Remove: `agent/src/discord-config.ts` (replaced by events/inspect-handler.ts)
- Update: imports in all files that referenced removed modules

**Step 1: Remove old files, update imports**

Verify no remaining references to removed modules.

**Step 2: Verify full build**

Run: `cd /Users/jaimeortiz/outlet-media-app/agent && npx tsc --noEmit`

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove replaced modules, clean up imports"
```

---

## Phase 5: Verification

### Task 16: End-to-end test

**Step 1: Start the bot**

Run: `cd /Users/jaimeortiz/outlet-media-app/agent && npm run dev`

**Step 2: Verify server layout**

Type `!restructure` in Discord. Confirm 16 channels, 8 categories.

**Step 3: Verify agent identities**

Send messages in #media-buyer, #tm-data, #creative. Confirm responses come from different webhook identities (different names/avatars).

**Step 4: Verify concurrency**

Send messages in two agent channels simultaneously. Confirm both agents respond without blocking each other.

**Step 5: Verify task queue**

Type "run meta sync" in #media-buyer. Check Supabase `agent_tasks` table for the task entry.

**Step 6: Verify approvals**

In #boss, ask Boss to create a new campaign (should trigger Red-tier). Confirm approval embed appears in #approvals with select menu.

**Step 7: Verify schedule**

Go to #schedule, `!schedule list`. Confirm all new jobs appear (morning-briefing, show-day-check, etc.). Enable one, verify it runs.

**Step 8: Verify inspector**

In #agent-internals, use `/inspect media-buyer memory`. Confirm memory file content appears as embed.

**Step 9: Commit final state**

```bash
git add -A
git commit -m "feat: discord multi-agent architecture v2 complete"
```
