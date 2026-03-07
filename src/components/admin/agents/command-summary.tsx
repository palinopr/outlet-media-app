import { Bot, CircleAlert, LoaderCircle, Signal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AgentJob } from "@/app/admin/agents/data";
import type { AgentCommandSummary } from "@/features/agents/summary";
import { fmtDate } from "@/lib/formatters";
import { agentName } from "./constants";
import { StatusBadge } from "./status-badge";

interface AgentCommandSummaryProps {
  attentionJobs: AgentJob[];
  summary: AgentCommandSummary;
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
    </section>
  );
}
