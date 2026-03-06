"use client";

import Link from "next/link";
import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Bot, CircleAlert, Clock3, LoaderCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { timeAgo } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { AgentOutcomeStatus, AgentOutcomeView } from "@/features/agent-outcomes/summary";

interface AgentOutcomesPanelProps {
  assetHrefPrefix?: string;
  canCreateActionItems?: boolean;
  campaignHrefPrefix?: string;
  crmHrefPrefix?: string;
  description?: string;
  emptyState?: string;
  outcomes: AgentOutcomeView[];
  title?: string;
  variant: "admin" | "client";
}

const AGENT_LABELS: Record<string, string> = {
  assistant: "Assistant",
  "campaign-monitor": "Campaign Monitor",
  "meta-ads": "Meta Ads",
  "tm-monitor": "TM Monitor",
  think: "Think",
};

function statusIcon(status: AgentOutcomeStatus) {
  switch (status) {
    case "done":
      return Sparkles;
    case "error":
      return CircleAlert;
    case "running":
      return LoaderCircle;
    default:
      return Clock3;
  }
}

function statusTone(status: AgentOutcomeStatus, variant: "admin" | "client") {
  if (variant === "client") {
    switch (status) {
      case "done":
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
      case "error":
        return "border-rose-500/30 bg-rose-500/10 text-rose-200";
      case "running":
        return "border-cyan-500/30 bg-cyan-500/10 text-cyan-200";
      default:
        return "border-white/15 bg-white/5 text-white/70";
    }
  }

  switch (status) {
    case "done":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "error":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "running":
      return "border-sky-200 bg-sky-50 text-sky-700";
    default:
      return "border-[#e5ded2] bg-[#f7f5f1] text-[#6f6a63]";
  }
}

function surfaceTone(variant: "admin" | "client") {
  if (variant === "client") {
    return {
      body: "rounded-[28px] border border-white/[0.08] bg-white/[0.04] p-5",
      empty:
        "rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] px-4 py-6 text-sm text-white/50",
      item: "rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4",
      muted: "text-white/50",
      text: "text-white",
    };
  }

  return {
    body: "rounded-[28px] border border-[#ece8df] bg-white/95 p-5 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.5)]",
    empty:
      "rounded-2xl border border-dashed border-[#e7e0d3] bg-[#faf8f5] px-4 py-6 text-sm text-[#9b9a97]",
    item: "rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4",
    muted: "text-[#9b9a97]",
    text: "text-[#2f2f2f]",
  };
}

function truncate(value: string, max = 220) {
  return value.length <= max ? value : `${value.slice(0, max - 1)}…`;
}

function outcomeMessage(outcome: AgentOutcomeView) {
  if (outcome.errorText) return truncate(outcome.errorText, 240);
  if (outcome.resultText) return truncate(outcome.resultText, 240);
  if (outcome.status === "running") return "Agent is working on this request now.";
  if (outcome.status === "pending") return "Queued and waiting for the agent worker to pick it up.";
  return "Completed without a displayable result.";
}

function agentLabel(agentId: string) {
  return AGENT_LABELS[agentId] ?? agentId;
}

