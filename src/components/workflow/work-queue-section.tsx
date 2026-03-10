"use client";

import Link from "next/link";
import {
  BriefcaseBusiness,
  CalendarDays,
  Image as ImageIcon,
  Megaphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { tone } from "@/lib/tone-styles";
import { fmtDate, slugToLabel } from "@/lib/formatters";
import {
  workQueueKindLabel,
  workQueuePriorityLabel,
  workQueueStatusLabel,
  type WorkQueueSummary,
  type WorkQueueItem,
} from "@/features/work-queue/summary";

interface WorkQueueSectionProps {
  description?: string;
  emptyState?: string;
  showMetrics?: boolean;
  showClientSlug?: boolean;
  summary: WorkQueueSummary;
  title?: string;
  variant: "admin" | "client";
}

function sectionTone(variant: "admin" | "client") {
  const isClient = variant === "client";
  return {
    ...tone(variant),
    item: isClient
      ? "rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4"
      : "rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4",
    metric: isClient
      ? "rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4"
      : "rounded-2xl border border-[#ece8df] bg-[#fcfbf8] p-4",
    pill: isClient
      ? "rounded-full bg-white/[0.08] px-2 py-1 text-[11px] font-medium text-white/70"
      : "rounded-full bg-[#f1ece4] px-2 py-1 text-[11px] font-medium text-[#6f6a63]",
  };
}

function workItemIcon(kind: WorkQueueItem["kind"]) {
  switch (kind) {
    case "campaign_action":
      return Megaphone;
    case "crm_follow_up":
      return BriefcaseBusiness;
    case "event_follow_up":
      return CalendarDays;
    case "asset_follow_up":
      return ImageIcon;
  }
}

export function WorkQueueSection({
  description = "Cross-app next steps across campaigns, CRM, events, and creative workflow.",
  emptyState = "No cross-app work items need attention right now.",
  showMetrics = true,
  showClientSlug = false,
  summary,
  title = "Work queue",
  variant,
}: WorkQueueSectionProps) {
  const styles = sectionTone(variant);

  return (
    <section className={styles.body}>
      <div className="mb-4">
        <p className={cn("text-sm font-medium", styles.muted)}>Workflow</p>
        <h2 className={cn("mt-1 text-xl font-semibold tracking-tight", styles.text)}>{title}</h2>
        <p className={cn("mt-1 text-sm", styles.muted)}>{description}</p>
      </div>

      {showMetrics ? (
        <div className="grid gap-3 md:grid-cols-4">
          {summary.metrics.map((metric) => (
            <div key={metric.key} className={styles.metric}>
              <p className={cn("text-xs font-semibold uppercase tracking-wide", styles.muted)}>
                {metric.label}
              </p>
              <p className={cn("mt-2 text-2xl font-bold tracking-tight", styles.text)}>
                {metric.value}
              </p>
              <p className={cn("mt-1 text-xs", styles.muted)}>{metric.detail}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className={cn("space-y-3", showMetrics ? "mt-4" : "mt-1")}>
        {summary.items.length === 0 ? (
          <div className={styles.empty}>{emptyState}</div>
        ) : (
          summary.items.map((item) => {
            const Icon = workItemIcon(item.kind);

            return (
              <div key={`${item.kind}-${item.id}`} className={styles.item}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white text-[#6f6a63] shadow-[0_10px_30px_-24px_rgba(15,23,42,0.8)]">
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={styles.pill}>{workQueueKindLabel(item.kind)}</span>
                      <span className={styles.pill}>{workQueueStatusLabel(item.status)}</span>
                      <span className={styles.pill}>{workQueuePriorityLabel(item.priority)}</span>
                      {showClientSlug && item.clientSlug ? (
                        <span className={styles.pill}>{slugToLabel(item.clientSlug)}</span>
                      ) : null}
                    </div>

                    <div className="mt-2 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className={cn("text-sm font-medium", styles.text)}>{item.title}</p>
                        <p className={cn("mt-1 text-xs", styles.muted)}>
                          {item.contextLabel}
                          {item.assigneeName ? ` • ${item.assigneeName}` : ""}
                          {item.dueDate ? ` • Due ${fmtDate(item.dueDate)}` : ""}
                        </p>
                        {item.description ? (
                          <p className={cn("mt-2 text-sm", styles.muted)}>{item.description}</p>
                        ) : null}
                      </div>
                      <Link href={item.href} className={cn("text-sm font-medium", styles.link)}>
                        Open
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
