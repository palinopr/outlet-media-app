import { getClientPortalConfig } from "@/features/client-portal/config";
import { resolveClientAgentAccessForApi } from "@/features/client-portal/access";
import { logSystemEvent } from "@/features/system-events/server";
import { revalidateClientAgentPath } from "@/features/workflow/revalidation";
import { getMemberAccessForSlug } from "@/lib/member-access";
import { generateClientAgentModelResponse } from "./model";
import {
  appendAssistantMessage,
  appendUserMessage,
  createThread as createStoreThread,
  getThread as getStoreThread,
  listThreads as listStoreThreads,
} from "./store";
import type {
  AgentAnswerBlock,
  AgentHistoryMessage,
  ClientAgentScope,
  ReferencedEntity,
  ResolvedRange,
} from "./types";

type ErrorResult = {
  ok: false;
  status: number;
  body: {
    error: string;
  };
};

type SuccessResult<T> = {
  ok: true;
  status: number;
  body: T;
};

type ServiceResult<T> = ErrorResult | SuccessResult<T>;

type ThreadListBody = {
  threads: Awaited<ReturnType<typeof listStoreThreads>>;
};

type PreviewThread = {
  threadId: string;
  title: string | null;
  previewText: string | null;
  referencedEntities: ReferencedEntity[];
  lastResponseStatus: "answer" | "clarify" | "refuse" | "error" | null;
  lastMessageAt: string;
  updatedAt: string;
  createdAt: string;
  messages: [];
};

type ThreadBody = {
  thread: NonNullable<Awaited<ReturnType<typeof getStoreThread>>> | PreviewThread;
};

type SendMessageBody = {
  status: "answer" | "clarify" | "refuse" | "error";
  thread_id: string;
  message_id: string;
  text: string;
  blocks: AgentAnswerBlock[];
  referenced_entities: ReferencedEntity[];
  resolved_range: ResolvedRange | null;
};

function errorResult(status: number, error: string): ErrorResult {
  return {
    ok: false,
    status,
    body: { error },
  };
}

function mapAccessFailure(destination: string) {
  return destination === "/sign-in"
    ? errorResult(401, "Unauthenticated")
    : errorResult(403, "Forbidden");
}

function mapStoreFailure(code: "not_found" | "preview_unavailable" | "write_failed") {
  if (code === "not_found") {
    return errorResult(404, "Thread not found");
  }

  if (code === "preview_unavailable") {
    return errorResult(403, "Preview mode does not support agent persistence");
  }

  return errorResult(500, "Unable to save agent state");
}

async function resolveScope(
  slug: string,
): Promise<
  | ErrorResult
  | {
      ok: true;
      portalConfig: NonNullable<Awaited<ReturnType<typeof getClientPortalConfig>>>;
      scope: ClientAgentScope;
      userId: string;
    }
> {
  const access = await resolveClientAgentAccessForApi(slug);
  if (access.kind === "redirect") {
    return mapAccessFailure(access.destination);
  }

  const portalConfig = await getClientPortalConfig(slug);
  if (!portalConfig?.agentEnabled) {
    return errorResult(403, "Forbidden");
  }

  if (access.viewer === "admin_preview") {
    return {
      ok: true,
      portalConfig,
      scope: {
        clientId: portalConfig.clientId,
        clientMemberId: `admin_preview:${access.userId}`,
        clientSlug: portalConfig.slug,
        allowedCampaignIds: null,
        allowedEventIds: null,
        eventsEnabled: portalConfig.eventsEnabled,
        viewer: "admin_preview",
      },
      userId: access.userId,
    };
  }

  const memberAccess = await getMemberAccessForSlug(access.userId, slug);
  if (!memberAccess) {
    return errorResult(403, "Forbidden");
  }

  return {
    ok: true,
    portalConfig,
    scope: {
      clientId: portalConfig.clientId,
      clientMemberId: memberAccess.memberId,
      clientSlug: portalConfig.slug,
      allowedCampaignIds: access.scope?.allowedCampaignIds ?? null,
      allowedEventIds: access.scope?.allowedEventIds ?? null,
      eventsEnabled: portalConfig.eventsEnabled,
      viewer: "member",
    },
    userId: access.userId,
  };
}

function blankThread() {
  const now = new Date().toISOString();

  return {
    threadId: crypto.randomUUID(),
    title: null,
    previewText: null,
    referencedEntities: [],
    lastResponseStatus: null,
    lastMessageAt: now,
    updatedAt: now,
    createdAt: now,
    messages: [],
  };
}

export async function listThreads({
  slug,
}: {
  slug: string;
}): Promise<ServiceResult<ThreadListBody>> {
  const access = await resolveScope(slug);
  if (!access.ok) {
    return access;
  }

  if (access.scope.viewer === "admin_preview") {
    return {
      ok: true,
      status: 200,
      body: { threads: [] },
    };
  }

  return {
    ok: true,
    status: 200,
    body: {
      threads: await listStoreThreads({ scope: access.scope }),
    },
  };
}

export async function createThread({
  slug,
}: {
  slug: string;
}): Promise<ServiceResult<ThreadBody>> {
  const access = await resolveScope(slug);
  if (!access.ok) {
    return access;
  }

  if (access.scope.viewer === "admin_preview") {
    return {
      ok: true,
      status: 201,
      body: {
        thread: blankThread(),
      },
    };
  }

  const result = await createStoreThread({ scope: access.scope });
  if (!result.ok) {
    return mapStoreFailure(result.code);
  }

  await logSystemEvent({
    eventName: "client_agent_thread_created",
    summary: "Client agent thread created.",
    actorId: access.userId,
    actorType: "user",
    clientSlug: access.scope.clientSlug,
    entityId: result.thread.threadId,
    entityType: "client_agent_thread",
    metadata: {
      threadId: result.thread.threadId,
      viewer: access.scope.viewer,
    },
    visibility: "shared",
  });
  revalidateClientAgentPath(access.scope.clientSlug);

  return {
    ok: true,
    status: 201,
    body: {
      thread: {
        ...result.thread,
        messages: [],
      },
    },
  };
}

