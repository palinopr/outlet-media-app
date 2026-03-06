"use client";

import { useMemo, useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CrmComment, CrmCommentVisibility } from "@/features/crm-comments/server";
import { CrmCommentThread } from "./crm-comment-thread";

interface CrmCommentsPanelProps {
  allowAdminOnly: boolean;
  allowCreateFollowUpItems?: boolean;
  canDeleteAny: boolean;
  clientSlug: string;
  comments: CrmComment[];
  contactId: string;
  currentUserId: string;
  linkedFollowUpSourceIds?: string[];
  description?: string;
  emptyState?: string;
  title?: string;
}

export function CrmCommentsPanel({
  allowAdminOnly,
  allowCreateFollowUpItems = false,
  canDeleteAny,
  clientSlug,
  comments: initialComments,
  contactId,
  currentUserId,
  linkedFollowUpSourceIds: initialLinkedFollowUpSourceIds = [],
  description = "Discuss relationship context, requests, blockers, and next steps directly on the CRM record.",
  emptyState = "No CRM comments yet.",
  title = "Relationship discussion",
}: CrmCommentsPanelProps) {
  const [comments, setComments] = useState(initialComments);
  const [loading, setLoading] = useState(false);
  const [creatingFollowUpId, setCreatingFollowUpId] = useState<string | null>(null);
  const [linkedFollowUpSourceIds, setLinkedFollowUpSourceIds] = useState<Set<string>>(
    new Set(initialLinkedFollowUpSourceIds),
  );
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [visibility, setVisibility] = useState<CrmCommentVisibility>("shared");

  async function fetchComments() {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/crm-comments?contact_id=${encodeURIComponent(contactId)}&client_slug=${encodeURIComponent(clientSlug)}`,
      );
      if (!response.ok) return;

      const data = (await response.json()) as { comments?: CrmComment[] };
      setComments(data.comments ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function addComment() {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const response = await fetch("/api/crm-comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_slug: clientSlug,
          contact_id: contactId,
          content: newComment.trim(),
          visibility,
        }),
      });
      if (!response.ok) return;

      setNewComment("");
      setVisibility("shared");
      await fetchComments();
    } finally {
      setSubmitting(false);
    }
  }

  async function reply(parentId: string, content: string) {
    const response = await fetch("/api/crm-comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_slug: clientSlug,
        contact_id: contactId,
        content,
        parent_comment_id: parentId,
      }),
    });
    if (response.ok) {
      await fetchComments();
    }
  }

  async function resolveComment(id: string, resolved: boolean) {
    const response = await fetch(`/api/crm-comments?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resolved }),
    });
    if (response.ok) {
      await fetchComments();
    }
  }

  async function deleteComment(id: string) {
    const response = await fetch(`/api/crm-comments?id=${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      await fetchComments();
    }
  }

  async function createFollowUpItem(commentId: string) {
    setCreatingFollowUpId(commentId);
    try {
      const response = await fetch("/api/crm-comments/follow-up-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
      });
      if (!response.ok) return;

      setLinkedFollowUpSourceIds((current) => {
        const next = new Set(current);
        next.add(commentId);
        return next;
      });
    } finally {
      setCreatingFollowUpId(null);
    }
  }

  const { repliesMap, topLevel } = useMemo(() => {
    const groupedReplies = new Map<string, CrmComment[]>();
    for (const comment of comments) {
      if (!comment.parentCommentId) continue;
      const siblings = groupedReplies.get(comment.parentCommentId) ?? [];
      siblings.push(comment);
      groupedReplies.set(comment.parentCommentId, siblings);
    }

    return {
      repliesMap: groupedReplies,
      topLevel: comments.filter((comment) => !comment.parentCommentId),
    };
  }, [comments]);

  return (
    <section className="rounded-[28px] border border-[#ece8df] bg-white/95 p-5 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.5)]">
      <div className="mb-4">
        <p className="text-sm font-medium text-[#787774]">Collaboration</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#2f2f2f]">{title}</h2>
        <p className="mt-1 text-sm text-[#9b9a97]">{description}</p>
      </div>

      <div className="space-y-3 rounded-2xl border border-[#ece8df] bg-[#fcfbf8] p-4">
        <textarea
          className="w-full rounded-xl border border-[#e5e1d8] bg-white px-3 py-2 text-sm text-[#37352f] placeholder:text-[#9b9a97] focus:outline-none focus:ring-2 focus:ring-[#ddd7cc]"
          placeholder="Add a CRM comment..."
          rows={3}
          value={newComment}
          onChange={(event) => setNewComment(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
              event.preventDefault();
              void addComment();
            }
          }}
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {allowAdminOnly ? (
            <Select
              value={visibility}
              onValueChange={(value) => setVisibility(value as CrmCommentVisibility)}
            >
              <SelectTrigger className="w-full border-[#e5ded2] bg-white text-[#37352f] sm:w-[170px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-[#ece8df] bg-white text-[#2f2f2f]">
                <SelectItem value="shared">Shared comment</SelectItem>
                <SelectItem value="admin_only">Admin only</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="text-xs text-[#9b9a97]">
              Clients can join the shared relationship discussion.
            </div>
          )}
          <Button
            className="bg-[#2f2f2f] text-white hover:bg-[#1f1f1f]"
            disabled={submitting || !newComment.trim()}
            onClick={() => void addComment()}
          >
            {submitting ? "Posting..." : "Comment"}
          </Button>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {loading && comments.length === 0 ? (
          <p className="text-sm text-[#9b9a97]">Loading comments...</p>
        ) : null}

        {!loading && topLevel.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#e7e0d3] bg-[#faf8f5] px-4 py-6 text-sm text-[#9b9a97]">
            {emptyState}
          </div>
        ) : null}

        {topLevel.map((comment) => (
          <CrmCommentThread
            key={comment.id}
            canDeleteAny={canDeleteAny}
            canCreateFollowUpItem={
              allowCreateFollowUpItems &&
              !comment.parentCommentId &&
              !linkedFollowUpSourceIds.has(comment.id) &&
              creatingFollowUpId !== comment.id
            }
            comment={comment}
            currentUserId={currentUserId}
            onCreateFollowUpItem={createFollowUpItem}
            onDelete={deleteComment}
            onReply={reply}
            onResolve={resolveComment}
            replies={(repliesMap.get(comment.id) ?? []).sort((a, b) =>
              a.createdAt.localeCompare(b.createdAt),
            )}
          />
        ))}

        {loading && comments.length > 0 ? (
          <div className="inline-flex items-center gap-2 text-sm text-[#9b9a97]">
            <MessageSquare className="h-4 w-4" />
            Refreshing discussion…
          </div>
        ) : null}
      </div>
    </section>
  );
}
