"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { ConversationPane } from "./conversation-pane";
import { ThreadList } from "./thread-list";
import type { ThreadContextPayload } from "../thread-context";
import type {
  AgentAnswerBlock,
  AgentResponseStatus,
  ReferencedEntity,
  ResolvedRange,
} from "../types";

export type AgentThreadSummary = {
  threadId: string;
  title: string | null;
  previewText: string | null;
  referencedEntities: ReferencedEntity[];
  lastResponseStatus: AgentResponseStatus | null;
  lastMessageAt: string;
  updatedAt: string;
  createdAt: string;
};

export type AgentThreadMessage = {
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
  clientRequestId: string | null;
  agentTaskId: string | null;
  createdAt: string;
};

type AgentThreadDetail = AgentThreadSummary & {
  messages: AgentThreadMessage[];
};

type AgentShellProps = {
  clientName: string;
  eventsEnabled: boolean;
  initialThreads: AgentThreadSummary[];
  slug: string;
  viewer: "member" | "admin_preview";
};

type SendMessagePayload = {
  status: "queued";
  thread_id: string;
  task_id: string;
  assistant_message_id: string;
  client_request_id?: string;
};

type ThreadResponsePayload = {
  thread?: AgentThreadDetail;
  error?: string;
};

const POLL_INTERVAL_MS = 1000;

const CAMPAIGN_PROMPTS = [
  "How are my campaigns doing this month?",
  "Which audience is performing best right now?",
  "What changed this week?",
  "Which campaign is strongest right now?",
];

const EVENT_PROMPTS = [
  "What was my last show?",
  "How did my last show do?",
];

function nowIso() {
  return new Date().toISOString();
}

function sortThreadSummaries(threads: AgentThreadSummary[]) {
  return [...threads].sort((left, right) =>
    right.lastMessageAt.localeCompare(left.lastMessageAt) ||
    right.updatedAt.localeCompare(left.updatedAt) ||
    right.createdAt.localeCompare(left.createdAt),
  );
}

function buildOptimisticUserMessage(
  text: string,
  clientRequestId: string,
): AgentThreadMessage {
  const createdAt = nowIso();

  return {
    messageId: `optimistic:${clientRequestId}`,
    role: "user",
    status: null,
    text,
    blocks: [],
    referencedEntities: [],
    contextPayload: null,
    resolvedRange: null,
    providerResponseId: null,
    clientGeneratedId: clientRequestId,
    clientRequestId,
    agentTaskId: null,
    createdAt,
  };
}

function buildPendingAssistantMessage({
  assistantMessageId,
  clientRequestId,
  taskId,
}: {
  assistantMessageId: string;
  clientRequestId: string;
  taskId: string;
}): AgentThreadMessage {
  return {
    messageId: assistantMessageId,
    role: "assistant",
    status: "pending",
    text: "Thinking…",
    blocks: [],
    referencedEntities: [],
    contextPayload: null,
    resolvedRange: null,
    providerResponseId: null,
    clientGeneratedId: null,
    clientRequestId,
    agentTaskId: taskId,
    createdAt: nowIso(),
  };
}

function buildErrorAssistantMessage(): AgentThreadMessage {
  return {
    messageId: `assistant-error:${nowIso()}`,
    role: "assistant",
    status: "error",
    text: "I’m unable to send that right now.",
    blocks: [],
    referencedEntities: [],
    contextPayload: null,
    resolvedRange: null,
    providerResponseId: null,
    clientGeneratedId: null,
    clientRequestId: null,
    agentTaskId: null,
    createdAt: nowIso(),
  };
}

function buildThreadSummary(detail: AgentThreadDetail): AgentThreadSummary {
  return {
    threadId: detail.threadId,
    title: detail.title,
    previewText: detail.previewText,
    referencedEntities: detail.referencedEntities,
    lastResponseStatus: detail.lastResponseStatus,
    lastMessageAt: detail.lastMessageAt,
    updatedAt: detail.updatedAt,
    createdAt: detail.createdAt,
  };
}

