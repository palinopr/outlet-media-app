import { describeCount } from "@/lib/formatters";
import type { TaskPriority } from "@/lib/workspace-types";

export type DashboardSummaryMode = "admin" | "client";

export interface DashboardCampaignRecord {
  campaignId: string;
  clientSlug: string;
  name: string;
  status: string;
}

export interface DashboardApprovalRecord {
  clientSlug: string;
  createdAt: string;
  entityId: string | null;
  entityType: string | null;
  metadata: Record<string, unknown>;
}

export interface DashboardActionItemRecord {
  campaignId: string;
  clientSlug: string;
  priority: TaskPriority;
  status: string;
  updatedAt: string;
}

export interface DashboardCommentRecord {
  campaignId: string;
  clientSlug: string;
  createdAt: string;
}

export interface DashboardEventRecord {
  clientSlug: string;
  createdAt: string;
  entityId: string | null;
  entityType: string | null;
  metadata: Record<string, unknown>;
}

export type DashboardMetricKey =
  | "pending_approvals"
  | "action_items"
  | "open_discussions"
  | "recent_updates";

export interface DashboardOpsMetric {
  detail: string;
  key: DashboardMetricKey;
  label: string;
  value: number;
}

export interface DashboardAttentionCampaign {
  attentionScore: number;
  campaignId: string;
  clientSlug: string;
  lastActivityAt: string | null;
  name: string;
  openActionItems: number;
  openDiscussionThreads: number;
  pendingApprovals: number;
  recentUpdates: number;
  status: string;
  urgentActionItems: number;
}

export interface DashboardOpsSummary {
  attentionCampaigns: DashboardAttentionCampaign[];
  campaignsNeedingAttention: number;
  metrics: DashboardOpsMetric[];
  mode: DashboardSummaryMode;
}

interface BuildDashboardOpsSummaryInput {
  actionItems: DashboardActionItemRecord[];
  approvals: DashboardApprovalRecord[];
  campaigns: DashboardCampaignRecord[];
  comments: DashboardCommentRecord[];
  events: DashboardEventRecord[];
  limit?: number;
  mode: DashboardSummaryMode;
}

type CampaignAggregate = DashboardAttentionCampaign;

function fallbackCampaignName(campaignId: string) {
  return `Campaign ${campaignId.slice(0, 8)}`;
}

function metadataString(metadata: Record<string, unknown>, key: string) {
  const value = metadata[key];
  return typeof value === "string" && value.length > 0 ? value : null;
}

function resolveCampaignId(
  entityType: string | null,
  entityId: string | null,
  metadata: Record<string, unknown>,
) {
  if (entityType === "campaign" && entityId) return entityId;
  return metadataString(metadata, "campaignId");
}

function sortDateDesc(a: string | null, b: string | null) {
  return new Date(b ?? 0).getTime() - new Date(a ?? 0).getTime();
}

function buildMetrics(
  mode: DashboardSummaryMode,
  pendingApprovals: number,
  openActionItems: number,
  urgentActionItems: number,
  openDiscussionThreads: number,
  recentUpdates: number,
): DashboardOpsMetric[] {
  return [
    {
      key: "pending_approvals",
      label: "Pending approvals",
      value: pendingApprovals,
      detail: describeCount(pendingApprovals, "decision awaiting review", "decisions awaiting review"),
    },
    {
      key: "action_items",
      label: mode === "admin" ? "Urgent items" : "Open next steps",
      value: mode === "admin" ? urgentActionItems : openActionItems,
      detail:
        mode === "admin"
          ? describeCount(urgentActionItems, "urgent item")
          : describeCount(openActionItems, "open next step"),
    },
    {
      key: "open_discussions",
      label: "Open threads",
      value: openDiscussionThreads,
      detail: describeCount(openDiscussionThreads, "active discussion thread"),
    },
    {
      key: "recent_updates",
      label: "Recent updates",
      value: recentUpdates,
      detail: describeCount(
        recentUpdates,
        "update in the last 7 days",
        "updates in the last 7 days",
      ),
    },
  ];
}