export function AgentOutcomesPanel({
  assetHrefPrefix,
  canCreateActionItems = false,
  campaignHrefPrefix,
  crmHrefPrefix,
  description = "Track what the agents have reviewed, what they recommended, and whether the work is still waiting on a human decision.",
  emptyState = "No linked agent follow-through yet.",
  outcomes,
  title = "Agent follow-through",
  variant,
}: AgentOutcomesPanelProps) {
  const router = useRouter();
  const tone = surfaceTone(variant);
  const isClient = variant === "client";
  const [creatingTaskId, setCreatingTaskId] = useState<string | null>(null);
  const [createdActionItems, setCreatedActionItems] = useState<Record<string, string>>({});
  const [errorByTaskId, setErrorByTaskId] = useState<Record<string, string>>({});

  async function createActionItem(taskId: string) {
    setCreatingTaskId(taskId);
    setErrorByTaskId((current) => {
      const next = { ...current };
      delete next[taskId];
      return next;
    });

    try {
      const response = await fetch("/api/agent-outcomes/action-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        item?: { id?: string };
        itemId?: string;
      };

      if (!response.ok) {
        setErrorByTaskId((current) => ({
          ...current,
          [taskId]: data.error ?? "Failed to create action item.",
        }));
        return;
      }

      const itemId = data.item?.id ?? data.itemId;
      if (itemId) {
        setCreatedActionItems((current) => ({
          ...current,
          [taskId]: itemId,
        }));
      }

      startTransition(() => {
        router.refresh();
      });
    } finally {
      setCreatingTaskId(null);
    }
  }

  return (
    <section className={tone.body}>
      <div className="mb-4">
        <p className={cn("text-sm font-medium", tone.muted)}>Agents</p>
        <h2 className={cn("mt-1 text-xl font-semibold tracking-tight", tone.text)}>{title}</h2>
        <p className={cn("mt-1 text-sm", tone.muted)}>{description}</p>
      </div>

      {outcomes.length === 0 ? (
        <div className={tone.empty}>{emptyState}</div>
      ) : (
        <div className="space-y-3">
          {outcomes.map((outcome) => {
            const StatusIcon = statusIcon(outcome.status);
            const linkedItemId =
              createdActionItems[outcome.taskId] ??
              outcome.linkedActionItemId ??
              outcome.linkedAssetFollowUpItemId ??
              outcome.linkedCrmFollowUpItemId ??
              null;
            const canCreateAction =
              canCreateActionItems &&
              !linkedItemId &&
              (!!outcome.campaignId || !!outcome.crmContactId || !!outcome.assetId) &&
              outcome.status !== "pending" &&
              outcome.status !== "running";
            const createLabel =
              outcome.crmContactId || outcome.assetId ? "Create follow-up" : "Create action";
            const createdLabel =
              outcome.crmContactId || outcome.assetId ? "Follow-up created" : "Action created";
            return (
              <div key={outcome.taskId} className={tone.item}>
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl",
                      isClient ? "bg-white/[0.08] text-white/80" : "bg-white text-[#6f6a63]",
                    )}
                  >
                    {outcome.status === "running" ? (
                      <StatusIcon className="h-4 w-4 animate-spin" />
                    ) : (
                      <StatusIcon className="h-4 w-4" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className={cn("flex flex-wrap items-center gap-2 text-xs", tone.muted)}>
                      <span className="inline-flex items-center gap-1">
                        <Bot className="h-3.5 w-3.5" />
                        {agentLabel(outcome.agentId)}
                      </span>
                      <span>&middot;</span>
                      <span>{timeAgo(outcome.createdAt)}</span>
                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 font-medium capitalize",
                          statusTone(outcome.status, variant),
                        )}
                      >
                        {outcome.status}
                      </span>
                    </div>

                    <p className={cn("mt-1 text-sm font-medium", tone.text)}>
                      {outcome.requestSummary}
                    </p>

                    {outcome.requestDetail ? (
                      <p className={cn("mt-1 text-sm", tone.muted)}>{outcome.requestDetail}</p>
                    ) : null}

                    <div
                      className={cn(
                        "mt-3 rounded-xl border px-3 py-3 text-sm leading-relaxed",
                        isClient
                          ? "border-white/[0.08] bg-white/[0.03] text-white/75"
                          : "border-[#ece8df] bg-white text-[#6f6a63]",
                      )}
                    >
                      {outcomeMessage(outcome)}
                    </div>

                    {campaignHrefPrefix && outcome.campaignId ? (
                      <div className="mt-3">
                        <Link
                          href={`${campaignHrefPrefix}/${outcome.campaignId}`}
                          className={cn(
                            "inline-flex items-center gap-1 text-sm font-medium",
                            isClient
                              ? "text-cyan-300 hover:text-cyan-200"
                              : "text-[#0f7b6c] hover:text-[#0b5e52]",
                          )}
                        >
                          {outcome.campaignName ? `Open ${outcome.campaignName}` : "Open campaign"}
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    ) : crmHrefPrefix && outcome.crmContactId ? (
                      <div className="mt-3">
                        <Link
                          href={`${crmHrefPrefix}/${outcome.crmContactId}`}
                          className={cn(
                            "inline-flex items-center gap-1 text-sm font-medium",
                            isClient
                              ? "text-cyan-300 hover:text-cyan-200"
                              : "text-[#0f7b6c] hover:text-[#0b5e52]",
                          )}
                        >
                          {outcome.crmContactName
                            ? `Open ${outcome.crmContactName}`
                            : "Open contact"}
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    ) : assetHrefPrefix && outcome.assetId ? (
                      <div className="mt-3">
                        <Link
                          href={`${assetHrefPrefix}/${outcome.assetId}`}
                          className={cn(
                            "inline-flex items-center gap-1 text-sm font-medium",
                            isClient
                              ? "text-cyan-300 hover:text-cyan-200"
                              : "text-[#0f7b6c] hover:text-[#0b5e52]",
                          )}
                        >
                          {outcome.assetName ? `Open ${outcome.assetName}` : "Open asset"}
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    ) : null}

                    {canCreateAction || linkedItemId || errorByTaskId[outcome.taskId] ? (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {linkedItemId ? (
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium",
                              isClient
                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                                : "border-emerald-200 bg-emerald-50 text-emerald-700",
                            )}
                          >
                            {createdLabel}
                          </span>
                        ) : null}

                        {canCreateAction ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "h-7 px-2 text-xs",
                              isClient
                                ? "text-cyan-300 hover:bg-white/[0.06] hover:text-cyan-200"
                                : "text-[#0f7b6c] hover:bg-[#eef7f4] hover:text-[#0b5e52]",
                            )}
                            disabled={creatingTaskId === outcome.taskId}
                            onClick={() => void createActionItem(outcome.taskId)}
                          >
                            {creatingTaskId === outcome.taskId ? "Creating..." : createLabel}
                          </Button>
                        ) : null}

                        {errorByTaskId[outcome.taskId] ? (
                          <span
                            className={cn(
                              "text-xs",
                              isClient ? "text-rose-200/90" : "text-rose-700",
                            )}
                          >
                            {errorByTaskId[outcome.taskId]}
                          </span>
                        ) : null}
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
