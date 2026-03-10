import { getServiceSupabase } from "./supabase-service.js";
import { toErrorMessage } from "../utils/error-helpers.js";

export type AgentSystemEventVisibility = "admin_only" | "shared";
export type AgentSystemEventActorType = "agent" | "system" | "user";

export interface AgentSystemEventInput {
  eventName: string;
  summary: string;
  detail?: string | null;
  occurredAt?: Date | string | null;
  visibility?: AgentSystemEventVisibility;
  actorType?: AgentSystemEventActorType;
  actorId?: string | null;
  actorName?: string | null;
  clientSlug?: string | null;
  source?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  pageId?: string | null;
  taskId?: string | null;
  correlationId?: string | null;
  causationId?: string | null;
  idempotencyKey?: string | null;
  metadata?: Record<string, unknown>;
}

export interface AgentSystemEvent {
  id: string;
  createdAt: string;
  occurredAt: string;
  eventName: string;
  eventVersion: number;
  visibility: AgentSystemEventVisibility;
  actorType: AgentSystemEventActorType;
  actorId: string | null;
  actorName: string | null;
  clientSlug: string | null;
  source: string;
  summary: string;
  detail: string | null;
  entityType: string | null;
  entityId: string | null;
  pageId: string | null;
  taskId: string | null;
  correlationId: string | null;
  causationId: string | null;
  idempotencyKey: string | null;
  metadata: Record<string, unknown>;
}

export interface AgentTaskTimelineInfo {
  id: string;
  action: string;
  from: string;
  to: string;
  params: Record<string, unknown>;
  tier: "green" | "yellow" | "red";
  status: string;
  startedAt?: Date;
  completedAt?: Date;
  approvedBy?: string;
  error?: string;
  result?: unknown;
}

export interface AgentTaskTimelineOptions {
  actorId?: string | null;
  actorName?: string | null;
  actorType?: AgentSystemEventActorType;
  causationId?: string | null;
  clientSlug?: string | null;
  correlationId?: string | null;
  detail?: string | null;
  idempotencyKey?: string | null;
  metadata?: Record<string, unknown>;
  source?: string | null;
  summary?: string;
  visibility?: AgentSystemEventVisibility;
}

export interface AgentActivitySearchOptions {
  clientSlug?: string | null;
  eventNames?: string[];
  keywords?: Array<string | null | undefined>;
  limit?: number;
  visibility?: AgentSystemEventVisibility | "all";
}

export interface LogDiscordAgentTurnInput {
  agentDescription: string;
  agentKey: string;
  channel: string;
  message: string;
  messageId: string;
  response: string;
  user: string;
}

const LEGACY_SYSTEM_EVENT_SELECT =
  "id, created_at, event_name, visibility, actor_type, actor_id, actor_name, client_slug, summary, detail, entity_type, entity_id, page_id, task_id, metadata";

const SYSTEM_EVENT_SELECT =
  `${LEGACY_SYSTEM_EVENT_SELECT}, event_version, occurred_at, source, correlation_id, causation_id, idempotency_key`;

const MAX_ACTIVITY_TEXT = 220;

export const AGENT_ACTIVITY_EVENT_NAMES = [
  "agent_action_requested",
  "agent_action_started",
  "agent_action_completed",
  "agent_action_failed",
  "agent_action_deferred",
  "agent_action_escalated",
  "agent_action_approved",
  "agent_action_rejected",
  "discord_agent_turn_logged",
] as const;

