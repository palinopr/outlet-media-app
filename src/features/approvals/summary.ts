import { describeCount } from "@/lib/formatters";
import type { ScopeFilter } from "@/lib/member-access";
import type { ApprovalRequest } from "./server";

export type ApprovalCenterMetricKey =
  | "pending_approvals"
  | "stale_pending"
  | "recently_resolved"
  | "asset_reviews"
  | "campaign_linked";

export interface ApprovalCenterMetric {
  detail: string;
  key: ApprovalCenterMetricKey;
  label: string;
  value: number;
}

export interface ApprovalCenterSummary {
  metrics: ApprovalCenterMetric[];
}

interface BuildApprovalCenterSummaryInput {
  now?: Date;
  pending: ApprovalRequest[];
  recent: ApprovalRequest[];
}

function approvalString(metadata: Record<string, unknown>, key: string) {
  const value = metadata[key];
  return typeof value === "string" && value.length > 0 ? value : null;
}

function normalizeScopeSet(values?: Iterable<string> | null) {
  if (values == null) return null;
  return values instanceof Set ? values : new Set(values);
}

export function approvalCampaignId(approval: ApprovalRequest) {
  if (approval.entityType === "campaign" && approval.entityId) return approval.entityId;
  return approvalString(approval.metadata, "campaignId");
}

export function approvalEventId(approval: ApprovalRequest) {
  if (approval.entityType === "event" && approval.entityId) return approval.entityId;
  return approvalString(approval.metadata, "eventId");
}

export function approvalAssetId(approval: ApprovalRequest) {
  if (approval.requestType !== "asset_review" && approval.requestType !== "asset_import_review") {
    return null;
  }
  if (approval.entityType === "asset" && approval.entityId) return approval.entityId;
  return approvalString(approval.metadata, "assetId");
}

export function approvalIsWithinScope(
  approval: ApprovalRequest,
  scope: ScopeFilter | null | undefined,
  allowedAssetIds?: Iterable<string> | null,
) {
  const campaignIds = normalizeScopeSet(scope?.allowedCampaignIds ?? null);
  const eventIds = normalizeScopeSet(scope?.allowedEventIds ?? null);
  const assetIds = normalizeScopeSet(allowedAssetIds ?? null);

  if (!campaignIds && !eventIds && !assetIds) return true;

  const campaignId = approvalCampaignId(approval);
  const eventId = approvalEventId(approval);
  const assetId = approvalAssetId(approval);

  if (!campaignId && !eventId && !assetId) return true;
  if (campaignId && campaignIds?.has(campaignId)) return true;
  if (eventId && eventIds?.has(eventId)) return true;
  if (assetId && assetIds?.has(assetId)) return true;
  return false;
}

export function filterApprovalRequestsByScope(
  approvals: ApprovalRequest[],
  scope: ScopeFilter | null | undefined,
  allowedAssetIds?: Iterable<string> | null,
) {
  return approvals.filter((approval) => approvalIsWithinScope(approval, scope, allowedAssetIds));
}

export function buildApprovalCenterSummary(
  input: BuildApprovalCenterSummaryInput,
): ApprovalCenterSummary {
  const now = input.now ?? new Date();
  const staleCutoff = now.getTime() - 48 * 60 * 60 * 1000;

  const stalePending = input.pending.filter(
    (approval) => new Date(approval.createdAt).getTime() <= staleCutoff,
  ).length;
  const assetReviews = input.pending.filter(
    (approval) =>
      approval.requestType === "asset_review" || approval.requestType === "asset_import_review",
  ).length;
  const campaignLinked = input.pending.filter((approval) => approvalCampaignId(approval)).length;

  return {
    metrics: [
      {
        key: "pending_approvals",
        label: "Pending approvals",
        value: input.pending.length,
        detail: describeCount(
          input.pending.length,
          "decision waiting right now",
          "decisions waiting right now",
        ),
      },
      {
        key: "stale_pending",
        label: "Waiting >48h",
        value: stalePending,
        detail: describeCount(stalePending, "approval overdue", "approvals overdue"),
      },
      {
        key: "recently_resolved",
        label: "Recently resolved",
        value: input.recent.length,
        detail: describeCount(input.recent.length, "recent decision"),
      },
      {
        key: "asset_reviews",
        label: "Creative reviews",
        value: assetReviews,
        detail: describeCount(assetReviews, "asset review in queue"),
      },
      {
        key: "campaign_linked",
        label: "Campaign-linked",
        value: campaignLinked,
        detail: describeCount(campaignLinked, "approval tied to a campaign"),
      },
    ],
  };
}
