import { supabaseAdmin } from "@/lib/supabase";
import type {
  AgentAnswerBlock,
  AgentResponseStatus,
  ClientAgentScope,
  ReferencedEntity,
  ResolvedRange,
} from "./types";
import { ReferencedEntitySchema } from "./types";
import {
  type ThreadContextPayload,
  ThreadContextPayloadSchema,
} from "./thread-context";

type StoreCode = "not_found" | "preview_unavailable" | "write_failed";

type StoreFailure = {
  ok: false;
  code: StoreCode;
};

type ThreadListItem = {
  threadId: string;
  title: string | null;
  previewText: string | null;
  referencedEntities: ReferencedEntity[];
  lastResponseStatus: AgentResponseStatus | null;
  lastMessageAt: string;
  updatedAt: string;
  createdAt: string;
};

type ThreadMessage = {
  messageId: string;
  role: "user" | "assistant";
  status: AgentResponseStatus | null;
  text: string;
  blocks: AgentAnswerBlock[];
  referencedEntities: ReferencedEntity[];
  contextPayload: ThreadContextPayload | null;
  resolvedRange: ResolvedRange | null;
  providerResponseId: string | null;
  clientGeneratedId: string | null;
  createdAt: string;
};

type ThreadDetail = ThreadListItem & {
  messages: ThreadMessage[];
};

type ThreadSuccess = {
  ok: true;
  thread: ThreadListItem;
};

type MessageSuccess = {
  ok: true;
  message: ThreadMessage;
};

type ThreadRow = {
  id: string;
  client_id: string;
  client_member_id: string | null;
  title: string | null;
  preview_text: string | null;
  referenced_entities: unknown;
  last_response_status: AgentResponseStatus | null;
  last_message_at: string;
  created_at: string;
  updated_at: string;
};

type MessageRow = {
  id: string;
  thread_id: string;
  role: "user" | "assistant";
  response_status: AgentResponseStatus | null;
  text: string;
  blocks: AgentAnswerBlock[] | null;
  referenced_entities: unknown;
  context_payload: unknown;
  resolved_range: ResolvedRange | null;
  provider_response_id: string | null;
  client_generated_id: string | null;
  created_at: string;
};

function previewUnavailable(): StoreFailure {
  return { ok: false, code: "preview_unavailable" };
}

function notFound(): StoreFailure {
  return { ok: false, code: "not_found" };
}

function writeFailed(): StoreFailure {
  return { ok: false, code: "write_failed" };
}

function isEntityAllowed(scope: ClientAgentScope, entity: ReferencedEntity) {
  if (entity.entityType === "campaign") {
    return scope.allowedCampaignIds == null || scope.allowedCampaignIds.includes(entity.entityId);
  }

  if (entity.entityType === "creative") {
    return scope.allowedCampaignIds == null || scope.allowedCampaignIds.includes(entity.campaignId);
  }

  if (!scope.eventsEnabled) {
    return false;
  }

  return scope.allowedEventIds == null || scope.allowedEventIds.includes(entity.entityId);
}

function normalizeReferencedEntities(value: unknown): ReferencedEntity[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry) => {
    const parsed = ReferencedEntitySchema.safeParse(entry);
    return parsed.success ? [parsed.data] : [];
  });
}

