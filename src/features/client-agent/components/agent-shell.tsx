"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { ConversationPane } from "./conversation-pane";
import { ThreadList } from "./thread-list";
import type { AgentAnswerBlock, AgentResponseStatus, ReferencedEntity, ResolvedRange } from "../types";

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
  resolvedRange: ResolvedRange | null;
  providerResponseId: string | null;
  clientGeneratedId: string | null;
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
  status: "answer" | "clarify" | "refuse" | "error";
  thread_id: string;
  message_id: string;
  text: string;
  blocks: AgentAnswerBlock[];
  referenced_entities: ReferencedEntity[];
  resolved_range: ResolvedRange | null;
};

type HistoryPayload = Array<{
  role: "user" | "assistant";
  text: string;
}>;

const BASE_PROMPTS = [
  "How are my campaigns doing this month?",
  "Show spend by date for Camila.",
  "Which audience is performing best right now?",
  "Compare my top campaigns this quarter.",
];

const EVENT_PROMPT = "How is this event trending?";

function nowIso() {
  return new Date().toISOString();
}

function normalizePreviewText(value: string) {
  return value.trim().slice(0, 140);
}

function buildOptimisticUserMessage(text: string, clientGeneratedId: string): AgentThreadMessage {
  const createdAt = nowIso();

  return {
    messageId: `optimistic:${clientGeneratedId}`,
    role: "user",
    status: null,
    text,
    blocks: [],
    referencedEntities: [],
    resolvedRange: null,
    providerResponseId: null,
    clientGeneratedId,
    createdAt,
  };
}

function buildAssistantMessage(payload: SendMessagePayload): AgentThreadMessage {
  return {
    messageId: payload.message_id,
    role: "assistant",
    status: payload.status,
    text: payload.text,
    blocks: payload.blocks,
    referencedEntities: payload.referenced_entities,
    resolvedRange: payload.resolved_range,
    providerResponseId: null,
    clientGeneratedId: null,
    createdAt: nowIso(),
  };
}

async function parseJson<T>(response: Response): Promise<T> {
  return response.json() as Promise<T>;
}

function buildHistoryPayload(messages: AgentThreadMessage[]): HistoryPayload {
  return messages.slice(-6).map((message) => ({
    role: message.role,
    text: message.text,
  }));
}

