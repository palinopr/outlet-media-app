import { runClaude } from "../runner.js";
import { runMetaSync, runTmCheck } from "../scheduler.js";
import { getAgentForChannel } from "../discord/core/router.js";
import { ResourceBusyError, withResourceLocks } from "../state.js";
import { processGmailHistoryPush } from "./gmail-watch-service.js";
import { getServiceSupabase } from "./supabase-service.js";
import {
  buildAgentActivityDigest,
  listRecentAgentActivity,
  safeLogAgentTaskDeferred,
  safeLogAgentTaskRequested,
  safeLogAgentTaskStarted,
  safeLogAgentTaskStatus,
} from "./system-events-service.js";
import { toErrorMessage } from "../utils/error-helpers.js";

const POLL_INTERVAL_MS = 5_000;
const MAX_CONCURRENT_TASKS = 3;

let started = false;
let timer: ReturnType<typeof setInterval> | null = null;
let pumping = false;
let activeWorkers = 0;

interface ExternalTaskRow {
  id: string;
  from_agent: string;
  to_agent: string;
  action: string;
  params: Record<string, unknown> | null;
  tier: "green" | "yellow" | "red" | null;
  status: string;
  started_at?: string | null;
}

const externalTaskRetryCounts = new Map<string, number>();

const WEB_ADMIN_AGENT_CHANNELS: Record<string, string> = {
  assistant: "boss",
  "campaign-monitor": "dashboard",
};

function getPromptParam(task: ExternalTaskRow): string | null {
  const prompt = task.params?.prompt;
  return typeof prompt === "string" ? prompt : null;
}

function isExternalTask(task: ExternalTaskRow): boolean {
  return (
    task.from_agent === "web-admin" ||
    task.from_agent === "gmail-push" ||
    task.from_agent === "whatsapp-cloud"
  );
}

async function claimPendingTask(): Promise<ExternalTaskRow | null> {
  const supabase = getServiceSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("agent_tasks")
    .select("id, from_agent, to_agent, action, params, tier, status")
    .eq("status", "pending")
    .in("from_agent", ["web-admin", "gmail-push", "whatsapp-cloud"])
    .order("started_at", { ascending: true, nullsFirst: true })
    .order("created_at", { ascending: true })
    .limit(20);

  if (error) {
    console.error("[external-dispatcher] fetch failed:", error.message);
    return null;
  }

  for (const task of (data ?? []) as ExternalTaskRow[]) {
    if (!isExternalTask(task)) continue;

    const { data: claimed, error: claimError } = await supabase
      .from("agent_tasks")
      .update({
        status: "running",
        started_at: new Date().toISOString(),
      })
      .eq("id", task.id)
      .eq("status", "pending")
      .select("id, from_agent, to_agent, action, params, tier, status, started_at")
      .maybeSingle();

    if (claimError) {
      console.error(`[external-dispatcher] claim failed for ${task.id}:`, claimError.message);
      continue;
    }

    if (claimed) {
      const claimedTask = claimed as ExternalTaskRow;
      await safeLogAgentTaskRequested(toTimelineTask(claimedTask));
      await safeLogAgentTaskStarted(toTimelineTask(claimedTask));
      return claimedTask;
    }
  }

  return null;
}

function toTimelineTask(task: ExternalTaskRow, overrides: Partial<{
  approvedBy: string | undefined;
  completedAt: Date | undefined;
  error: string | undefined;
  result: unknown;
  startedAt: Date | undefined;
  status: string;
}> = {}) {
  return {
    action: task.action,
    approvedBy: overrides.approvedBy,
    completedAt: overrides.completedAt,
    error: overrides.error,
    from: task.from_agent,
    id: task.id,
    params: task.params ?? {},
    result: overrides.result,
    startedAt: overrides.startedAt ?? (task.started_at ? new Date(task.started_at) : undefined),
    status: overrides.status ?? task.status,
    tier: task.tier ?? "green",
    to: task.to_agent,
  };
}

async function completeTask(task: ExternalTaskRow, result: string): Promise<void> {
  const supabase = getServiceSupabase();
  if (!supabase) return;

  const completedAt = new Date();
  await supabase
    .from("agent_tasks")
    .update({
      status: "completed",
      completed_at: completedAt.toISOString(),
      result: { text: result },
    })
    .eq("id", task.id);

  externalTaskRetryCounts.delete(task.id);
  await safeLogAgentTaskStatus(toTimelineTask(task, {
    completedAt,
    result: { text: result },
    status: "completed",
  }));
}

async function failTask(task: ExternalTaskRow, error: string): Promise<void> {
  const supabase = getServiceSupabase();
  if (!supabase) return;

  const completedAt = new Date();
  await supabase
    .from("agent_tasks")
    .update({
      status: "failed",
      completed_at: completedAt.toISOString(),
      error,
    })
    .eq("id", task.id);

  externalTaskRetryCounts.delete(task.id);
  await safeLogAgentTaskStatus(toTimelineTask(task, {
    completedAt,
    error,
    status: "failed",
  }));
}