function mergeThreadMessages(
  currentMessages: AgentThreadMessage[],
  incomingMessages: AgentThreadMessage[],
) {
  const nextMessages = [...currentMessages];

  for (const incoming of incomingMessages) {
    const idMatchIndex = nextMessages.findIndex((message) => message.messageId === incoming.messageId);
    if (idMatchIndex >= 0) {
      nextMessages[idMatchIndex] = incoming;
      continue;
    }

    const requestMatchIndex = incoming.clientRequestId
      ? nextMessages.findIndex(
          (message) =>
            message.role === incoming.role &&
            message.clientRequestId === incoming.clientRequestId,
        )
      : -1;

    if (requestMatchIndex >= 0) {
      nextMessages[requestMatchIndex] = incoming;
      continue;
    }

    nextMessages.push(incoming);
  }

  return nextMessages;
}

async function parseJson<T>(response: Response): Promise<T> {
  return response.json() as Promise<T>;
}

export function AgentShell({
  clientName,
  eventsEnabled,
  initialThreads,
  slug,
  viewer,
}: AgentShellProps) {
  const [threads, setThreads] = useState<AgentThreadSummary[]>(() =>
    sortThreadSummaries(initialThreads),
  );
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messagesByThread, setMessagesByThread] = useState<Record<string, AgentThreadMessage[]>>(
    {},
  );
  const [loadedThreadIds, setLoadedThreadIds] = useState<Set<string>>(new Set());
  const [draft, setDraft] = useState("");
  const [sendingThreadIds, setSendingThreadIds] = useState<Record<string, boolean>>({});
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [isLoadingThread, setIsLoadingThread] = useState(false);
  const [shellMessage, setShellMessage] = useState<string | null>(null);

  const promptChips = useMemo(
    () => [...CAMPAIGN_PROMPTS, ...(eventsEnabled ? EVENT_PROMPTS : [])],
    [eventsEnabled],
  );
  const isPreview = viewer === "admin_preview";
  const activeMessages = activeThreadId ? (messagesByThread[activeThreadId] ?? []) : [];
  const activeThreadHasPendingAssistant = activeMessages.some(
    (message) => message.role === "assistant" && message.status === "pending",
  );
  const activeThreadIsSending = activeThreadId
    ? Boolean(sendingThreadIds[activeThreadId])
    : isCreatingThread;
  const composerDisabled = activeThreadIsSending;

  useEffect(() => {
    if (!activeThreadId || loadedThreadIds.has(activeThreadId)) {
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    setIsLoadingThread(true);
    setShellMessage(null);

    fetch(`/api/client/${slug}/agent/threads/${activeThreadId}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const body = await parseJson<ThreadResponsePayload>(response);
        if (!response.ok || !body.thread) {
          throw new Error(body.error ?? "Unable to load this conversation right now.");
        }

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setThreads((current) =>
            sortThreadSummaries([
              buildThreadSummary(body.thread!),
              ...current.filter((thread) => thread.threadId !== activeThreadId),
            ]),
          );
          setMessagesByThread((current) => ({
            ...current,
            [activeThreadId]: mergeThreadMessages(
              current[activeThreadId] ?? [],
              body.thread?.messages ?? [],
            ),
          }));
          setLoadedThreadIds((current) => {
            const next = new Set(current);
            next.add(activeThreadId);
            return next;
          });
        });
      })
      .catch(() => {
        if (!cancelled && !controller.signal.aborted) {
          setShellMessage("Unable to load this conversation right now.");
        }
      })
      .finally(() => {
        if (!cancelled && !controller.signal.aborted) {
          setIsLoadingThread(false);
        }
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [activeThreadId, loadedThreadIds, slug]);

  useEffect(() => {
    if (!activeThreadId || !activeThreadHasPendingAssistant) {
      return;
    }

    const controller = new AbortController();
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const pollThread = async () => {
      try {
        const response = await fetch(`/api/client/${slug}/agent/threads/${activeThreadId}`, {
          signal: controller.signal,
        });
        const body = await parseJson<ThreadResponsePayload>(response);
        if (!response.ok || !body.thread) {
          throw new Error(body.error ?? "Unable to refresh this conversation right now.");
        }

        if (cancelled || controller.signal.aborted) {
          return;
        }

        setShellMessage(null);
        startTransition(() => {
          setThreads((current) =>
            sortThreadSummaries([
              buildThreadSummary(body.thread!),
              ...current.filter((thread) => thread.threadId !== activeThreadId),
            ]),
          );
          setMessagesByThread((current) => ({
            ...current,
            [activeThreadId]: mergeThreadMessages(
              current[activeThreadId] ?? [],
              body.thread?.messages ?? [],
            ),
          }));
          setLoadedThreadIds((current) => {
            const next = new Set(current);
            next.add(activeThreadId);
            return next;
          });
        });

        const stillPending = body.thread.messages.some(
          (message) => message.role === "assistant" && message.status === "pending",
        );
        if (stillPending) {
          timeoutId = setTimeout(() => {
            void pollThread();
          }, POLL_INTERVAL_MS);
        }
      } catch {
        if (!cancelled && !controller.signal.aborted) {
          setShellMessage("Unable to refresh this conversation right now.");
          timeoutId = setTimeout(() => {
            void pollThread();
          }, POLL_INTERVAL_MS);
        }
      }
    };

    void pollThread();

    return () => {
      cancelled = true;
      controller.abort();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [activeThreadHasPendingAssistant, activeThreadId, slug]);

  async function createThreadAndSelect() {
    const response = await fetch(`/api/client/${slug}/agent/threads`, {
      method: "POST",
    });
    const body = await parseJson<{ error?: string; thread?: AgentThreadDetail }>(response);
    if (!response.ok || !body.thread) {
      throw new Error(body.error ?? "Unable to start a conversation right now.");
    }

    startTransition(() => {
      setThreads((current) =>
        sortThreadSummaries([
          buildThreadSummary(body.thread!),
          ...current.filter((thread) => thread.threadId !== body.thread?.threadId),
        ]),
      );
      setMessagesByThread((current) => ({
        ...current,
        [body.thread!.threadId]: body.thread?.messages ?? [],
      }));
      setLoadedThreadIds((current) => {
        const next = new Set(current);
        next.add(body.thread!.threadId);
        return next;
      });
      setActiveThreadId(body.thread!.threadId);
      setDraft("");
    });

    return body.thread.threadId;
  }

  async function handleNewChat() {
    try {
      setShellMessage(null);
      await createThreadAndSelect();
    } catch {
      setShellMessage("Unable to start a conversation right now.");
    }
  }

  function upsertPendingThread(threadId: string, titleFallback: string) {
    setThreads((current) => {
      const existing = current.find((thread) => thread.threadId === threadId);
      const now = nowIso();
      const baseThread: AgentThreadSummary = existing ?? {
        threadId,
        title: titleFallback.slice(0, 80),
        previewText: null,
        referencedEntities: [],
        lastResponseStatus: null,
        lastMessageAt: now,
        updatedAt: now,
        createdAt: now,
      };

      const updatedThread: AgentThreadSummary = {
        ...baseThread,
        previewText: "Thinking…",
        lastResponseStatus: "pending",
        lastMessageAt: now,
        updatedAt: now,
      };

      return sortThreadSummaries([
        updatedThread,
        ...current.filter((thread) => thread.threadId !== threadId),
      ]);
    });
  }

  function setThreadSending(threadId: string, sending: boolean) {
    setSendingThreadIds((current) => {
      if (sending) {
        if (current[threadId]) {
          return current;
        }

        return {
          ...current,
          [threadId]: true,
        };
      }

      if (!current[threadId]) {
        return current;
      }

      const next = { ...current };
      delete next[threadId];
      return next;
    });
  }

  async function handleSendMessage(explicitMessage?: string) {
    const nextMessage = (explicitMessage ?? draft).trim();
    if (!nextMessage || composerDisabled) {
      return;
    }

    let threadId: string | null = activeThreadId;
    const clientRequestId = crypto.randomUUID();
    const optimisticUserMessage = buildOptimisticUserMessage(nextMessage, clientRequestId);

    setShellMessage(null);
    if (!threadId) {
      setIsCreatingThread(true);
    }

    try {
      threadId = threadId ?? (await createThreadAndSelect());
      if (!threadId) {
        throw new Error("Unable to resolve an active thread.");
      }

      const resolvedThreadId = threadId;
      setIsCreatingThread(false);
      setThreadSending(resolvedThreadId, true);

      startTransition(() => {
        setDraft("");
        setMessagesByThread((current) => {
          const existingMessages = current[resolvedThreadId] ?? [];
          if (
            existingMessages.some(
              (message) =>
                message.messageId === optimisticUserMessage.messageId ||
                (message.role === "user" && message.clientRequestId === clientRequestId),
            )
          ) {
            return current;
          }

          return {
            ...current,
            [resolvedThreadId]: [...existingMessages, optimisticUserMessage],
          };
        });
      });

      const response = await fetch(`/api/client/${slug}/agent/threads/${resolvedThreadId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: nextMessage,
          client_request_id: clientRequestId,
        }),
      });
      const body = await parseJson<SendMessagePayload & { error?: string }>(response);
      if (!response.ok || body.status !== "queued") {
        throw new Error(body.error ?? "Unable to send that message right now.");
      }

      startTransition(() => {
        setMessagesByThread((current) => {
          const existingMessages = current[resolvedThreadId] ?? [];
          if (
            existingMessages.some(
              (message) =>
                message.messageId === body.assistant_message_id ||
                (message.role === "assistant" &&
                  message.clientRequestId === body.client_request_id),
            )
          ) {
            return current;
          }

          return {
            ...current,
            [resolvedThreadId]: [
              ...existingMessages,
              buildPendingAssistantMessage({
                assistantMessageId: body.assistant_message_id,
                clientRequestId: body.client_request_id ?? clientRequestId,
                taskId: body.task_id,
              }),
            ],
          };
        });
        upsertPendingThread(resolvedThreadId, nextMessage);
      });
    } catch {
      const assistantError = buildErrorAssistantMessage();

      if (threadId) {
        const resolvedThreadId = threadId;
        startTransition(() => {
          setMessagesByThread((current) => ({
            ...current,
            [resolvedThreadId]: [...(current[resolvedThreadId] ?? []), assistantError],
          }));
        });
      } else {
        setShellMessage("I’m unable to send that right now.");
      }
    } finally {
      if (threadId) {
        setThreadSending(threadId, false);
      }
      setIsCreatingThread(false);
    }
  }

  function handlePromptClick(prompt: string) {
    if (activeThreadId) {
      void handleSendMessage(prompt);
      return;
    }

    setDraft(prompt);
  }

  return (
    <section
      data-testid="agent-shell"
      data-client-slug={slug}
      data-events-enabled={eventsEnabled ? "true" : "false"}
      data-thread-count={String(threads.length)}
      data-viewer={viewer}
      className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]"
    >
      <ThreadList
        activeThreadId={activeThreadId}
        isPreview={isPreview}
        onNewChat={handleNewChat}
        onSelectThread={setActiveThreadId}
        threads={threads}
      />
      <ConversationPane
        activeThreadId={activeThreadId}
        clientName={clientName}
        composerDisabled={composerDisabled}
        draft={draft}
        isLoadingThread={isLoadingThread}
        isPreview={isPreview}
        isWorking={activeThreadIsSending && !activeThreadHasPendingAssistant}
        messages={activeMessages}
        onDraftChange={setDraft}
        onPromptClick={handlePromptClick}
        onSubmit={() => void handleSendMessage()}
        promptChips={promptChips}
        shellMessage={shellMessage}
      />
    </section>
  );
}