function ensureAggregate(
  aggregates: Map<string, CampaignAggregate>,
  campaignId: string,
  fallback: Partial<Pick<CampaignAggregate, "clientSlug" | "name" | "status">> = {},
) {
  const existing = aggregates.get(campaignId);
  if (existing) return existing;

  const created: CampaignAggregate = {
    attentionScore: 0,
    campaignId,
    clientSlug: fallback.clientSlug ?? "unknown",
    lastActivityAt: null,
    name: fallback.name ?? fallbackCampaignName(campaignId),
    openActionItems: 0,
    openDiscussionThreads: 0,
    pendingApprovals: 0,
    recentUpdates: 0,
    status: fallback.status ?? "unknown",
    urgentActionItems: 0,
  };
  aggregates.set(campaignId, created);
  return created;
}

function bumpLastActivity(aggregate: CampaignAggregate, timestamp: string) {
  if (!aggregate.lastActivityAt || new Date(timestamp).getTime() > new Date(aggregate.lastActivityAt).getTime()) {
    aggregate.lastActivityAt = timestamp;
  }
}

export function buildDashboardOpsSummary(
  input: BuildDashboardOpsSummaryInput,
): DashboardOpsSummary {
  const aggregates = new Map<string, CampaignAggregate>();

  for (const campaign of input.campaigns) {
    ensureAggregate(aggregates, campaign.campaignId, {
      clientSlug: campaign.clientSlug,
      name: campaign.name,
      status: campaign.status,
    });
  }

  for (const approval of input.approvals) {
    const campaignId = resolveCampaignId(
      approval.entityType,
      approval.entityId,
      approval.metadata,
    );
    if (!campaignId) continue;

    const aggregate = ensureAggregate(aggregates, campaignId, {
      clientSlug: approval.clientSlug,
      name: metadataString(approval.metadata, "campaignName") ?? undefined,
    });

    aggregate.pendingApprovals += 1;
    bumpLastActivity(aggregate, approval.createdAt);
  }

  for (const actionItem of input.actionItems) {
    const aggregate = ensureAggregate(aggregates, actionItem.campaignId, {
      clientSlug: actionItem.clientSlug,
    });

    aggregate.openActionItems += 1;
    if (actionItem.priority === "urgent") {
      aggregate.urgentActionItems += 1;
    }
    bumpLastActivity(aggregate, actionItem.updatedAt);
  }

  for (const comment of input.comments) {
    const aggregate = ensureAggregate(aggregates, comment.campaignId, {
      clientSlug: comment.clientSlug,
    });

    aggregate.openDiscussionThreads += 1;
    bumpLastActivity(aggregate, comment.createdAt);
  }

  for (const event of input.events) {
    const campaignId = resolveCampaignId(event.entityType, event.entityId, event.metadata);
    if (!campaignId) continue;

    const aggregate = ensureAggregate(aggregates, campaignId, {
      clientSlug: event.clientSlug,
      name: metadataString(event.metadata, "campaignName") ?? undefined,
    });

    aggregate.recentUpdates += 1;
    bumpLastActivity(aggregate, event.createdAt);
  }

  const rankedAttentionCampaigns = [...aggregates.values()]
    .map((campaign) => ({
      ...campaign,
      attentionScore:
        campaign.pendingApprovals * 5 +
        campaign.urgentActionItems * 4 +
        Math.max(campaign.openActionItems - campaign.urgentActionItems, 0) * 2 +
        campaign.openDiscussionThreads * 2 +
        Math.min(campaign.recentUpdates, 5),
    }))
    .filter((campaign) => campaign.attentionScore > 0)
    .sort((a, b) => {
      if (b.attentionScore !== a.attentionScore) {
        return b.attentionScore - a.attentionScore;
      }
      return sortDateDesc(a.lastActivityAt, b.lastActivityAt);
    });

  const attentionCampaigns = rankedAttentionCampaigns.slice(0, input.limit ?? 6);

  const pendingApprovals = input.approvals.length;
  const openActionItems = input.actionItems.length;
  const urgentActionItems = input.actionItems.filter(
    (item) => item.priority === "urgent",
  ).length;
  const openDiscussionThreads = input.comments.length;
  const recentUpdates = input.events.length;

  return {
    attentionCampaigns,
    campaignsNeedingAttention: rankedAttentionCampaigns.length,
    metrics: buildMetrics(
      input.mode,
      pendingApprovals,
      openActionItems,
      urgentActionItems,
      openDiscussionThreads,
      recentUpdates,
    ),
    mode: input.mode,
  };
}
