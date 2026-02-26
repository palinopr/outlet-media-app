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
