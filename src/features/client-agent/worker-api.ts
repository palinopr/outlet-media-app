import { ZodError, z } from "zod";

import { getClientPortalConfig } from "@/features/client-portal/config";
import { logSystemEvent } from "@/features/system-events/server";
import { revalidateClientAgentPath } from "@/features/workflow/revalidation";
import { supabaseAdmin } from "@/lib/supabase";
import type { ThreadContextPayload } from "./thread-context";
import {
  clientAgentToolHandlers,
} from "./tools";
import {
  type AgentAnswerBlock,
  AgentResponseStatusSchema,
  type ClientAgentScope,
  type ReferencedEntity,
  type ResolvedRange,
} from "./types";
import {
  CLIENT_AGENT_TOOL_NAMES,
  type ClientAgentToolName,
} from "./tool-contracts";
import {
  failPendingAssistantMessage,
  getThread,
  isStoreReadError,
  resolvePendingAssistantMessage,
} from "./store";

const ClientAgentTaskParamsSchema = z.object({
  clientSlug: z.string().min(1),
  threadId: z.string().min(1),
  userMessageId: z.string().min(1),
  assistantMessageId: z.string().min(1),
  viewerContext: z.enum(["member", "admin_preview"]),
  clientMemberId: z.string().min(1).nullable().optional(),
  previewAdminUserId: z.string().min(1).nullable().optional(),
});

const AgentTaskRowSchema = z.object({
  id: z.string().min(1),
  from_agent: z.string().min(1),
  to_agent: z.string().min(1),
  action: z.string().min(1),
  params: z.unknown(),
  status: z.string().min(1),
});

export const WorkerToolNameSchema = z.enum(CLIENT_AGENT_TOOL_NAMES);
export type WorkerToolName = ClientAgentToolName;

type WorkerApiError = {
  ok: false;
  status: number;
  error: string;
};

type WorkerApiSuccess<T> = {
  ok: true;
  body: T;
};

type WorkerTaskContextBody = {
  task_id: string;
  thread_id: string;
  user_message_id: string;
  assistant_message_id: string;
  scope_summary: {
    client_slug: string;
    events_enabled: boolean;
    viewer: ClientAgentScope["viewer"];
  };
  scope: ClientAgentScope;
  thread: NonNullable<Awaited<ReturnType<typeof getThread>>>;
  user_message: NonNullable<Awaited<ReturnType<typeof getThread>>>["messages"][number];
  assistant_message: NonNullable<Awaited<ReturnType<typeof getThread>>>["messages"][number];
};

type WorkerToolBody = {
  status: "ok" | "no_data" | "invalid_arguments" | "error";
  data?: unknown;
  referenced_entities: ReferencedEntity[];
  warnings?: string[];
};

type WorkerToolResult =
  | {
      status: "ok" | "no_data" | "invalid_arguments" | "error";
      data?: unknown;
      referencedEntities: ReferencedEntity[];
      warnings?: string[];
    }
  | Promise<{
      status: "ok" | "no_data" | "invalid_arguments" | "error";
      data?: unknown;
      referencedEntities: ReferencedEntity[];
      warnings?: string[];
    }>;

type ResolveTaskResult = {
  status: Exclude<z.infer<typeof AgentResponseStatusSchema>, "pending">;
  text: string;
  blocks: AgentAnswerBlock[];
  referencedEntities: ReferencedEntity[];
  contextPayload: ThreadContextPayload | null;
  resolvedRange: ResolvedRange | null;
  providerResponseId: string | null;
};

type ResolveTaskBody = {
  status: Exclude<z.infer<typeof AgentResponseStatusSchema>, "pending">;
  thread_id: string;
  assistant_message_id: string;
};

type LoadedTask = {
  taskId: string;
  params: z.infer<typeof ClientAgentTaskParamsSchema>;
};

type ScopeBuildSuccess = {
  scope: ClientAgentScope;
  scopeSummary: WorkerTaskContextBody["scope_summary"];
};

function apiError(status: number, error: string): WorkerApiError {
  return { ok: false, status, error };
}

async function loadReplyTask(taskId: string): Promise<WorkerApiError | LoadedTask> {
  if (!supabaseAdmin) {
    return apiError(500, "DB not configured");
  }

  const { data, error } = await supabaseAdmin
    .from("agent_tasks")
    .select("id, from_agent, to_agent, action, params, status")
    .eq("id", taskId)
    .maybeSingle();

  if (error) {
    return apiError(500, "Unable to load worker task");
  }

  if (!data) {
    return apiError(404, "Task not found");
  }

  const parsedRow = AgentTaskRowSchema.safeParse(data);
  if (!parsedRow.success) {
    return apiError(409, "Task payload is invalid");
  }

  if (
    parsedRow.data.from_agent !== "client-portal" ||
    parsedRow.data.to_agent !== "client-agent" ||
    parsedRow.data.action !== "reply"
  ) {
    return apiError(409, "Task is not a client-agent reply task");
  }

  const parsedParams = ClientAgentTaskParamsSchema.safeParse(parsedRow.data.params);
  if (!parsedParams.success) {
    return apiError(409, "Task payload is invalid");
  }

  return {
    taskId: parsedRow.data.id,
    params: parsedParams.data,
  };
}