export async function getThread({
  slug,
  threadId,
}: {
  slug: string;
  threadId: string;
}): Promise<ServiceResult<ThreadBody>> {
  const access = await resolveScope(slug);
  if (!access.ok) {
    return access;
  }

  if (access.scope.viewer === "admin_preview") {
    return errorResult(404, "Thread not found");
  }

  const thread = await getStoreThread({
    threadId,
    scope: access.scope,
  });
  if (!thread) {
    return errorResult(404, "Thread not found");
  }

  return {
    ok: true,
    status: 200,
    body: {
      thread,
    },
  };
}

function eventNameForStatus(status: "answer" | "clarify" | "refuse" | "error") {
  if (status === "refuse") {
    return "client_agent_refusal_generated" as const;
  }

  if (status === "error") {
    return "client_agent_failure_returned" as const;
  }

  return "client_agent_answer_generated" as const;
}

function fallbackAssistantResponseId({
  threadId,
  userMessageId,
}: {
  threadId: string;
  userMessageId: string;
}) {
  return `client_agent:${threadId}:${userMessageId}`;
}

export async function sendMessage({
  slug,
  threadId,
  message,
  clientGeneratedId,
  history = [],
}: {
  slug: string;
  threadId: string;
  message: string;
  clientGeneratedId?: string;
  history?: AgentHistoryMessage[];
}): Promise<ServiceResult<SendMessageBody>> {
  const access = await resolveScope(slug);
  if (!access.ok) {
    return access;
  }

  if (access.scope.viewer === "admin_preview") {
    const modelResponse = await generateClientAgentModelResponse({
      history,
      message,
      scope: access.scope,
      scopeSummary: {
        clientSlug: access.scope.clientSlug,
        eventsEnabled: access.portalConfig.eventsEnabled,
      },
    });

    return {
      ok: true,
      status: 200,
      body: {
        status: modelResponse.status,
        thread_id: threadId,
        message_id: crypto.randomUUID(),
        text: modelResponse.text,
        blocks: modelResponse.blocks,
        referenced_entities: modelResponse.referencedEntities,
        resolved_range: modelResponse.resolvedRange,
      },
    };
  }

  const thread = await getStoreThread({
    scope: access.scope,
    threadId,
  });
  if (!thread) {
    return errorResult(404, "Thread not found");
  }

  const userResult = await appendUserMessage({
    threadId,
    scope: access.scope,
    text: message,
    clientGeneratedId: clientGeneratedId ?? crypto.randomUUID(),
  });
  if (!userResult.ok) {
    return mapStoreFailure(userResult.code);
  }

  await logSystemEvent({
    eventName: "client_agent_user_message_submitted",
    summary: "Client agent message submitted.",
    actorId: access.userId,
    actorType: "user",
    clientSlug: access.scope.clientSlug,
    entityId: threadId,
    entityType: "client_agent_thread",
    metadata: {
      clientGeneratedId: userResult.message.clientGeneratedId,
      messageId: userResult.message.messageId,
      threadId,
    },
    visibility: "shared",
  });

  const modelResponse = await generateClientAgentModelResponse({
    history: thread.messages.map((entry) => ({
      role: entry.role,
      text: entry.text,
      referencedEntities: entry.referencedEntities,
    })),
    message,
    scope: access.scope,
    scopeSummary: {
      clientSlug: access.scope.clientSlug,
      eventsEnabled: access.portalConfig.eventsEnabled,
    },
  });
  const assistantIdempotencyKey = fallbackAssistantResponseId({
    threadId,
    userMessageId: userResult.message.messageId,
  });

  const assistantResult = await appendAssistantMessage({
    threadId,
    scope: access.scope,
    status: modelResponse.status,
    text: modelResponse.text,
    blocks: modelResponse.blocks,
    referencedEntities: modelResponse.referencedEntities,
    resolvedRange: modelResponse.resolvedRange,
    providerResponseId: assistantIdempotencyKey,
  });
  if (!assistantResult.ok) {
    return mapStoreFailure(assistantResult.code);
  }
  const assistantStatus = assistantResult.message.status ?? modelResponse.status;

  await logSystemEvent({
    eventName: eventNameForStatus(assistantStatus),
    summary:
      assistantStatus === "refuse"
        ? "Client agent refused an out-of-scope question."
        : assistantStatus === "error"
          ? "Client agent returned an error."
          : "Client agent responded to a client question.",
    actorId: access.userId,
    actorType: "user",
    clientSlug: access.scope.clientSlug,
    entityId: threadId,
    entityType: "client_agent_thread",
    metadata: {
      messageId: assistantResult.message.messageId,
      providerResponseId: assistantIdempotencyKey,
      modelProviderResponseId: modelResponse.providerResponseId,
      status: assistantStatus,
      threadId,
    },
    visibility: "shared",
  });
  revalidateClientAgentPath(access.scope.clientSlug);

  return {
    ok: true,
    status: 200,
    body: {
      status: assistantStatus,
      thread_id: threadId,
      message_id: assistantResult.message.messageId,
      text: assistantResult.message.text,
      blocks: assistantResult.message.blocks,
      referenced_entities: assistantResult.message.referencedEntities,
      resolved_range: assistantResult.message.resolvedRange,
    },
  };
}
