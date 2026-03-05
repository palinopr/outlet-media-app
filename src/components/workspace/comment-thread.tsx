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
    <div className={`rounded-lg border p-3 ${comment.resolved ? "opacity-60" : ""}`}>
      <SingleComment
        comment={comment}
        currentUserId={currentUserId}
        onDelete={onDelete}
      />

      <div className="mt-2 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-xs"
          onClick={() => setReplyOpen(!replyOpen)}
        >
          Reply
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-xs"
          onClick={() => onResolve(comment.id, !comment.resolved)}
        >
          {comment.resolved ? "Reopen" : "Resolve"}
        </Button>
      </div>

      {replies.length > 0 && (
        <div className="mt-2 ml-4 space-y-2 border-l pl-3">
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
            className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
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
            <Button size="sm" className="h-7 text-xs" onClick={handleReply} disabled={submitting || !replyText.trim()}>
              {submitting ? "Sending..." : "Reply"}
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setReplyOpen(false)}>
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
          <span className="text-sm font-medium">{comment.author_name ?? "Unknown"}</span>
          <span className="text-xs text-muted-foreground">{timeAgo(comment.created_at)}</span>
          {comment.author_id === currentUserId && (
            <button
              type="button"
              className="ml-auto hidden text-xs text-muted-foreground hover:text-destructive group-hover:inline"
              onClick={() => onDelete(comment.id)}
            >
              Delete
            </button>
          )}
        </div>
        <p className="mt-0.5 text-sm whitespace-pre-wrap">{comment.content}</p>
      </div>
    </div>
  );
}