async function requeueTask(task: ExternalTaskRow, reason: string): Promise<void> {
  const supabase = getServiceSupabase();
  if (!supabase) return;

  await supabase
    .from("agent_tasks")
    .update({
      status: "pending",
      started_at: null,
    })
    .eq("id", task.id);

  const retryCount = (externalTaskRetryCounts.get(task.id) ?? 0) + 1;
  externalTaskRetryCounts.set(task.id, retryCount);
  await safeLogAgentTaskDeferred(toTimelineTask(task, {
    startedAt: task.started_at ? new Date(task.started_at) : undefined,
  }), reason, retryCount);
}

function getResourceBusyError(err: unknown): ResourceBusyError | null {
  if (err instanceof ResourceBusyError) {
    return err;
  }

  if (!err || typeof err !== "object") {
    return null;
  }

  const wrapped = Reflect.get(err, "error");
  if (wrapped instanceof ResourceBusyError) {
    return wrapped;
  }

  const cause = Reflect.get(err, "cause");
  if (cause instanceof ResourceBusyError) {
    return cause;
  }

  return null;
}

async function executeWebAdminTask(task: ExternalTaskRow): Promise<string> {
  switch (task.to_agent) {
    case "assistant": {
      return await runWebAdminPromptTask(
        task,
        "Give me a concise executive briefing across Outlet Media. Read MEMORY.md and use the durable activity context below first.",
      );
    }
    case "meta-ads": {
      return await runMetaSync({ notify: false, audit: false, source: "web-admin" });
    }
    case "tm-monitor": {
      return await runTmCheck({ notify: false, audit: false, source: "web-admin" });
    }
    case "campaign-monitor": {
      return await runWebAdminPromptTask(
        task,
        "Cross-reference current Meta spend against Ticketmaster sales and flag the campaigns or events that need action right now. Keep it concise and specific.",
      );
    }
    default:
      throw new Error(`Unsupported web-admin task target: ${task.to_agent}`);
  }
}

async function runWebAdminPromptTask(
  task: ExternalTaskRow,
  fallbackPrompt: string,
): Promise<string> {
  const channelName = WEB_ADMIN_AGENT_CHANNELS[task.to_agent];
  if (!channelName) {
    throw new Error(`Unsupported web-admin prompt target: ${task.to_agent}`);
  }

  const recentActivity = await listRecentAgentActivity({ limit: 18, visibility: "admin_only" });
  const activityContext = buildAgentActivityDigest(
    recentActivity,
    "Durable activity context from system_events",
  );
  const prompt = [
    getPromptParam(task) ?? fallbackPrompt,
    "",
    activityContext,
  ].join("\n");
  const agent = getAgentForChannel(channelName);
  const result = await runClaude({
    prompt,
    systemPromptName: agent.promptFile,
    maxTurns: agent.maxTurns,
  });

  if (!result.success && result.error) {
    throw new Error(result.error);
  }

  return result.text;
}

async function executeTask(task: ExternalTaskRow): Promise<string> {
  if (task.from_agent === "gmail-push") {
    const rawHistoryId = task.params?.historyId;
    const historyId =
      typeof rawHistoryId === "string"
        ? rawHistoryId
        : typeof rawHistoryId === "number" || typeof rawHistoryId === "bigint"
          ? String(rawHistoryId)
          : null;

    if (!historyId || historyId.length === 0) {
      return "Ignored Gmail push task without a historyId.";
    }
    return await withResourceLocks("gmail-push", ["gmail-inbox"], async () => {
      return await processGmailHistoryPush(historyId);
    });
  }

  if (task.from_agent === "whatsapp-cloud") {
    const { processWhatsAppTask } = await import("./whatsapp-cloud-service.js");
    return await processWhatsAppTask(task);
  }

  return await executeWebAdminTask(task);
}

async function processTask(task: ExternalTaskRow): Promise<void> {
  try {
    const result = await executeTask(task);
    await completeTask(task, result);
  } catch (err) {
    const busyError = getResourceBusyError(err);
    if (busyError) {
      console.log(
        `[external-dispatcher] deferring ${task.id}; blockers: ${busyError.blockers.join(", ") || "unknown"}`,
      );
      await requeueTask(task, `waiting for ${busyError.blockers.join(", ") || "resource lock"}`);
      return;
    }

    const message = toErrorMessage(err);
    console.error(`[external-dispatcher] task ${task.id} failed:`, message);
    await failTask(task, message);
  } finally {
    activeWorkers = Math.max(0, activeWorkers - 1);
    void pumpQueue();
  }
}

async function pumpQueue(): Promise<void> {
  if (pumping) return;
  pumping = true;

  try {
    while (activeWorkers < MAX_CONCURRENT_TASKS) {
      const task = await claimPendingTask();
      if (!task) break;

      activeWorkers += 1;
      void processTask(task);
    }
  } finally {
    pumping = false;
  }
}

export function startExternalTaskDispatcher(): void {
  if (started) return;
  started = true;

  timer = setInterval(() => {
    void pumpQueue();
  }, POLL_INTERVAL_MS);
  timer.unref?.();

  void pumpQueue();
  console.log("[external-dispatcher] Polling agent_tasks for web-admin, Gmail push, and WhatsApp Cloud work");
}

export function stopExternalTaskDispatcher(): void {
  if (timer) clearInterval(timer);
  timer = null;
  started = false;
}
