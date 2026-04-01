import { getReportsData } from "@/features/reports/server";

import {
  loadClientAgentCampaignDetail,
  loadClientAgentEventDetail,
} from "../readers";
import {
  type CampaignDetailsRequest,
  CampaignDetailsRequestSchema,
  type CampaignDetailsResponse,
  type CreativeDetailsRequest,
  CreativeDetailsRequestSchema,
  type CreativeDetailsResponse,
  type EventDetailsRequest,
  EventDetailsRequestSchema,
  type EventDetailsResponse,
} from "../tool-contracts";
import type { ClientAgentScope, ReferencedEntity, ResolvedRange } from "../types";

type ToolResult<T> =
  | { status: "ok"; data: T; referencedEntities: ReferencedEntity[]; warnings?: string[] }
  | { status: "no_data"; data?: T; referencedEntities: ReferencedEntity[]; warnings?: string[] };

type EventDetail = Awaited<ReturnType<typeof loadClientAgentEventDetail>>;

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

async function loadVisibleCampaignIds(scope: ClientAgentScope) {
  if (scope.allowedCampaignIds != null) {
    return scope.allowedCampaignIds;
  }

  const reports = await getReportsData({
    clientSlug: scope.clientSlug,
    scope: toScopeFilter(scope),
  });

  return reports.campaigns
    .filter((campaign) => isCampaignAllowed(scope, campaign.campaignId))
    .map((campaign) => campaign.campaignId);
}

function sum(values: Array<number | null | undefined>) {
  return values.reduce<number>((total, value) => total + (value ?? 0), 0);
}

function average(values: Array<number | null | undefined>) {
  const present = values.filter((value): value is number => value != null);
  return present.length === 0 ? null : sum(present) / present.length;
}

function filterByDateRange<T extends { date: string }>(rows: T[], range: ResolvedRange) {
  return rows.filter((row) => row.date >= range.startDate && row.date <= range.endDate);
}

function summarizeCampaignDaily(
  daily: Array<{
    date: string;
    spend: number;
    revenue: number | null;
    roas: number | null;
    impressions: number;
    clicks: number;
    ctr: number | null;
  }>,
) {
  const spend = sum(daily.map((point) => point.spend));
  const revenue = sum(daily.map((point) => point.revenue));
  const impressions = sum(daily.map((point) => point.impressions));
  const clicks = sum(daily.map((point) => point.clicks));

  return {
    spendUsd: spend,
    revenueUsd: revenue,
    roas:
      spend > 0
        ? revenue / spend
        : average(daily.map((point) => point.roas)),
    impressions,
    clicks,
    ctr:
      impressions > 0
        ? (clicks / impressions) * 100
        : average(daily.map((point) => point.ctr)),
  };
}

function summarizeEventRange(detail: EventDetail, range: ResolvedRange) {
  if (!detail) return null;

  const snapshots = filterByDateRange(detail.snapshots, range);
  const dailyDeltas = filterByDateRange(detail.dailyDeltas, range);
  const ticketsSold =
    dailyDeltas.length > 0
      ? sum(dailyDeltas.map((delta) => delta.ticketsDelta))
      : snapshots.length > 1
        ? snapshots[snapshots.length - 1]!.ticketsSold - snapshots[0]!.ticketsSold
        : 0;
  const gross =
    dailyDeltas.length > 0
      ? sum(dailyDeltas.map((delta) => delta.revenueDelta))
      : snapshots.length > 1
        ? (snapshots[snapshots.length - 1]!.gross ?? 0) - (snapshots[0]!.gross ?? 0)
        : 0;
  const avgDailySales = dailyDeltas.length > 0 ? ticketsSold / dailyDeltas.length : null;

  return { ticketsSold, grossUsd: gross, avgDailySales };
}