function clipText(value: string | null | undefined, maxLength: number): string {
  if (!value) return "";
  return value.length <= maxLength ? value : `${value.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

function normalizeOccurredAt(value?: Date | string | null) {
  if (value == null) return new Date().toISOString();
  return value instanceof Date ? value.toISOString() : value;
}

function metadataString(metadata: Record<string, unknown>, key: string) {
  const value = metadata[key];
  return typeof value === "string" && value.length > 0 ? value : null;
}

function isEnvelopeSchemaError(error: { message?: string | null; details?: string | null } | null) {
  if (!error) return false;

  const text = `${error.message ?? ""} ${error.details ?? ""}`;
  if (!text) return false;

  return [
    "event_version",
    "occurred_at",
    "source",
    "correlation_id",
    "causation_id",
    "idempotency_key",
  ].some((field) => text.includes(field));
}

function isIdempotencyConflict(error: { code?: string | null; message?: string | null } | null) {
  if (!error) return false;
  return error.code === "23505" &&
    (error.message?.includes("idx_system_events_source_idempotency_key") ?? false);
}

function mapSystemEventRow(row: Record<string, unknown>): AgentSystemEvent {
  return {
    id: row.id as string,
    createdAt: row.created_at as string,
    occurredAt: (row.occurred_at as string | null) ?? (row.created_at as string),
    eventName: row.event_name as string,
    eventVersion: (row.event_version as number | null) ?? 1,
    visibility: ((row.visibility as AgentSystemEventVisibility | null) ?? "admin_only") as AgentSystemEventVisibility,
    actorType: ((row.actor_type as AgentSystemEventActorType | null) ?? "system") as AgentSystemEventActorType,
    actorId: (row.actor_id as string | null) ?? null,
    actorName: (row.actor_name as string | null) ?? null,
    clientSlug: (row.client_slug as string | null) ?? null,
    source: ((row.source as string | null) ?? "worker") as string,
    summary: row.summary as string,
    detail: (row.detail as string | null) ?? null,
    entityType: (row.entity_type as string | null) ?? null,
    entityId: (row.entity_id as string | null) ?? null,
    pageId: (row.page_id as string | null) ?? null,
    taskId: (row.task_id as string | null) ?? null,
    correlationId: (row.correlation_id as string | null) ?? null,
    causationId: (row.causation_id as string | null) ?? null,
    idempotencyKey: (row.idempotency_key as string | null) ?? null,
    metadata: ((row.metadata as Record<string, unknown> | null) ?? {}) as Record<string, unknown>,
  };
}

export async function logAgentSystemEvent(input: AgentSystemEventInput): Promise<void> {
  const supabase = getServiceSupabase();
  if (!supabase) return;

  const metadata = input.metadata ?? {};
  const row = {
    event_name: input.eventName,
    event_version: 1,
    occurred_at: normalizeOccurredAt(input.occurredAt),
    visibility: input.visibility ?? "admin_only",
    actor_type: input.actorType ?? "system",
    actor_id: input.actorId ?? null,
    actor_name: input.actorName ?? null,
    client_slug: input.clientSlug ?? null,
    source: input.source ?? metadataString(metadata, "source") ?? "worker",
    summary: input.summary,
    detail: input.detail ?? null,
    entity_type: input.entityType ?? null,
    entity_id: input.entityId ?? null,
    page_id: input.pageId ?? null,
    task_id: input.taskId ?? null,
    correlation_id: input.correlationId ?? metadataString(metadata, "correlationId") ?? null,
    causation_id: input.causationId ?? metadataString(metadata, "causationId") ?? null,
    idempotency_key: input.idempotencyKey ?? metadataString(metadata, "idempotencyKey") ?? null,
    metadata,
  };

  let { error } = await supabase.from("system_events").insert(row);

  if (isIdempotencyConflict(error)) return;

  if (isEnvelopeSchemaError(error)) {
    const legacyRow = {
      event_name: row.event_name,
      visibility: row.visibility,
      actor_type: row.actor_type,
      actor_id: row.actor_id,
      actor_name: row.actor_name,
      client_slug: row.client_slug,
      summary: row.summary,
      detail: row.detail,
      entity_type: row.entity_type,
      entity_id: row.entity_id,
      page_id: row.page_id,
      task_id: row.task_id,
      metadata: row.metadata,
    };

    const legacyInsert = await supabase.from("system_events").insert(legacyRow);
    error = legacyInsert.error;
  }

  if (error) {
    throw new Error(error.message);
  }
}

export async function safeLogAgentSystemEvent(input: AgentSystemEventInput): Promise<void> {
  try {
    await logAgentSystemEvent(input);
  } catch (error) {
    console.warn(`[system-events] failed to log ${input.eventName}: ${toErrorMessage(error)}`);
  }
}

export async function listAgentSystemEvents(options: {
  clientSlug?: string | null;
  entityId?: string | null;
  entityType?: string | null;
  eventNames?: string[];
  limit?: number;
  visibility?: AgentSystemEventVisibility | "all";
} = {}): Promise<AgentSystemEvent[]> {
  const supabase = getServiceSupabase();
  if (!supabase) return [];

  const queryBuilder = (selectClause: string) => {
    let query = supabase
      .from("system_events")
      .select(selectClause)
      .order("created_at", { ascending: false })
      .limit(options.limit ?? 30);

    if (options.clientSlug) {
      query = query.eq("client_slug", options.clientSlug);
    }

    if (options.entityType) {
      query = query.eq("entity_type", options.entityType);
    }

    if (options.entityId) {
      query = query.eq("entity_id", options.entityId);
    }

    if (options.visibility && options.visibility !== "all") {
      query = query.eq("visibility", options.visibility);
    }

    if (options.eventNames && options.eventNames.length === 1) {
      query = query.eq("event_name", options.eventNames[0]);
    } else if (options.eventNames && options.eventNames.length > 1) {
      query = query.in("event_name", options.eventNames);
    }

    return query;
  };

  let { data, error } = await queryBuilder(SYSTEM_EVENT_SELECT);

  if (isEnvelopeSchemaError(error)) {
    const legacy = await queryBuilder(LEGACY_SYSTEM_EVENT_SELECT);
    data = legacy.data;
    error = legacy.error;
  }

  if (error) {
    console.warn("[system-events] list failed:", error.message);
    return [];
  }

  return ((data ?? []) as unknown as Record<string, unknown>[]).map(mapSystemEventRow);
}

function matchesKeywords(event: AgentSystemEvent, keywords: string[]) {
  if (keywords.length === 0) return true;

  const haystack = JSON.stringify({
    summary: event.summary,
    detail: event.detail,
    metadata: event.metadata,
    actorName: event.actorName,
    clientSlug: event.clientSlug,
  }).toLowerCase();

  return keywords.some((keyword) => haystack.includes(keyword));
}

export async function listRecentAgentActivity(
  options: AgentActivitySearchOptions = {},
): Promise<AgentSystemEvent[]> {
  const keywords = (options.keywords ?? [])
    .map((value) => value?.trim().toLowerCase() ?? "")
    .filter(Boolean);

  const limit = options.limit ?? 24;
  const events = await listAgentSystemEvents({
    clientSlug: options.clientSlug,
    eventNames: options.eventNames ?? [...AGENT_ACTIVITY_EVENT_NAMES],
    limit: keywords.length > 0 ? Math.max(limit * 4, 24) : limit,
    visibility: options.visibility ?? "admin_only",
  });

  return events
    .filter((event) => matchesKeywords(event, keywords))
    .slice(0, limit);
}

export function formatAgentActivityLine(event: AgentSystemEvent): string {
  const stamp = event.occurredAt.slice(0, 16).replace("T", " ");

  if (event.eventName === "discord_agent_turn_logged") {
    const channel = metadataString(event.metadata, "channel") ?? event.entityId ?? "unknown";
    const user = metadataString(event.metadata, "user") ?? event.actorName ?? "unknown";
    const responseSummary =
      metadataString(event.metadata, "responseSummary") ??
      clipText(event.summary, MAX_ACTIVITY_TEXT);
    return `${stamp} #${channel} ${user}: ${clipText(responseSummary, MAX_ACTIVITY_TEXT)}`;
  }

  return `${stamp} ${clipText(event.summary, MAX_ACTIVITY_TEXT)}`;
}

