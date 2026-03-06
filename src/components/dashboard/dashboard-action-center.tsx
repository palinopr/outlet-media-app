import Link from "next/link";
import { ArrowRight, BadgeCheck, CheckSquare, MessageSquareMore } from "lucide-react";
import { timeAgo } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { DashboardActionCenter } from "@/features/dashboard/server";

interface DashboardActionCenterProps {
  actionCenter: DashboardActionCenter;
  assetHrefPrefix?: string;
  assetLibraryHref?: string;
  campaignHrefPrefix: string;
  crmHrefPrefix?: string;
  description?: string;
  variant: "admin" | "client";
}

function truncate(value: string, max = 140) {
  return value.length <= max ? value : `${value.slice(0, max - 1)}…`;
}

function panelTone(variant: "admin" | "client") {
  if (variant === "client") {
    return {
      body: "rounded-[28px] border border-white/[0.08] bg-white/[0.04] p-5",
      item: "rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4",
      muted: "text-white/50",
      title: "text-white",
    };
  }

  return {
    body: "rounded-[28px] border border-border/60 bg-card p-5 shadow-sm",
    item: "rounded-2xl border border-border/60 bg-muted/20 p-4",
    muted: "text-muted-foreground",
    title: "text-foreground",
  };
}

function emptyClass(variant: "admin" | "client") {
  return variant === "client"
    ? "rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] px-4 py-6 text-sm text-white/50"
    : "rounded-2xl border border-dashed border-border/60 bg-muted/10 px-4 py-6 text-sm text-muted-foreground";
}

