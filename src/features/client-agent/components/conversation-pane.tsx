"use client";

import { AnswerBlocks } from "./answer-blocks";
import type { AgentThreadMessage } from "./agent-shell";

type ConversationPaneProps = {
  activeThreadId: string | null;
  clientName: string;
  composerDisabled: boolean;
  draft: string;
  isLoadingThread: boolean;
  isPreview: boolean;
  messages: AgentThreadMessage[];
  onDraftChange: (value: string) => void;
  onPromptClick: (prompt: string) => void;
  onSubmit: () => void;
  promptChips: string[];
  shellMessage: string | null;
};

function statusClass(status: AgentThreadMessage["status"]) {
  if (status === "clarify") {
    return "border-amber-400/25 bg-amber-400/10 text-amber-100";
  }

  if (status === "refuse") {
    return "border-rose-400/25 bg-rose-400/10 text-rose-100";
  }

  if (status === "error") {
    return "border-white/[0.12] bg-white/[0.06] text-white/85";
  }

  return "border-white/[0.08] bg-white/[0.04] text-white/90";
}

function statusLabel(status: AgentThreadMessage["status"]) {
  if (status === "clarify") return "Clarification";
  if (status === "refuse") return "Out of scope";
  if (status === "error") return "Error";
  return "Agent";
}

export function ConversationPane({
  activeThreadId,
  clientName,
  composerDisabled,
  draft,
  isLoadingThread,
  isPreview,
  messages,
  onDraftChange,
  onPromptClick,
  onSubmit,
  promptChips,
  shellMessage,
}: ConversationPaneProps) {
  const showEmptyState = !activeThreadId && messages.length === 0;

  return (
    <div className="rounded-3xl border border-white/[0.06] bg-black/20 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur-sm">
      <div className="border-b border-white/[0.06] px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300/70">
          Agent
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
          Ask anything about your campaigns and events
        </h2>
        <p className="mt-2 text-sm text-white/55">
          {isPreview
            ? `Preview mode can test the agent for ${clientName}, but preview chats are not saved.`
            : `Use plain language and the agent will answer from your client-safe analytics.`}
        </p>
      </div>

      <div className="min-h-[420px] space-y-4 px-6 py-5">
        {shellMessage ? (
          <div className="rounded-2xl border border-white/[0.1] bg-white/[0.04] px-4 py-3 text-sm text-white/75">
            {shellMessage}
          </div>
        ) : null}

        {showEmptyState ? (
          <div className="space-y-4">
            <p className="text-sm text-white/60">
              Start a new conversation or choose one of these prompts.
            </p>
            <div className="flex flex-wrap gap-2">
              {promptChips.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => onPromptClick(prompt)}
                  className="rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-white/80 transition hover:border-cyan-300/35 hover:bg-cyan-300/10"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {isLoadingThread ? (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white/55">
            Loading conversation…
          </div>
        ) : null}

        {messages.map((message) => (
          <div
            key={message.messageId}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-3xl rounded-3xl border px-4 py-3 ${
                message.role === "user"
                  ? "border-cyan-400/25 bg-cyan-400/12 text-white"
                  : statusClass(message.status)
              }`}
            >
              {message.role === "assistant" ? (
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-inherit/80">
                  {statusLabel(message.status)}
                </p>
              ) : null}
              <p className="text-sm leading-6">{message.text}</p>
              {message.blocks.length > 0 ? (
                <div className="mt-4">
                  <AnswerBlocks blocks={message.blocks} />
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/[0.06] px-6 py-5">
        <div className="flex flex-col gap-3">
          <textarea
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            disabled={composerDisabled}
            rows={4}
            placeholder={
              isPreview
                ? "Ask a preview question. These chats are not saved."
                : "Ask about campaign or event performance…"
            }
            className="w-full resize-none rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-cyan-300/35 disabled:cursor-not-allowed disabled:opacity-60"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onSubmit}
              disabled={composerDisabled || draft.trim().length === 0}
              className="rounded-full border border-cyan-400/25 bg-cyan-400/12 px-5 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/18 disabled:cursor-not-allowed disabled:border-white/[0.08] disabled:bg-white/[0.04] disabled:text-white/35"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
