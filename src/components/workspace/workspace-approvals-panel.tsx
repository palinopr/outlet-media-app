"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, Clock3, XCircle } from "lucide-react";
import { timeAgo } from "@/lib/formatters";
import type { ApprovalRequest } from "@/features/approvals/server";

interface WorkspaceApprovalsPanelProps {
  approvals: ApprovalRequest[];
  canDecide: boolean;
  description?: string;
  emptyState?: string;
  title?: string;
}

function statusTone(status: ApprovalRequest["status"]) {
  switch (status) {
    case "approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "rejected":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "cancelled":
      return "bg-zinc-100 text-zinc-600 border-zinc-200";
    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
}

function statusIcon(status: ApprovalRequest["status"]) {
  switch (status) {
    case "approved":
      return BadgeCheck;
    case "rejected":
      return XCircle;
    default:
      return Clock3;
  }
}

export function WorkspaceApprovalsPanel({
  approvals,
  canDecide,
  description = "Requests that need a clear yes or no to keep work moving.",
  emptyState = "No approvals are waiting right now.",
  title = "Pending decisions",
}: WorkspaceApprovalsPanelProps) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function decide(id: string, status: "approved" | "rejected") {
    setPendingId(id);

    try {
      const response = await fetch(`/api/workspace/approvals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update approval");
      }

      startTransition(() => {
        router.refresh();
      });
    } finally {
      setPendingId(null);
    }
  }

  return (
    <section className="rounded-[28px] border border-[#ece8df] bg-white/95 p-5 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.5)]">
      <div className="mb-4">
        <p className="text-sm font-medium text-[#787774]">Approvals</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#2f2f2f]">
          {title}
        </h2>
        <p className="mt-1 text-sm text-[#9b9a97]">{description}</p>
      </div>

      {approvals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e7e0d3] bg-[#faf8f5] px-4 py-6 text-sm text-[#9b9a97]">
          {emptyState}
        </div>
      ) : (
        <div className="space-y-3">
          {approvals.map((approval) => {
            const Icon = statusIcon(approval.status);
            const busy = isPending && pendingId === approval.id;

            return (
              <div
                key={approval.id}
                className="rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white text-[#6f6a63] shadow-[0_10px_30px_-24px_rgba(15,23,42,0.8)]">
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#9b9a97]">
                      <span>{approval.requestedByName ?? "Unknown"}</span>
                      <span>&middot;</span>
                      <span>{timeAgo(approval.createdAt)}</span>
                      <span
                        className={`rounded-full border px-2 py-0.5 font-medium ${statusTone(approval.status)}`}
                      >
                        {approval.status}
                      </span>
                    </div>

                    <p className="mt-1 text-sm font-medium text-[#2f2f2f]">
                      {approval.title}
                    </p>

                    {approval.summary ? (
                      <p className="mt-1 text-sm text-[#787774]">{approval.summary}</p>
                    ) : null}

                    {canDecide && approval.status === "pending" ? (
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          type="button"
                          className="inline-flex h-9 items-center rounded-full bg-[#0f7b6c] px-3 text-sm font-medium text-white transition-colors hover:bg-[#0b5e52] disabled:cursor-not-allowed disabled:opacity-60"
                          disabled={busy}
                          onClick={() => void decide(approval.id, "approved")}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="inline-flex h-9 items-center rounded-full border border-[#e2d8cb] bg-white px-3 text-sm font-medium text-[#6f6a63] transition-colors hover:bg-[#f7f5f1] hover:text-[#2f2f2f] disabled:cursor-not-allowed disabled:opacity-60"
                          disabled={busy}
                          onClick={() => void decide(approval.id, "rejected")}
                        >
                          Reject
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
