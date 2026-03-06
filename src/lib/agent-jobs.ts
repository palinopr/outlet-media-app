import { supabaseAdmin } from "@/lib/supabase";
import type { Database, Json } from "@/lib/database.types";

type AgentTaskRow = Database["public"]["Tables"]["agent_tasks"]["Row"];
type RuntimeStateRow = Database["public"]["Tables"]["agent_runtime_state"]["Row"];
type AgentTaskJobRow = Pick<
  AgentTaskRow,
  | "completed_at"
  | "created_at"
  | "error"
  | "from_agent"
  | "id"
  | "params"
  | "result"
  | "started_at"
  | "status"
  | "to_agent"
>;

export interface AgentJobView {
  id: string;
  agent_id: string;
  status: "pending" | "running" | "done" | "error";
  prompt: string | null;
  result: string | null;
  error: string | null;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
}

const DISPLAYABLE_TO_AGENTS = new Set([
  "assistant",
  "meta-ads",
  "tm-monitor",
  "campaign-monitor",
  "think",
  "email-agent",
  "don-omar-agent",
]);

const DISPLAYABLE_FROM_AGENTS = new Set([
  "web-admin",
  "scheduler",
  "gmail-push",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function taskStatusToUiStatus(status: string): AgentJobView["status"] {
  if (status === "running") return "running";
  if (status === "completed") return "done";
  if (status === "failed" || status === "rejected" || status === "expired") return "error";
  return "pending";
}

function jsonToText(value: Json | null): string | null {
  if (value == null) return null;
  if (typeof value === "string") return value;
  if (isRecord(value) && typeof value.text === "string") return value.text;
  return JSON.stringify(value, null, 2);
}

function taskPrompt(task: AgentTaskJobRow): string | null {
  if (!isRecord(task.params)) return null;
  if (typeof task.params.prompt === "string") return task.params.prompt;
  if (typeof task.params.label === "string") return task.params.label;
  return null;
}

function isDisplayableTask(task: AgentTaskJobRow): boolean {
  return DISPLAYABLE_FROM_AGENTS.has(task.from_agent) || DISPLAYABLE_TO_AGENTS.has(task.to_agent);
}

export function mapTaskToJob(task: AgentTaskJobRow): AgentJobView {
  return {
    id: task.id,
    agent_id: task.to_agent,
    status: taskStatusToUiStatus(task.status),
    prompt: taskPrompt(task),
    result: jsonToText(task.result),
    error: task.error,
    created_at: task.created_at ?? new Date().toISOString(),
    started_at: task.started_at,
    finished_at: task.completed_at,
  };
}

export async function listAgentJobs(limit = 80): Promise<AgentJobView[]> {
  if (!supabaseAdmin) return [];

  const { data, error } = await supabaseAdmin
    .from("agent_tasks")
    .select("id, from_agent, to_agent, action, params, status, result, error, created_at, started_at, completed_at")
    .order("created_at", { ascending: false })
    .limit(limit * 3);

  if (error) {
    console.error("[agent-jobs] list failed:", error.message);
    return [];
  }

  return (data ?? [])
    .filter(isDisplayableTask)
    .slice(0, limit)
    .map(mapTaskToJob);
}

export async function getAgentJob(id: string): Promise<AgentJobView | null> {
  if (!supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from("agent_tasks")
    .select("id, from_agent, to_agent, action, params, status, result, error, created_at, started_at, completed_at")
    .eq("id", id)
    .maybeSingle();

  if (error || !data || !isDisplayableTask(data)) {
    return null;
  }

  return mapTaskToJob(data);
}

export async function getLatestAgentStatuses(agentIds: readonly string[]): Promise<Array<{
  agent_id: string;
  status: AgentJobView["status"];
  last_run: string | null;
  last_result: string | null;
}>> {
  const jobs = await listAgentJobs(200);
  const latest = new Map<string, AgentJobView>();

  for (const job of jobs) {
    if (!agentIds.includes(job.agent_id)) continue;
    if (!latest.has(job.agent_id)) latest.set(job.agent_id, job);
  }

  return agentIds.map((agentId) => {
    const job = latest.get(agentId);
    return {
      agent_id: agentId,
      status: job?.status ?? "pending",
      last_run: job?.finished_at ?? null,
      last_result: job?.result ?? null,
    };
  });
}

export async function getHeartbeatStatus(): Promise<{ isOnline: boolean; lastSeen: string | null }> {
  if (!supabaseAdmin) return { isOnline: false, lastSeen: null };

  const { data, error } = await supabaseAdmin
    .from("agent_runtime_state")
    .select("value")
    .eq("key", "heartbeat")
    .maybeSingle();

  if (error || !data) {
    return { isOnline: false, lastSeen: null };
  }

  const value = (data as RuntimeStateRow).value;
  const lastSeen =
    isRecord(value) && typeof value.last_seen === "string"
      ? value.last_seen
      : null;

  const isOnline = lastSeen
    ? Date.now() - new Date(lastSeen).getTime() < 2 * 60 * 1000
    : false;

  return { isOnline, lastSeen };
}