export async function getCampaignDetails({
  scope,
  args,
}: {
  scope: ClientAgentScope;
  args: CampaignDetailsRequest;
}): Promise<ToolResult<CampaignDetailsResponse>> {
  const request = CampaignDetailsRequestSchema.parse(args);
  const campaignIds = request.campaignIds.filter((campaignId) =>
    isCampaignAllowed(scope, campaignId),
  );

  const details = await Promise.all(
    campaignIds.map((campaignId) =>
      loadClientAgentCampaignDetail({
        slug: scope.clientSlug,
        campaignId,
        range: request.range,
        scope: toScopeFilter(scope),
      }),
    ),
  );

  const campaigns = details.flatMap((detail) => {
    if (!detail) return [];
    const daily = filterByDateRange(detail.daily, request.range);
    const metrics =
      daily.length > 0
        ? summarizeCampaignDaily(daily)
        : {
            spendUsd: detail.campaign.spend ?? 0,
            revenueUsd: detail.campaign.revenue ?? null,
            roas: detail.campaign.roas ?? null,
            impressions: detail.campaign.impressions ?? 0,
            clicks: detail.campaign.clicks ?? 0,
            ctr: detail.campaign.ctr ?? null,
          };

    return [
      {
        campaignId: detail.campaign.campaignId,
        name: detail.campaign.name,
        metrics,
      },
    ];
  });

  if (campaigns.length === 0) {
    return { status: "no_data", referencedEntities: [] };
  }

  return {
    status: "ok",
    data: { campaigns },
    referencedEntities: campaigns.map((campaign) => ({
      entityId: campaign.campaignId,
      entityType: "campaign" as const,
      name: campaign.name,
    })),
  };
}

export async function getEventDetails({
  scope,
  args,
}: {
  scope: ClientAgentScope;
  args: EventDetailsRequest;
}): Promise<ToolResult<EventDetailsResponse>> {
  const request = EventDetailsRequestSchema.parse(args);
  const eventIds = request.eventIds.filter((eventId) => isEventAllowed(scope, eventId));

  const details = await Promise.all(
    eventIds.map((eventId) =>
      loadClientAgentEventDetail({
        slug: scope.clientSlug,
        eventId,
        scope: toScopeFilter(scope),
      }),
    ),
  );

  const events = details.flatMap((detail) => {
    if (!detail) return [];
    const metrics = summarizeEventRange(detail, request.range);
    if (!metrics) return [];

    return [
      {
        eventId: detail.event.id,
        name: detail.event.name,
        metrics: {
          ticketsSold: metrics.ticketsSold,
          grossUsd: metrics.grossUsd,
          avgDailySales: metrics.avgDailySales,
          currentSellThroughPct: detail.event.sellThrough ?? null,
          currentConversionPct: detail.event.conversionRate ?? null,
          currentViews: detail.event.edpTotalViews ?? null,
        },
      },
    ];
  });

  if (events.length === 0) {
    return { status: "no_data", referencedEntities: [] };
  }

  return {
    status: "ok",
    data: { events },
    referencedEntities: events.map((event) => ({
      entityId: event.eventId,
      entityType: "event" as const,
      name: event.name,
    })),
  };
}

export async function getCreativeDetails({
  scope,
  args,
}: {
  scope: ClientAgentScope;
  args: CreativeDetailsRequest;
}): Promise<ToolResult<CreativeDetailsResponse>> {
  const request = CreativeDetailsRequestSchema.parse(args);
  const requestedIds = request.creativeIds ?? [];
  const normalizedQuery = request.query?.toLowerCase().trim() ?? null;
  const campaignIds = await loadVisibleCampaignIds(scope);

  const details = await Promise.all(
    campaignIds.map((campaignId) =>
      loadClientAgentCampaignDetail({
        slug: scope.clientSlug,
        campaignId,
        range: request.range,
        scope: toScopeFilter(scope),
      }),
    ),
  );

  const creatives = details.flatMap((detail) => {
    if (!detail) return [];
    return detail.ads
      .filter((ad) => {
        if (requestedIds.length > 0) {
          return requestedIds.includes(ad.adId);
        }

        return normalizedQuery != null && ad.name.toLowerCase().includes(normalizedQuery);
      })
      .map((ad) => ({
        creativeId: ad.adId,
        name: ad.name,
        campaignId: detail.campaign.campaignId,
        campaignName: detail.campaign.name,
        metrics: {
          spendUsd: ad.spend ?? 0,
          revenueUsd: ad.revenue ?? null,
          roas: ad.roas ?? null,
          impressions: ad.impressions ?? null,
          clicks: ad.clicks ?? null,
          ctr: ad.ctr ?? null,
          cpcUsd: ad.cpc ?? null,
          cpmUsd: null,
        },
      }));
  });

  if (creatives.length === 0) {
    return { status: "no_data", referencedEntities: [] };
  }

  return {
    status: "ok",
    data: { creatives },
    referencedEntities: creatives.map((creative) => ({
      entityId: creative.creativeId,
      entityType: "creative" as const,
      name: creative.name,
      campaignId: creative.campaignId,
    })),
  };
}
