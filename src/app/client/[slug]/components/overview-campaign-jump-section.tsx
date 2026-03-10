"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BellRing, ListChecks, Megaphone, MessageSquare, RefreshCw, Search } from "lucide-react";
import type { DateRange } from "@/lib/constants";
import { fmtDate, timeAgo } from "@/lib/formatters";
import type { DashboardAttentionCampaign, DashboardOpsMetric } from "@/features/dashboard/summary";
import type { CampaignCard as CampaignCardData } from "../types";
import { CampaignStatusBadge } from "./campaign-status-badge";

interface OverviewCampaignJumpSectionProps {
  campaigns: CampaignCardData[];
  attentionCampaigns: DashboardAttentionCampaign[];
  metrics: DashboardOpsMetric[];
  range: DateRange;
  slug: string;
}

function compareCampaigns(
  left: CampaignCardData,
  right: CampaignCardData,
  attentionById: Map<string, DashboardAttentionCampaign>,
) {
  const leftAttention = attentionById.get(left.campaignId)?.attentionScore ?? 0;
  const rightAttention = attentionById.get(right.campaignId)?.attentionScore ?? 0;

  if (rightAttention !== leftAttention) {
    return rightAttention - leftAttention;
  }

  if (left.status === "ACTIVE" && right.status !== "ACTIVE") return -1;
  if (left.status !== "ACTIVE" && right.status === "ACTIVE") return 1;

  const leftStartTime = left.startTime ? new Date(left.startTime).getTime() : 0;
  const rightStartTime = right.startTime ? new Date(right.startTime).getTime() : 0;
  return rightStartTime - leftStartTime;
}

function summaryTone(key: DashboardOpsMetric["key"]) {
  switch (key) {
    case "pending_approvals":
      return {
        accent: "text-amber-300",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        icon: BellRing,
      };
    case "action_items":
      return {
        accent: "text-cyan-300",
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/20",
        icon: ListChecks,
      };
    case "open_discussions":
      return {
        accent: "text-violet-300",
        bg: "bg-violet-500/10",
        border: "border-violet-500/20",
        icon: MessageSquare,
      };
    case "recent_updates":
      return {
        accent: "text-emerald-300",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        icon: RefreshCw,
      };
  }
}

function describeAttention(campaign: DashboardAttentionCampaign | undefined) {
  if (!campaign) return "Open this campaign to review the latest performance and activity.";

  const parts = [
    campaign.pendingApprovals > 0
      ? `${campaign.pendingApprovals} approval${campaign.pendingApprovals === 1 ? "" : "s"}`
      : null,
    campaign.openActionItems > 0
      ? `${campaign.openActionItems} next step${campaign.openActionItems === 1 ? "" : "s"}`
      : null,
    campaign.openDiscussionThreads > 0
      ? `${campaign.openDiscussionThreads} thread${campaign.openDiscussionThreads === 1 ? "" : "s"}`
      : null,
    campaign.recentUpdates > 0
      ? `${campaign.recentUpdates} recent update${campaign.recentUpdates === 1 ? "" : "s"}`
      : null,
  ].filter(Boolean);

  return parts.length > 0
    ? parts.join(" | ")
    : "Open this campaign to review the latest performance and activity.";
}

export function OverviewCampaignJumpSection({
  campaigns,
  attentionCampaigns,
  metrics,
  range,
  slug,
}: OverviewCampaignJumpSectionProps) {
  const attentionById = new Map(
    attentionCampaigns.map((campaign) => [campaign.campaignId, campaign]),
  );
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();
  const sortedCampaigns = [...campaigns].sort((left, right) =>
    compareCampaigns(left, right, attentionById),
  );
  const defaultCampaigns =
    attentionCampaigns.length > 0
      ? attentionCampaigns
          .map((campaign) =>
            campaigns.find((candidate) => candidate.campaignId === campaign.campaignId),
          )
          .filter((campaign): campaign is CampaignCardData => !!campaign)
      : sortedCampaigns.filter((campaign) => campaign.status === "ACTIVE").slice(0, 6);

  const visibleCampaigns = (
    query
      ? sortedCampaigns.filter((campaign) =>
          campaign.name.toLowerCase().includes(query),
        )
      : defaultCampaigns.length > 0
        ? defaultCampaigns
        : sortedCampaigns
  ).slice(0, 6);

  const headline =
    query.length > 0
      ? `Matching campaigns (${visibleCampaigns.length})`
      : attentionCampaigns.length > 0
        ? "Campaigns to open first"
        : "Recent active campaigns";

  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
      <div className="glass-card p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <Megaphone className="h-3.5 w-3.5 text-white/50" />
              <span className="section-label">Jump Into A Campaign</span>
            </div>
            <p className="mt-2 text-sm text-white/55 max-w-2xl">
              Search by name or open the campaigns with the most active work, approvals, and discussion.
            </p>
          </div>
          <Link
            href={`/client/${slug}/campaigns`}
            className="text-xs font-medium text-cyan-300 hover:text-cyan-200 transition-colors"
          >
            View all campaigns
          </Link>
        </div>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
          <input
            aria-label="Search campaigns"
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 pl-9 pr-3 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search a campaign..."
            type="text"
            value={search}
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/35">
            {headline}
          </p>
          {!query && attentionCampaigns.length > 0 && (
            <p className="text-xs text-white/40">
              Ranked by approvals, next steps, discussion, and recent updates
            </p>
          )}
        </div>

        {visibleCampaigns.length > 0 ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {visibleCampaigns.map((campaign) => {
              const attention = attentionById.get(campaign.campaignId);
              return (
                <Link
                  key={campaign.campaignId}
                  href={`/client/${slug}/campaign/${campaign.campaignId}?range=${range}`}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 hover:bg-white/[0.05] hover:ring-1 hover:ring-white/10 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white leading-tight">
                        {campaign.name}
                      </p>
                      <p className="mt-1 text-xs text-white/45">
                        {attention?.lastActivityAt
                          ? `Last activity ${timeAgo(attention.lastActivityAt)}`
                          : campaign.startTime
                            ? `Started ${fmtDate(campaign.startTime)}`
                            : "Campaign overview"}
                      </p>
                    </div>
                    <CampaignStatusBadge status={campaign.status} />
                  </div>

                  <p className="mt-3 text-xs text-white/60">
                    {describeAttention(attention)}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="text-white/35">
                      {campaign.startTime ? fmtDate(campaign.startTime) : "Open campaign"}
                    </span>
                    <span className="inline-flex items-center gap-1 font-medium text-cyan-300">
                      Open
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-3 rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] p-6 text-center text-sm text-white/55">
            No campaigns match &quot;{search}&quot;.
          </div>
        )}
      </div>

      <div className="glass-card p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <ListChecks className="h-3.5 w-3.5 text-white/50" />
          <span className="section-label">What Needs Review</span>
        </div>
        <p className="mt-2 text-sm text-white/55">
          A quick breakdown of the work that is most likely to send you into a campaign page.
        </p>

        <div className="mt-4 space-y-3">
          {metrics.map((metric) => {
            const tone = summaryTone(metric.key);
            const Icon = tone.icon;
            return (
              <div
                key={metric.key}
                className={`rounded-2xl border ${tone.border} ${tone.bg} p-4`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                      {metric.label}
                    </p>
                    <p className="mt-1 text-xs text-white/55">
                      {metric.detail}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Icon className={`h-3.5 w-3.5 ${tone.accent}`} />
                    <span className={`text-xl font-bold ${tone.accent}`}>
                      {metric.value}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