export function buildAgentActivityDigest(
  events: AgentSystemEvent[],
  header = "Recent agent activity",
): string {
  if (events.length === 0) {
    return `${header}: none recorded.`;
  }

  return [
    `${header} (${events.length} events):`,
    ...events.map(formatAgentActivityLine),
  ].join("\n");
}

function baseTaskMetadata(task: AgentTaskTimelineInfo) {
  return {
    action: task.action,
    fromAgent: task.from,
    params: task.params,
    taskId: task.id,
    tier: task.tier,
    toAgent: task.to,
  };
}

export async function safeLogAgentTaskRequested(
  task: AgentTaskTimelineInfo,
  options: AgentTaskTimelineOptions = {},
): Promise<void> {
  await safeLogAgentSystemEvent({
    actorId: options.actorId ?? task.from,
    actorName: options.actorName ?? task.from,
    actorType: options.actorType ?? "agent",
    clientSlug: options.clientSlug ?? null,
    causationId: options.causationId ?? null,
    correlationId: options.correlationId ?? task.id,
    detail: options.detail ?? null,
    entityId: task.id,
    entityType: "agent_task",
    eventName: "agent_action_requested",
    idempotencyKey: options.idempotencyKey ?? `agent_action_requested:${task.id}`,
    metadata: {
      ...baseTaskMetadata(task),
      ...(options.metadata ?? {}),
    },
    source: options.source ?? "worker",
    summary: options.summary ?? `Task requested: ${task.action} -> ${task.to}`,
    visibility: options.visibility ?? "admin_only",
  });
}

