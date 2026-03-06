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
  AssetComment,
  AssetCommentVisibility,
} from "@/features/asset-comments/server";
import { cn } from "@/lib/utils";
import { AssetCommentThread } from "./asset-comment-thread";

interface AssetCommentsPanelProps {
  allowAdminOnly: boolean;
  allowCreateFollowUpItems?: boolean;
  assetId: string;
  canDeleteAny: boolean;
  clientSlug: string;
  comments: AssetComment[];
  currentUserId: string;
  linkedFollowUpSourceIds?: string[];
  description?: string;
  emptyState?: string;
  title?: string;
  variant: "admin" | "client";
}

function styles(variant: "admin" | "client") {
  if (variant === "client") {
    return {
      body: "rounded-[28px] border border-white/[0.08] bg-white/[0.04] p-5",
      composer: "rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4",
      empty:
        "rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] px-4 py-6 text-sm text-white/50",
      muted: "text-white/50",
      text: "text-white",
      textarea:
        "w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/45 focus:outline-none focus:ring-2 focus:ring-white/[0.12]",
      select: "w-full border-white/[0.12] bg-white/[0.04] text-white sm:w-[170px]",
      selectContent: "border-white/[0.12] bg-[#141414] text-white",
      button: "bg-white text-[#141414] hover:bg-white/90",
      helper: "text-xs text-white/50",
      refresh: "inline-flex items-center gap-2 text-sm text-white/55",
    };
  }

  return {
    body: "rounded-[28px] border border-[#ece8df] bg-white/95 p-5 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.5)]",
    composer: "rounded-2xl border border-[#ece8df] bg-[#fcfbf8] p-4",
    empty:
      "rounded-2xl border border-dashed border-[#e7e0d3] bg-[#faf8f5] px-4 py-6 text-sm text-[#9b9a97]",
    muted: "text-[#9b9a97]",
    text: "text-[#2f2f2f]",
    textarea:
      "w-full rounded-xl border border-[#e5e1d8] bg-white px-3 py-2 text-sm text-[#37352f] placeholder:text-[#9b9a97] focus:outline-none focus:ring-2 focus:ring-[#ddd7cc]",
    select: "w-full border-[#e5ded2] bg-white text-[#37352f] sm:w-[170px]",
    selectContent: "border-[#ece8df] bg-white text-[#2f2f2f]",
    button: "bg-[#2f2f2f] text-white hover:bg-[#1f1f1f]",
    helper: "text-xs text-[#9b9a97]",
    refresh: "inline-flex items-center gap-2 text-sm text-[#9b9a97]",
  };
}

export function AssetCommentsPanel({
  allowAdminOnly,
  allowCreateFollowUpItems = false,
  assetId,
  canDeleteAny,
  clientSlug,
  comments: initialComments,
  currentUserId,
  linkedFollowUpSourceIds: initialLinkedFollowUpSourceIds = [],
  description = "Keep creative feedback, review notes, and response context attached directly to this asset.",
  emptyState = "No asset discussion yet.",
  title = "Asset discussion",
  variant,
}: AssetCommentsPanelProps) {
  const [comments, setComments] = useState(initialComments);
  const [loading, setLoading] = useState(false);
  const [creatingFollowUpId, setCreatingFollowUpId] = useState<string | null>(null);
  const [linkedFollowUpSourceIds, setLinkedFollowUpSourceIds] = useState<Set<string>>(
    new Set(initialLinkedFollowUpSourceIds),
  );
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [visibility, setVisibility] = useState<AssetCommentVisibility>("shared");
  const tone = styles(variant);

  async function fetchComments() {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/asset-comments?asset_id=${encodeURIComponent(assetId)}&client_slug=${encodeURIComponent(clientSlug)}`,
      );
      if (!response.ok) return;

      const data = (await response.json()) as { comments?: AssetComment[] };
      setComments(data.comments ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function addComment() {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const response = await fetch("/api/asset-comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asset_id: assetId,
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
    const response = await fetch("/api/asset-comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        asset_id: assetId,
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
    const response = await fetch(`/api/asset-comments?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resolved }),
    });

    if (response.ok) {
      await fetchComments();
    }
  }

  async function deleteComment(id: string) {
    const response = await fetch(`/api/asset-comments?id=${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      await fetchComments();
    }
  }

  async function createFollowUpItem(commentId: string) {
    setCreatingFollowUpId(commentId);
    try {
      const response = await fetch("/api/asset-comments/follow-up-item", {
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
    const groupedReplies = new Map<string, AssetComment[]>();
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
    <section className={tone.body}>
      <div className="mb-4">
        <p className={cn("text-sm font-medium", tone.muted)}>Collaboration</p>
        <h2 className={cn("mt-1 text-xl font-semibold tracking-tight", tone.text)}>{title}</h2>
        <p className={cn("mt-1 text-sm", tone.muted)}>{description}</p>
      </div>

      <div className={cn("space-y-3", tone.composer)}>
        <textarea
          className={tone.textarea}
          placeholder="Add a creative comment..."
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
              onValueChange={(value) => setVisibility(value as AssetCommentVisibility)}
            >
              <SelectTrigger className={tone.select}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={tone.selectContent}>
                <SelectItem value="shared">Shared comment</SelectItem>
                <SelectItem value="admin_only">Admin only</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className={tone.helper}>Clients can join the shared creative discussion.</div>
          )}
          <Button
            className={tone.button}
            disabled={submitting || !newComment.trim()}
            onClick={() => void addComment()}
          >
            {submitting ? "Posting..." : "Comment"}
          </Button>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {loading && comments.length === 0 ? <p className={cn("text-sm", tone.muted)}>Loading comments...</p> : null}

        {!loading && topLevel.length === 0 ? <div className={tone.empty}>{emptyState}</div> : null}

        {topLevel.map((comment) => (
          <AssetCommentThread
            key={comment.id}
            canCreateFollowUpItem={
              allowCreateFollowUpItems &&
              !comment.parentCommentId &&
              !linkedFollowUpSourceIds.has(comment.id) &&
              creatingFollowUpId !== comment.id
            }
            canDeleteAny={canDeleteAny}
            comment={comment}
            currentUserId={currentUserId}
            onCreateFollowUpItem={createFollowUpItem}
            onDelete={deleteComment}
            onReply={reply}
            onResolve={resolveComment}
            replies={(repliesMap.get(comment.id) ?? []).sort((a, b) =>
              a.createdAt.localeCompare(b.createdAt),
            )}
            variant={variant}
          />
        ))}

        {loading && comments.length > 0 ? (
          <div className={tone.refresh}>
            <MessageSquare className="h-4 w-4" />
            Refreshing discussion…
          </div>
        ) : null}
      </div>
    </section>
  );
}
