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
const EXTERNAL_TASK_SOURCES = new Set(["web-admin", "gmail-push", "whatsapp-cloud"]);

/** Active tasks per agent (agent key -> task or null) */
const activeSlots = new Map<string, AgentTask | null>();

/** Pending queue per agent */
const pendingQueues = new Map<string, AgentTask[]>();

/** All tasks (for lookup) */
const taskRegistry = new Map<string, AgentTask>();

/** Event bus for task lifecycle events */
export const taskEvents = new EventEmitter();

let supabase: SupabaseClient | null = null;
let taskExecutor: ((task: AgentTask) => Promise<void>) | null = null;

interface PersistedTaskRow {
  id: string;
  from_agent: string;
  to_agent: string;
  action: string;
  params: Record<string, unknown> | null;
  tier: AgentTask["tier"] | null;
  status: AgentTask["status"];
  result: unknown;
  error: string | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  discord_message_id: string | null;
  approved_by: string | null;
}

function reviveTask(row: PersistedTaskRow): AgentTask {
  return {
    id: row.id,
    from: row.from_agent,
    to: row.to_agent,
    action: row.action,
    params: row.params ?? {},
    tier: row.tier ?? "green",
    status: row.status,
    createdAt: new Date(row.created_at),
    startedAt: row.started_at ? new Date(row.started_at) : undefined,
    completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
    result: row.result ?? undefined,
    error: row.error ?? undefined,
    discordMessageId: row.discord_message_id ?? undefined,
    approvedBy: row.approved_by ?? undefined,
  };
}

function runTask(task: AgentTask): void {
  if (!taskExecutor) return;

  void taskExecutor(task).catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    const current = taskRegistry.get(task.id);
    if (current?.status === "running") {
      failTask(task.id, message);
      return;
    }
    console.error(`[queue] task ${task.id} runner failed after state transition:`, message);
  });
}

export function setTaskExecutor(executor: ((task: AgentTask) => Promise<void>) | null): void {
  taskExecutor = executor;
}

export async function initQueue(): Promise<void> {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) {
    supabase = createClient(url, key);
    console.log("[queue] Supabase ledger connected");
  } else {
    console.warn("[queue] Supabase not configured -- tasks will not be persisted");
  }

  // Recover orphaned running tasks from previous crash
  if (supabase) {
    const { data } = await supabase.from("agent_tasks").select("id").eq("status", "running");
    if (data?.length) {
      await supabase.from("agent_tasks").update({ status: "failed", error: "recovered after bot restart" }).eq("status", "running");
      console.log(`[queue] Recovered ${data.length} orphaned running task(s)`);
    }

    const { data: pendingRows, error } = await supabase
      .from("agent_tasks")
      .select(
        "id, from_agent, to_agent, action, params, tier, status, result, error, created_at, started_at, completed_at, discord_message_id, approved_by",
      )
      .eq("status", "pending")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[queue] Failed to recover pending task(s):", error.message);
      return;
    }

    const recoverableRows = ((pendingRows ?? []) as PersistedTaskRow[]).filter(
      (row) => !EXTERNAL_TASK_SOURCES.has(row.from_agent),
    );

    for (const row of recoverableRows) {
      const task = reviveTask(row);
      taskRegistry.set(task.id, task);

      const agentSlot = activeSlots.get(task.to);
      if (!agentSlot && countActive() < MAX_CONCURRENT) {
        startTask(task);
      } else {
        if (!pendingQueues.has(task.to)) pendingQueues.set(task.to, []);
        pendingQueues.get(task.to)!.push(task);
        taskEvents.emit("queued", task);
      }
    }

    if (recoverableRows.length > 0) {
      console.log(`[queue] Recovered ${recoverableRows.length} pending delegated task(s)`);
    }
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
  runTask(task);
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
 * Escalate a task into approval flow without holding an active execution slot.
 */
export function escalateTask(taskId: string): void {
  const task = taskRegistry.get(taskId);
  if (!task) return;

  task.status = "escalated";

  const activeTask = activeSlots.get(task.to);
  if (activeTask?.id === taskId) {
    activeSlots.set(task.to, null);
    processNextForAgent(task.to);
  }

  const queue = pendingQueues.get(task.to);
  if (queue?.length) {
    pendingQueues.set(
      task.to,
      queue.filter((queuedTask) => queuedTask.id !== taskId),
    );
  }

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
  activeSlots.set(task.to, null);
  persistTask(task).catch(() => {});
  taskEvents.emit("rejected", task);

  processNextForAgent(task.to);
}

export async function waitForTaskTerminal(taskId: string, timeoutMs = 300_000): Promise<AgentTask> {
  const existing = taskRegistry.get(taskId);
  if (existing && ["completed", "failed", "rejected", "expired"].includes(existing.status)) {
    return existing;
  }

  return await new Promise<AgentTask>((resolve, reject) => {
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error(`Timed out waiting for task ${taskId} to finish.`));
    }, timeoutMs);

    function maybeResolve(task: AgentTask): void {
      if (task.id !== taskId) return;
      cleanup();
      resolve(task);
    }

    function cleanup(): void {
      clearTimeout(timeout);
      taskEvents.off("completed", maybeResolve);
      taskEvents.off("failed", maybeResolve);
      taskEvents.off("rejected", maybeResolve);
      taskEvents.off("expired", maybeResolve);
    }

    taskEvents.on("completed", maybeResolve);
    taskEvents.on("failed", maybeResolve);
    taskEvents.on("rejected", maybeResolve);
    taskEvents.on("expired", maybeResolve);
  });
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
