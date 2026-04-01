import { getReportsData } from "@/features/reports/server";

import { normalizeRange } from "../range";
import { loadClientAgentCampaignDetail } from "../readers";
import type { ClientAgentScope, ReferencedEntity } from "../types";
import {
  type SearchScopeRequest,
  SearchScopeRequestSchema,
  type SearchScopeResponse,
} from "../tool-contracts";

type SearchMatch = SearchScopeResponse["matches"][number];
type ToolResult<T> =
  | { status: "ok"; data: T; referencedEntities: ReferencedEntity[]; warnings?: string[] }
  | { status: "no_data"; data?: T; referencedEntities: ReferencedEntity[]; warnings?: string[] };

function toScopeFilter(scope: ClientAgentScope) {
  return {
    allowedCampaignIds: scope.allowedCampaignIds,
    allowedEventIds: scope.allowedEventIds,
  };
}

function isCampaignAllowed(scope: ClientAgentScope, campaignId: string) {
  return scope.allowedCampaignIds == null || scope.allowedCampaignIds.includes(campaignId);
}

function isEventAllowed(scope: ClientAgentScope, eventId: string) {
  if (!scope.eventsEnabled) return false;
  return scope.allowedEventIds == null || scope.allowedEventIds.includes(eventId);
}

function uniqueMatches(matches: SearchMatch[]) {
  const seen = new Set<string>();
  return matches.filter((match) => {
    const key = `${match.entityType}:${match.entityId}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function searchScope({
  scope,
  args,
}: {
  scope: ClientAgentScope;
  args: SearchScopeRequest;
}): Promise<ToolResult<SearchScopeResponse>> {
  const request = SearchScopeRequestSchema.parse(args);
  const query = request.query.trim().toLowerCase();
  const includeAllVisible = query === "*";
  const reports = await getReportsData({
    clientSlug: scope.clientSlug,
    scope: toScopeFilter(scope),
  });

  const matches: SearchMatch[] = [
    ...reports.campaigns
      .filter(
        (campaign) =>
          isCampaignAllowed(scope, campaign.campaignId) &&
          (includeAllVisible || campaign.name.toLowerCase().includes(query)),
      )
      .map((campaign) => ({
        entityId: campaign.campaignId,
        entityType: "campaign" as const,
        name: campaign.name,
        domain: "ads" as const,
      })),
    ...reports.events
      .filter(
        (event) =>
          isEventAllowed(scope, event.id) &&
          (includeAllVisible || event.name.toLowerCase().includes(query)),
      )
      .map((event) => ({
        entityId: event.id,
        entityType: "event" as const,
        name: event.name,
        domain: "events" as const,
        date: event.date ?? undefined,
        city: event.city,
        venue: event.venue,
      })),
  ];

  const searchRange = normalizeRange("lifetime", { timezone: "America/Chicago" });
  const allowedCampaigns = reports.campaigns.filter((campaign) =>
    isCampaignAllowed(scope, campaign.campaignId),
  );

  const creativeMatches = await Promise.all(
    allowedCampaigns.map(async (campaign) => {
      const detail = await loadClientAgentCampaignDetail({
        slug: scope.clientSlug,
        campaignId: campaign.campaignId,
        range: searchRange,
        scope: toScopeFilter(scope),
      });

      if (!detail) return [];

      return detail.ads
        .filter((ad) => includeAllVisible || ad.name.toLowerCase().includes(query))
        .map((ad) => ({
          entityId: ad.adId,
          entityType: "creative" as const,
          name: ad.name,
          domain: "ads" as const,
          campaignId: detail.campaign.campaignId,
          campaignName: detail.campaign.name,
        }));
    }),
  );

  const allMatches = uniqueMatches([...matches, ...creativeMatches.flat()]);
  const referencedEntities = allMatches.map((match) =>
    match.entityType === "creative"
      ? {
          entityId: match.entityId,
          entityType: "creative" as const,
          name: match.name,
          campaignId: match.campaignId!,
        }
      : {
          entityId: match.entityId,
          entityType: match.entityType,
          name: match.name,
        },
  );

  if (allMatches.length === 0) {
    return {
      status: "no_data",
      referencedEntities: [],
    };
  }

  return {
    status: "ok",
    data: { matches: allMatches },
    referencedEntities,
  };
}
