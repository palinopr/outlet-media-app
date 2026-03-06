import Link from "next/link";
import { CalendarDays, CheckSquare, Clock3, MessageSquareMore, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { slugToLabel, timeAgo } from "@/lib/formatters";
import type {
  EventOperationsMetricKey,
  EventOperationsSummary,
} from "@/features/events/summary";

interface EventOperationsSectionProps {
  description?: string;
  emptyState?: string;
  hrefPrefix: string;
  showClientSlug?: boolean;
  summary: EventOperationsSummary;
  title?: string;
  variant: "admin" | "client";
}

function styles(variant: "admin" | "client") {
  if (variant === "client") {
    return {
      body: "rounded-[28px] border border-white/[0.08] bg-white/[0.04] p-5",
      item: "rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4",
      empty:
        "rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] px-4 py-6 text-sm text-white/50",
      muted: "text-white/50",
      pill: "rounded-full bg-white/[0.06] px-2 py-1 text-[11px] font-medium text-white/70",
      text: "text-white",
      link: "text-sm font-medium text-cyan-300 hover:text-cyan-200",
      metricCard: "glass-card p-4",
      metricLabel: "text-xs font-semibold uppercase tracking-wide text-white/55",
      metricValue: "mt-2 text-2xl font-bold tracking-tight text-white",
      metricDetail: "mt-1 text-xs text-white/45",
    };
  }

  return {
    body: "rounded-[28px] border border-[#ece8df] bg-white/95 p-5 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.5)]",
    item: "rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4",
    empty:
      "rounded-2xl border border-dashed border-[#e7e0d3] bg-[#faf8f5] px-4 py-6 text-sm text-[#9b9a97]",
    muted: "text-[#9b9a97]",
    pill: "rounded-full bg-[#f1ece4] px-2 py-1 text-[11px] font-medium text-[#6f6a63]",
    text: "text-[#2f2f2f]",
    link: "text-sm font-medium text-[#0f7b6c] hover:text-[#0b5e52]",
    metricCard: "rounded-2xl border border-[#ece8df] bg-[#fcfbf8] p-4",
    metricLabel: "text-xs font-semibold uppercase tracking-wide text-[#9b9a97]",
    metricValue: "mt-2 text-2xl font-bold tracking-tight text-[#2f2f2f]",
    metricDetail: "mt-1 text-xs text-[#9b9a97]",
  };
}

const metricIcons: Record<EventOperationsMetricKey, typeof Ticket> = {
  open_follow_ups: CheckSquare,
  urgent_follow_ups: Clock3,
  open_discussions: MessageSquareMore,
  recent_updates: CalendarDays,
};

export function EventOperationsSection({
  description = "The shows with the most open follow-ups, discussion, and recent workflow movement.",
  emptyState = "No events need operating attention right now.",
  hrefPrefix,
  showClientSlug = false,
  summary,
  title = "Event operations",
  variant,
}: EventOperationsSectionProps) {
  const tone = styles(variant);

  return (
    <section className={tone.body}>
      <div className="mb-4">
        <p className={cn("text-sm font-medium", tone.muted)}>Operations</p>
        <h2 className={cn("mt-1 text-xl font-semibold tracking-tight", tone.text)}>{title}</h2>
        <p className={cn("mt-1 text-sm", tone.muted)}>{description}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        {summary.metrics.map((metric) => {
          const Icon = metricIcons[metric.key];
          return (
            <div key={metric.key} className={tone.metricCard}>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span className={tone.metricLabel}>{metric.label}</span>
              </div>
              <p className={tone.metricValue}>{metric.value}</p>
              <p className={tone.metricDetail}>{metric.detail}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 space-y-3">
        {summary.attentionEvents.length === 0 ? (
          <div className={tone.empty}>{emptyState}</div>
        ) : (
          summary.attentionEvents.map((event) => (
            <div key={event.eventId} className={tone.item}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className={tone.pill}>{event.status ?? "unknown"}</span>
                    {event.date ? <span className={tone.pill}>{event.date}</span> : null}
                    {showClientSlug && event.clientSlug ? (
                      <span className={tone.pill}>{slugToLabel(event.clientSlug)}</span>
                    ) : null}
                  </div>
                  <p className={cn("mt-2 text-sm font-medium", tone.text)}>{event.name}</p>
                  <div className={cn("mt-1 flex flex-wrap items-center gap-2 text-xs", tone.muted)}>
                    {event.venue ? <span>{event.venue}</span> : null}
                    {event.lastActivityAt ? (
                      <>
                        {event.venue ? <span>&middot;</span> : null}
                        <span>Last activity {timeAgo(event.lastActivityAt)}</span>
                      </>
                    ) : null}
                  </div>
                </div>
                <Link href={`${hrefPrefix}/${event.eventId}`} className={tone.link}>
                  Open
                </Link>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {event.openFollowUps > 0 ? (
                  <span className={tone.pill}>{event.openFollowUps} follow-ups</span>
                ) : null}
                {event.urgentFollowUps > 0 ? (
                  <span className={tone.pill}>{event.urgentFollowUps} urgent</span>
                ) : null}
                {event.openDiscussions > 0 ? (
                  <span className={tone.pill}>{event.openDiscussions} discussions</span>
                ) : null}
                {event.recentUpdates > 0 ? (
                  <span className={tone.pill}>{event.recentUpdates} recent updates</span>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
