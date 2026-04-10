"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageSquareMore, Reply, RotateCcw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fmtDate } from "@/lib/formatters";

export type AdminRequestComment = {
  authorName: string | null;
  content: string;
  createdAt: string;
  id: string;
  parentCommentId: string | null;
  resolved: boolean;
  visibility: "admin_only" | "shared";
};

interface ThreadComment extends AdminRequestComment {
  replies: AdminRequestComment[];
}

interface ClientRequestsPanelProps {
  clientSlug: string | null;
  comments: AdminRequestComment[];
  entityId: string;
  entityLabel: string;
  entityType: "campaign" | "event";
}

function groupDiscussionThreads(comments: AdminRequestComment[]): ThreadComment[] {
  const repliesByParent = new Map<string, AdminRequestComment[]>();

  for (const comment of comments) {
    if (!comment.parentCommentId) continue;
    const current = repliesByParent.get(comment.parentCommentId) ?? [];
    current.push(comment);
    repliesByParent.set(comment.parentCommentId, current);
  }

  return comments
    .filter((comment) => !comment.parentCommentId)
    .map((thread) => ({
      ...thread,
      replies: repliesByParent.get(thread.id) ?? [],
    }))
    .filter((thread) => thread.visibility === "shared")
    .sort((left, right) => {
      if (left.resolved !== right.resolved) {
        return Number(left.resolved) - Number(right.resolved);
      }

      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    });
}

function requestEndpoint(entityType: "campaign" | "event") {
  return entityType === "campaign" ? "/api/campaign-comments" : "/api/event-comments";
}

function requestEntityKey(entityType: "campaign" | "event") {
  return entityType === "campaign" ? "campaign_id" : "event_id";
}

export function ClientRequestsPanel({
  clientSlug,
  comments,
  entityId,
  entityLabel,
  entityType,
}: ClientRequestsPanelProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pendingReplyThreadId, setPendingReplyThreadId] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [submittingReplyThreadId, setSubmittingReplyThreadId] = useState<string | null>(null);
  const [updatingThreadId, setUpdatingThreadId] = useState<string | null>(null);

  const threads = useMemo(() => groupDiscussionThreads(comments), [comments]);
  const openThreadCount = threads.filter((thread) => !thread.resolved).length;
  const endpoint = requestEndpoint(entityType);
  const entityKey = requestEntityKey(entityType);

  async function handleReply(threadId: string) {
    if (!clientSlug) return;

    const nextContent = replyDrafts[threadId]?.trim();
    if (!nextContent || submittingReplyThreadId) return;

    setSubmittingReplyThreadId(threadId);
    setError(null);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [entityKey]: entityId,
          client_slug: clientSlug,
          content: nextContent,
          parent_comment_id: threadId,
          visibility: "shared",
        }),
      });
      const body = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(body.error ?? "Unable to send the reply right now.");
      }

      setReplyDrafts((current) => ({ ...current, [threadId]: "" }));
      setPendingReplyThreadId(null);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Unable to send the reply right now.",
      );
    } finally {
      setSubmittingReplyThreadId(null);
    }
  }

  async function handleResolvedChange(threadId: string, resolved: boolean) {
    setUpdatingThreadId(threadId);
    setError(null);

    try {
      const response = await fetch(`${endpoint}?id=${threadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resolved }),
      });
      const body = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(body.error ?? "Unable to update the request right now.");
      }

      router.refresh();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update the request right now.",
      );
    } finally {
      setUpdatingThreadId(null);
    }
  }

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border/50 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MessageSquareMore className="h-4 w-4" />
            <p className="text-sm font-medium">Client requests</p>
          </div>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
            Requests attached to {entityLabel}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Reply to the client and resolve request threads without leaving this {entityType}.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="rounded-full border border-border/60 bg-muted/40 px-2.5 py-1">
            {openThreadCount} open
          </span>
          <span className="rounded-full border border-border/60 bg-muted/40 px-2.5 py-1">
            {threads.length} total thread{threads.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-rose-500">{error}</p> : null}

      {!clientSlug ? (
        <div className="mt-4 rounded-2xl border border-dashed border-border/60 bg-muted/20 px-4 py-6 text-sm text-muted-foreground">
          Assign this {entityType} to a client before using the request inbox.
        </div>
      ) : threads.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-border/60 bg-muted/20 px-4 py-6 text-sm text-muted-foreground">
          No client requests have been sent on this {entityType} yet.
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {threads.map((thread) => {
            const isReplyOpen = pendingReplyThreadId === thread.id;
            const isReplying = submittingReplyThreadId === thread.id;
            const isUpdating = updatingThreadId === thread.id;
            const replyDraft = replyDrafts[thread.id] ?? "";

            return (
              <article key={thread.id} className="rounded-2xl border border-border/60 bg-background/50 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-foreground">
                        {thread.authorName ?? "Unknown author"}
                      </p>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[11px] ${
                          thread.resolved
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
                            : "border-amber-500/20 bg-amber-500/10 text-amber-700"
                        }`}
                      >
                        {thread.resolved ? "Resolved" : "Open"}
                      </span>
                      <span className="rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-[11px] text-muted-foreground">
                        Shared with client
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Started {fmtDate(thread.createdAt)}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setError(null);
                        setPendingReplyThreadId(isReplyOpen ? null : thread.id);
                      }}
                    >
                      <Reply className="h-4 w-4" />
                      Reply
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={isUpdating}
                      onClick={() => handleResolvedChange(thread.id, !thread.resolved)}
                    >
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : thread.resolved ? (
                        <RotateCcw className="h-4 w-4" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                      {thread.resolved ? "Reopen" : "Resolve"}
                    </Button>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-foreground">{thread.content}</p>

                {thread.replies.length > 0 ? (
                  <div className="mt-4 space-y-3 border-l border-border/60 pl-4">
                    {thread.replies.map((reply) => (
                      <div key={reply.id} className="rounded-xl border border-border/60 bg-card p-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-xs font-medium text-foreground">
                            {reply.authorName ?? "Unknown author"}
                          </p>
                          <span className="rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] text-muted-foreground">
                            Shared reply
                          </span>
                          <span className="text-[11px] text-muted-foreground">{fmtDate(reply.createdAt)}</span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                ) : null}

                {isReplyOpen ? (
                  <div className="mt-4 rounded-2xl border border-border/60 bg-card p-4">
                    <label htmlFor={`admin-reply-${thread.id}`} className="text-sm font-medium text-foreground">
                      Reply to client request
                    </label>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Replies posted here stay visible on the client side for this thread.
                    </p>
                    <textarea
                      id={`admin-reply-${thread.id}`}
                      value={replyDraft}
                      onChange={(event) =>
                        setReplyDrafts((current) => ({
                          ...current,
                          [thread.id]: event.target.value,
                        }))
                      }
                      rows={4}
                      disabled={isReplying}
                      placeholder="Send an update, answer the request, or ask for the missing detail you need."
                      className="mt-3 w-full rounded-xl border border-border/60 bg-background px-3 py-3 text-sm text-foreground outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        disabled={isReplying || replyDraft.trim().length === 0}
                        onClick={() => handleReply(thread.id)}
                      >
                        {isReplying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Reply className="h-4 w-4" />}
                        {isReplying ? "Sending..." : "Send reply"}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={isReplying}
                        onClick={() => setPendingReplyThreadId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
