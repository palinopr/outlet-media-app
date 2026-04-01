"use client";

import { MessageSquarePlus } from "lucide-react";
import type { AgentThreadSummary } from "./agent-shell";

type ThreadListProps = {
  activeThreadId: string | null;
  isPreview: boolean;
  onNewChat: () => void;
  onSelectThread: (threadId: string) => void;
  threads: AgentThreadSummary[];
};

export function ThreadList({
  activeThreadId,
  isPreview,
  onNewChat,
  onSelectThread,
  threads,
}: ThreadListProps) {
  return (
    <aside className="rounded-3xl border border-white/[0.06] bg-black/20 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur-sm">
      <button
        type="button"
        onClick={onNewChat}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-cyan-400/25 bg-cyan-400/10 px-4 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:border-white/[0.08] disabled:bg-white/[0.04] disabled:text-white/35"
      >
        <MessageSquarePlus className="h-4 w-4" />
        New chat
      </button>

      <div className="mt-4 space-y-2">
        {threads.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/[0.08] px-4 py-5 text-sm text-white/45">
            {isPreview
              ? "Preview chats are not saved."
              : "No saved conversations yet."}
          </p>
        ) : (
          threads.map((thread) => {
            const active = activeThreadId === thread.threadId;

            return (
              <button
                key={thread.threadId}
                type="button"
                onClick={() => onSelectThread(thread.threadId)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  active
                    ? "border-cyan-400/30 bg-cyan-400/10 text-white"
                    : "border-white/[0.06] bg-white/[0.03] text-white/70 hover:border-white/[0.12] hover:bg-white/[0.05]"
                }`}
              >
                <p className="truncate text-sm font-medium">
                  {thread.title ?? "New conversation"}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-white/45">
                  {thread.previewText ?? "No replies yet."}
                </p>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
