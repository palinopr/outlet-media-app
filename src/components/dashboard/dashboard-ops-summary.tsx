import Link from "next/link";
import {
  Activity,
  BadgeCheck,
  ListTodo,
  MessageSquareMore,
  Siren,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  DashboardAttentionCampaign,
  DashboardMetricKey,
  DashboardOpsSummary,
} from "@/features/dashboard/summary";

interface DashboardOpsSummaryProps {
  campaignHrefPrefix: string;
  description: string;
  emptyState: string;
  summary: DashboardOpsSummary;
  title: string;
  variant: "admin" | "client";
}

const METRIC_ICONS: Record<DashboardMetricKey, typeof ListTodo> = {
  action_items: Siren,
  open_discussions: MessageSquareMore,
  pending_approvals: BadgeCheck,
  recent_updates: Activity,
};

function MetricIcon({
  className,
  iconKey,
}: {
  className?: string;
  iconKey: DashboardMetricKey;
}) {
  const IconComponent = METRIC_ICONS[iconKey];
  return <IconComponent className={className} />;
}

function statusBadgeClass(status: string, variant: "admin" | "client") {
  const normalized = status.toUpperCase();
  if (normalized === "ACTIVE") {
    return variant === "client"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
      : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
  }

  if (normalized === "PAUSED") {
    return variant === "client"
      ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
      : "border-amber-500/20 bg-amber-500/10 text-amber-400";
  }

  return variant === "client"
    ? "border-white/15 bg-white/5 text-white/70"
    : "border-border/60 bg-muted/40 text-muted-foreground";
}

function pillClass(variant: "admin" | "client") {
  return variant === "client"
    ? "rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-white/75"
    : "rounded-full border border-border/60 bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground";
}

function formatLastActivity(timestamp: string | null) {
  if (!timestamp) return "No recent workflow activity";
  return `Last activity ${new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })}`;
}

function attentionPills(campaign: DashboardAttentionCampaign) {
  const pills: string[] = [];

  if (campaign.pendingApprovals > 0) {
    pills.push(`${campaign.pendingApprovals} approval${campaign.pendingApprovals === 1 ? "" : "s"}`);
  }
  if (campaign.urgentActionItems > 0) {
    pills.push(`${campaign.urgentActionItems} urgent`);
  }
  if (campaign.openActionItems > 0) {
    pills.push(`${campaign.openActionItems} next step${campaign.openActionItems === 1 ? "" : "s"}`);
  }
  if (campaign.openDiscussionThreads > 0) {
    pills.push(`${campaign.openDiscussionThreads} thread${campaign.openDiscussionThreads === 1 ? "" : "s"}`);
  }
  if (campaign.recentUpdates > 0) {
    pills.push(`${campaign.recentUpdates} update${campaign.recentUpdates === 1 ? "" : "s"}`);
  }

  return pills;
}

function MetricCard({
  detail,
  keyName,
  label,
  value,
  variant,
}: {
  detail: string;
  keyName: DashboardMetricKey;
  label: string;
  value: number;
  variant: "admin" | "client";
}) {
  if (variant === "client") {
    return (
      <div className="glass-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-white/80">
            <MetricIcon className="h-4 w-4" iconKey={keyName} />
          </div>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
            {label}
          </span>
        </div>
        <p className="text-2xl font-extrabold tracking-tight text-white">{value}</p>
        <p className="mt-1 text-xs text-white/50">{detail}</p>
      </div>
    );
  }

  return (
    <Card className="border-border/60">
      <CardContent className="flex items-start justify-between gap-3 p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-2 text-muted-foreground">
          <MetricIcon className="h-4 w-4" iconKey={keyName} />
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardOpsSummarySection({
  campaignHrefPrefix,
  description,
  emptyState,
  summary,
  title,
  variant,
}: DashboardOpsSummaryProps) {
  const isClient = variant === "client";

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className={cn("text-sm font-semibold", isClient ? "text-white" : "text-foreground")}>
            {title}
          </h2>
          <p className={cn("mt-1 text-sm", isClient ? "text-white/55" : "text-muted-foreground")}>
            {description}
          </p>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium",
            isClient
              ? "border-white/10 bg-white/[0.04] text-white/70"
              : "border-border/60 bg-muted/40 text-muted-foreground",
          )}
        >
          {summary.campaignsNeedingAttention} campaign{summary.campaignsNeedingAttention === 1 ? "" : "s"} flagged
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summary.metrics.map((metric) => (
          <MetricCard
            key={metric.key}
            detail={metric.detail}
            keyName={metric.key}
            label={metric.label}
            value={metric.value}
            variant={variant}
          />
        ))}
      </div>

      {isClient ? (
        <div className="glass-card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-white">Campaigns needing attention</h3>
              <p className="mt-1 text-xs text-white/50">
                The shared workflows with the most pending approvals, next steps, and updates.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {summary.attentionCampaigns.length === 0 ? (
              <div className="rounded-xl border border-white/8 bg-white/[0.02] px-4 py-5 text-sm text-white/55">
                {emptyState}
              </div>
            ) : (
              summary.attentionCampaigns.map((campaign) => (
                <div
                  key={campaign.campaignId}
                  className="rounded-xl border border-white/8 bg-white/[0.02] px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-white">{campaign.name}</p>
                        <span
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                            statusBadgeClass(campaign.status, variant),
                          )}
                        >
                          {campaign.status}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-white/45">{formatLastActivity(campaign.lastActivityAt)}</p>
                    </div>
                    <Link
                      href={`${campaignHrefPrefix}/${campaign.campaignId}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-cyan-300 transition-colors hover:text-cyan-200"
                    >
                      Open <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {attentionPills(campaign).map((pill) => (
                      <span key={pill} className={pillClass(variant)}>
                        {pill}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Campaigns needing attention</CardTitle>
            <p className="text-sm text-muted-foreground">
              The campaigns with the most pending approvals, urgent work, and recent workflow movement.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.attentionCampaigns.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/60 px-4 py-5 text-sm text-muted-foreground">
                {emptyState}
              </div>
            ) : (
              summary.attentionCampaigns.map((campaign) => (
                <div
                  key={campaign.campaignId}
                  className="flex items-start justify-between gap-4 rounded-xl border border-border/60 bg-muted/20 px-4 py-4"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold">{campaign.name}</p>
                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                          statusBadgeClass(campaign.status, variant),
                        )}
                      >
                        {campaign.status}
                      </span>
                      <span className="text-xs text-muted-foreground">{campaign.clientSlug}</span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatLastActivity(campaign.lastActivityAt)}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {attentionPills(campaign).map((pill) => (
                        <span key={pill} className={pillClass(variant)}>
                          {pill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    href={`${campaignHrefPrefix}/${campaign.campaignId}`}
                    className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-foreground transition-colors hover:text-primary"
                  >
                    Open <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </section>
  );
}