export async function safeLogAgentTaskStarted(
  task: AgentTaskTimelineInfo,
  options: AgentTaskTimelineOptions = {},
): Promise<void> {
  const startedAt = task.startedAt?.toISOString() ?? new Date().toISOString();
  await safeLogAgentSystemEvent({
    actorId: options.actorId ?? task.to,
    actorName: options.actorName ?? task.to,
    actorType: options.actorType ?? "agent",
    clientSlug: options.clientSlug ?? null,
    causationId: options.causationId ?? null,
    correlationId: options.correlationId ?? task.id,
    detail: options.detail ?? null,
    entityId: task.id,
    entityType: "agent_task",
    eventName: "agent_action_started",
    idempotencyKey: `agent_action_started:${task.id}:${startedAt}`,
    metadata: {
      ...baseTaskMetadata(task),
      startedAt,
      ...(options.metadata ?? {}),
    },
    occurredAt: startedAt,
    source: options.source ?? "worker",
    summary: options.summary ?? `Task started: ${task.action} -> ${task.to}`,
    visibility: options.visibility ?? "admin_only",
  });
}

export async function safeLogAgentTaskDeferred(
  task: AgentTaskTimelineInfo,
  reason: string,
  retryCount: number,
  options: AgentTaskTimelineOptions = {},
): Promise<void> {
  await safeLogAgentSystemEvent({
    actorId: options.actorId ?? task.to,
    actorName: options.actorName ?? task.to,
    actorType: options.actorType ?? "agent",
    clientSlug: options.clientSlug ?? null,
    causationId: options.causationId ?? null,
    correlationId: options.correlationId ?? task.id,
    detail: options.detail ?? reason,
    entityId: task.id,
    entityType: "agent_task",
    eventName: "agent_action_deferred",
    idempotencyKey: `agent_action_deferred:${task.id}:${retryCount}`,
    metadata: {
      ...baseTaskMetadata(task),
      reason,
      retryCount,
      ...(options.metadata ?? {}),
    },
    source: options.source ?? "worker",
    summary: options.summary ?? `Task deferred: ${task.action} -> ${task.to}`,
    visibility: options.visibility ?? "admin_only",
  });
}

function taskStatusEventName(status: string) {
  switch (status) {
    case "approved":
      return "agent_action_approved";
    case "completed":
      return "agent_action_completed";
    case "escalated":
      return "agent_action_escalated";
    case "failed":
      return "agent_action_failed";
    case "rejected":
      return "agent_action_rejected";
    default:
      return null;
  }
}

export async function safeLogAgentTaskStatus(
  task: AgentTaskTimelineInfo,
  options: AgentTaskTimelineOptions = {},
): Promise<void> {
  const eventName = taskStatusEventName(task.status);
  if (!eventName) return;

  const occurredAt =
    task.completedAt?.toISOString() ??
    task.startedAt?.toISOString() ??
    new Date().toISOString();

  await safeLogAgentSystemEvent({
    actorId: options.actorId ?? (task.status === "approved" ? task.approvedBy ?? task.from : task.to),
    actorName: options.actorName ?? (task.status === "approved" ? task.approvedBy ?? task.from : task.to),
    actorType: options.actorType ?? (task.status === "approved" ? "user" : "agent"),
    clientSlug: options.clientSlug ?? null,
    causationId: options.causationId ?? null,
    correlationId: options.correlationId ?? task.id,
    detail: options.detail ?? task.error ?? null,
    entityId: task.id,
    entityType: "agent_task",
    eventName,
    idempotencyKey: `${eventName}:${task.id}:${occurredAt}`,
    metadata: {
      ...baseTaskMetadata(task),
      approvedBy: task.approvedBy ?? null,
      error: task.error ?? null,
      result: task.result ?? null,
      status: task.status,
      ...(options.metadata ?? {}),
    },
    occurredAt,
    source: options.source ?? "worker",
    summary: options.summary ?? `Task ${task.status}: ${task.action} -> ${task.to}`,
    visibility: options.visibility ?? "admin_only",
  });
}

export async function logDiscordAgentTurn(input: LogDiscordAgentTurnInput): Promise<void> {
  const message = clipText(input.message, MAX_ACTIVITY_TEXT);
  const responseSummary = clipText(input.response, MAX_ACTIVITY_TEXT);
  await safeLogAgentSystemEvent({
    actorId: input.agentKey,
    actorName: input.agentDescription,
    actorType: "agent",
    causationId: input.messageId,
    correlationId: input.messageId,
    detail: `${input.user}: ${message}\n${input.agentDescription}: ${responseSummary}`.trim(),
    entityId: input.channel,
    entityType: "discord_channel",
    eventName: "discord_agent_turn_logged",
    idempotencyKey: `discord_agent_turn_logged:${input.messageId}`,
    metadata: {
      agent: input.agentDescription,
      agentKey: input.agentKey,
      channel: input.channel,
      message,
      responseSummary,
      user: input.user,
    },
    source: "worker",
    summary: `${input.agentDescription} replied in #${input.channel}`,
    visibility: "admin_only",
  });
}
