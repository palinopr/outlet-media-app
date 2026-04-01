import { getReportsData } from "@/features/reports/server";

import {
  loadClientAgentCampaignDetail,
  loadClientAgentEventDetail,
} from "../readers";
import {
  type CompareEntitiesRequest,
  CompareEntitiesRequestSchema,
  type CompareEntitiesResponse,
  type TimeseriesRequest,
  TimeseriesRequestSchema,
  type TimeseriesResponse,
} from "../tool-contracts";
import type { ClientAgentScope, ReferencedEntity, ResolvedRange } from "../types";

type ToolResult<T> =
  | { status: "ok"; data: T; referencedEntities: ReferencedEntity[]; warnings?: string[] }
  | { status: "no_data"; data?: T; referencedEntities: ReferencedEntity[]; warnings?: string[] }
  | { status: "invalid_arguments"; referencedEntities: ReferencedEntity[]; warnings?: string[] };

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
  return { ticketsSold, grossUsd: gross };
}

function startOfWeek(date: string) {
  const utcDate = new Date(`${date}T00:00:00.000Z`);
  const dayOfWeek = utcDate.getUTCDay();
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  utcDate.setUTCDate(utcDate.getUTCDate() - diff);
  return utcDate.toISOString().slice(0, 10);
}

function monthKey(date: string) {
  return date.slice(0, 7);
}

function bucketKey(date: string, interval: "day" | "week" | "month") {
  if (interval === "day") return date;
  if (interval === "week") return startOfWeek(date);
  return monthKey(date);
}

function groupSeries(
  points: Array<{ date: string; value: number | null }>,
  interval: "day" | "week" | "month",
) {
  const buckets = new Map<string, number>();
  for (const point of points) {
    const key = bucketKey(point.date, interval);
    buckets.set(key, (buckets.get(key) ?? 0) + (point.value ?? 0));
  }

  return Array.from(buckets.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([x, y]) => ({ x, y }));
}

export async function compareEntities({
  scope,
  args,
}: {
  scope: ClientAgentScope;
  args: CompareEntitiesRequest;
}): Promise<ToolResult<CompareEntitiesResponse>> {
  const request = CompareEntitiesRequestSchema.parse(args);

  if (request.entityType === "campaign") {
    const reports = await getReportsData({
      clientSlug: scope.clientSlug,
      range: toReportsRange(request.range),
      scope: toScopeFilter(scope),
    });
    const rows = reports.campaigns
      .filter(
        (campaign) =>
          request.entityIds.includes(campaign.campaignId) &&
          isCampaignAllowed(scope, campaign.campaignId),
      )
      .map((campaign) => ({
        entityId: campaign.campaignId,
        entityType: "campaign" as const,
        name: campaign.name,
        metric: request.metric,
        value:
          request.metric === "spend"
            ? campaign.spend
            : request.metric === "revenue"
              ? campaign.revenue
              : request.metric === "roas"
                ? campaign.roas
                : request.metric === "impressions"
                  ? campaign.impressions
                  : request.metric === "clicks"
                    ? campaign.clicks
                    : request.metric === "ctr"
                      ? campaign.ctr
                      : request.metric === "cpc"
                        ? campaign.cpc
                        : campaign.cpm,
      }));

    if (rows.length === 0) {
      return { status: "no_data", referencedEntities: [] };
    }

    return {
      status: "ok",
      data: { rows },
      referencedEntities: rows.map((row) => ({
        entityId: row.entityId,
        entityType: "campaign" as const,
        name: row.name,
      })),
    };
  }

  if (request.entityType === "creative") {
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
    const rows = details.flatMap((detail) =>
      !detail
        ? []
        : detail.ads
            .filter((ad) => request.entityIds.includes(ad.adId))
            .map((ad) => ({
              entityId: ad.adId,
              entityType: "creative" as const,
              name: ad.name,
              metric: request.metric,
              value:
                request.metric === "spend"
                  ? ad.spend
                  : request.metric === "revenue"
                    ? ad.revenue
                    : request.metric === "roas"
                      ? ad.roas
                      : request.metric === "impressions"
                        ? ad.impressions
                        : request.metric === "clicks"
                          ? ad.clicks
                          : request.metric === "ctr"
                            ? ad.ctr
                            : request.metric === "cpc"
                              ? ad.cpc
                              : null,
              campaignId: detail.campaign.campaignId,
            })),
    );

    if (rows.length === 0) {
      return { status: "no_data", referencedEntities: [] };
    }

    return {
      status: "ok",
      data: {
        rows: rows.map(({ campaignId: _campaignId, ...row }) => row),
      },
      referencedEntities: rows.map((row) => ({
        entityId: row.entityId,
        entityType: "creative" as const,
        name: row.name,
        campaignId: row.campaignId,
      })),
    };
  }

  const details = await Promise.all(
    request.entityIds
      .filter((eventId) => isEventAllowed(scope, eventId))
      .map((eventId) =>
        loadClientAgentEventDetail({
          slug: scope.clientSlug,
          eventId,
          scope: toScopeFilter(scope),
        }),
      ),
  );

  const rows = details.flatMap((detail) => {
    if (!detail) return [];
    const summary = summarizeEventRange(detail, request.range);
    if (!summary) return [];

    return [
      {
        entityId: detail.event.id,
        entityType: "event" as const,
        name: detail.event.name,
        metric: request.metric,
        value:
          request.metric === "tickets_sold"
            ? summary.ticketsSold
            : request.metric === "gross"
                ? summary.grossUsd
                : request.metric === "sell_through"
                ? detail.event.sellThrough ?? null
                : request.metric === "views"
                  ? detail.event.edpTotalViews ?? null
                  : detail.event.conversionRate ?? null,
      },
    ];
  });

  if (rows.length === 0) {
    return { status: "no_data", referencedEntities: [] };
  }

  return {
    status: "ok",
    data: { rows },
    referencedEntities: rows.map((row) => ({
      entityId: row.entityId,
      entityType: "event" as const,
      name: row.name,
    })),
  };
}

