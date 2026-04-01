import { getReportsData } from "@/features/reports/server";

import { loadClientAgentCampaignDetail } from "../readers";
import {
  type DemographicBreakdownRequest,
  DemographicBreakdownRequestSchema,
  type DemographicBreakdownResponse,
  type GeographyBreakdownRequest,
  GeographyBreakdownRequestSchema,
  type GeographyBreakdownResponse,
  type PlacementBreakdownRequest,
  PlacementBreakdownRequestSchema,
  type PlacementBreakdownResponse,
} from "../tool-contracts";
import type { ClientAgentScope, ReferencedEntity, ResolvedRange } from "../types";

type ToolResult<T> =
  | { status: "ok"; data: T; referencedEntities: ReferencedEntity[]; warnings?: string[] }
  | { status: "no_data"; data?: T; referencedEntities: ReferencedEntity[]; warnings?: string[] };

type CampaignDetail = Awaited<ReturnType<typeof loadClientAgentCampaignDetail>>;

function toScopeFilter(scope: ClientAgentScope) {
  return {
    allowedCampaignIds: scope.allowedCampaignIds,
    allowedEventIds: scope.allowedEventIds,
  };
}

function isCampaignAllowed(scope: ClientAgentScope, campaignId: string) {
  return scope.allowedCampaignIds == null || scope.allowedCampaignIds.includes(campaignId);
}

function toReportsRange(range: ResolvedRange) {
  switch (range.preset) {
    case "today":
      return "today" as const;
    case "yesterday":
      return "yesterday" as const;
    case "last_7_days":
      return "7" as const;
    case "last_30_days":
      return "30" as const;
    case "lifetime":
      return "lifetime" as const;
    case "this_week":
    case "this_month":
    case "this_quarter":
    case "custom":
      return {
        since: range.startDate,
        until: range.endDate,
      };
  }
}

async function loadScopedCampaignDetails({
  scope,
  range,
  campaignIds,
}: {
  scope: ClientAgentScope;
  range: ResolvedRange;
  campaignIds: string[] | null | undefined;
}): Promise<NonNullable<CampaignDetail>[]> {
  const requestedIds =
    campaignIds?.filter((campaignId) => isCampaignAllowed(scope, campaignId)) ??
    (await getReportsData({
      clientSlug: scope.clientSlug,
      range: toReportsRange(range),
      scope: toScopeFilter(scope),
    })).campaigns
      .filter((campaign) => isCampaignAllowed(scope, campaign.campaignId))
      .map((campaign) => campaign.campaignId);

  const details = await Promise.all(
    requestedIds.map((campaignId) =>
      loadClientAgentCampaignDetail({
        slug: scope.clientSlug,
        campaignId,
        range,
        scope: toScopeFilter(scope),
      }),
    ),
  );

  return details.filter((detail): detail is NonNullable<CampaignDetail> => detail != null);
}

export async function getDemographicBreakdown({
  scope,
  args,
}: {
  scope: ClientAgentScope;
  args: DemographicBreakdownRequest;
}): Promise<ToolResult<DemographicBreakdownResponse>> {
  const request = DemographicBreakdownRequestSchema.parse(args);
  const details = await loadScopedCampaignDetails({
    scope,
    range: request.range,
    campaignIds: request.campaignIds,
  });

  if (details.length === 0) {
    return { status: "no_data", referencedEntities: [] };
  }

  const rows = Array.from(
    details
      .reduce<
        Map<
          string,
          {
            age: string;
            gender: string;
            spendUsd: number;
            revenueUsd: number | null;
            roasWeight: number;
            roasWeightedTotal: number;
            impressions: number;
            clicks: number;
          }
        >
      >((result, detail) => {
        for (const row of detail.ageGender) {
          const key = `${row.age}::${row.gender}`;
          const current = result.get(key) ?? {
            age: row.age,
            gender: row.gender,
            spendUsd: 0,
            revenueUsd: null,
            roasWeight: 0,
            roasWeightedTotal: 0,
            impressions: 0,
            clicks: 0,
          };

          current.spendUsd += row.spend ?? 0;
          current.impressions += row.impressions ?? 0;
          current.clicks += row.clicks ?? 0;
          if (row.roas != null) {
            const weight = row.spend && row.spend > 0 ? row.spend : 1;
            current.roasWeight += weight;
            current.roasWeightedTotal += row.roas * weight;
          }

          result.set(key, current);
        }
        return result;
      }, new Map())
      .values(),
  )
    .map((row) => ({
      age: row.age,
      gender: row.gender,
      spendUsd: row.spendUsd,
      revenueUsd: row.revenueUsd,
      roas: row.roasWeight > 0 ? row.roasWeightedTotal / row.roasWeight : null,
      impressions: row.impressions,
      clicks: row.clicks,
      ctr: row.impressions > 0 ? (row.clicks / row.impressions) * 100 : null,
    }))
    .sort((left, right) => (right.roas ?? right.spendUsd) - (left.roas ?? left.spendUsd));

  return {
    status: "ok",
    data: { rows },
    referencedEntities: details.map((detail) => ({
      entityId: detail.campaign.campaignId,
      entityType: "campaign" as const,
      name: detail.campaign.name,
    })),
  };
}

