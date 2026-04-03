import type { ScopeFilter } from "@/lib/member-access";
import type { ApprovalRequest } from "./server";

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

