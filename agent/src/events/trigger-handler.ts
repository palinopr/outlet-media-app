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
  const { notifyChannel } = await import("../discord/core/entry.js");

  switch (task.action) {
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
  const { notifyChannel } = await import("../discord/core/entry.js");

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
  const { notifyChannel } = await import("../discord/core/entry.js");

  await notifyChannel("ops",
    `**Escalation**: Task ${task.action} (${task.from} -> ${task.to}) escalated to RED tier.\nDetails: ${JSON.stringify(task.params).slice(0, 500)}\nTask ID: ${task.id}`
  ).catch(() => {});

  await notifyChannel("audit-log",
    `Task ESCALATED: **${task.action}** (${task.from} -> ${task.to}) [${task.id}]`
  ).catch(() => {});
}

/**
 * Check if an error is transient (network timeout, rate limit, etc.)
 * Checks both error message strings and HTTP status codes.
 */
function isTransientError(error: string): boolean {
  const transientPatterns = [
    "timeout",
    "etimedout",
    "econnreset",
    "econnrefused",
    "enotfound",
    "epipe",
    "ehostunreach",
    "enetunreach",
    "rate limit",
    "too many requests",
    "service unavailable",
    "bad gateway",
    "gateway timeout",
    "socket hang up",
    "network error",
    "fetch failed",
  ];
  const lower = error.toLowerCase();
  if (transientPatterns.some(p => lower.includes(p))) return true;

  // Check for HTTP status codes commonly indicating transient failures
  const transientStatusCodes = [429, 502, 503, 504];
  const statusMatch = error.match(/\bstatus[:\s]*(\d{3})\b/i) ?? error.match(/\b(4\d{2}|5\d{2})\b/);
  if (statusMatch) {
    const code = parseInt(statusMatch[1], 10);
    if (transientStatusCodes.includes(code)) return true;
  }

  return false;
}
