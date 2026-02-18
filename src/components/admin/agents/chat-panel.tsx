"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Bot, User, CalendarDays, Megaphone, BarChart3, RefreshCw } from "lucide-react";

type JobStatus = "pending" | "running" | "done" | "error";

interface Job {
  id: string;
  agent_id: string;
  status: JobStatus;
  prompt: string | null;
  result: string | null;
  error: string | null;
  created_at: string;
  finished_at: string | null;
}

const AGENT_LABELS: Record<string, { label: string; icon: React.ElementType }> = {
  "tm-monitor":       { label: "TM One Monitor",   icon: CalendarDays },
  "meta-ads":         { label: "Meta Ads",          icon: Megaphone    },
  "campaign-monitor": { label: "Campaign Monitor",  icon: BarChart3    },
};

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function StatusBadge({ status }: { status: JobStatus }) {
  const map = {
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    running: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    done:    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    error:   "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${map[status]}`}>
      {status === "running" && <Loader2 className="h-2.5 w-2.5 mr-1 animate-spin" />}
      {status}
    </span>
  );
}

function ResultText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 400;
  const shown = expanded || !isLong ? text : text.slice(0, 400) + "…";

  return (
    <div>
      <p className="text-sm whitespace-pre-wrap leading-relaxed">{shown}</p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-muted-foreground hover:text-foreground mt-1 underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}

function JobBubble({ job }: { job: Job }) {
  const meta = AGENT_LABELS[job.agent_id] ?? { label: job.agent_id, icon: Bot };
  const Icon = meta.icon;
  const hasPrompt = job.prompt && job.prompt.trim();

  return (
    <div className="space-y-2">
      {/* User message — only show if there's a custom prompt */}
      {hasPrompt && (
        <div className="flex justify-end gap-2.5">
          <div className="max-w-[80%] bg-primary/10 border border-primary/20 rounded-xl rounded-tr-sm px-4 py-2.5">
            <p className="text-sm">{job.prompt}</p>
          </div>
          <div className="h-7 w-7 rounded-full bg-muted border border-border flex items-center justify-center shrink-0 mt-0.5">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </div>
      )}

      {/* Agent response */}
      <div className="flex gap-2.5">
        <div className="h-7 w-7 rounded-full bg-muted border border-border flex items-center justify-center shrink-0 mt-0.5">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <div className="max-w-[85%] space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium">{meta.label}</span>
            <StatusBadge status={job.status} />
            <span className="text-xs text-muted-foreground">{timeAgo(job.created_at)}</span>
          </div>
          <div className="bg-muted/50 border border-border/60 rounded-xl rounded-tl-sm px-4 py-2.5">
            {job.status === "pending" && (
              <p className="text-sm text-muted-foreground italic">Queued — waiting for agent to pick up...</p>
            )}
            {job.status === "running" && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Working on it...</span>
              </div>
            )}
            {job.status === "done" && job.result && (
              <ResultText text={job.result} />
            )}
            {job.status === "error" && (
              <p className="text-sm text-red-400">{job.error ?? "Something went wrong."}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ChatPanelProps {
  initialJobs: Job[];
}

const POLL_MS = 3000;
const REFRESH_MS = 30_000;

export function ChatPanel({ initialJobs }: ChatPanelProps) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [jobs]);

  // Poll active job until done
  useEffect(() => {
    if (!activeJobId) return;

    const interval = setInterval(async () => {
      const res = await fetch(`/api/agents/job/${activeJobId}`);
      if (!res.ok) return;

      const { job } = await res.json() as { job: Job };
      setJobs((prev) =>
        prev.map((j) => (j.id === activeJobId ? job : j))
      );

      if (job.status === "done" || job.status === "error") {
        setActiveJobId(null);
        clearInterval(interval);
      }
    }, POLL_MS);

    return () => clearInterval(interval);
  }, [activeJobId]);

  // Refresh job list periodically to show scheduled runs
  const refreshJobs = useCallback(async () => {
    const res = await fetch("/api/agents/jobs");
    if (!res.ok) return;
    const { jobs: fresh } = await res.json() as { jobs: Job[] };
    setJobs(fresh);
  }, []);

  useEffect(() => {
    const interval = setInterval(refreshJobs, REFRESH_MS);
    return () => clearInterval(interval);
  }, [refreshJobs]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;

    setSending(true);
    setInput("");

    const res = await fetch("/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agent: "assistant", prompt: text }),
    });

    setSending(false);

    if (!res.ok) return;
    const { job } = await res.json() as { job: Job };

    // Optimistic add
    setJobs((prev) => [...prev, job]);
    setActiveJobId(job.id);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const visibleJobs = jobs.filter((j) => j.agent_id !== "heartbeat");

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 shrink-0">
        <div>
          <h2 className="text-sm font-semibold">Activity & Chat</h2>
          <p className="text-xs text-muted-foreground">All agent runs + your messages</p>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={refreshJobs}>
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {visibleJobs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <Bot className="h-8 w-8 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">No activity yet.</p>
            <p className="text-xs text-muted-foreground mt-1">
              Run an agent or send a message below.
            </p>
          </div>
        )}
        {visibleJobs.map((job) => (
          <JobBubble key={job.id} job={job} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2 border-t border-border/60 shrink-0">
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask the agent anything — 'How are the Denver campaigns?' or 'Check Meta now'"
            rows={2}
            className="flex-1 resize-none rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground/60"
          />
          <Button
            onClick={send}
            disabled={!input.trim() || sending}
            size="icon"
            className="h-10 w-10 rounded-xl shrink-0"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 px-1">
          Enter to send — Shift+Enter for new line — messages run as agent tasks
        </p>
      </div>

    </div>
  );
}
