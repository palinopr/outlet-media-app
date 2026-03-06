import Link from "next/link";
import {
  CalendarDays,
  Image as ImageIcon,
  Megaphone,
  MessageSquareMore,
  Users,
} from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { ConversationFollowUpButton } from "@/components/conversations/conversation-follow-up-button";
import type {
  ConversationMetric,
  ConversationsSummary,
  ConversationThread,
  ConversationThreadKind,
} from "@/features/conversations/summary";
import { timeAgo } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface ConversationsCenterProps {
  assetHrefPrefix?: string;
  canCreateFollowUps?: boolean;
  campaignHrefPrefix: string;
  crmHrefPrefix?: string;
  description: string;
  emptyState?: string;
  eventHrefPrefix?: string;
  showClientSlug?: boolean;
  summary: ConversationsSummary;
  threads: ConversationThread[];
  title: string;
  variant: "admin" | "client";
}

const metricIcons: Record<ConversationMetric["key"], typeof MessageSquareMore> = {
  asset_threads: ImageIcon,
  campaign_threads: Megaphone,
  crm_threads: Users,
  event_threads: CalendarDays,
  open_threads: MessageSquareMore,
};

function threadHref(
  thread: ConversationThread,
  options: Pick<
    ConversationsCenterProps,
    "assetHrefPrefix" | "campaignHrefPrefix" | "crmHrefPrefix" | "eventHrefPrefix"
  >,
) {
  switch (thread.kind) {
    case "asset":
      return options.assetHrefPrefix ? `${options.assetHrefPrefix}/${thread.targetId}` : null;
    case "campaign":
      return `${options.campaignHrefPrefix}/${thread.targetId}`;
    case "crm":
      return options.crmHrefPrefix ? `${options.crmHrefPrefix}/${thread.targetId}` : null;
    case "event":
      return options.eventHrefPrefix ? `${options.eventHrefPrefix}/${thread.targetId}` : null;
    default:
      return null;
  }
}

function threadLabel(kind: ConversationThreadKind, hasAssetRoute: boolean) {
  switch (kind) {
    case "asset":
      return hasAssetRoute ? "Open asset" : "Open asset library";
    case "campaign":
      return "Open campaign";
    case "crm":
      return "Open contact";
    case "event":
      return "Open event";
  }
}

function threadTargetName(thread: ConversationThread) {
  if (thread.targetName) return thread.targetName;

  switch (thread.kind) {
    case "asset":
      return "Asset discussion";
    case "campaign":
      return "Campaign thread";
    case "crm":
      return "CRM relationship";
    case "event":
      return "Event discussion";
  }
}

function truncate(value: string, max = 180) {
  return value.length <= max ? value : `${value.slice(0, max - 1)}…`;
}

function tone(variant: "admin" | "client") {
  if (variant === "client") {
    return {
      body: "glass-card p-5",
      item: "rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 transition-colors hover:border-white/[0.14] hover:bg-white/[0.05]",
      meta: "text-white/45",
      muted: "text-white/55",
      title: "text-white",
      link: "text-cyan-300 hover:text-cyan-200",
      empty:
        "rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] px-4 py-6 text-sm text-white/50",
    };
  }

  return {
    body: "rounded-[28px] border border-[#ece8df] bg-white/95 p-5 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.5)]",
    item: "rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4 transition-colors hover:bg-white",
    meta: "text-[#9b9a97]",
    muted: "text-[#787774]",
    title: "text-[#2f2f2f]",
    link: "text-[#0f7b6c] hover:text-[#0b5e52]",
    empty:
      "rounded-2xl border border-dashed border-[#e7e0d3] bg-[#faf8f5] px-4 py-6 text-sm text-[#9b9a97]",
  };
}

export function ConversationsCenter({
  assetHrefPrefix,
  canCreateFollowUps = false,
  campaignHrefPrefix,
  crmHrefPrefix,
  description,
  emptyState = "No open conversation threads right now.",
  eventHrefPrefix,
  showClientSlug = false,
  summary,
  threads,
  title,
  variant,
}: ConversationsCenterProps) {
  const styles = tone(variant);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        {summary.metrics.map((metric) => {
          const Icon = metricIcons[metric.key];
          return (
            <StatCard
              key={metric.key}
              icon={Icon}
              iconColor={variant === "client" ? "bg-white/[0.08] text-white/80" : "text-[#0f7b6c]"}
              label={metric.label}
              sub={metric.detail}
              value={String(metric.value)}
              variant={variant === "client" ? "glass" : "default"}
            />
          );
        })}
      </div>

      <section className={styles.body}>
        <div className="mb-4">
          <p className={cn("text-sm font-medium", styles.muted)}>Conversations</p>
          <h2 className={cn("mt-1 text-xl font-semibold tracking-tight", styles.title)}>{title}</h2>
          <p className={cn("mt-1 text-sm", styles.meta)}>{description}</p>
        </div>

        {threads.length === 0 ? (
          <div className={styles.empty}>{emptyState}</div>
        ) : (
          <div className="space-y-3">
            {threads.map((thread) => {
              const href = threadHref(thread, {
                assetHrefPrefix,
                campaignHrefPrefix,
                crmHrefPrefix,
                eventHrefPrefix,
              });

              return (
                <div key={thread.id} className={styles.item}>
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl",
                        variant === "client"
                          ? "bg-white/[0.08] text-white/80"
                          : "bg-white text-[#6f6a63] shadow-[0_10px_30px_-24px_rgba(15,23,42,0.8)]",
                      )}
                    >
                      <MessageSquareMore className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className={cn("flex flex-wrap items-center gap-2 text-xs", styles.meta)}>
                        <span>{thread.authorName ?? "Team member"}</span>
                        <span>&middot;</span>
                        <span>{timeAgo(thread.createdAt)}</span>
                        {showClientSlug && thread.clientSlug ? (
                          <>
                            <span>&middot;</span>
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 font-medium",
                                variant === "client"
                                  ? "bg-white/[0.08] text-white/65"
                                  : "bg-[#f1ece4] text-[#6f6a63]",
                              )}
                            >
                              {thread.clientSlug}
                            </span>
                          </>
                        ) : null}
                      </div>

                      <p className={cn("mt-1 text-sm font-medium", styles.title)}>
                        {threadTargetName(thread)}
                      </p>
                      <p className={cn("mt-1 text-sm", styles.muted)}>
                        {truncate(thread.content)}
                      </p>

                      {href || canCreateFollowUps ? (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <Link
                            href={href ?? "#"}
                            className={cn(
                              "inline-flex items-center gap-1 text-sm font-medium",
                              styles.link,
                              !href && "pointer-events-none opacity-50",
                            )}
                          >
                            {threadLabel(thread.kind, Boolean(assetHrefPrefix))}
                          </Link>
                          {canCreateFollowUps ? (
                            thread.linkedFollowUpItemId ? (
                              <span
                                className={cn(
                                  "rounded-full px-2 py-1 text-[11px] font-medium",
                                  variant === "client"
                                    ? "bg-white/[0.08] text-white/65"
                                    : "bg-[#f1ece4] text-[#6f6a63]",
                                )}
                              >
                                Follow-up created
                              </span>
                            ) : (
                              <ConversationFollowUpButton commentId={thread.id} kind={thread.kind} />
                            )
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
    </div>
  );
}
