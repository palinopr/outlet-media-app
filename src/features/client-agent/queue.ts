import { logSystemEvent } from "@/features/system-events/server";
import type { ClientAgentScope } from "./types";
import { queueTurn } from "./store";

type QueueClientAgentTurnResult = Awaited<ReturnType<typeof queueTurn>>;

function visibilityForScope(scope: ClientAgentScope) {
  return scope.viewer === "member" ? "shared" : "admin_only";
}

export async function queueClientAgentTurn({
  clientGeneratedId,
  message,
  scope,
  threadId,
  userId,
}: {
  clientGeneratedId?: string;
  message: string;
  scope: ClientAgentScope;
  threadId: string;
  userId: string;
}): Promise<QueueClientAgentTurnResult> {
  const clientRequestId = clientGeneratedId ?? crypto.randomUUID();
  const result = await queueTurn({
    threadId,
    scope,
    clientSlug: scope.clientSlug,
    clientRequestId,
    text: message,
  });

  if (!result.ok) {
    return result;
  }

  if (result.queued.wasExisting) {
    return result;
  }

  const visibility = visibilityForScope(scope);

  await logSystemEvent({
    eventName: "client_agent_user_message_submitted",
    actorId: userId,
    actorType: "user",
    clientSlug: scope.clientSlug,
    entityId: result.queued.threadId,
    entityType: "client_agent_thread",
    idempotencyKey: `client_agent_user_message_submitted:${result.queued.assistantMessageId}`,
    summary:
      scope.viewer === "member"
        ? "Client agent message submitted."
        : "Admin preview agent message submitted.",
    visibility,
    metadata: {
      assistantMessageId: result.queued.assistantMessageId,
      clientRequestId: result.queued.clientRequestId,
      messageId: result.queued.userMessageId,
      taskId: result.queued.taskId,
      threadId: result.queued.threadId,
      viewer: scope.viewer,
    },
  });

  await logSystemEvent({
    eventName: "agent_action_requested",
    actorId: userId,
    actorType: "user",
    clientSlug: scope.clientSlug,
    detail: "Client agent worker will resolve the queued reply.",
    entityId: result.queued.taskId,
    entityType: "agent_task",
    summary:
      scope.viewer === "member"
        ? "Queued client agent reply."
        : "Queued admin preview client agent reply.",
    taskId: result.queued.taskId,
    visibility,
    metadata: {
      assistantMessageId: result.queued.assistantMessageId,
      clientRequestId: result.queued.clientRequestId,
      fromAgent: "client-portal",
      taskId: result.queued.taskId,
      threadId: result.queued.threadId,
      toAgent: "client-agent",
      userMessageId: result.queued.userMessageId,
      viewer: scope.viewer,
    },
  });

  return result;
}
