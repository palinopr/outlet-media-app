import type { ScopeFilter } from "@/lib/member-access";

export function allowsCampaignInScope(
  scope: ScopeFilter | undefined,
  campaignId: string,
) {
  if (!scope?.allowedCampaignIds) return true;
  return scope.allowedCampaignIds.includes(campaignId);
}

export function allowsEventInScope(
  scope: ScopeFilter | undefined,
  eventId: string,
) {
  if (!scope?.allowedEventIds) return true;
  return scope.allowedEventIds.includes(eventId);
}