async function buildScopeFromTask(
  params: z.infer<typeof ClientAgentTaskParamsSchema>,
): Promise<WorkerApiError | ScopeBuildSuccess> {
  if (!supabaseAdmin) {
    return apiError(500, "DB not configured");
  }

  const portalConfig = await getClientPortalConfig(params.clientSlug);
  if (!portalConfig) {
    return apiError(404, "Client not found");
  }

  if (params.viewerContext === "admin_preview") {
    if (!params.previewAdminUserId) {
      return apiError(409, "Task preview scope is invalid");
    }

    return {
      scope: {
        clientId: portalConfig.clientId,
        clientMemberId: `admin_preview:${params.previewAdminUserId}`,
        clientSlug: portalConfig.slug,
        allowedCampaignIds: null,
        allowedEventIds: null,
        eventsEnabled: portalConfig.eventsEnabled,
        viewer: "admin_preview",
      },
      scopeSummary: {
        client_slug: portalConfig.slug,
        events_enabled: portalConfig.eventsEnabled,
        viewer: "admin_preview",
      },
    };
  }

  if (!params.clientMemberId) {
    return apiError(409, "Task member scope is invalid");
  }

  const { data: member, error: memberError } = await supabaseAdmin
    .from("client_members")
    .select("id, client_id, scope")
    .eq("id", params.clientMemberId)
    .eq("client_id", portalConfig.clientId)
    .maybeSingle();

  if (memberError) {
    return apiError(500, "Unable to load worker scope");
  }

  if (!member) {
    return apiError(409, "Task member scope is invalid");
  }

  let allowedCampaignIds: string[] | null = null;
  let allowedEventIds: string[] | null = null;

  if (member.scope === "assigned") {
    const [campaignsRes, eventsRes] = await Promise.all([
      supabaseAdmin
        .from("client_member_campaigns")
        .select("campaign_id")
        .eq("member_id", member.id),
      supabaseAdmin
        .from("client_member_events")
        .select("event_id")
        .eq("member_id", member.id),
    ]);

    if (campaignsRes.error || eventsRes.error) {
      return apiError(500, "Unable to load worker scope");
    }

    allowedCampaignIds = (campaignsRes.data ?? []).map((row) => row.campaign_id);
    allowedEventIds = (eventsRes.data ?? []).map((row) => row.event_id);
  }

  return {
    scope: {
      clientId: portalConfig.clientId,
      clientMemberId: member.id,
      clientSlug: portalConfig.slug,
      allowedCampaignIds,
      allowedEventIds,
      eventsEnabled: portalConfig.eventsEnabled,
      viewer: "member",
    },
    scopeSummary: {
      client_slug: portalConfig.slug,
      events_enabled: portalConfig.eventsEnabled,
      viewer: "member",
    },
  };
}

async function loadScopedTaskContext(
  loadedTask: LoadedTask,
): Promise<WorkerApiError | WorkerApiSuccess<WorkerTaskContextBody>> {
  const scopeResult = await buildScopeFromTask(loadedTask.params);
  if ("ok" in scopeResult) {
    return scopeResult;
  }

  try {
    const thread = await getThread({
      threadId: loadedTask.params.threadId,
      scope: scopeResult.scope,
    });

    if (!thread) {
      return apiError(404, "Thread not found");
    }

    const userMessage = thread.messages.find(
      (message) => message.messageId === loadedTask.params.userMessageId && message.role === "user",
    );
    const assistantMessage = thread.messages.find(
      (message) =>
        message.messageId === loadedTask.params.assistantMessageId &&
        message.role === "assistant",
    );

    if (!userMessage || !assistantMessage) {
      return apiError(409, "Task messages are invalid");
    }

    if (!isBoundQueuedTurn({ userMessage, assistantMessage, taskId: loadedTask.taskId })) {
      return apiError(409, "Task messages are invalid");
    }

    if (assistantMessage.status !== "pending") {
      return apiError(409, "Task placeholder is no longer pending");
    }

    return {
      ok: true,
      body: {
        task_id: loadedTask.taskId,
        thread_id: thread.threadId,
        user_message_id: userMessage.messageId,
        assistant_message_id: assistantMessage.messageId,
        scope_summary: scopeResult.scopeSummary,
        scope: scopeResult.scope,
        thread,
        user_message: userMessage,
        assistant_message: assistantMessage,
      },
    };
  } catch (error) {
    if (isStoreReadError(error)) {
      return apiError(500, "Unable to load worker thread state");
    }

    throw error;
  }
}

