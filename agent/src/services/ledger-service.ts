import { randomUUID } from "node:crypto";
import { getServiceSupabase } from "./supabase-service.js";
import {
  safeLogAgentTaskRequested,
  safeLogAgentTaskStarted,
  safeLogAgentTaskStatus,
  type AgentTaskTimelineOptions,
} from "./system-events-service.js";

export interface LedgerTask {
  id: string;
  from: string;
  to: string;
  action: string;
  params: Record<string, unknown>;
  tier: "green" | "yellow" | "red";
}

interface PersistedLedgerTaskRow {
  action: string;
  approved_by: string | null;
  completed_at: string | null;
  error: string | null;
  from_agent: string;
  id: string;
  params: Record<string, unknown> | null;
  result: unknown;
  started_at: string | null;
  status: string;
  tier: LedgerTask["tier"] | null;
  to_agent: string;
}

interface CreateLedgerTaskInput {
  action: string;
  from: string;
  params?: Record<string, unknown>;
  startedAt?: string;
  status?: "pending" | "running";
  tier?: "green" | "yellow" | "red";
  timeline?: AgentTaskTimelineOptions;
  to: string;
}

function createTaskId(prefix = "task"): string {
  return `${prefix}_${Date.now().toString(36)}_${randomUUID().slice(0, 8)}`;
}

function toTimelineTask(row: PersistedLedgerTaskRow) {
  return {
    action: row.action,
    approvedBy: row.approved_by ?? undefined,
    completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
    error: row.error ?? undefined,
    from: row.from_agent,
    id: row.id,
    params: row.params ?? {},
    result: row.result ?? undefined,
    startedAt: row.started_at ? new Date(row.started_at) : undefined,
    status: row.status,
    tier: row.tier ?? "green",
    to: row.to_agent,
  };
}

export async function createLedgerTask(input: CreateLedgerTaskInput): Promise<LedgerTask> {
  const task: LedgerTask = {
    id: createTaskId(),
    from: input.from,
    to: input.to,
    action: input.action,
    params: input.params ?? {},
    tier: input.tier ?? "green",
  };

  const supabase = getServiceSupabase();
  if (!supabase) return task;

  const { error } = await supabase.from("agent_tasks").insert({
    id: task.id,
    from_agent: task.from,
    to_agent: task.to,
    action: task.action,
    params: task.params,
    tier: task.tier,
    status: input.status ?? "pending",
    started_at: input.startedAt ?? null,
  });

  if (error) {
    console.error("[ledger] Failed to create task:", error.message);
    return task;
  }

  const timelineTask = {
    action: task.action,
    from: task.from,
    id: task.id,
    params: task.params,
    startedAt: input.status === "running" && input.startedAt ? new Date(input.startedAt) : undefined,
    status: input.status ?? "pending",
    tier: task.tier,
    to: task.to,
  };
  await safeLogAgentTaskRequested(timelineTask, input.timeline);
  if (input.status === "running") {
    await safeLogAgentTaskStarted(timelineTask, input.timeline);
  }

  return task;
}

export async function updateLedgerTask(
  id: string,
  patch: Record<string, unknown>,
  timeline?: AgentTaskTimelineOptions,
): Promise<void> {
  const supabase = getServiceSupabase();
  if (!supabase) return;

  const { data, error } = await supabase
    .from("agent_tasks")
    .update(patch)
    .eq("id", id)
    .select("id, from_agent, to_agent, action, params, tier, status, result, error, started_at, completed_at, approved_by")
    .maybeSingle();

  if (error) {
    console.error(`[ledger] Failed to update task ${id}:`, error.message);
    return;
  }

  if (!data) {
    return;
  }

  const status = typeof patch.status === "string" ? patch.status : null;
  if (status === "running") {
    await safeLogAgentTaskStarted(toTimelineTask(data as PersistedLedgerTaskRow), timeline);
    return;
  }

  if (status) {
    await safeLogAgentTaskStatus(toTimelineTask(data as PersistedLedgerTaskRow), timeline);
  }
}
