/**
 * trigger-handler.ts -- Event-driven reaction handler.
 *
 * Watches for data changes and triggers agent tasks:
 * - After Meta sync: check for ROAS drops below threshold
 * - After TM sync: check for new events, ticket velocity changes
 * - After task completion: check if follow-up tasks are needed
 * - Agent task failures: Boss evaluates and decides retry or escalate
 */

import { taskEvents, type AgentTask, enqueueTask } from "../services/queue-service.js";
import { sendAsAgent } from "../services/webhook-service.js";

/** ROAS threshold for auto-alert */
const ROAS_ALERT_THRESHOLD = 1.5;

/** Ticket capacity percentage for alert */
const TICKET_CAPACITY_ALERT = 0.8;

/**
 * Initialize event-driven triggers.
 * Call once on bot startup after queue-service is initialized.
 */
export function initTriggers(): void {
  // Listen for completed tasks and dispatch reactions
  taskEvents.on("completed", (task: AgentTask) => {
    handleTaskCompletion(task).catch(err => {
      console.error("[triggers] Error handling task completion:", err);
    });
  });

  // Listen for failed tasks -- Boss evaluates
  taskEvents.on("failed", (task: AgentTask) => {
    handleTaskFailure(task).catch(err => {
      console.error("[triggers] Error handling task failure:", err);
    });
  });

  // Listen for escalated tasks -- notify ops
  taskEvents.on("escalated", (task: AgentTask) => {
    handleEscalation(task).catch(err => {
      console.error("[triggers] Error handling escalation:", err);
    });
  });

  console.log("[triggers] Event-driven trigger handler initialized");
}

/**
 * React to completed tasks.
 * Dispatches follow-up tasks based on the completed task's action.
 */
async function handleTaskCompletion(task: AgentTask): Promise<void> {
  const { notifyChannel } = await import("../discord.js");

  switch (task.action) {
    case "meta-sync": {
      // After Meta sync, check for ROAS drops
      const result = task.result as { text?: string } | null;
      if (result?.text && result.text.toLowerCase().includes("roas")) {
        const roasMatch = result.text.match(/roas[:\s]*(\d+\.?\d*)/gi);
        if (roasMatch) {
          for (const match of roasMatch) {
            const value = parseFloat(match.replace(/roas[:\s]*/i, ""));
            if (value < ROAS_ALERT_THRESHOLD && value > 0) {
              enqueueTask("trigger", "media-buyer", "roas-alert", {
                threshold: ROAS_ALERT_THRESHOLD,
                detected: value,
                source_task: task.id,
              }, "yellow");

              await sendAsAgent("boss", "boss",
                `**ROAS Alert**: Detected ROAS of ${value.toFixed(2)}x (below ${ROAS_ALERT_THRESHOLD}x threshold) after Meta sync.`
              ).catch(() => {});
              break;
            }
          }
        }
      }
      break;
    }

    case "tm-sync": {
      // After TM sync, check for ticket velocity
      const result = task.result as { text?: string } | null;
      if (result?.text) {
        if (result.text.includes("80%") || result.text.includes("90%") || result.text.includes("sold out")) {
          enqueueTask("trigger", "boss", "capacity-alert", {
            source_task: task.id,
            details: result.text.slice(0, 500),
          }, "green");

          await notifyChannel("boss", `**Capacity Alert**: High ticket sales detected after TM sync. Check #tm-data.`).catch(() => {});
        }
      }
      break;
    }

    case "morning-briefing": {
      await notifyChannel("general", `Morning briefing posted to #morning-briefing.`).catch(() => {});
      break;
    }

    default:
      await notifyChannel("audit-log",
        `Task completed: **${task.action}** (${task.from} -> ${task.to}) [${task.id}]`
      ).catch(() => {});
      break;
  }
}

/**
 * React to failed tasks.
 * Boss evaluates whether to retry or escalate.
 */
async function handleTaskFailure(task: AgentTask): Promise<void> {
  const { notifyChannel } = await import("../discord.js");

  await notifyChannel("audit-log",
    `Task FAILED: **${task.action}** (${task.from} -> ${task.to}) -- ${task.error?.slice(0, 200) ?? "unknown error"} [${task.id}]`
  ).catch(() => {});

  await sendAsAgent("boss", "boss",
    `**Task Failed**: ${task.action} (assigned to ${task.to})\nError: ${task.error?.slice(0, 300) ?? "unknown"}\nTask ID: ${task.id}`
  ).catch(() => {
    notifyChannel("boss",
      `**Task Failed**: ${task.action} (${task.to}) -- ${task.error?.slice(0, 200) ?? "unknown"}`
    ).catch(() => {});
  });

  // Auto-retry once for transient errors
  if (task.error && isTransientError(task.error)) {
    const retryCount = (task.params._retryCount as number) ?? 0;

    if (retryCount < 1) {
      console.log(`[triggers] Auto-retrying ${task.action} (attempt ${retryCount + 1})`);
      enqueueTask(task.from, task.to, task.action, {
        ...task.params,
        _retryCount: retryCount + 1,
        _originalTaskId: task.id,
      }, task.tier);
    }
  }
}

/**
 * React to escalated tasks.
 * Posts to #ops for visibility.
 */
async function handleEscalation(task: AgentTask): Promise<void> {
  const { notifyChannel } = await import("../discord.js");

  await notifyChannel("ops",
    `**Escalation**: Task ${task.action} (${task.from} -> ${task.to}) escalated to RED tier.\nDetails: ${JSON.stringify(task.params).slice(0, 500)}\nTask ID: ${task.id}`
  ).catch(() => {});

  await notifyChannel("audit-log",
    `Task ESCALATED: **${task.action}** (${task.from} -> ${task.to}) [${task.id}]`
  ).catch(() => {});
}

/**
 * Check if an error is transient (network timeout, rate limit, etc.)
 */
function isTransientError(error: string): boolean {
  const transientPatterns = [
    "timeout",
    "etimedout",
    "econnreset",
    "rate limit",
    "429",
    "503",
    "502",
    "enotfound",
  ];
  const lower = error.toLowerCase();
  return transientPatterns.some(p => lower.includes(p));
}
