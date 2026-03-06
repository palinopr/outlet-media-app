"use client";

import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CommentThread } from "./comment-thread";
import type { WorkspaceComment } from "@/lib/workspace-types";

interface CommentSidebarProps {
  pageId: string;
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
}

export function CommentSidebar({ pageId, isOpen, onClose, currentUserId }: CommentSidebarProps) {
  const [comments, setComments] = useState<WorkspaceComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    if (!pageId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/workspace/comments?page_id=${pageId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments ?? []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    if (isOpen) fetchComments();
  }, [isOpen, fetchComments]);

  async function handleAddComment() {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/workspace/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page_id: pageId, content: newComment.trim() }),
      });
      if (res.ok) {
        setNewComment("");
        await fetchComments();
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReply(parentId: string, content: string) {
    const res = await fetch("/api/workspace/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page_id: pageId, content, parent_comment_id: parentId }),
    });
    if (res.ok) await fetchComments();
  }

  async function handleResolve(id: string, resolved: boolean) {
    const res = await fetch(`/api/workspace/comments?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resolved }),
    });
    if (res.ok) await fetchComments();
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/workspace/comments?id=${id}`, { method: "DELETE" });
    if (res.ok) await fetchComments();
  }

  // Group comments: top-level + their replies
  const topLevel = comments.filter((c) => !c.parent_comment_id);
  const repliesMap = new Map<string, WorkspaceComment[]>();
  for (const c of comments) {
    if (c.parent_comment_id) {
      const arr = repliesMap.get(c.parent_comment_id) ?? [];
      arr.push(c);
      repliesMap.set(c.parent_comment_id, arr);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="flex h-full w-[340px] flex-col border-l border-[#ece8df] bg-[#fbfbfa]">
      <div className="flex items-center justify-between border-b border-[#ece8df] px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-[#37352f]">Comments</h3>
          <p className="text-xs text-[#9b9a97]">Discuss this page with your team.</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-[#787774] hover:bg-[#f1efea] hover:text-[#37352f]"
          onClick={onClose}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      <ScrollArea className="flex-1 overflow-auto">
        <div className="space-y-3 p-4">
          {loading && comments.length === 0 && (
            <p className="text-sm text-[#9b9a97]">Loading...</p>
          )}
          {!loading && topLevel.length === 0 && (
            <p className="text-sm text-[#9b9a97]">No comments yet.</p>
          )}
          {topLevel.map((comment) => (
            <CommentThread
              key={comment.id}
              comment={comment}
              replies={repliesMap.get(comment.id) ?? []}
              onReply={handleReply}
              onResolve={handleResolve}
              onDelete={handleDelete}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      </ScrollArea>

      <div className="border-t border-[#ece8df] p-4">
        <textarea
          className="w-full rounded-xl border border-[#e5e1d8] bg-white px-3 py-2 text-sm text-[#37352f] placeholder:text-[#9b9a97] focus:outline-none focus:ring-2 focus:ring-[#ddd7cc]"
          placeholder="Add a comment..."
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              handleAddComment();
            }
          }}
        />
        <Button
          size="sm"
          className="mt-2 w-full bg-[#2f2f2f] text-white hover:bg-[#1f1f1f]"
          onClick={handleAddComment}
          disabled={submitting || !newComment.trim()}
        >
          {submitting ? "Posting..." : "Comment"}
        </Button>
      </div>
    </div>
  );
}
