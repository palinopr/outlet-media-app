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
  agentTaskId: string | null;
  clientRequestId: string | null;
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

type QueuedTurn = {
  threadId: string;
  clientRequestId: string;
  userMessageId: string;
  assistantMessageId: string;
  taskId: string;
  wasExisting: boolean;
};

type QueuedTurnSuccess = {
  ok: true;
  queued: QueuedTurn;
};

type ThreadRow = {
  id: string;
  client_id: string;
  client_member_id: string | null;
  viewer_context: "member" | "admin_preview";
  preview_admin_user_id: string | null;
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
  agent_task_id: string | null;
  client_request_id: string | null;
  created_at: string;
};

type QueuedTurnRow = {
  thread_id: string;
  client_request_id: string;
  user_message_id: string;
  assistant_message_id: string;
  agent_task_id: string;
  was_existing: boolean;
};

class StoreReadError extends Error {
  constructor() {
    super("store_read_failed");
    this.name = "StoreReadError";
  }
}

export function isStoreReadError(error: unknown): error is StoreReadError {
  return error instanceof StoreReadError;
}

function previewUnavailable(): StoreFailure {
  return { ok: false, code: "preview_unavailable" };
}

function notFound(): StoreFailure {
  return { ok: false, code: "not_found" };
}

function writeFailed(): StoreFailure {
  return { ok: false, code: "write_failed" };
}

function previewAdminUserIdFromScope(scope: ClientAgentScope) {
  if (scope.viewer !== "admin_preview") {
    return null;
  }

  const prefix = "admin_preview:";
  return scope.clientMemberId.startsWith(prefix)
    ? scope.clientMemberId.slice(prefix.length)
    : scope.clientMemberId;
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

  if (scope.viewer === "admin_preview") {
    if (thread.viewer_context !== "admin_preview") {
      return false;
    }

    if (thread.preview_admin_user_id !== previewAdminUserIdFromScope(scope)) {
      return false;
    }
  } else {
    if (thread.viewer_context !== "member") {
      return false;
    }

    if (thread.client_member_id !== scope.clientMemberId) {
      return false;
    }
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
    agentTaskId: row.agent_task_id,
    clientRequestId: row.client_request_id,
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

  const { data, error } = await supabaseAdmin
    .from("client_agent_threads")
    .select("*")
    .eq("id", threadId)
    .maybeSingle();

  if (error) {
    throw new StoreReadError();
  }

  return (data as ThreadRow | null) ?? null;
}

async function loadThreadMessages(threadId: string): Promise<MessageRow[]> {
  if (!supabaseAdmin) return [];

  const { data, error } = await supabaseAdmin
    .from("client_agent_messages")
    .select("*")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new StoreReadError();
  }

  return ((data ?? []) as MessageRow[]).map((row) => ({ ...row }));
}

