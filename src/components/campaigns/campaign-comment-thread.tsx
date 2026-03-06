"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { CampaignComment } from "@/features/campaign-comments/server";
import { timeAgo } from "@/lib/formatters";

interface CampaignCommentThreadProps {
  canDeleteAny: boolean;
  canCreateActionItem?: boolean;
  comment: CampaignComment;
  currentUserId: string;
  onCreateActionItem?: (commentId: string) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
  onReply: (parentId: string, content: string) => Promise<void> | void;
  onResolve: (id: string, resolved: boolean) => Promise<void> | void;
  replies: CampaignComment[];
}

export function CampaignCommentThread({
  canDeleteAny,
  canCreateActionItem = false,
  comment,
  currentUserId,
  onCreateActionItem,
  onDelete,
  onReply,
  onResolve,
  replies,
}: CampaignCommentThreadProps) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleReply() {
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      await onReply(comment.id, replyText.trim());
      setReplyText("");
      setReplyOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className={`rounded-2xl border border-[#ece8df] bg-white p-4 shadow-[0_12px_32px_-28px_rgba(15,23,42,0.45)] ${comment.resolved ? "opacity-60" : ""}`}
    >
      <SingleCampaignComment
        canDeleteAny={canDeleteAny}
        comment={comment}
        currentUserId={currentUserId}
        onDelete={onDelete}
      />

      <div className="mt-3 flex items-center gap-2">
        {canCreateActionItem && onCreateActionItem ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs text-[#787774] hover:bg-[#f1efea] hover:text-[#37352f]"
            onClick={() => void onCreateActionItem(comment.id)}
          >
            Create action
          </Button>
        ) : null}
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-xs text-[#787774] hover:bg-[#f1efea] hover:text-[#37352f]"
          onClick={() => setReplyOpen((value) => !value)}
        >
          Reply
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-xs text-[#787774] hover:bg-[#f1efea] hover:text-[#37352f]"
          onClick={() => void onResolve(comment.id, !comment.resolved)}
        >
          {comment.resolved ? "Reopen" : "Resolve"}
        </Button>
      </div>

      {replies.length > 0 ? (
        <div className="ml-4 mt-3 space-y-2 border-l border-[#ece8df] pl-3">
          {replies.map((reply) => (
            <SingleCampaignComment
              key={reply.id}
              canDeleteAny={canDeleteAny}
              comment={reply}
              currentUserId={currentUserId}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : null}

      {replyOpen ? (
        <div className="ml-4 mt-3 space-y-2">
          <textarea
            className="w-full rounded-xl border border-[#e5e1d8] bg-[#fbfbfa] px-3 py-2 text-sm text-[#37352f] placeholder:text-[#9b9a97] focus:outline-none focus:ring-2 focus:ring-[#ddd7cc]"
            placeholder="Write a reply..."
            rows={2}
            value={replyText}
            onChange={(event) => setReplyText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                void handleReply();
              }
            }}
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              className="h-7 bg-[#2f2f2f] text-xs text-white hover:bg-[#1f1f1f]"
              onClick={() => void handleReply()}
              disabled={submitting || !replyText.trim()}
            >
              {submitting ? "Sending..." : "Reply"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-[#787774] hover:bg-[#f1efea] hover:text-[#37352f]"
              onClick={() => setReplyOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SingleCampaignComment({
  canDeleteAny,
  comment,
  currentUserId,
  onDelete,
}: {
  canDeleteAny: boolean;
  comment: CampaignComment;
  currentUserId: string;
  onDelete: (id: string) => Promise<void> | void;
}) {
  const initials = (comment.authorName ?? "?")
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const canDelete = canDeleteAny || comment.authorId === currentUserId;

  return (
    <div className="group flex gap-3">
      <Avatar size="sm" className="mt-0.5 shrink-0">
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-[#37352f]">
            {comment.authorName ?? "Unknown"}
          </span>
          <span className="text-xs text-[#9b9a97]">{timeAgo(comment.createdAt)}</span>
          {comment.visibility === "admin_only" ? (
            <span className="rounded-full bg-[#f1ece4] px-2 py-0.5 text-[11px] font-medium text-[#6f6a63]">
              Admin only
            </span>
          ) : null}
          {canDelete ? (
            <button
              type="button"
              className="ml-auto hidden text-xs text-[#9b9a97] hover:text-rose-600 group-hover:inline"
              onClick={() => void onDelete(comment.id)}
            >
              Delete
            </button>
          ) : null}
        </div>
        <p className="mt-1 whitespace-pre-wrap text-sm text-[#57534e]">{comment.content}</p>
      </div>
    </div>
  );
}
