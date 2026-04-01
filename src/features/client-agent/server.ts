import { getClientPortalConfig } from "@/features/client-portal/config";
import { resolveClientAgentAccessForApi } from "@/features/client-portal/access";
import { logSystemEvent } from "@/features/system-events/server";
import { revalidateClientAgentPath } from "@/features/workflow/revalidation";
import { getMemberAccessForSlug } from "@/lib/member-access";
import { queueClientAgentTurn } from "./queue";
import {
  createOrLoadPreviewThread,
  createThread as createStoreThread,
  getThread as getStoreThread,
  listThreads as listStoreThreads,
} from "./store";
import type {
  AgentHistoryMessage,
  ClientAgentScope,
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

type ThreadBody = {
  thread: NonNullable<Awaited<ReturnType<typeof getStoreThread>>>;
};

type SendMessageBody = {
  status: "queued";
  thread_id: string;
  task_id: string;
  assistant_message_id: string;
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

function storeReadFailure() {
  return errorResult(500, "Unable to load agent state");
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

export async function listThreads({
  slug,
}: {
  slug: string;
}): Promise<ServiceResult<ThreadListBody>> {
  const access = await resolveScope(slug);
  if (!access.ok) {
    return access;
  }

  try {
    return {
      ok: true,
      status: 200,
      body: {
        threads: await listStoreThreads({ scope: access.scope }),
      },
    };
  } catch {
    return storeReadFailure();
  }
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

  const result = await createStoreThread({ scope: access.scope });
  if (!result.ok) {
    return mapStoreFailure(result.code);
  }

  if (access.scope.viewer === "member") {
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
  }

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

  try {
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
  } catch {
    return storeReadFailure();
  }
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
  void history;

  const access = await resolveScope(slug);
  if (!access.ok) {
    return access;
  }

  let persistedThreadId: string;

  try {
    if (access.scope.viewer === "admin_preview") {
      const previewThread = await createOrLoadPreviewThread({
        scope: access.scope,
        threadId,
      });
      if (!previewThread.ok) {
        return mapStoreFailure(previewThread.code);
      }

      persistedThreadId = previewThread.thread.threadId;
    } else {
      const thread = await getStoreThread({
        scope: access.scope,
        threadId,
      });
      if (!thread) {
        return errorResult(404, "Thread not found");
      }

      persistedThreadId = thread.threadId;
    }
  } catch {
    return storeReadFailure();
  }

  let queued: Awaited<ReturnType<typeof queueClientAgentTurn>>;

  try {
    queued = await queueClientAgentTurn({
      clientGeneratedId,
      message,
      scope: access.scope,
      threadId: persistedThreadId,
      userId: access.userId,
    });
  } catch {
    return storeReadFailure();
  }

  if (!queued.ok) {
    return mapStoreFailure(queued.code);
  }

  return {
    ok: true,
    status: 202,
    body: {
      status: "queued",
      thread_id: persistedThreadId,
      task_id: queued.queued.taskId,
      assistant_message_id: queued.queued.assistantMessageId,
    },
  };
}
