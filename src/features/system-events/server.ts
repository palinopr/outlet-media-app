import { currentUser } from "@clerk/nextjs/server";
import { getFeatureReadClient, supabaseAdmin } from "@/lib/supabase";

export type SystemEventName = "campaign_updated";
export type SystemEventVisibility = "admin_only" | "shared";
export type SystemEventActorType = "system" | "user";
export type SystemEventSource = "app" | "backfill" | "webhook" | "worker" | (string & {});

export interface SystemEvent {
  id: string;
  createdAt: string;
  occurredAt: string;
  eventName: SystemEventName | string;
  eventVersion: number;
  visibility: SystemEventVisibility;
  actorType: SystemEventActorType;
  actorId: string | null;
  actorName: string | null;
  clientSlug: string | null;
  source: SystemEventSource;
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

interface ActorInput {
  actorId?: string | null;
  actorName?: string | null;
  actorType?: SystemEventActorType;
}

interface LogSystemEventInput extends ActorInput {
  eventName: SystemEventName;
  summary: string;
  eventVersion?: number;
  detail?: string | null;
  occurredAt?: Date | string | null;
  clientSlug?: string | null;
  visibility?: SystemEventVisibility;
  source?: SystemEventSource | null;
  entityType?: string | null;
  entityId?: string | null;
  pageId?: string | null;
  taskId?: string | null;
  correlationId?: string | null;
  causationId?: string | null;
  idempotencyKey?: string | null;
  metadata?: Record<string, unknown>;
}

interface ListSystemEventsOptions {
  audience?: "all" | SystemEventVisibility;
  clientSlug?: string | null;
  entityId?: string | null;
  entityType?: string | null;
  limit?: number;
}

const LEGACY_SYSTEM_EVENT_SELECT =
  "id, created_at, event_name, visibility, actor_type, actor_id, actor_name, client_slug, summary, detail, entity_type, entity_id, page_id, task_id, metadata";

const SYSTEM_EVENT_SELECT =
  `${LEGACY_SYSTEM_EVENT_SELECT}, event_version, occurred_at, source, correlation_id, causation_id, idempotency_key`;

function metadataString(metadata: Record<string, unknown> | undefined, key: string) {
  const value = metadata?.[key];
  return typeof value === "string" && value.length > 0 ? value : null;
}

function normalizeOccurredAt(value?: Date | string | null) {
  if (value == null) return new Date().toISOString();
  return value instanceof Date ? value.toISOString() : value;
}

function resolveEventSource(input: LogSystemEventInput, metadata: Record<string, unknown>): SystemEventSource {
  return (input.source ?? metadataString(metadata, "source") ?? "app") as SystemEventSource;
}

function resolveCorrelationId(input: LogSystemEventInput, metadata: Record<string, unknown>) {
  return input.correlationId ?? metadataString(metadata, "correlationId");
}

function resolveCausationId(input: LogSystemEventInput, metadata: Record<string, unknown>) {
  return input.causationId ?? metadataString(metadata, "causationId");
}

function resolveIdempotencyKey(input: LogSystemEventInput, metadata: Record<string, unknown>) {
  return input.idempotencyKey ?? metadataString(metadata, "idempotencyKey");
}

function isEnvelopeSchemaError(error: { message?: string | null; details?: string | null } | null) {
  if (!error) return false;
  const text = `${error.message ?? ""} ${error.details ?? ""}`;
  return [
    "event_version",
    "occurred_at",
    "source",
    "correlation_id",
    "causation_id",
    "idempotency_key",
  ].some((field) => text.includes(field));
}

function isSystemEventIdempotencyConflict(error: { code?: string | null; message?: string | null } | null) {
  return Boolean(
    error?.code === "23505" &&
      (error.message?.includes("idx_system_events_source_idempotency_key") ?? false),
  );
}

function mapSystemEventRow(row: Record<string, unknown>): SystemEvent {
  return {
    id: row.id as string,
    createdAt: row.created_at as string,
    occurredAt: (row.occurred_at as string | null) ?? (row.created_at as string),
    eventName: row.event_name as SystemEventName | string,
    eventVersion: (row.event_version as number | null) ?? 1,
    visibility: row.visibility as SystemEventVisibility,
    actorType: row.actor_type as SystemEventActorType,
    actorId: (row.actor_id as string | null) ?? null,
    actorName: (row.actor_name as string | null) ?? null,
    clientSlug: (row.client_slug as string | null) ?? null,
    source: ((row.source as SystemEventSource | null) ?? "app") as SystemEventSource,
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

function buildSystemEventsQuery(
  db: NonNullable<typeof supabaseAdmin>,
  selectClause: string,
  options: ListSystemEventsOptions,
) {
  let query = db
    .from("system_events")
    .select(selectClause)
    .order("created_at", { ascending: false })
    .limit(options.limit ?? 12);

  if (options.clientSlug) query = query.eq("client_slug", options.clientSlug);
  if (options.entityType) query = query.eq("entity_type", options.entityType);
  if (options.entityId) query = query.eq("entity_id", options.entityId);
  if (options.audience && options.audience !== "all") query = query.eq("visibility", options.audience);

  return query;
}

function toActorName(user: Awaited<ReturnType<typeof currentUser>>): string | null {
  if (!user) return null;
  if (user.fullName) return user.fullName;
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return name || user.emailAddresses[0]?.emailAddress || user.username || null;
}

async function resolveActor(input: ActorInput) {
  if (input.actorName && (input.actorId || input.actorType)) {
    return {
      actorId: input.actorId ?? null,
      actorName: input.actorName,
      actorType: input.actorType ?? "user",
    };
  }

  const user = await currentUser();

  return {
    actorId: input.actorId ?? user?.id ?? null,
    actorName: input.actorName ?? toActorName(user),
    actorType: input.actorType ?? "user",
  };
}

export async function getCurrentActor(input: ActorInput = {}) {
  return resolveActor(input);
}

export async function logSystemEvent(input: LogSystemEventInput): Promise<void> {
  if (!supabaseAdmin) return;

  const actor = await resolveActor(input);
  const metadata = input.metadata ?? {};
  const row = {
    event_name: input.eventName,
    event_version: input.eventVersion ?? 1,
    occurred_at: normalizeOccurredAt(input.occurredAt),
    visibility: input.visibility ?? "shared",
    actor_type: actor.actorType,
    actor_id: actor.actorId,
    actor_name: actor.actorName,
    client_slug: input.clientSlug ?? null,
    source: resolveEventSource(input, metadata),
    summary: input.summary,
    detail: input.detail ?? null,
    entity_type: input.entityType ?? null,
    entity_id: input.entityId ?? null,
    page_id: input.pageId ?? null,
    task_id: input.taskId ?? null,
    correlation_id: resolveCorrelationId(input, metadata),
    causation_id: resolveCausationId(input, metadata),
    idempotency_key: resolveIdempotencyKey(input, metadata),
    metadata,
  };

  let { error } = await supabaseAdmin.from("system_events").insert(row);

  if (isSystemEventIdempotencyConflict(error)) return;

  if (isEnvelopeSchemaError(error)) {
    const legacyInsert = await supabaseAdmin.from("system_events").insert({
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
    });
    error = legacyInsert.error;
  }

  if (error) {
    console.error("[system-events] Failed to write event:", error.message);
  }
}

export async function listSystemEvents(
  options: ListSystemEventsOptions = {},
): Promise<SystemEvent[]> {
  const eventReadDb = await getFeatureReadClient(!!options.clientSlug);
  if (!eventReadDb) return [];

  let { data, error } = await buildSystemEventsQuery(eventReadDb, SYSTEM_EVENT_SELECT, options);

  if (isEnvelopeSchemaError(error)) {
    const legacyResult = await buildSystemEventsQuery(eventReadDb, LEGACY_SYSTEM_EVENT_SELECT, options);
    data = legacyResult.data;
    error = legacyResult.error;
  }

  if (error) {
    console.error("[system-events] Failed to list events:", error.message);
    return [];
  }

  return ((data ?? []) as unknown[]).map((row) => mapSystemEventRow(row as Record<string, unknown>));
}
