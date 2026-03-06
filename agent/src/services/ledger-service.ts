import { randomUUID } from "node:crypto";
import { getServiceSupabase } from "./supabase-service.js";

export interface LedgerTask {
  id: string;
  from: string;
  to: string;
  action: string;
  params: Record<string, unknown>;
  tier: "green" | "yellow" | "red";
}

function createTaskId(prefix = "task"): string {
  return `${prefix}_${Date.now().toString(36)}_${randomUUID().slice(0, 8)}`;
}

export async function createLedgerTask(input: {
  from: string;
  to: string;
  action: string;
  params?: Record<string, unknown>;
  tier?: "green" | "yellow" | "red";
  status?: "pending" | "running";
  startedAt?: string;
}): Promise<LedgerTask> {
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
  }

  return task;
}

export async function updateLedgerTask(
  id: string,
  patch: Record<string, unknown>,
): Promise<void> {
  const supabase = getServiceSupabase();
  if (!supabase) return;

  const { error } = await supabase
    .from("agent_tasks")
    .update(patch)
    .eq("id", id);

  if (error) {
    console.error(`[ledger] Failed to update task ${id}:`, error.message);
  }
}