export function DashboardActionCenterSection({
  actionCenter,
  assetHrefPrefix,
  assetLibraryHref,
  campaignHrefPrefix,
  crmHrefPrefix,
  description = "The next approvals and conversations that need human attention.",
  variant,
}: DashboardActionCenterProps) {
  const tone = panelTone(variant);
  const isClient = variant === "client";

  return (
    <section className="grid gap-4 xl:grid-cols-3">
      <div className={tone.body}>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className={cn("text-sm font-medium", tone.muted)}>Approvals</p>
            <h2 className={cn("mt-1 text-xl font-semibold tracking-tight", tone.title)}>
              Pending decisions
            </h2>
            <p className={cn("mt-1 text-sm", tone.muted)}>{description}</p>
          </div>
        </div>

        <div className="space-y-3">
          {actionCenter.approvals.length === 0 ? (
            <div className={emptyClass(variant)}>No approvals are waiting right now.</div>
          ) : (
            actionCenter.approvals.map((approval) => (
              <div key={approval.id} className={tone.item}>
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl",
                      isClient ? "bg-white/[0.08] text-white/80" : "bg-white text-[#6f6a63]",
                    )}
                  >
                    <BadgeCheck className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={cn("flex flex-wrap items-center gap-2 text-xs", tone.muted)}>
                      <span>{approval.campaignName ?? "Campaign approval"}</span>
                      <span>&middot;</span>
                      <span>{timeAgo(approval.createdAt)}</span>
                      {!isClient ? (
                        <>
                          <span>&middot;</span>
                          <span>{approval.clientSlug}</span>
                        </>
                      ) : null}
                    </div>
                    <p className={cn("mt-1 text-sm font-medium", tone.title)}>{approval.title}</p>
                    {approval.summary ? (
                      <p className={cn("mt-1 text-sm", tone.muted)}>
                        {truncate(approval.summary, 160)}
                      </p>
                    ) : null}
                    {approval.campaignId || approval.assetId ? (
                      <div className="mt-3">
                        <Link
                          href={
                            approval.campaignId
                              ? `${campaignHrefPrefix}/${approval.campaignId}`
                              : approval.assetId && assetHrefPrefix
                                ? `${assetHrefPrefix}/${approval.assetId}`
                                : assetLibraryHref ?? campaignHrefPrefix
                          }
                          className={cn(
                            "inline-flex items-center gap-1 text-sm font-medium",
                            isClient
                              ? "text-cyan-300 hover:text-cyan-200"
                              : "text-[#0f7b6c] hover:text-[#0b5e52]",
                          )}
                        >
                          {approval.campaignId
                            ? "Review campaign"
                            : assetHrefPrefix
                              ? "Review asset"
                              : "Open asset library"}{" "}
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className={tone.body}>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className={cn("text-sm font-medium", tone.muted)}>CRM</p>
            <h2 className={cn("mt-1 text-xl font-semibold tracking-tight", tone.title)}>
              Next relationship steps
            </h2>
            <p className={cn("mt-1 text-sm", tone.muted)}>
              CRM follow-up work that needs attention soon.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {actionCenter.crmFollowUps.length === 0 ? (
            <div className={emptyClass(variant)}>No CRM next steps are waiting right now.</div>
          ) : (
            actionCenter.crmFollowUps.map((item) => (
              <div key={item.id} className={tone.item}>
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl",
                      isClient ? "bg-white/[0.08] text-white/80" : "bg-white text-[#6f6a63]",
                    )}
                  >
                    <CheckSquare className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={cn("flex flex-wrap items-center gap-2 text-xs", tone.muted)}>
                      <span>{item.contactName ?? "CRM contact"}</span>
                      <span>&middot;</span>
                      <span>{timeAgo(item.createdAt)}</span>
                      {!isClient ? (
                        <>
                          <span>&middot;</span>
                          <span>{item.clientSlug}</span>
                        </>
                      ) : null}
                    </div>
                    <p className={cn("mt-1 text-sm font-medium", tone.title)}>{item.title}</p>
                    <p className={cn("mt-1 text-sm", tone.muted)}>
                      {item.dueDate ? `Due ${item.dueDate}` : "No due date set"}
                    </p>
                    {crmHrefPrefix ? (
                      <div className="mt-3">
                        <Link
                          href={`${crmHrefPrefix}/${item.contactId}`}
                          className={cn(
                            "inline-flex items-center gap-1 text-sm font-medium",
                            isClient
                              ? "text-cyan-300 hover:text-cyan-200"
                              : "text-[#0f7b6c] hover:text-[#0b5e52]",
                          )}
                        >
                          Open contact <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className={tone.body}>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className={cn("text-sm font-medium", tone.muted)}>Discussion</p>
            <h2 className={cn("mt-1 text-xl font-semibold tracking-tight", tone.title)}>
              Recent conversation
            </h2>
            <p className={cn("mt-1 text-sm", tone.muted)}>
              Open campaign, asset, and CRM threads that still need a response or follow-up.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {actionCenter.discussions.length === 0 ? (
            <div className={emptyClass(variant)}>No unresolved campaign, asset, or CRM discussions right now.</div>
          ) : (
            actionCenter.discussions.map((discussion) => {
              const href =
                discussion.kind === "campaign"
                  ? `${campaignHrefPrefix}/${discussion.targetId}`
                  : discussion.kind === "asset"
                    ? assetHrefPrefix
                      ? `${assetHrefPrefix}/${discussion.targetId}`
                      : assetLibraryHref ?? null
                  : crmHrefPrefix
                    ? `${crmHrefPrefix}/${discussion.targetId}`
                    : null;

              return (
                <div key={discussion.id} className={tone.item}>
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl",
                        isClient ? "bg-white/[0.08] text-white/80" : "bg-white text-[#6f6a63]",
                      )}
                    >
                      <MessageSquareMore className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={cn("flex flex-wrap items-center gap-2 text-xs", tone.muted)}>
                        <span>{discussion.authorName ?? "Team member"}</span>
                        <span>&middot;</span>
                        <span>{timeAgo(discussion.createdAt)}</span>
                        {!isClient ? (
                          <>
                            <span>&middot;</span>
                            <span>{discussion.clientSlug}</span>
                          </>
                        ) : null}
                      </div>
                      <p className={cn("mt-1 text-sm font-medium", tone.title)}>
                        {discussion.targetName ??
                          (discussion.kind === "campaign"
                            ? "Campaign thread"
                            : discussion.kind === "asset"
                              ? "Asset discussion"
                              : "CRM relationship")}
                      </p>
                      <p className={cn("mt-1 text-sm", tone.muted)}>
                        {truncate(discussion.content, 160)}
                      </p>
                      {href ? (
                        <div className="mt-3">
                          <Link
                            href={href}
                            className={cn(
                              "inline-flex items-center gap-1 text-sm font-medium",
                              isClient
                                ? "text-cyan-300 hover:text-cyan-200"
                                : "text-[#0f7b6c] hover:text-[#0b5e52]",
                            )}
                          >
                            {discussion.kind === "campaign"
                              ? "Open campaign"
                              : discussion.kind === "asset"
                                ? assetHrefPrefix
                                  ? "Open asset"
                                  : "Open asset library"
                                : "Open contact"}{" "}
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
