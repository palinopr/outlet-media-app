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
  approvedBy?: string;
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

  if (taskRegistry.size > 200) pruneTaskRegistry();
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

  if (taskRegistry.size > 200) pruneTaskRegistry();
}

/**
 * Approve a task (from #approvals).
 */
export function approveTask(taskId: string, approvedBy: string): void {
  const task = taskRegistry.get(taskId);
  if (!task) return;

  task.status = "approved";
  task.approvedBy = approvedBy;
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
    approved_by: task.approvedBy ?? null,
  };

  const { error } = await supabase
    .from("agent_tasks")
    .upsert(row, { onConflict: "id" });

  if (error) {
    console.warn("[queue] persist retry after:", error.message);
    const { error: retryError } = await supabase
      .from("agent_tasks")
      .upsert(row, { onConflict: "id" });
    if (retryError) {
      console.error("[queue] persist failed permanently:", retryError.message);
    }
  }
}

/**
 * Remove completed/failed tasks beyond the last 200, and anything older than 24 hours.
 * Called after every completeTask/failTask when registry exceeds 200 entries.
 */
export function pruneTaskRegistry(): void {
  const now = Date.now();
  const DAY_MS = 24 * 60 * 60 * 1000;
  const terminalStatuses = new Set(["completed", "failed", "rejected", "expired"]);
  let pruned = 0;

  // Pass 1: remove terminal tasks older than 24 hours
  for (const [id, task] of taskRegistry) {
    if (terminalStatuses.has(task.status) && now - task.createdAt.getTime() > DAY_MS) {
      taskRegistry.delete(id);
      pruned++;
    }
  }

  // Pass 2: if still over 200, keep only the 200 most recent
  if (taskRegistry.size > 200) {
    const entries = [...taskRegistry.entries()]
      .sort((a, b) => b[1].createdAt.getTime() - a[1].createdAt.getTime());
    const toDelete = entries.slice(200);
    for (const [id] of toDelete) {
      taskRegistry.delete(id);
      pruned++;
    }
  }

  if (pruned > 0) {
    console.log(`[queue] GC: pruned ${pruned} old tasks`);
  }
}