function normalizeThreadContextPayload(value: unknown): ThreadContextPayload | null {
  const parsed = ThreadContextPayloadSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

function isThreadVisible(scope: ClientAgentScope, thread: ThreadRow) {
  if (thread.client_id !== scope.clientId) {
    return false;
  }

  if (thread.client_member_id !== scope.clientMemberId) {
    return false;
  }

  return normalizeReferencedEntities(thread.referenced_entities).every((entity) =>
    isEntityAllowed(scope, entity),
  );
}

function uniqueReferencedEntities(entities: ReferencedEntity[]) {
  const seen = new Set<string>();
  const result: ReferencedEntity[] = [];

  for (const entity of entities) {
    const key =
      entity.entityType === "creative"
        ? `${entity.entityType}:${entity.entityId}:${entity.campaignId}`
        : `${entity.entityType}:${entity.entityId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(entity);
  }

  return result;
}

function truncate(value: string, limit: number) {
  return value.slice(0, limit);
}

function mapThreadRow(row: ThreadRow): ThreadListItem {
  return {
    threadId: row.id,
    title: row.title,
    previewText: row.preview_text,
    referencedEntities: normalizeReferencedEntities(row.referenced_entities),
    lastResponseStatus: row.last_response_status,
    lastMessageAt: row.last_message_at,
    updatedAt: row.updated_at,
    createdAt: row.created_at,
  };
}

function mapMessageRow(row: MessageRow): ThreadMessage {
  return {
    messageId: row.id,
    role: row.role,
    status: row.response_status,
    text: row.text,
    blocks: Array.isArray(row.blocks) ? row.blocks : [],
    referencedEntities: normalizeReferencedEntities(row.referenced_entities),
    contextPayload: normalizeThreadContextPayload(row.context_payload),
    resolvedRange: row.resolved_range,
    providerResponseId: row.provider_response_id,
    clientGeneratedId: row.client_generated_id,
    createdAt: row.created_at,
  };
}

function isMessageVisible(scope: ClientAgentScope, message: MessageRow) {
  if (message.role !== "assistant") {
    return true;
  }

  const referencedEntities = normalizeReferencedEntities(message.referenced_entities);
  const contextPayload = normalizeThreadContextPayload(message.context_payload);

  return (
    referencedEntities.every((entity) => isEntityAllowed(scope, entity)) &&
    (contextPayload?.referencedEntities.every((entity) => isEntityAllowed(scope, entity)) ?? true)
  );
}

async function loadThreadRow(threadId: string): Promise<ThreadRow | null> {
  if (!supabaseAdmin) return null;

  const { data } = await supabaseAdmin
    .from("client_agent_threads")
    .select("*")
    .eq("id", threadId)
    .maybeSingle();

  return (data as ThreadRow | null) ?? null;
}

async function loadThreadMessages(threadId: string): Promise<MessageRow[]> {
  if (!supabaseAdmin) return [];

  const { data } = await supabaseAdmin
    .from("client_agent_messages")
    .select("*")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  return ((data ?? []) as MessageRow[]).map((row) => ({ ...row }));
}

async function loadMessageByField(
  threadId: string,
  field: "client_generated_id" | "provider_response_id",
  value: string,
): Promise<MessageRow | null> {
  if (!supabaseAdmin) return null;

  const { data } = await supabaseAdmin
    .from("client_agent_messages")
    .select("*")
    .eq("thread_id", threadId)
    .eq(field, value)
    .maybeSingle();

  return (data as MessageRow | null) ?? null;
}

async function refreshThreadSummary(threadId: string) {
  if (!supabaseAdmin) return false;

  const [threadRow, messageRows] = await Promise.all([
    loadThreadRow(threadId),
    loadThreadMessages(threadId),
  ]);

  if (!threadRow) return false;

  const firstUserMessage = messageRows.find((message) => message.role === "user");
  const latestAssistantMessage = [...messageRows]
    .reverse()
    .find((message) => message.role === "assistant");
  const referencedEntities = uniqueReferencedEntities(
    messageRows
      .filter((message) => message.role === "assistant")
      .flatMap((message) => normalizeReferencedEntities(message.referenced_entities)),
  );
  const latestMessage = messageRows.at(-1);
  const summaryTimestamp = latestMessage?.created_at ?? threadRow.updated_at;

  const { error } = await supabaseAdmin
    .from("client_agent_threads")
    .update({
      title: firstUserMessage ? truncate(firstUserMessage.text, 80) : threadRow.title,
      preview_text: latestAssistantMessage ? truncate(latestAssistantMessage.text, 140) : null,
      referenced_entities: referencedEntities,
      last_response_status: latestAssistantMessage?.response_status ?? null,
      last_message_at: summaryTimestamp,
      updated_at: summaryTimestamp,
    })
    .eq("id", threadId);

  return !error;
}

export async function createThread({
  scope,
}: {
  scope: ClientAgentScope;
}): Promise<ThreadSuccess | StoreFailure> {
  if (scope.viewer === "admin_preview") {
    return previewUnavailable();
  }

  if (!supabaseAdmin) {
    return notFound();
  }

  const now = new Date().toISOString();
  const row: ThreadRow = {
    id: crypto.randomUUID(),
    client_id: scope.clientId,
    client_member_id: scope.clientMemberId,
    title: null,
    preview_text: null,
    referenced_entities: [],
    last_response_status: null,
    last_message_at: now,
    created_at: now,
    updated_at: now,
  };

  const { error } = await supabaseAdmin.from("client_agent_threads").insert(row);
  if (error) {
    return writeFailed();
  }

  return { ok: true, thread: mapThreadRow(row) };
}

export async function listThreads({
  scope,
}: {
  scope: ClientAgentScope;
}): Promise<ThreadListItem[]> {
  if (scope.viewer === "admin_preview" || !supabaseAdmin) {
    return [];
  }

  const { data } = await supabaseAdmin
    .from("client_agent_threads")
    .select("*")
    .eq("client_id", scope.clientId)
    .eq("client_member_id", scope.clientMemberId)
    .order("updated_at", { ascending: false });

  const visibleRows = await Promise.all(
    ((data ?? []) as ThreadRow[]).map(async (row) => {
      if (!isThreadVisible(scope, row)) {
        return null;
      }

      const messageRows = await loadThreadMessages(row.id);
      if (!messageRows.every((message) => isMessageVisible(scope, message))) {
        return null;
      }

      return row;
    }),
  );

  return visibleRows.filter((row): row is ThreadRow => row != null).map(mapThreadRow);
}

export async function getThread({
  threadId,
  scope,
}: {
  threadId: string;
  scope: ClientAgentScope;
}): Promise<ThreadDetail | null> {
  if (scope.viewer === "admin_preview" || !supabaseAdmin) {
    return null;
  }

  const threadRow = await loadThreadRow(threadId);
  if (!threadRow || !isThreadVisible(scope, threadRow)) {
    return null;
  }

  const messageRows = await loadThreadMessages(threadId);
  if (!messageRows.every((message) => isMessageVisible(scope, message))) {
    return null;
  }

  return {
    ...mapThreadRow(threadRow),
    messages: messageRows.map(mapMessageRow),
  };
}

export async function appendUserMessage({
  threadId,
  scope,
  text,
  clientGeneratedId,
}: {
  threadId: string;
  scope: ClientAgentScope;
  text: string;
  clientGeneratedId: string;
}): Promise<MessageSuccess | StoreFailure> {
  if (scope.viewer === "admin_preview") {
    return previewUnavailable();
  }

  const thread = await getThread({ threadId, scope });
  if (!thread || !supabaseAdmin) {
    return notFound();
  }

  const existingRow = await loadMessageByField(threadId, "client_generated_id", clientGeneratedId);
  if (existingRow) {
    if (!(await refreshThreadSummary(threadId))) {
      return writeFailed();
    }

    return { ok: true, message: mapMessageRow(existingRow) };
  }

  const now = new Date().toISOString();
  const row: MessageRow = {
    id: crypto.randomUUID(),
    thread_id: threadId,
    role: "user",
    response_status: null,
    text,
    blocks: [],
    referenced_entities: [],
    context_payload: null,
    resolved_range: null,
    provider_response_id: null,
    client_generated_id: clientGeneratedId,
    created_at: now,
  };

  const { error } = await supabaseAdmin.from("client_agent_messages").insert(row);
  if (error) {
    return writeFailed();
  }

  if (!(await refreshThreadSummary(threadId))) {
    return writeFailed();
  }

  return { ok: true, message: mapMessageRow(row) };
}

export async function appendAssistantMessage({
  threadId,
  scope,
  status,
  text,
  blocks,
  referencedEntities,
  contextPayload = null,
  resolvedRange,
  providerResponseId,
}: {
  threadId: string;
  scope: ClientAgentScope;
  status: AgentResponseStatus;
  text: string;
  blocks: AgentAnswerBlock[];
  referencedEntities: ReferencedEntity[];
  contextPayload?: ThreadContextPayload | null;
  resolvedRange: ResolvedRange | null;
  providerResponseId: string | null;
}): Promise<MessageSuccess | StoreFailure> {
  if (scope.viewer === "admin_preview") {
    return previewUnavailable();
  }

  const thread = await getThread({ threadId, scope });
  if (!thread || !supabaseAdmin) {
    return notFound();
  }

  if (providerResponseId) {
    const existingRow = await loadMessageByField(threadId, "provider_response_id", providerResponseId);
    if (existingRow) {
      if (!(await refreshThreadSummary(threadId))) {
        return writeFailed();
      }

      return { ok: true, message: mapMessageRow(existingRow) };
    }
  }

  const now = new Date().toISOString();
  const row: MessageRow = {
    id: crypto.randomUUID(),
    thread_id: threadId,
    role: "assistant",
    response_status: status,
    text,
    blocks,
    referenced_entities: referencedEntities,
    context_payload: contextPayload,
    resolved_range: resolvedRange,
    provider_response_id: providerResponseId,
    client_generated_id: null,
    created_at: now,
  };

  const { error } = await supabaseAdmin.from("client_agent_messages").insert(row);
  if (error) {
    return writeFailed();
  }

  if (!(await refreshThreadSummary(threadId))) {
    return writeFailed();
  }

  return { ok: true, message: mapMessageRow(row) };
}

export async function touchThreadSummary({
  threadId,
  scope,
}: {
  threadId: string;
  scope: ClientAgentScope;
}): Promise<StoreFailure | { ok: true }> {
  if (scope.viewer === "admin_preview") {
    return previewUnavailable();
  }

  const thread = await getThread({ threadId, scope });
  if (!thread) {
    return notFound();
  }

  if (!(await refreshThreadSummary(threadId))) {
    return writeFailed();
  }

  return { ok: true };
}