export async function getTimeseries({
  scope,
  args,
}: {
  scope: ClientAgentScope;
  args: TimeseriesRequest;
}): Promise<ToolResult<TimeseriesResponse>> {
  const request = TimeseriesRequestSchema.parse(args);
  const entityId = request.entityIds[0];

  if (!entityId) {
    return { status: "no_data", referencedEntities: [] };
  }

  if (request.domain === "ads") {
    if (request.entityType === "creative") {
      return {
        status: "no_data",
        referencedEntities: [],
        warnings: ["Creative-level timeseries is not available from the current reader layer."],
      };
    }

    if (!isCampaignAllowed(scope, entityId)) {
      return { status: "no_data", referencedEntities: [] };
    }

    const detail = await loadClientAgentCampaignDetail({
      slug: scope.clientSlug,
      campaignId: entityId,
      range: request.range,
      scope: toScopeFilter(scope),
    });

    if (!detail) {
      return { status: "no_data", referencedEntities: [] };
    }

    const points = filterByDateRange(detail.daily, request.range).map((point) => ({
      date: point.date,
      value:
        request.metric === "spend"
          ? point.spend
          : request.metric === "revenue"
            ? point.revenue
            : request.metric === "roas"
              ? point.roas
              : request.metric === "impressions"
                ? point.impressions
                : request.metric === "clicks"
                  ? point.clicks
                  : request.metric === "ctr"
                    ? point.ctr
                    : null,
    }));

    return {
      status: "ok",
      data: { series: groupSeries(points, request.interval) },
      referencedEntities: [
        {
          entityId: detail.campaign.campaignId,
          entityType: "campaign",
          name: detail.campaign.name,
        },
      ],
    };
  }

  if (!isEventAllowed(scope, entityId)) {
    return { status: "no_data", referencedEntities: [] };
  }

  const detail = await loadClientAgentEventDetail({
    slug: scope.clientSlug,
    eventId: entityId,
    scope: toScopeFilter(scope),
  });

  if (!detail) {
    return { status: "no_data", referencedEntities: [] };
  }

  const deltaPoints = filterByDateRange(detail.dailyDeltas, request.range).map((point) => ({
    date: point.date,
    value:
      request.metric === "tickets_sold"
        ? point.ticketsDelta
        : request.metric === "gross"
          ? point.revenueDelta ?? null
          : null,
  }));

  const snapshotPoints = filterByDateRange(detail.snapshots, request.range).map((point) => ({
    date: point.date,
    value:
      request.metric === "tickets_sold"
        ? point.ticketsSold
        : request.metric === "gross"
          ? point.gross ?? null
          : null,
  }));

  const sourcePoints =
    request.metric === "tickets_sold" || request.metric === "gross" ? deltaPoints : snapshotPoints;

  return {
    status: "ok",
    data: { series: groupSeries(sourcePoints, request.interval) },
    referencedEntities: [
      {
        entityId: detail.event.id,
        entityType: "event",
        name: detail.event.name,
      },
    ],
    warnings:
      request.metric === "tickets_sold" || request.metric === "gross"
        ? undefined
        : ["Only tickets sold and gross have date-aware event series in the current reader layer."],
  };
}
