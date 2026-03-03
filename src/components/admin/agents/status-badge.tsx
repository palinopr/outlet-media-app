"use client";

import { Loader2 } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

const STATUS_MAP: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  running: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  done:    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  error:   "bg-red-500/10 text-red-400 border-red-500/20",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${STATUS_MAP[status] ?? STATUS_MAP.pending}`}>
      {status === "running" && <Loader2 className="h-2.5 w-2.5 mr-1 animate-spin" />}
      {status}
    </span>
  );
}
