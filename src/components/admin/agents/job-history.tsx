"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";

interface Job {
  id: string;
  agent_id: string;
  status: string;
  result: string | null;
  error: string | null;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
}

interface Props {
  jobs: Job[];
}

const LABEL: Record<string, string> = {
  "meta-ads": "Meta Ads",
  "tm-monitor": "TM Monitor",
  "campaign-monitor": "Campaign Monitor",
  "think": "Think Cycle",
  "assistant": "Chat",
};

function duration(started: string | null, finished: string | null) {
  if (!started || !finished) return "—";
  const ms = new Date(finished).getTime() - new Date(started).getTime();
  if (ms < 60000) return `${Math.round(ms / 1000)}s`;
  return `${Math.round(ms / 60000)}m`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    done:    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    error:   "bg-red-500/10 text-red-400 border-red-500/20",
    running: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    pending: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${map[status] ?? map.pending}`}>
      {status}
    </span>
  );
}

function ExpandableRow({ job }: { job: Job }) {
  const [open, setOpen] = useState(false);
  const output = job.error || job.result;
  const preview = output ? output.slice(0, 120).replace(/\n/g, " ") : null;

  return (
    <>
      <TableRow
        className="border-border/60 cursor-pointer hover:bg-muted/30"
        onClick={() => setOpen((o) => !o)}
      >
        <TableCell className="w-6 text-muted-foreground">
          {output
            ? open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
            : null}
        </TableCell>
        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
          {fmtDate(job.created_at)}
        </TableCell>
        <TableCell className="text-xs font-medium">
          {LABEL[job.agent_id] ?? job.agent_id}
        </TableCell>
        <TableCell><StatusBadge status={job.status} /></TableCell>
        <TableCell className="text-xs text-muted-foreground tabular-nums">
          {duration(job.started_at, job.finished_at)}
        </TableCell>
        <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
          {preview ?? "—"}
        </TableCell>
      </TableRow>
      {open && output && (
        <TableRow className="border-border/60 bg-muted/20">
          <TableCell colSpan={6} className="py-3 px-4">
            <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
              {output}
            </pre>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export function JobHistory({ jobs }: Props) {
  // Exclude assistant and heartbeat — those show in the chat panel
  const history = jobs
    .filter((j) => j.agent_id !== "assistant" && j.agent_id !== "heartbeat")
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 30);

  return (
    <div>
      <h2 className="text-sm font-semibold mb-3">
        Automated Run History
        <span className="text-muted-foreground font-normal ml-2">({history.length})</span>
      </h2>
      <Card className="border-border/60">
        {history.length === 0 ? (
          <div className="py-10 text-center text-xs text-muted-foreground">
            No automated runs yet — the agent runs Meta sync every 6h and think cycles every 30m
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead className="w-6" />
                <TableHead className="text-xs font-medium text-muted-foreground">Started</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Agent</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Duration</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Output preview</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((job) => (
                <ExpandableRow key={job.id} job={job} />
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
