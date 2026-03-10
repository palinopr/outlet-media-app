/**
 * approval-service.ts -- Three-tier approval engine.
 *
 * Green: execute immediately.
 * Yellow: Boss auto-approves if within rules.json thresholds.
 * Red: post to #approvals with select menu, wait for user tap.
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { toErrorMessage } from "../utils/error-helpers.js";
import { OWNER_USER_IDS } from "./owner-discord-service.js";
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
  taskEvents,
} from "./queue-service.js";
import { getServiceSupabase } from "./supabase-service.js";

const RULES_PATH = join(process.cwd(), "rules.json");
const APPROVALS_CHANNEL = "approvals";
const OWNER_IDS = new Set(OWNER_USER_IDS);
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
let sweepInterval: ReturnType<typeof setInterval> | null = null;

/** Pending approval tasks: task ID -> { timeout handle, created timestamp } */
const pendingApprovals = new Map<string, { timeout: ReturnType<typeof setTimeout>; createdAt: number }>();

export async function initApprovals(c: Client): Promise<void> {
  client = c;
  await loadRules();
  await rehydrateEscalatedTasks();

  // Listen for task events that need approval
  taskEvents.on("escalated", (task: AgentTask) => {
    if (pendingApprovals.has(task.id)) return;
    postApprovalRequest(task).catch(err => {
      console.error("[approvals] Failed to post approval:", err);
    });
  });

  // Register select menu interaction handler
  c.on("interactionCreate", async (interaction) => {
    if (!interaction.isStringSelectMenu()) return;
    if (!interaction.customId.startsWith("approval_")) return;

    // Owner-only gate
    if (!OWNER_IDS.has(interaction.user.id)) {
      await interaction.reply({ content: "You do not have permission to approve tasks.", ephemeral: true });
      return;
    }

    const taskId = interaction.customId.replace("approval_", "");
    const value = interaction.values[0];

    if (value === "approve") {
      approveTask(taskId, interaction.user.username);
      await interaction.update({
        content: `Approved by ${interaction.user.username}`,
        components: [],
      });
      const entry = pendingApprovals.get(taskId);
      if (entry) clearTimeout(entry.timeout);
      pendingApprovals.delete(taskId);
    } else if (value === "reject") {
      rejectTask(taskId);
      await interaction.update({
        content: `Rejected by ${interaction.user.username}`,
        components: [],
      });
      const entry = pendingApprovals.get(taskId);
      if (entry) clearTimeout(entry.timeout);
      pendingApprovals.delete(taskId);
    }
  });

  // Sweep stale approvals every hour (catches orphans from bot restarts)
  sweepInterval = setInterval(sweepExpiredApprovals, 60 * 60 * 1000);

  console.log("[approvals] Approval service initialized");
}

async function loadRules(): Promise<void> {
  try {
    const raw = await readFile(RULES_PATH, "utf-8");
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      rules = parsed as Rules;
    }
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

async function rehydrateEscalatedTasks(): Promise<void> {
  const supabase = getServiceSupabase();
  if (!supabase) return;

  try {
    const { data, error } = await supabase
      .from("agent_tasks")
      .select("id, created_at")
      .eq("status", "escalated");

    if (error) {
      console.error("[approvals] Failed to rehydrate escalated tasks:", error.message);
      return;
    }

    if (!data || data.length === 0) return;

    const now = Date.now();
    let rehydrated = 0;
    for (const row of data) {
      if (pendingApprovals.has(row.id)) continue;
      const createdAt = new Date(row.created_at).getTime();
      const age = now - createdAt;
      if (age > APPROVAL_EXPIRY_MS) {
        rejectTask(row.id);
        console.log(`[approvals] Expired stale escalated task on rehydrate: ${row.id}`);
        continue;
      }
      const remaining = APPROVAL_EXPIRY_MS - age;
      const timeout = setTimeout(() => {
        rejectTask(row.id);
        pendingApprovals.delete(row.id);
        console.log(`[approvals] Task ${row.id} auto-expired after 24h (rehydrated)`);
      }, remaining);
      pendingApprovals.set(row.id, { timeout, createdAt });
      rehydrated++;
    }

    if (rehydrated > 0) {
      console.log(`[approvals] Rehydrated ${rehydrated} escalated task(s) from Supabase`);
    }
  } catch (err) {
    console.error("[approvals] rehydrate error:", toErrorMessage(err));
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
      const amount = Number(params.amount_cents) || 0;
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

  // Set expiry timeout -- auto-reject if no response in 24h
  const timeout = setTimeout(() => {
    rejectTask(task.id);
    msg.edit({
      content: "Expired (no response in 24h)",
      components: [],
    }).catch((e) => console.warn("[approvals] edit expired message failed:", toErrorMessage(e)));
    pendingApprovals.delete(task.id);
    console.log(`[approvals] Task ${task.id} auto-expired after 24h`);
  }, APPROVAL_EXPIRY_MS);

  pendingApprovals.set(task.id, { timeout, createdAt: Date.now() });
}

export function stopApprovals(): void {
  if (sweepInterval) {
    clearInterval(sweepInterval);
    sweepInterval = null;
  }
}

/**
 * Sweep pending approvals and expire any older than 24h.
 * Catches approvals that survived a bot restart (their setTimeout was lost).
 * Called periodically from a setInterval in initApprovals.
 */
function sweepExpiredApprovals(): void {
  const now = Date.now();
  for (const [taskId, entry] of pendingApprovals) {
    if (now - entry.createdAt > APPROVAL_EXPIRY_MS) {
      clearTimeout(entry.timeout);
      rejectTask(taskId);
      pendingApprovals.delete(taskId);
      console.log(`[approvals] Swept expired approval: ${taskId}`);
    }
  }
}