export function AgentShell({
  clientName,
  eventsEnabled,
  initialThreads,
  slug,
  viewer,
}: AgentShellProps) {
  const [threads, setThreads] = useState<AgentThreadSummary[]>(initialThreads);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messagesByThread, setMessagesByThread] = useState<Record<string, AgentThreadMessage[]>>({});
  const [pendingThreadIds, setPendingThreadIds] = useState<Record<string, boolean>>({});
  const [loadedThreadIds, setLoadedThreadIds] = useState<Set<string>>(new Set());
  const [draft, setDraft] = useState("");
  const [composerDisabled, setComposerDisabled] = useState(false);
  const [isLoadingThread, setIsLoadingThread] = useState(false);
  const [shellMessage, setShellMessage] = useState<string | null>(null);

  const promptChips = useMemo(
    () => [...BASE_PROMPTS, ...(eventsEnabled ? [EVENT_PROMPT] : [])],
    [eventsEnabled],
  );
  const isPreview = viewer === "admin_preview";
  const activeMessages = activeThreadId ? (messagesByThread[activeThreadId] ?? []) : [];

  useEffect(() => {
    if (!activeThreadId || loadedThreadIds.has(activeThreadId) || isPreview) {
      return;
    }

    let cancelled = false;
    setIsLoadingThread(true);
    setShellMessage(null);

    fetch(`/api/client/${slug}/agent/threads/${activeThreadId}`)
      .then(async (response) => {
        const body = await parseJson<{ error?: string; thread?: AgentThreadDetail }>(response);
        if (!response.ok || !body.thread) {
          throw new Error(body.error ?? "Unable to load this conversation right now.");
        }

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setMessagesByThread((current) => ({
            ...current,
            [activeThreadId]: body.thread?.messages ?? [],
          }));
          setLoadedThreadIds((current) => {
            const next = new Set(current);
            next.add(activeThreadId);
            return next;
          });
        });
      })
      .catch(() => {
        if (!cancelled) {
          setShellMessage("Unable to load this conversation right now.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingThread(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeThreadId, isPreview, loadedThreadIds, slug]);

  async function createThreadAndSelect() {
    const response = await fetch(`/api/client/${slug}/agent/threads`, {
      method: "POST",
    });
    const body = await parseJson<{ error?: string; thread?: AgentThreadDetail }>(response);
    if (!response.ok || !body.thread) {
      throw new Error(body.error ?? "Unable to start a conversation right now.");
    }

    startTransition(() => {
      setThreads((current) => {
        const next = current.filter((thread) => thread.threadId !== body.thread?.threadId);
        return [body.thread!, ...next];
      });
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

  async function handleSendMessage(explicitMessage?: string) {
    const nextMessage = (explicitMessage ?? draft).trim();
    if (!nextMessage || composerDisabled) {
      return;
    }

    let threadId: string | null = activeThreadId;
    setComposerDisabled(true);
    setShellMessage(null);

    try {
      threadId = threadId ?? (await createThreadAndSelect());
      if (!threadId) {
        throw new Error("Unable to resolve an active thread.");
      }
      const resolvedThreadId = threadId;
      const threadHistory = buildHistoryPayload(messagesByThread[resolvedThreadId] ?? []);
      const clientGeneratedId = crypto.randomUUID();
      const optimisticUserMessage = buildOptimisticUserMessage(nextMessage, clientGeneratedId);

      startTransition(() => {
        setDraft("");
        setMessagesByThread((current) => ({
          ...current,
          [resolvedThreadId]: [...(current[resolvedThreadId] ?? []), optimisticUserMessage],
        }));
        setPendingThreadIds((current) => ({
          ...current,
          [resolvedThreadId]: true,
        }));
      });

      const response = await fetch(`/api/client/${slug}/agent/threads/${resolvedThreadId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: nextMessage,
          client_generated_id: clientGeneratedId,
          history: threadHistory,
        }),
      });
      const body = await parseJson<SendMessagePayload & { error?: string }>(response);
      if (!response.ok) {
        throw new Error(body.error ?? "Unable to send that message right now.");
      }

      const assistantMessage = buildAssistantMessage(body);

      startTransition(() => {
        setMessagesByThread((current) => ({
          ...current,
          [resolvedThreadId]: [...(current[resolvedThreadId] ?? []), assistantMessage],
        }));
        setPendingThreadIds((current) => ({
          ...current,
          [resolvedThreadId]: false,
        }));
        setThreads((current) => {
          const existing = current.find((thread) => thread.threadId === resolvedThreadId);
          const baseThread: AgentThreadSummary = existing ?? {
            threadId: resolvedThreadId,
            title: nextMessage.slice(0, 80),
            previewText: null,
            referencedEntities: [],
            lastResponseStatus: null,
            lastMessageAt: nowIso(),
            updatedAt: nowIso(),
            createdAt: nowIso(),
          };

          const updatedThread: AgentThreadSummary = {
            ...baseThread,
            previewText: normalizePreviewText(body.text),
            referencedEntities: body.referenced_entities,
            lastResponseStatus: body.status,
            lastMessageAt: nowIso(),
            updatedAt: nowIso(),
          };

          return [
            updatedThread,
            ...current.filter((thread) => thread.threadId !== resolvedThreadId),
          ];
        });
      });
    } catch {
      const assistantError: AgentThreadMessage = {
        messageId: `assistant-error:${nowIso()}`,
        role: "assistant",
        status: "error",
        text: "I’m unable to send that right now.",
        blocks: [],
        referencedEntities: [],
        resolvedRange: null,
        providerResponseId: null,
        clientGeneratedId: null,
        createdAt: nowIso(),
      };

      if (threadId) {
        const resolvedThreadId = threadId;
        startTransition(() => {
          setMessagesByThread((current) => ({
            ...current,
            [resolvedThreadId]: [...(current[resolvedThreadId] ?? []), assistantError],
          }));
          setPendingThreadIds((current) => ({
            ...current,
            [resolvedThreadId]: false,
          }));
        });
      } else {
        setShellMessage("I’m unable to send that right now.");
      }
    } finally {
      setComposerDisabled(false);
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
        isWorking={Boolean(activeThreadId && pendingThreadIds[activeThreadId])}
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
