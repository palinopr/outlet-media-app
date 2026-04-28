import type { ScopeFilter } from "@/lib/member-access";

export function allowsCampaignInScope(
  scope: ScopeFilter | undefined,
  campaignId: string,
) {
  if (!scope?.allowedCampaignIds) return true;
  return scope.allowedCampaignIds.includes(campaignId);
}