async function loadMessageByField(
  threadId: string,
  field: "client_generated_id" | "provider_response_id" | "client_request_id",
  value: string,
): Promise<MessageRow | null> {
  if (!supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from("client_agent_messages")
    .select("*")
    .eq("thread_id", threadId)
    .eq(field, value)
    .maybeSingle();

  if (error) {
    throw new StoreReadError();
  }

  return (data as MessageRow | null) ?? null;
}

async function loadMessageById({
  messageId,
  threadId,
}: {
  messageId: string;
  threadId: string;
}): Promise<MessageRow | null> {
  if (!supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from("client_agent_messages")
    .select("*")
    .eq("id", messageId)
    .eq("thread_id", threadId)
    .maybeSingle();

  if (error) {
    throw new StoreReadError();
  }

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
  if (!supabaseAdmin) {
    return notFound();
  }

  const now = new Date().toISOString();
  const row: ThreadRow = {
    id: crypto.randomUUID(),
    client_id: scope.clientId,
    client_member_id: scope.viewer === "member" ? scope.clientMemberId : null,
    viewer_context: scope.viewer,
    preview_admin_user_id: previewAdminUserIdFromScope(scope),
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
  if (!supabaseAdmin) {
    return [];
  }

  let query = supabaseAdmin
    .from("client_agent_threads")
    .select("*")
    .eq("client_id", scope.clientId)
    .eq("viewer_context", scope.viewer)
    .order("updated_at", { ascending: false });

  if (scope.viewer === "admin_preview") {
    query = query.eq("preview_admin_user_id", previewAdminUserIdFromScope(scope));
  } else {
    query = query.eq("client_member_id", scope.clientMemberId);
  }

  const { data } = await query;

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
  if (!supabaseAdmin) {
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

export async function createOrLoadPreviewThread({
  threadId,
  scope,
}: {
  threadId: string;
  scope: ClientAgentScope;
}): Promise<ThreadSuccess | StoreFailure> {
  if (scope.viewer !== "admin_preview") {
    return previewUnavailable();
  }

  try {
    const existing = await getThread({ threadId, scope });
    if (existing) {
      return { ok: true, thread: existing };
    }
  } catch (error) {
    if (isStoreReadError(error)) {
      return writeFailed();
    }

    throw error;
  }

  return createThread({ scope });
}

export async function queueTurn({
  threadId,
  scope,
  clientSlug,
  clientRequestId,
  text,
}: {
  threadId: string;
  scope: ClientAgentScope;
  clientSlug: string;
  clientRequestId: string;
  text: string;
}): Promise<QueuedTurnSuccess | StoreFailure> {
  if (!supabaseAdmin) {
    return notFound();
  }

  try {
    const thread = await getThread({ threadId, scope });
    if (!thread) {
      return notFound();
    }
  } catch (error) {
    if (isStoreReadError(error)) {
      return writeFailed();
    }

    throw error;
  }

  const { data, error } = await supabaseAdmin.rpc("queue_client_agent_turn", {
    p_thread_id: threadId,
    p_client_slug: clientSlug,
    p_viewer_context: scope.viewer,
    p_client_member_id: scope.viewer === "member" ? scope.clientMemberId : null,
    p_preview_admin_user_id: previewAdminUserIdFromScope(scope),
    p_client_request_id: clientRequestId,
    p_text: text,
  });

  const row = ((data ?? []) as QueuedTurnRow[])[0];
  if (error || !row) {
    return writeFailed();
  }

  return {
    ok: true,
    queued: {
      threadId: row.thread_id,
      clientRequestId: row.client_request_id,
      userMessageId: row.user_message_id,
      assistantMessageId: row.assistant_message_id,
      taskId: row.agent_task_id,
      wasExisting: row.was_existing,
    },
  };
}

async function updateAssistantPlaceholder({
  assistantMessageId,
  threadId,
  scope,
  status,
  text,
  blocks,
  referencedEntities,
  contextPayload,
  resolvedRange,
  providerResponseId,
}: {
  assistantMessageId: string;
  threadId: string;
  scope: ClientAgentScope;
  status: AgentResponseStatus;
  text: string;
  blocks: AgentAnswerBlock[];
  referencedEntities: ReferencedEntity[];
  contextPayload: ThreadContextPayload | null;
  resolvedRange: ResolvedRange | null;
  providerResponseId: string | null;
}): Promise<MessageSuccess | StoreFailure> {
  if (!supabaseAdmin) {
    return notFound();
  }

  try {
    const thread = await getThread({ threadId, scope });
    if (!thread) {
      return notFound();
    }

    const existingRow = await loadMessageById({ messageId: assistantMessageId, threadId });
    if (!existingRow || existingRow.role !== "assistant") {
      return notFound();
    }

    if (existingRow.response_status != null && existingRow.response_status !== "pending") {
      return {
        ok: true,
        message: mapMessageRow(existingRow),
      };
    }

    const { error } = await supabaseAdmin
      .from("client_agent_messages")
      .update({
        response_status: status,
        text,
        blocks,
        referenced_entities: referencedEntities,
        context_payload: contextPayload,
        resolved_range: resolvedRange,
        provider_response_id: providerResponseId,
      })
      .eq("id", assistantMessageId)
      .eq("thread_id", threadId);

    if (error) {
      return writeFailed();
    }

    if (!(await refreshThreadSummary(threadId))) {
      return writeFailed();
    }

    const updatedRow = await loadMessageById({ messageId: assistantMessageId, threadId });
    if (!updatedRow) {
      return notFound();
    }

    return {
      ok: true,
      message: mapMessageRow(updatedRow),
    };
  } catch (error) {
    if (isStoreReadError(error)) {
      return writeFailed();
    }

    throw error;
  }
}

export async function resolvePendingAssistantMessage({
  assistantMessageId,
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
  assistantMessageId: string;
  threadId: string;
  scope: ClientAgentScope;
  status: Exclude<AgentResponseStatus, "pending">;
  text: string;
  blocks: AgentAnswerBlock[];
  referencedEntities: ReferencedEntity[];
  contextPayload?: ThreadContextPayload | null;
  resolvedRange: ResolvedRange | null;
  providerResponseId: string | null;
}): Promise<MessageSuccess | StoreFailure> {
  return updateAssistantPlaceholder({
    assistantMessageId,
    threadId,
    scope,
    status,
    text,
    blocks,
    referencedEntities,
    contextPayload,
    resolvedRange,
    providerResponseId,
  });
}

export async function failPendingAssistantMessage({
  assistantMessageId,
  threadId,
  scope,
  text,
}: {
  assistantMessageId: string;
  threadId: string;
  scope: ClientAgentScope;
  text: string;
}): Promise<MessageSuccess | StoreFailure> {
  return updateAssistantPlaceholder({
    assistantMessageId,
    threadId,
    scope,
    status: "error",
    text,
    blocks: [],
    referencedEntities: [],
    contextPayload: null,
    resolvedRange: null,
    providerResponseId: null,
  });
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

  if (!supabaseAdmin) {
    return notFound();
  }

  try {
    const thread = await getThread({ threadId, scope });
    if (!thread) {
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
      agent_task_id: null,
      client_request_id: null,
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
  } catch (error) {
    if (isStoreReadError(error)) {
      return writeFailed();
    }

    throw error;
  }
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

  if (!supabaseAdmin) {
    return notFound();
  }

  try {
    const thread = await getThread({ threadId, scope });
    if (!thread) {
      return notFound();
    }

    if (providerResponseId) {
      const existingRow = await loadMessageByField(
        threadId,
        "provider_response_id",
        providerResponseId,
      );
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
      agent_task_id: null,
      client_request_id: null,
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
  } catch (error) {
    if (isStoreReadError(error)) {
      return writeFailed();
    }

    throw error;
  }
}

export async function touchThreadSummary({
  threadId,
  scope,
}: {
  threadId: string;
  scope: ClientAgentScope;
}): Promise<StoreFailure | { ok: true }> {
  try {
    const thread = await getThread({ threadId, scope });
    if (!thread) {
      return notFound();
    }

    if (!(await refreshThreadSummary(threadId))) {
      return writeFailed();
    }

    return { ok: true };
  } catch (error) {
    if (isStoreReadError(error)) {
      return writeFailed();
    }

    throw error;
  }
}
