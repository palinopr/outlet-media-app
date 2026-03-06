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
import type {
  CampaignComment,
  CampaignCommentVisibility,
} from "@/features/campaign-comments/server";
import { CampaignCommentThread } from "./campaign-comment-thread";

interface CampaignCommentsPanelProps {
  allowAdminOnly: boolean;
  allowCreateActionItems?: boolean;
  canDeleteAny: boolean;
  campaignId: string;
  clientSlug: string;
  comments: CampaignComment[];
  currentUserId: string;
  linkedActionSourceIds?: string[];
  description?: string;
  emptyState?: string;
  title?: string;
}

export function CampaignCommentsPanel({
  allowAdminOnly,
  allowCreateActionItems = false,
  canDeleteAny,
  campaignId,
  clientSlug,
  comments: initialComments,
  currentUserId,
  linkedActionSourceIds: initialLinkedActionSourceIds = [],
  description = "Discuss campaign changes, creative feedback, blockers, and next steps in context.",
  emptyState = "No campaign comments yet.",
  title = "Campaign discussion",
}: CampaignCommentsPanelProps) {
  const [comments, setComments] = useState(initialComments);
  const [loading, setLoading] = useState(false);
  const [creatingActionId, setCreatingActionId] = useState<string | null>(null);
  const [linkedActionSourceIds, setLinkedActionSourceIds] = useState<Set<string>>(
    new Set(initialLinkedActionSourceIds),
  );
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [visibility, setVisibility] = useState<CampaignCommentVisibility>("shared");

  async function fetchComments() {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/campaign-comments?campaign_id=${encodeURIComponent(campaignId)}&client_slug=${encodeURIComponent(clientSlug)}`,
      );
      if (!response.ok) return;

      const data = (await response.json()) as { comments?: CampaignComment[] };
      setComments(data.comments ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function addComment() {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const response = await fetch("/api/campaign-comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaign_id: campaignId,
          client_slug: clientSlug,
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
    const response = await fetch("/api/campaign-comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        campaign_id: campaignId,
        client_slug: clientSlug,
        content,
        parent_comment_id: parentId,
      }),
    });
    if (response.ok) {
      await fetchComments();
    }
  }

  async function resolveComment(id: string, resolved: boolean) {
    const response = await fetch(`/api/campaign-comments?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resolved }),
    });
    if (response.ok) {
      await fetchComments();
    }
  }

  async function deleteComment(id: string) {
    const response = await fetch(`/api/campaign-comments?id=${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      await fetchComments();
    }
  }

  async function createActionItem(commentId: string) {
    setCreatingActionId(commentId);
    try {
      const response = await fetch("/api/campaign-comments/action-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
      });
      if (!response.ok) return;

      setLinkedActionSourceIds((current) => {
        const next = new Set(current);
        next.add(commentId);
        return next;
      });
    } finally {
      setCreatingActionId(null);
    }
  }

  const { repliesMap, topLevel } = useMemo(() => {
    const groupedReplies = new Map<string, CampaignComment[]>();
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
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#2f2f2f]">
          {title}
        </h2>
        <p className="mt-1 text-sm text-[#9b9a97]">{description}</p>
      </div>

      <div className="space-y-3 rounded-2xl border border-[#ece8df] bg-[#fcfbf8] p-4">
        <textarea
          className="w-full rounded-xl border border-[#e5e1d8] bg-white px-3 py-2 text-sm text-[#37352f] placeholder:text-[#9b9a97] focus:outline-none focus:ring-2 focus:ring-[#ddd7cc]"
          placeholder="Add a campaign comment..."
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
              onValueChange={(value) => setVisibility(value as CampaignCommentVisibility)}
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
              Clients can join the shared campaign discussion.
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
          <CampaignCommentThread
            key={comment.id}
            canDeleteAny={canDeleteAny}
            canCreateActionItem={
              allowCreateActionItems &&
              !comment.parentCommentId &&
              !linkedActionSourceIds.has(comment.id) &&
              creatingActionId !== comment.id
            }
            comment={comment}
            currentUserId={currentUserId}
            onCreateActionItem={createActionItem}
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
