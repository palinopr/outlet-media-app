"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { EventComment } from "@/features/event-comments/server";
import { timeAgo } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface EventCommentThreadProps {
  canCreateFollowUpItem?: boolean;
  canDeleteAny: boolean;
  comment: EventComment;
  currentUserId: string;
  onCreateFollowUpItem?: (commentId: string) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
  onReply: (parentId: string, content: string) => Promise<void> | void;
  onResolve: (id: string, resolved: boolean) => Promise<void> | void;
  replies: EventComment[];
  variant: "admin" | "client";
}

function styles(variant: "admin" | "client") {
  if (variant === "client") {
    return {
      container:
        "rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 shadow-[0_12px_32px_-28px_rgba(15,23,42,0.45)]",
      divider: "border-white/[0.08]",
      replyInput:
        "w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/45 focus:outline-none focus:ring-2 focus:ring-white/[0.12]",
      replyText: "text-xs text-white/55 hover:bg-white/[0.05] hover:text-white/80",
      text: "text-white",
      muted: "text-white/50",
      body: "text-sm text-white/75",
      chip: "rounded-full bg-white/[0.08] px-2 py-0.5 text-[11px] font-medium text-white/65",
      delete: "ml-auto hidden text-xs text-white/45 hover:text-rose-300 group-hover:inline",
      primaryButton: "h-7 bg-white text-xs text-[#141414] hover:bg-white/90",
      ghostButton: "h-7 text-xs text-white/60 hover:bg-white/[0.05] hover:text-white",
    };
  }

  return {
    container:
      "rounded-2xl border border-[#ece8df] bg-white p-4 shadow-[0_12px_32px_-28px_rgba(15,23,42,0.45)]",
    divider: "border-[#ece8df]",
    replyInput:
      "w-full rounded-xl border border-[#e5e1d8] bg-[#fbfbfa] px-3 py-2 text-sm text-[#37352f] placeholder:text-[#9b9a97] focus:outline-none focus:ring-2 focus:ring-[#ddd7cc]",
    replyText: "text-xs text-[#787774] hover:bg-[#f1efea] hover:text-[#37352f]",
    text: "text-[#37352f]",
    muted: "text-[#9b9a97]",
    body: "text-sm text-[#57534e]",
    chip: "rounded-full bg-[#f1ece4] px-2 py-0.5 text-[11px] font-medium text-[#6f6a63]",
    delete: "ml-auto hidden text-xs text-[#9b9a97] hover:text-rose-600 group-hover:inline",
    primaryButton: "h-7 bg-[#2f2f2f] text-xs text-white hover:bg-[#1f1f1f]",
    ghostButton: "h-7 text-xs text-[#787774] hover:bg-[#f1efea] hover:text-[#37352f]",
  };
}

export function EventCommentThread({
  canCreateFollowUpItem = false,
  canDeleteAny,
  comment,
  currentUserId,
  onCreateFollowUpItem,
  onDelete,
  onReply,
  onResolve,
  replies,
  variant,
}: EventCommentThreadProps) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const tone = styles(variant);

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
    <div className={cn(tone.container, comment.resolved ? "opacity-60" : "")}>
      <SingleEventComment
        canDeleteAny={canDeleteAny}
        comment={comment}
        currentUserId={currentUserId}
        onDelete={onDelete}
        variant={variant}
      />

      <div className="mt-3 flex items-center gap-2">
        {canCreateFollowUpItem && onCreateFollowUpItem ? (
          <Button
            variant="ghost"
            size="sm"
            className={tone.replyText}
            onClick={() => void onCreateFollowUpItem(comment.id)}
          >
            Create follow-up
          </Button>
        ) : null}
        <Button
          variant="ghost"
          size="sm"
          className={tone.replyText}
          onClick={() => setReplyOpen((value) => !value)}
        >
          Reply
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={tone.replyText}
          onClick={() => void onResolve(comment.id, !comment.resolved)}
        >
          {comment.resolved ? "Reopen" : "Resolve"}
        </Button>
      </div>

      {replies.length > 0 ? (
        <div className={cn("ml-4 mt-3 space-y-2 border-l pl-3", tone.divider)}>
          {replies.map((reply) => (
            <SingleEventComment
              key={reply.id}
              canDeleteAny={canDeleteAny}
              comment={reply}
              currentUserId={currentUserId}
              onDelete={onDelete}
              variant={variant}
            />
          ))}
        </div>
      ) : null}

      {replyOpen ? (
        <div className="ml-4 mt-3 space-y-2">
          <textarea
            className={tone.replyInput}
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
              className={tone.primaryButton}
              onClick={() => void handleReply()}
              disabled={submitting || !replyText.trim()}
            >
              {submitting ? "Sending..." : "Reply"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={tone.ghostButton}
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

function SingleEventComment({
  canDeleteAny,
  comment,
  currentUserId,
  onDelete,
  variant,
}: {
  canDeleteAny: boolean;
  comment: EventComment;
  currentUserId: string;
  onDelete: (id: string) => Promise<void> | void;
  variant: "admin" | "client";
}) {
  const initials = (comment.authorName ?? "?")
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const tone = styles(variant);
  const canDelete = canDeleteAny || comment.authorId === currentUserId;

  return (
    <div className="group flex gap-3">
      <Avatar size="sm" className="mt-0.5 shrink-0">
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("text-sm font-medium", tone.text)}>
            {comment.authorName ?? "Unknown"}
          </span>
          <span className={cn("text-xs", tone.muted)}>{timeAgo(comment.createdAt)}</span>
          {comment.visibility === "admin_only" ? <span className={tone.chip}>Admin only</span> : null}
          {canDelete ? (
            <button
              type="button"
              className={tone.delete}
              onClick={() => void onDelete(comment.id)}
            >
              Delete
            </button>
          ) : null}
        </div>
        <p className={cn("mt-1 whitespace-pre-wrap", tone.body)}>{comment.content}</p>
      </div>
    </div>
  );
}
