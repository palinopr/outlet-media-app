"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { WorkspaceComment } from "@/lib/workspace-types";
import { timeAgo } from "@/lib/formatters";

interface CommentThreadProps {
  comment: WorkspaceComment;
  replies: WorkspaceComment[];
  onReply: (parentId: string, content: string) => void;
  onResolve: (id: string, resolved: boolean) => void;
  onDelete: (id: string) => void;
  currentUserId: string;
}

export function CommentThread({
  comment,
  replies,
  onReply,
  onResolve,
  onDelete,
  currentUserId,
}: CommentThreadProps) {
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
      className={`rounded-2xl border border-[#ece8df] bg-white p-3 shadow-[0_12px_32px_-28px_rgba(15,23,42,0.45)] ${comment.resolved ? "opacity-60" : ""}`}
    >
      <SingleComment
        comment={comment}
        currentUserId={currentUserId}
        onDelete={onDelete}
      />

      <div className="mt-2 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-xs text-[#787774] hover:bg-[#f1efea] hover:text-[#37352f]"
          onClick={() => setReplyOpen(!replyOpen)}
        >
          Reply
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-xs text-[#787774] hover:bg-[#f1efea] hover:text-[#37352f]"
          onClick={() => onResolve(comment.id, !comment.resolved)}
        >
          {comment.resolved ? "Reopen" : "Resolve"}
        </Button>
      </div>

      {replies.length > 0 && (
        <div className="mt-3 ml-4 space-y-2 border-l border-[#ece8df] pl-3">
          {replies.map((reply) => (
            <SingleComment
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {replyOpen && (
        <div className="mt-2 ml-4 space-y-2">
          <textarea
            className="w-full rounded-xl border border-[#e5e1d8] bg-[#fbfbfa] px-3 py-2 text-sm text-[#37352f] placeholder:text-[#9b9a97] focus:outline-none focus:ring-2 focus:ring-[#ddd7cc]"
            placeholder="Write a reply..."
            rows={2}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleReply();
              }
            }}
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              className="h-7 bg-[#2f2f2f] text-xs text-white hover:bg-[#1f1f1f]"
              onClick={handleReply}
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
      )}
    </div>
  );
}

function SingleComment({
  comment,
  currentUserId,
  onDelete,
}: {
  comment: WorkspaceComment;
  currentUserId: string;
  onDelete: (id: string) => void;
}) {
  const initials = (comment.author_name ?? "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="group flex gap-2">
      <Avatar size="sm" className="mt-0.5 shrink-0">
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#37352f]">
            {comment.author_name ?? "Unknown"}
          </span>
          <span className="text-xs text-[#9b9a97]">{timeAgo(comment.created_at)}</span>
          {comment.author_id === currentUserId && (
            <button
              type="button"
              className="ml-auto hidden text-xs text-[#9b9a97] hover:text-red-500 group-hover:inline"
              onClick={() => onDelete(comment.id)}
            >
              Delete
            </button>
          )}
        </div>
        <p className="mt-0.5 whitespace-pre-wrap text-sm text-[#57534e]">{comment.content}</p>
      </div>
    </div>
  );
}
