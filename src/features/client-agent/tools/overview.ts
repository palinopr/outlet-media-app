import { getReportsData } from "@/features/reports/server";

import {
  loadClientAgentCampaignDetail,
  loadClientAgentEventDetail,
} from "../readers";
import {
  type AdsOverviewRequest,
  AdsOverviewRequestSchema,
  type AdsOverviewResponse,
  type EventsOverviewRequest,
  EventsOverviewRequestSchema,
  type EventsOverviewResponse,
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

function sum(values: Array<number | null | undefined>) {
  return values.reduce<number>((total, value) => total + (value ?? 0), 0);
}

function average(values: Array<number | null | undefined>) {
  const present = values.filter((value): value is number => value != null);
  return present.length === 0 ? null : sum(present) / present.length;
}

function buildCampaignReference(campaignId: string, name: string): ReferencedEntity {
  return {
    entityId: campaignId,
    entityType: "campaign",
    name,
  };
}

function buildCreativeReference(
  creativeId: string,
  name: string,
  campaignId: string,
): ReferencedEntity {
  return {
    entityId: creativeId,
    entityType: "creative",
    name,
    campaignId,
  };
}

function buildEventReference(eventId: string, name: string): ReferencedEntity {
  return {
    entityId: eventId,
    entityType: "event",
    name,
  };
}

function filterByDateRange<T extends { date: string }>(rows: T[], range: ResolvedRange) {
  return rows.filter((row) => row.date >= range.startDate && row.date <= range.endDate);
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

  return { ticketsSold, gross };
}

export async function getAdsOverview({
  scope,
  args,
}: {
  scope: ClientAgentScope;
  args: AdsOverviewRequest;
}): Promise<ToolResult<AdsOverviewResponse>> {
  const request = AdsOverviewRequestSchema.parse(args);
  const reports = await getReportsData({
    clientSlug: scope.clientSlug,
    range: toReportsRange(request.range),
    scope: toScopeFilter(scope),
  });

  if (request.creativeIds && request.creativeIds.length > 0) {
    const campaignDetails = await Promise.all(
      reports.campaigns
        .filter((campaign) => isCampaignAllowed(scope, campaign.campaignId))
        .map((campaign) =>
          loadClientAgentCampaignDetail({
            slug: scope.clientSlug,
            campaignId: campaign.campaignId,
            range: request.range,
            scope: toScopeFilter(scope),
          }),
        ),
    );

    const matchingAds = campaignDetails
      .flatMap((detail) =>
        !detail
          ? []
          : detail.ads
              .filter((ad) => request.creativeIds?.includes(ad.adId))
              .map((ad) => ({
                ad,
                campaignId: detail.campaign.campaignId,
              })),
      );

    if (matchingAds.length === 0) {
      return { status: "no_data", referencedEntities: [] };
    }

    const spendUsd = sum(matchingAds.map(({ ad }) => ad.spend));
    const revenueUsd = sum(matchingAds.map(({ ad }) => ad.revenue));
    const impressions = sum(matchingAds.map(({ ad }) => ad.impressions));
    const clicks = sum(matchingAds.map(({ ad }) => ad.clicks));

    return {
      status: "ok",
      data: {
        totals: {
          spendUsd,
          revenueUsd,
          roas:
            spendUsd > 0 ? revenueUsd / spendUsd : average(matchingAds.map(({ ad }) => ad.roas)),
          impressions,
          clicks,
          ctr:
            impressions > 0
              ? (clicks / impressions) * 100
              : average(matchingAds.map(({ ad }) => ad.ctr)),
          cpcUsd: average(matchingAds.map(({ ad }) => ad.cpc)),
          cpmUsd: impressions > 0 ? (spendUsd / impressions) * 1000 : null,
        },
      },
      referencedEntities: matchingAds.map(({ ad, campaignId }) =>
        buildCreativeReference(ad.adId, ad.name, campaignId),
      ),
    };
  }

  const campaigns = reports.campaigns.filter(
    (campaign) =>
      isCampaignAllowed(scope, campaign.campaignId) &&
      (request.campaignIds == null || request.campaignIds.includes(campaign.campaignId)),
  );

  if (campaigns.length === 0) {
    return { status: "no_data", referencedEntities: [] };
  }

  const spendUsd = sum(campaigns.map((campaign) => campaign.spend));
  const revenueUsd = sum(campaigns.map((campaign) => campaign.revenue));
  const impressions = sum(campaigns.map((campaign) => campaign.impressions));
  const clicks = sum(campaigns.map((campaign) => campaign.clicks));

  return {
    status: "ok",
    data: {
      totals: {
        spendUsd,
        revenueUsd,
        roas:
          spendUsd > 0 ? revenueUsd / spendUsd : average(campaigns.map((campaign) => campaign.roas)),
        impressions,
        clicks,
        ctr:
          impressions > 0
            ? (clicks / impressions) * 100
            : average(campaigns.map((campaign) => campaign.ctr)),
        cpcUsd: average(campaigns.map((campaign) => campaign.cpc)),
        cpmUsd: average(campaigns.map((campaign) => campaign.cpm)),
      },
    },
    referencedEntities: campaigns.map((campaign) =>
      buildCampaignReference(campaign.campaignId, campaign.name),
    ),
  };
}

export async function getEventsOverview({
  scope,
  args,
}: {
  scope: ClientAgentScope;
  args: EventsOverviewRequest;
}): Promise<ToolResult<EventsOverviewResponse>> {
  const request = EventsOverviewRequestSchema.parse(args);
  const reports = await getReportsData({
    clientSlug: scope.clientSlug,
    scope: toScopeFilter(scope),
  });

  const visibleEvents = reports.events.filter(
    (event) =>
      isEventAllowed(scope, event.id) &&
      (request.eventIds == null || request.eventIds.includes(event.id)),
  );

  const details = await Promise.all(
    visibleEvents.map((event) =>
      loadClientAgentEventDetail({
        slug: scope.clientSlug,
        eventId: event.id,
        scope: toScopeFilter(scope),
      }),
    ),
  );
  const entries = details.flatMap((detail) => {
    if (!detail) return [];
    const metrics = summarizeEventRange(detail, request.range);
    if (!metrics) return [];
    return [{ detail, metrics }];
  });

  if (entries.length === 0) {
    return { status: "no_data", referencedEntities: [] };
  }

  return {
    status: "ok",
    data: {
      totals: {
        ticketsSold: sum(entries.map((entry) => entry.metrics.ticketsSold)),
        grossUsd: sum(entries.map((entry) => entry.metrics.gross)),
        avgSellThroughPct: average(entries.map((entry) => entry.detail.event.sellThrough)),
        views: average(entries.map((entry) => entry.detail.event.edpTotalViews)),
        conversionPct: average(entries.map((entry) => entry.detail.event.conversionRate)),
      },
    },
    referencedEntities: entries.map((entry) =>
      buildEventReference(entry.detail.event.id, entry.detail.event.name),
    ),
  };
}