export async function getTaskContext(
  taskId: string,
): Promise<WorkerApiError | { ok: true; context: WorkerTaskContextBody }> {
  const loadedTask = await loadReplyTask(taskId);
  if ("ok" in loadedTask) {
    return loadedTask;
  }

  const contextResult = await loadScopedTaskContext(loadedTask);
  if (!contextResult.ok) {
    return contextResult;
  }

  return {
    ok: true,
    context: contextResult.body,
  };
}

type WorkerToolHandler = (input: {
  scope: ClientAgentScope;
  args: unknown;
}) => WorkerToolResult;

const toolHandlers: Record<WorkerToolName, WorkerToolHandler> = {
  ...clientAgentToolHandlers,
} as Record<WorkerToolName, WorkerToolHandler>;

export async function runTool({
  taskId,
  toolName,
  args,
}: {
  taskId: string;
  toolName: WorkerToolName;
  args: unknown;
}): Promise<WorkerApiError | WorkerApiSuccess<WorkerToolBody>> {
  const context = await getTaskContext(taskId);
  if (!context.ok) {
    return context;
  }

  try {
    const result = await toolHandlers[toolName]({
      scope: context.context.scope,
      args,
    });

    return {
      ok: true,
      body: {
        status: result.status,
        data: result.data,
        referenced_entities: result.referencedEntities,
        warnings: result.warnings,
      },
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(400, "Invalid tool arguments");
    }

    throw error;
  }
}

function eventNameForStatus(status: ResolveTaskResult["status"]) {
  if (status === "refuse") {
    return "client_agent_refusal_generated" as const;
  }

  if (status === "error") {
    return "client_agent_failure_returned" as const;
  }

  return "client_agent_answer_generated" as const;
}

function isBoundQueuedTurn(input: {
  assistantMessage: WorkerTaskContextBody["assistant_message"];
  taskId: string;
  userMessage: WorkerTaskContextBody["user_message"];
}) {
  if (input.assistantMessage.agentTaskId !== input.taskId) {
    return false;
  }

  if (
    !input.userMessage.clientRequestId ||
    !input.assistantMessage.clientRequestId ||
    input.userMessage.clientRequestId !== input.assistantMessage.clientRequestId
  ) {
    return false;
  }

  return true;
}

export async function resolveTask(
  taskId: string,
  result: ResolveTaskResult,
): Promise<WorkerApiError | WorkerApiSuccess<ResolveTaskBody>> {
  const loadedTask = await loadReplyTask(taskId);
  if ("ok" in loadedTask) {
    return loadedTask;
  }

  const scopeResult = await buildScopeFromTask(loadedTask.params);
  if ("ok" in scopeResult) {
    return scopeResult;
  }

  try {
    const messageResult =
      result.status === "error"
        ? await failPendingAssistantMessage({
            assistantMessageId: loadedTask.params.assistantMessageId,
            threadId: loadedTask.params.threadId,
            scope: scopeResult.scope,
            text: result.text,
          })
        : await resolvePendingAssistantMessage({
            assistantMessageId: loadedTask.params.assistantMessageId,
            threadId: loadedTask.params.threadId,
            scope: scopeResult.scope,
            status: result.status,
            text: result.text,
            blocks: result.blocks,
            referencedEntities: result.referencedEntities,
            contextPayload: result.contextPayload,
            resolvedRange: result.resolvedRange,
            providerResponseId: result.providerResponseId,
          });

    if (!messageResult.ok) {
      return apiError(
        messageResult.code === "not_found" ? 404 : 500,
        messageResult.code === "not_found" ? "Thread not found" : "Unable to update worker task",
      );
    }

    const visibility = scopeResult.scope.viewer === "member" ? "shared" : "admin_only";
    const status: ResolveTaskResult["status"] =
      messageResult.message.status && messageResult.message.status !== "pending"
        ? messageResult.message.status
        : result.status;

    await logSystemEvent({
      eventName: eventNameForStatus(status),
      actorId: "client-agent",
      actorType: "agent",
      clientSlug: scopeResult.scope.clientSlug,
      entityId: loadedTask.params.threadId,
      entityType: "client_agent_thread",
      idempotencyKey: `client_agent_result:${taskId}:${status}`,
      summary:
        status === "refuse"
          ? "Client agent refused an out-of-scope question."
          : status === "error"
            ? "Client agent returned an error."
            : "Client agent responded to a client question.",
      source: "worker",
      taskId,
      visibility,
      metadata: {
        assistantMessageId: messageResult.message.messageId,
        providerResponseId: messageResult.message.providerResponseId,
        status,
        taskId,
        threadId: loadedTask.params.threadId,
        viewer: scopeResult.scope.viewer,
      },
    });
    revalidateClientAgentPath(scopeResult.scope.clientSlug);

    return {
      ok: true,
      body: {
        status,
        thread_id: loadedTask.params.threadId,
        assistant_message_id: messageResult.message.messageId,
      },
    };
  } catch (error) {
    if (isStoreReadError(error)) {
      return apiError(500, "Unable to update worker task");
    }

    throw error;
  }
}
