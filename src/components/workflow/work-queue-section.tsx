"use client";

import Link from "next/link";
import {
  BriefcaseBusiness,
  CalendarDays,
  Image as ImageIcon,
  Megaphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
  showClientSlug?: boolean;
  summary: WorkQueueSummary;
  title?: string;
  variant: "admin" | "client";
}

function tone(variant: "admin" | "client") {
  if (variant === "client") {
    return {
      body: "rounded-[28px] border border-white/[0.08] bg-white/[0.04] p-5",
      empty:
        "rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] px-4 py-6 text-sm text-white/50",
      item: "rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4",
      metric: "rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4",
      muted: "text-white/50",
      text: "text-white",
      link: "text-cyan-300 hover:text-cyan-200",
      pill: "rounded-full bg-white/[0.08] px-2 py-1 text-[11px] font-medium text-white/70",
    };
  }

  return {
    body: "rounded-[28px] border border-[#ece8df] bg-white/95 p-5 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.5)]",
    empty:
      "rounded-2xl border border-dashed border-[#e7e0d3] bg-[#faf8f5] px-4 py-6 text-sm text-[#9b9a97]",
    item: "rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4",
    metric: "rounded-2xl border border-[#ece8df] bg-[#fcfbf8] p-4",
    muted: "text-[#9b9a97]",
    text: "text-[#2f2f2f]",
    link: "text-[#0f7b6c] hover:text-[#0b5e52]",
    pill: "rounded-full bg-[#f1ece4] px-2 py-1 text-[11px] font-medium text-[#6f6a63]",
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
  showClientSlug = false,
  summary,
  title = "Work queue",
  variant,
}: WorkQueueSectionProps) {
  const styles = tone(variant);

  return (
    <section className={styles.body}>
      <div className="mb-4">
        <p className={cn("text-sm font-medium", styles.muted)}>Workflow</p>
        <h2 className={cn("mt-1 text-xl font-semibold tracking-tight", styles.text)}>{title}</h2>
        <p className={cn("mt-1 text-sm", styles.muted)}>{description}</p>
      </div>

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

      <div className="mt-4 space-y-3">
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