export async function getGeographyBreakdown({
  scope,
  args,
}: {
  scope: ClientAgentScope;
  args: GeographyBreakdownRequest;
}): Promise<ToolResult<GeographyBreakdownResponse>> {
  const request = GeographyBreakdownRequestSchema.parse(args);
  const details = await loadScopedCampaignDetails({
    scope,
    range: request.range,
    campaignIds: request.campaignIds,
  });

  if (details.length === 0) {
    return { status: "no_data", referencedEntities: [] };
  }

  const rows = Array.from(
    details
      .reduce<
        Map<
          string,
          {
            market: string;
            marketType: string;
            spendUsd: number;
            impressions: number;
            clicks: number;
          }
        >
      >((result, detail) => {
        for (const row of detail.geography) {
          const current = result.get(row.market) ?? {
            market: row.market,
            marketType: row.marketType,
            spendUsd: 0,
            impressions: 0,
            clicks: 0,
          };
          current.spendUsd += row.spend ?? 0;
          current.impressions += row.impressions ?? 0;
          current.clicks += row.clicks ?? 0;
          result.set(row.market, current);
        }
        return result;
      }, new Map())
      .values(),
  )
    .map((row) => ({
      market: row.market,
      marketType: row.marketType,
      spendUsd: row.spendUsd,
      revenueUsd: null,
      roas: null,
      impressions: row.impressions,
      clicks: row.clicks,
      ctr: row.impressions > 0 ? (row.clicks / row.impressions) * 100 : null,
    }))
    .sort((left, right) => (right.ctr ?? right.spendUsd) - (left.ctr ?? left.spendUsd));

  return {
    status: "ok",
    data: { rows },
    referencedEntities: details.map((detail) => ({
      entityId: detail.campaign.campaignId,
      entityType: "campaign" as const,
      name: detail.campaign.name,
    })),
  };
}

export async function getPlacementBreakdown({
  scope,
  args,
}: {
  scope: ClientAgentScope;
  args: PlacementBreakdownRequest;
}): Promise<ToolResult<PlacementBreakdownResponse>> {
  const request = PlacementBreakdownRequestSchema.parse(args);
  const details = await loadScopedCampaignDetails({
    scope,
    range: request.range,
    campaignIds: request.campaignIds,
  });

  if (details.length === 0) {
    return { status: "no_data", referencedEntities: [] };
  }

  const rows = Array.from(
    details
      .reduce<
        Map<
          string,
          {
            platform: string;
            position: string;
            spendUsd: number;
            impressions: number;
            clicks: number;
          }
        >
      >((result, detail) => {
        for (const row of detail.placements) {
          const key = `${row.platform}::${row.position}`;
          const current = result.get(key) ?? {
            platform: row.platform,
            position: row.position,
            spendUsd: 0,
            impressions: 0,
            clicks: 0,
          };
          current.spendUsd += row.spend ?? 0;
          current.impressions += row.impressions ?? 0;
          current.clicks += row.clicks ?? 0;
          result.set(key, current);
        }
        return result;
      }, new Map())
      .values(),
  )
    .map((row) => ({
      platform: row.platform,
      position: row.position,
      spendUsd: row.spendUsd,
      revenueUsd: null,
      roas: null,
      impressions: row.impressions,
      clicks: row.clicks,
      ctr: row.impressions > 0 ? (row.clicks / row.impressions) * 100 : null,
    }))
    .sort((left, right) => (right.ctr ?? right.spendUsd) - (left.ctr ?? left.spendUsd));

  return {
    status: "ok",
    data: { rows },
    referencedEntities: details.map((detail) => ({
      entityId: detail.campaign.campaignId,
      entityType: "campaign" as const,
      name: detail.campaign.name,
    })),
  };
}
