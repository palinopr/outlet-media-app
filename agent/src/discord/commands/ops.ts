import { EmbedBuilder, type Client } from "discord.js";
import { getRuntimeState } from "../../services/runtime-state.js";
import { getServiceSupabase } from "../../services/supabase-service.js";
import { listAgentSystemEvents, type AgentSystemEvent } from "../../services/system-events-service.js";

interface OpsTaskRow {
  action: string;
  completed_at: string | null;
  created_at: string;
  error: string | null;
  from_agent: string;
  id: string;
  params: Record<string, unknown> | null;
  started_at: string | null;
  status: string;
  to_agent: string;
}

interface HeartbeatState {
  last_seen?: string;
  source?: string;
}

interface OpsSnapshot {
  deferredEvents: AgentSystemEvent[];
  failedEvents: AgentSystemEvent[];
  heartbeatLastSeen: string | null;
  heartbeatOnline: boolean;
  recentCompleted: OpsTaskRow[];
  tasks: OpsTaskRow[];
}

const LIVE_TASK_STATUSES = new Set(["pending", "running", "escalated", "approved"]);
const PENDING_TASK_STATUSES = new Set(["pending", "approved"]);
const FAILURE_LOOKBACK_MS = 24 * 60 * 60 * 1000;

function clipText(text: string, max = 180): string {
  return text.length <= max ? text : `${text.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
}

function asRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function taskPrompt(task: OpsTaskRow): string | null {
  const params = task.params;
  if (!asRecord(params)) return null;

  const candidates = [
    params.originalRequest,
    params.prompt,
    params.label,
    params.message,
    params.requestType,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate.trim();
    }
  }

  if (typeof params.conversationId === "string") {
    return `conversation ${params.conversationId}`;
  }

  if (typeof params.historyId === "string") {
    return `history ${params.historyId}`;
  }

  return null;
}

function formatAge(iso: string | null | undefined, now = Date.now()): string {
  if (!iso) return "--";

  const ts = new Date(iso).getTime();
  if (!Number.isFinite(ts)) return "--";

  const diffMs = Math.max(0, now - ts);
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "<1m";
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    const remainder = minutes % 60;
    return remainder === 0 ? `${hours}h` : `${hours}h ${remainder}m`;
  }

  const days = Math.floor(hours / 24);
  const remainderHours = hours % 24;
  return remainderHours === 0 ? `${days}d` : `${days}d ${remainderHours}h`;
}

function formatTaskLine(task: OpsTaskRow, now = Date.now()): string {
  const age = formatAge(task.started_at ?? task.created_at, now);
  const prompt = taskPrompt(task);
  const error = task.error ? ` | ${clipText(task.error, 70)}` : "";
  return [
    `• \`${task.to_agent}\` <- \`${task.from_agent}\` · ${task.action} · ${age}${error}`,
    prompt ? `  ${clipText(prompt, 110)}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

function formatEventLine(event: AgentSystemEvent, now = Date.now()): string {
  const prompt =
    typeof event.metadata.reason === "string"
      ? event.metadata.reason
      : typeof event.detail === "string" && event.detail.length > 0
        ? event.detail
        : event.summary;
  const when = formatAge(event.occurredAt, now);
  const taskId = typeof event.metadata.taskId === "string" ? event.metadata.taskId : event.entityId;
  return `• ${clipText(event.summary, 120)} · ${when}${taskId ? ` · \`${taskId}\`` : ""}\n  ${clipText(prompt, 110)}`;
}

function trimFieldLines(lines: string[], emptyText: string, max = 1000): string {
  if (lines.length === 0) return emptyText;

  let total = 0;
  const kept: string[] = [];
  for (const line of lines) {
    const next = total + line.length + (kept.length > 0 ? 1 : 0);
    if (next > max) break;
    kept.push(line);
    total = next;
  }

  if (kept.length === 0) return emptyText;
  if (kept.length < lines.length) kept.push(`… +${lines.length - kept.length} more`);
  return kept.join("\n");
}

function heartbeatStatus(lastSeen: string | null): { online: boolean; label: string } {
  if (!lastSeen) {
    return { online: false, label: "offline" };
  }

  const ageMs = Date.now() - new Date(lastSeen).getTime();
  const online = ageMs < 2 * 60 * 1000;
  return {
    online,
    label: online ? `online · last seen ${formatAge(lastSeen)}` : `offline · last seen ${formatAge(lastSeen)}`,
  };
}

async function readOpsSnapshot(): Promise<OpsSnapshot | null> {
  const supabase = getServiceSupabase();
  if (!supabase) return null;

  const [taskResult, heartbeat, deferredEvents, failedEvents] = await Promise.all([
    supabase
      .from("agent_tasks")
      .select("id, from_agent, to_agent, action, params, status, error, created_at, started_at, completed_at")
      .order("created_at", { ascending: false })
      .limit(120),
    getRuntimeState<HeartbeatState>("heartbeat"),
    listAgentSystemEvents({
      eventNames: ["agent_action_deferred"],
      limit: 8,
      visibility: "admin_only",
    }),
    listAgentSystemEvents({
      eventNames: ["agent_action_failed"],
      limit: 8,
      visibility: "admin_only",
    }),
  ]);

  if (taskResult.error) {
    throw new Error(taskResult.error.message);
  }

  const tasks = (taskResult.data ?? []) as OpsTaskRow[];
  const recentCompleted = tasks
    .filter((task) =>
      task.status === "completed" &&
      !!task.completed_at &&
      Date.now() - new Date(task.completed_at).getTime() < FAILURE_LOOKBACK_MS,
    )
    .sort((left, right) => (right.completed_at ?? "").localeCompare(left.completed_at ?? ""))
    .slice(0, 8);

  const heartbeatLastSeen =
    heartbeat && typeof heartbeat.last_seen === "string"
      ? heartbeat.last_seen
      : null;

  return {
    deferredEvents,
    failedEvents,
    heartbeatLastSeen,
    heartbeatOnline: heartbeatStatus(heartbeatLastSeen).online,
    recentCompleted,
    tasks,
  };
}

function buildOpsEmbed(snapshot: OpsSnapshot): EmbedBuilder {
  const now = Date.now();
  const heartbeat = heartbeatStatus(snapshot.heartbeatLastSeen);

  const running = snapshot.tasks
    .filter((task) => task.status === "running")
    .sort((left, right) => (left.started_at ?? left.created_at).localeCompare(right.started_at ?? right.created_at))
    .slice(0, 6);

  const pending = snapshot.tasks
    .filter((task) => PENDING_TASK_STATUSES.has(task.status))
    .sort((left, right) => left.created_at.localeCompare(right.created_at))
    .slice(0, 6);

  const escalated = snapshot.tasks
    .filter((task) => task.status === "escalated")
    .sort((left, right) => left.created_at.localeCompare(right.created_at))
    .slice(0, 6);

  const liveCount = snapshot.tasks.filter((task) => LIVE_TASK_STATUSES.has(task.status)).length;
  const pendingCount = snapshot.tasks.filter((task) => PENDING_TASK_STATUSES.has(task.status)).length;
  const runningCount = snapshot.tasks.filter((task) => task.status === "running").length;
  const escalatedCount = snapshot.tasks.filter((task) => task.status === "escalated").length;
  const scheduledCount = snapshot.tasks.filter(
    (task) => task.to_agent === "scheduler" && PENDING_TASK_STATUSES.has(task.status),
  ).length;

  const color = !heartbeat.online
    ? 0xf44336
    : snapshot.failedEvents.length > 0
      ? 0xef6c00
      : escalatedCount > 0 || snapshot.deferredEvents.length > 0
        ? 0xffb300
        : 0x43a047;

  return new EmbedBuilder()
    .setTitle("Boss Ops Snapshot")
    .setColor(color)
    .setDescription(
      [
        `Heartbeat: **${heartbeat.label}**`,
        `Live tasks: **${liveCount}** | Running: **${runningCount}** | Pending: **${pendingCount}** | Waiting approval: **${escalatedCount}** | Scheduled: **${scheduledCount}**`,
        `Recent deferred: **${snapshot.deferredEvents.length}** | Recent failures: **${snapshot.failedEvents.length}** | Recent completed: **${snapshot.recentCompleted.length}**`,
      ].join("\n"),
    )
    .addFields(
      {
        name: "Running Now",
        value: trimFieldLines(running.map((task) => formatTaskLine(task, now)), "No running tasks."),
        inline: false,
      },
      {
        name: "Queued / Pending",
        value: trimFieldLines(pending.map((task) => formatTaskLine(task, now)), "No pending tasks."),
        inline: false,
      },
      {
        name: "Waiting Approval",
        value: trimFieldLines(escalated.map((task) => formatTaskLine(task, now)), "No approval blockers."),
        inline: false,
      },
      {
        name: "Recent Retries / Deferrals",
        value: trimFieldLines(snapshot.deferredEvents.map((event) => formatEventLine(event, now)), "No recent deferrals."),
        inline: false,
      },
      {
        name: "Recent Failures",
        value: trimFieldLines(snapshot.failedEvents.map((event) => formatEventLine(event, now)), "No recent failures."),
        inline: false,
      },
      {
        name: "Recent Completed",
        value: trimFieldLines(snapshot.recentCompleted.map((task) => formatTaskLine(task, now)), "No recent completed tasks."),
        inline: false,
      },
    )
    .setTimestamp()
    .setFooter({ text: "Triggered by !ops or /ops" });
}

export async function handleOpsCommand(
  _client?: Client,
): Promise<{ text: string; embed: EmbedBuilder }> {
  const snapshot = await readOpsSnapshot();
  if (!snapshot) {
    return {
      text: "Ops snapshot unavailable. Supabase service client is not configured.",
      embed: new EmbedBuilder()
        .setTitle("Boss Ops Snapshot")
        .setColor(0x9e9e9e)
        .setDescription("Supabase service client is not configured in the agent runtime."),
    };
  }

  return {
    text: "",
    embed: buildOpsEmbed(snapshot),
  };
}

export { buildOpsEmbed, readOpsSnapshot };
