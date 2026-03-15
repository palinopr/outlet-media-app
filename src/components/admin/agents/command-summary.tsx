import Link from "next/link";
import { ArrowRight, Bot, CircleAlert, LoaderCircle, Signal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AgentJob } from "@/app/admin/agents/data";
import type { AgentCommandSummary, AgentCommandOutcomeBucket } from "@/features/agents/summary";
import type { AgentOutcomeView } from "@/features/agent-outcomes/summary";
import { fmtDate } from "@/lib/formatters";
import { agentName } from "./constants";
import { StatusBadge } from "./status-badge";

interface AgentCommandSummaryProps {
  attentionJobs: AgentJob[];
  summary: AgentCommandSummary;
}

function outcomeContext(outcome: AgentOutcomeView) {
  if (outcome.assetId) {
    return {
      href: `/admin/assets/${outcome.assetId}`,
      label: outcome.assetName ?? "Asset",
      type: "Asset",
    };
  }
  if (outcome.crmContactId) {
    return {
      href: null,
      label: outcome.crmContactName ?? "Contact",
      type: "Contact",
    };
  }
  if (outcome.eventId) {
    return {
      href: `/admin/events/${outcome.eventId}`,
      label: outcome.eventName ?? "Event",
      type: "Event",
    };
  }
  if (outcome.campaignId) {
    return {
      href: `/admin/campaigns/${outcome.campaignId}`,
      label: outcome.campaignName ?? "Campaign",
      type: "Campaign",
    };
  }

  return {
    href: null,
    label: "General agent output",
    type: "Other",
  };
}

function actionableOutcomeNote(outcome: AgentOutcomeView) {
  switch (outcome.status) {
    case "error":
      return "Failed and needs inspection or a retry.";
    case "running":
      return "Still running and waiting on the worker.";
    case "pending":
      return "Queued and waiting on the worker.";
    default:
      return "Completed, but no tracked next step exists yet.";
  }
}

function nonZeroBuckets(buckets: AgentCommandOutcomeBucket[]) {
  return buckets.filter((bucket) => bucket.value > 0);
}

function metricTone(tone: "critical" | "neutral" | "positive") {
  switch (tone) {
    case "critical":
      return {
        accent: "text-rose-700",
        border: "border-rose-200",
        surface: "bg-rose-50/80",
      };
    case "positive":
      return {
        accent: "text-emerald-700",
        border: "border-emerald-200",
        surface: "bg-emerald-50/80",
      };
    default:
      return {
        accent: "text-[#0f7b6c]",
        border: "border-[#ece8df]",
        surface: "bg-[#fcfbf8]",
      };
  }
}

function attentionIcon(status: AgentJob["status"]) {
  switch (status) {
    case "error":
      return CircleAlert;
    case "running":
      return LoaderCircle;
    case "pending":
      return Bot;
    default:
      return Signal;
  }
}

export function AgentCommandSummarySection({
  attentionJobs,
  summary,
}: AgentCommandSummaryProps) {
  const buckets = nonZeroBuckets(summary.outcomeBuckets);

  return (
    <section className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {summary.metrics.map((metric) => {
          const tone = metricTone(metric.tone);

          return (
            <Card
              key={metric.key}
              className={cn(
                "border shadow-[0_24px_60px_-48px_rgba(15,23,42,0.5)]",
                tone.border,
                tone.surface,
              )}
            >
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {metric.label}
                </p>
                <p className={cn("mt-2 text-3xl font-semibold tracking-tight", tone.accent)}>
                  {metric.value}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{metric.detail}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="border-border/60">
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <div>
            <p className="text-sm font-medium">Attention queue</p>
            <p className="text-xs text-muted-foreground">
              The most urgent non-chat agent runs that still need human review.
            </p>
          </div>
          <span className="text-xs text-muted-foreground">{attentionJobs.length} active</span>
        </div>
        {attentionJobs.length === 0 ? (
          <div className="px-5 py-6 text-sm text-muted-foreground">
            No pending, running, or failed agent runs need attention right now.
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {attentionJobs.map((job) => {
              const Icon = attentionIcon(job.status);
              return (
                <div key={job.id} className="flex items-start gap-3 px-5 py-4">
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-muted/40 text-muted-foreground">
                    <Icon className={cn("h-4 w-4", job.status === "running" ? "animate-spin" : "")} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium">{agentName(job.agent_id)}</p>
                      <StatusBadge status={job.status} />
                      <span className="text-xs text-muted-foreground">
                        {fmtDate(job.created_at)}
                      </span>
                    </div>
                    {job.prompt ? (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {job.prompt}
                      </p>
                    ) : null}
                    {job.error ? (
                      <p className="mt-2 line-clamp-3 text-xs text-rose-700">{job.error}</p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card className="border-border/60">
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <div>
            <p className="text-sm font-medium">Action queue</p>
            <p className="text-xs text-muted-foreground">
              Agent work that is still blocked on a human next step or worker completion.
            </p>
          </div>
          <span className="text-xs text-muted-foreground">
            {summary.actionableOutcomes.length} active
          </span>
        </div>

        {summary.actionableOutcomes.length === 0 ? (
          <div className="px-5 py-6 text-sm text-muted-foreground">
            No queued, failed, or untriaged agent outcomes need action right now.
          </div>
        ) : (
          <div className="space-y-4 px-5 py-4">
            {buckets.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {buckets.map((bucket) => (
                  <Badge key={bucket.key} variant="outline" className="gap-1 border-border/60">
                    <span>{bucket.label}</span>
                    <span className="text-muted-foreground">{bucket.value}</span>
                  </Badge>
                ))}
              </div>
            ) : null}

            <div className="space-y-3">
              {summary.actionableOutcomes.map((outcome) => {
                const context = outcomeContext(outcome);

                return (
                  <div key={outcome.taskId} className="rounded-2xl border border-border/60 bg-muted/10 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium">{outcome.requestSummary}</p>
                      <StatusBadge status={outcome.status} />
                      <span className="text-xs text-muted-foreground">{agentName(outcome.agentId)}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {actionableOutcomeNote(outcome)}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="border-border/60">
                        {context.type}
                      </Badge>
                      <span>{context.label}</span>
                    </div>
                    {context.href ? (
                      <div className="mt-3">
                        <Link
                          href={context.href}
                          className="inline-flex items-center gap-1 text-sm font-medium text-[#0f7b6c] hover:text-[#0b5e52]"
                        >
                          Open {context.type.toLowerCase()}
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}
