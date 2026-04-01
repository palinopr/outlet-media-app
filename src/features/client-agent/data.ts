import type { DateRange } from "@/lib/constants";
import type { MetaInsightsTimeRange } from "@/lib/meta-api";
import type { AgentAnswerBlock, ClientAgentScope, ReferencedEntity, ResolvedRange } from "./types";
import { getReportsData } from "@/features/reports/server";
import { loadClientAgentCampaignDetail, loadClientAgentEventDetail } from "./readers";

type DataSuccess = {
  status: "ok";
  blocks: AgentAnswerBlock[];
  referencedEntities: ReferencedEntity[];
};

type DataNoData = {
  status: "no_data";
  reason: "not_found";
};

type DataResult = DataSuccess | DataNoData;

type EntityType = "campaign" | "event";

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
  if (!scope.eventsEnabled) {
    return false;
  }

  return scope.allowedEventIds == null || scope.allowedEventIds.includes(eventId);
}

function ok(blocks: AgentAnswerBlock[], referencedEntities: ReferencedEntity[]): DataSuccess {
  return {
    status: "ok",
    blocks,
    referencedEntities,
  };
}

function noData(): DataNoData {
  return {
    status: "no_data",
    reason: "not_found",
  };
}

function metricCards(
  cards: Array<{
    label: string;
    value: string;
    change?: string;
    trend?: "up" | "down" | "flat";
  }>,
  title?: string,
): AgentAnswerBlock {
  return {
    type: "metric_cards",
    cards: cards.slice(0, 6),
    title,
  };
}

function table(
  columns: string[],
  rows: Record<string, string | number | null>[],
  title?: string,
): AgentAnswerBlock {
  return {
    type: "table",
    columns,
    rows: rows.slice(0, 12).map((row) =>
      columns.reduce<Record<string, string | number | null>>((result, column) => {
        result[column] = row[column] ?? null;
        return result;
      }, {}),
    ),
    title,
  };
}

function chart(
  seriesName: string,
  points: Array<{ x: string; y: number | null }>,
  title?: string,
): AgentAnswerBlock {
  return {
    type: "chart",
    xKey: "date",
    series: [
      {
        name: seriesName,
        points: points.slice(0, 31),
      },
    ],
    title,
  };
}

function uniqueEntities(entities: ReferencedEntity[]) {
  const seen = new Set<string>();
  const result: ReferencedEntity[] = [];

  for (const entity of entities) {
    const key = `${entity.entityType}:${entity.entityId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(entity);
  }

  return result;
}

function toReportsRange(range: ResolvedRange): DateRange | MetaInsightsTimeRange {
  switch (range.preset) {
    case "today":
      return "today";
    case "yesterday":
      return "yesterday";
    case "last_7_days":
      return "7";
    case "last_30_days":
      return "30";
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

function formatNumber(value: number | null | undefined) {
  if (value == null) return "0";
  return value.toLocaleString("en-US");
}

function formatCurrency(value: number | null | undefined) {
  if (value == null) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDecimal(value: number | null | undefined) {
  if (value == null) return "0";
  return value.toFixed(2);
}

function isDateWithinRange(date: string, range: ResolvedRange) {
  return date >= range.startDate && date <= range.endDate;
}

function sum(values: Array<number | null | undefined>) {
  return values.reduce<number>((total, value) => total + (value ?? 0), 0);
}

function average(values: number[]) {
  if (values.length === 0) {
    return null;
  }

  const total = sum(values);
  return total / values.length;
}

function buildCampaignReference(entityId: string, name: string): ReferencedEntity {
  return {
    entityId,
    entityType: "campaign",
    name,
  };
}

function buildEventReference(entityId: string, name: string): ReferencedEntity {
  return {
    entityId,
    entityType: "event",
    name,
  };
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
    spend,
    revenue,
    roas: spend > 0 ? revenue / spend : average(daily.flatMap((point) => (point.roas != null ? [point.roas] : []))),
    impressions,
    clicks,
    ctr: impressions > 0 ? (clicks / impressions) * 100 : average(daily.flatMap((point) => (point.ctr != null ? [point.ctr] : []))),
  };
}

function filterByDateRange<T extends { date: string }>(rows: T[], range: ResolvedRange) {
  return rows.filter((row) => isDateWithinRange(row.date, range));
}

function summarizeEventRange(detail: Awaited<ReturnType<typeof loadClientAgentEventDetail>>) {
  if (!detail) {
    return null;
  }

  return (range: ResolvedRange) => {
    const snapshots = filterByDateRange(detail.snapshots, range);
    const dailyDeltas = filterByDateRange(detail.dailyDeltas, range);
    const ticketsSold = dailyDeltas.length > 0
      ? sum(dailyDeltas.map((delta) => delta.ticketsDelta))
      : snapshots.length > 1
        ? snapshots[snapshots.length - 1]!.ticketsSold - snapshots[0]!.ticketsSold
        : 0;
    const gross = dailyDeltas.length > 0
      ? sum(dailyDeltas.map((delta) => delta.revenueDelta))
      : snapshots.length > 1
        ? (snapshots[snapshots.length - 1]!.gross ?? 0) - (snapshots[0]!.gross ?? 0)
        : 0;
    const avgDailySales = dailyDeltas.length > 0 ? ticketsSold / dailyDeltas.length : null;

    return {
      snapshots,
      dailyDeltas,
      ticketsSold,
      gross,
      avgDailySales,
    };
  };
}

export async function searchEntities({
  scope,
  query,
}: {
  scope: ClientAgentScope;
  query: string;
}) {
  const reports = await getReportsData({
    clientSlug: scope.clientSlug,
    scope: toScopeFilter(scope),
  });
  const normalized = query.trim().toLowerCase();

  return uniqueEntities([
    ...reports.campaigns
      .filter((campaign) => campaign.name.toLowerCase().includes(normalized))
      .map<ReferencedEntity>((campaign) => ({
        entityId: campaign.campaignId,
        entityType: "campaign",
        name: campaign.name,
      })),
    ...reports.events
      .filter((event) => event.name.toLowerCase().includes(normalized) && isEventAllowed(scope, event.id))
      .map<ReferencedEntity>((event) => ({
        entityId: event.id,
        entityType: "event",
        name: event.name,
      })),
  ]);
}

export async function getOverview({
  scope,
  range,
}: {
  scope: ClientAgentScope;
  range: ResolvedRange;
}): Promise<DataResult> {
  const reports = await getReportsData({
    clientSlug: scope.clientSlug,
    range: toReportsRange(range),
    scope: toScopeFilter(scope),
  });
  const campaigns = reports.campaigns.filter((campaign) => isCampaignAllowed(scope, campaign.campaignId));
  const eventSummaries = await Promise.all(
    reports.events
      .filter((event) => isEventAllowed(scope, event.id))
      .map(async (event) => {
        const detail = await loadClientAgentEventDetail({
          slug: scope.clientSlug,
          eventId: event.id,
          scope: toScopeFilter(scope),
        });
        const summarize = summarizeEventRange(detail);
        if (!detail || !summarize) {
          return null;
        }

        return {
          detail,
          metrics: summarize(range),
        };
      }),
  );
  const events = eventSummaries.filter((entry) => entry != null);
  const referencedEntities = uniqueEntities([
    ...campaigns.map((campaign) => buildCampaignReference(campaign.campaignId, campaign.name)),
    ...events.map((entry) => buildEventReference(entry.detail.event.id, entry.detail.event.name)),
  ]);

  if (referencedEntities.length === 0) {
    return noData();
  }

  return ok(
    [
      metricCards(
        [
          { label: "Spend", value: formatCurrency(reports.summary.totalSpend) },
          { label: "Revenue", value: formatCurrency(reports.summary.totalRevenue) },
          { label: "ROAS", value: formatDecimal(reports.summary.blendedRoas) },
          { label: "Impressions", value: formatNumber(reports.summary.totalImpressions) },
          { label: "Clicks", value: formatNumber(reports.summary.totalClicks) },
          { label: "Tickets Sold", value: formatNumber(sum(events.map((entry) => entry.metrics.ticketsSold))) },
        ],
        "Overview",
      ),
      table(
        ["Campaign", "Spend", "ROAS"],
        campaigns.map((campaign) => ({
          Campaign: campaign.name,
          Spend: formatCurrency(campaign.spend),
          ROAS: formatDecimal(campaign.roas),
        })),
        "Campaign performance",
      ),
      table(
        ["Event", "Tickets Sold"],
        events.map((entry) => ({
          Event: entry.detail.event.name,
          "Tickets Sold": entry.metrics.ticketsSold,
        })),
        "Event performance",
      ),
      chart(
        "Spend",
        reports.trendData.map((point) => ({ x: point.date, y: point.spend })),
        `${range.preset} trend`,
      ),
    ],
    referencedEntities,
  );
}

export async function getEntityDetails({
  scope,
  entityId,
  entityType,
  range,
}: {
  scope: ClientAgentScope;
  entityId: string;
  entityType: EntityType;
  range: ResolvedRange;
}): Promise<DataResult> {
  if (entityType === "campaign") {
    if (!isCampaignAllowed(scope, entityId)) {
      return noData();
    }

    const detail = await loadClientAgentCampaignDetail({
      slug: scope.clientSlug,
      campaignId: entityId,
      range,
      scope: toScopeFilter(scope),
    });

    if (!detail) {
      return noData();
    }

    const daily = filterByDateRange(detail.daily, range);
    const summary = daily.length > 0
      ? summarizeCampaignDaily(daily)
      : {
          spend: detail.campaign.spend,
          revenue: detail.campaign.revenue,
          roas: detail.campaign.roas,
          impressions: detail.campaign.impressions,
          clicks: detail.campaign.clicks,
          ctr: detail.campaign.ctr,
        };

    return ok(
      [
        metricCards(
          [
            { label: "Spend", value: formatCurrency(summary.spend) },
            { label: "Revenue", value: formatCurrency(summary.revenue) },
            { label: "ROAS", value: formatDecimal(summary.roas) },
            { label: "Impressions", value: formatNumber(summary.impressions) },
            { label: "Clicks", value: formatNumber(summary.clicks) },
            { label: "CTR", value: formatDecimal(summary.ctr) },
          ],
          detail.campaign.name,
        ),
      ],
      [
        buildCampaignReference(detail.campaign.campaignId, detail.campaign.name),
      ],
    );
  }

  if (!isEventAllowed(scope, entityId)) {
    return noData();
  }

  const detail = await loadClientAgentEventDetail({
    slug: scope.clientSlug,
    eventId: entityId,
    scope: toScopeFilter(scope),
  });
  if (!detail) {
    return noData();
  }

  const summarize = summarizeEventRange(detail);
  if (!summarize) {
    return noData();
  }
  const metrics = summarize(range);

  return ok(
    [
      metricCards(
        [
          { label: "Tickets Sold", value: formatNumber(metrics.ticketsSold) },
          { label: "Current Sell Through", value: formatNumber(detail.event.sellThrough) },
          { label: "Gross", value: formatCurrency(metrics.gross) },
          { label: "Avg Daily Sales", value: formatDecimal(metrics.avgDailySales) },
          { label: "Current Views", value: formatNumber(detail.event.edpTotalViews) },
          { label: "Current Conversion", value: formatDecimal(detail.event.conversionRate) },
        ],
        detail.event.name,
      ),
    ],
    [
      buildEventReference(detail.event.id, detail.event.name),
    ],
  );
}

export async function compareEntities({
  scope,
  entityType,
  entityIds,
  range,
  metric,
}: {
  scope: ClientAgentScope;
  entityType: EntityType;
  entityIds: string[];
  range: ResolvedRange;
  metric: "spend" | "roas";
}): Promise<DataResult> {
  const rows: Array<{
    Entity: string;
    Metric: string;
    reference: ReferencedEntity;
  }> = [];

  if (entityType === "campaign") {
    const reports = await getReportsData({
      clientSlug: scope.clientSlug,
      range: toReportsRange(range),
      scope: toScopeFilter(scope),
    });

    for (const campaign of reports.campaigns) {
      if (!entityIds.includes(campaign.campaignId) || !isCampaignAllowed(scope, campaign.campaignId)) {
        continue;
      }

      rows.push({
        Entity: campaign.name,
        Metric: metric === "spend" ? formatCurrency(campaign.spend) : formatDecimal(campaign.roas),
        reference: buildCampaignReference(campaign.campaignId, campaign.name),
      });
    }
  } else {
    const details = await Promise.all(
      entityIds
        .filter((eventId) => isEventAllowed(scope, eventId))
        .map(async (eventId) => {
          const detail = await loadClientAgentEventDetail({
            slug: scope.clientSlug,
            eventId,
            scope: toScopeFilter(scope),
          });
          const summarize = summarizeEventRange(detail);
          if (!detail || !summarize) {
            return null;
          }

          return {
            detail,
            metrics: summarize(range),
          };
        }),
    );

    for (const entry of details) {
      if (!entry) {
        continue;
      }

      rows.push({
        Entity: entry.detail.event.name,
        Metric:
          metric === "spend"
            ? formatCurrency(entry.metrics.gross)
            : formatNumber(entry.metrics.ticketsSold),
        reference: buildEventReference(entry.detail.event.id, entry.detail.event.name),
      });
    }
  }

  if (rows.length === 0) {
    return noData();
  }

  return ok(
    [table(["Entity", "Metric"], rows.map(({ reference: _reference, ...row }) => row), "Comparison")],
    rows.map((row) => row.reference),
  );
}

export async function getBreakdowns({
  scope,
  entityType,
  entityId,
  range,
  breakdown,
}: {
  scope: ClientAgentScope;
  entityType: EntityType;
  entityId: string;
  range: ResolvedRange;
  breakdown: "creative" | "placement" | "geography" | "age_gender";
}): Promise<DataResult> {
  if (entityType !== "campaign" || !isCampaignAllowed(scope, entityId)) {
    return noData();
  }

  const detail = await loadClientAgentCampaignDetail({
    slug: scope.clientSlug,
    campaignId: entityId,
    range,
    scope: toScopeFilter(scope),
  });

  if (!detail) {
    return noData();
  }

  const rows =
    breakdown === "creative"
      ? detail.ads.map((ad) => ({
          Creative: ad.name,
          Spend: formatCurrency(ad.spend),
          ROAS: formatDecimal(ad.roas),
        }))
      : breakdown === "placement"
        ? detail.placements.map((placement) => ({
            Platform: placement.platform,
            Position: placement.position,
            Spend: formatCurrency(placement.spend),
          }))
        : breakdown === "geography"
          ? detail.geography.map((geography) => ({
              Market: geography.market,
              Spend: formatCurrency(geography.spend),
              CTR: formatDecimal(geography.ctr),
            }))
          : detail.ageGender.map((row) => ({
              Age: row.age,
              Gender: row.gender,
              Spend: formatCurrency(row.spend),
            }));

  const columns = Object.keys(rows[0] ?? { Label: null });

  return ok(
    [table(columns, rows, "Breakdown")],
    [buildCampaignReference(detail.campaign.campaignId, detail.campaign.name)],
  );
}

export async function getTimeseries({
  scope,
  entityType,
  entityIds,
  range,
  metric,
  interval: _interval,
}: {
  scope: ClientAgentScope;
  entityType: EntityType;
  entityIds: string[];
  range: ResolvedRange;
  metric: "spend" | "roas";
  interval: "day";
}): Promise<DataResult> {
  const entityId = entityIds[0];
  if (!entityId) {
    return noData();
  }

  if (entityType === "campaign") {
    if (!isCampaignAllowed(scope, entityId)) {
      return noData();
    }

    const detail = await loadClientAgentCampaignDetail({
      slug: scope.clientSlug,
      campaignId: entityId,
      range,
      scope: toScopeFilter(scope),
    });

    if (!detail) {
      return noData();
    }

    return ok(
      [
        chart(
          metric === "spend" ? "Spend" : "ROAS",
          filterByDateRange(detail.daily, range).map((point) => ({
            x: point.date,
            y: metric === "spend" ? point.spend : point.roas,
          })),
          "Timeseries",
        ),
      ],
      [buildCampaignReference(detail.campaign.campaignId, detail.campaign.name)],
    );
  }

  if (!isEventAllowed(scope, entityId)) {
    return noData();
  }

  const detail = await loadClientAgentEventDetail({
    slug: scope.clientSlug,
    eventId: entityId,
    scope: toScopeFilter(scope),
  });
  if (!detail) {
    return noData();
  }

  return ok(
    [
      chart(
        "Tickets Sold",
        filterByDateRange(detail.snapshots, range).map((snapshot) => ({
          x: snapshot.date,
          y: snapshot.ticketsSold,
        })),
        "Timeseries",
      ),
    ],
    [buildEventReference(detail.event.id, detail.event.name)],
  );
}

export async function getTopMovers({
  scope,
  entityType,
  range,
  metric,
  direction,
}: {
  scope: ClientAgentScope;
  entityType: EntityType;
  range: ResolvedRange;
  metric: "spend" | "roas";
  direction: "asc" | "desc";
}): Promise<DataResult> {
  const rows: Array<{
    Entity: string;
    Metric: string;
    sortValue: number;
    reference: ReferencedEntity;
  }> = [];

  if (entityType === "campaign") {
    const reports = await getReportsData({
      clientSlug: scope.clientSlug,
      range: toReportsRange(range),
      scope: toScopeFilter(scope),
    });

    for (const campaign of reports.campaigns) {
      if (!isCampaignAllowed(scope, campaign.campaignId)) {
        continue;
      }

      const sortValue = metric === "spend" ? campaign.spend : campaign.roas ?? 0;
      rows.push({
        Entity: campaign.name,
        Metric: metric === "spend" ? formatCurrency(campaign.spend) : formatDecimal(campaign.roas),
        sortValue,
        reference: buildCampaignReference(campaign.campaignId, campaign.name),
      });
    }
  } else {
    const reports = await getReportsData({
      clientSlug: scope.clientSlug,
      scope: toScopeFilter(scope),
    });
    const details = await Promise.all(
      reports.events
        .filter((event) => isEventAllowed(scope, event.id))
        .map(async (event) => {
          const eventId = event.id;
          const detail = await loadClientAgentEventDetail({
            slug: scope.clientSlug,
            eventId,
            scope: toScopeFilter(scope),
          });
          const summarize = summarizeEventRange(detail);
          if (!detail || !summarize) {
            return null;
          }

          return {
            detail,
            metrics: summarize(range),
          };
        }),
    );

    for (const entry of details) {
      if (!entry) {
        continue;
      }

      const sortValue = metric === "spend" ? entry.metrics.gross : entry.metrics.ticketsSold;
      rows.push({
        Entity: entry.detail.event.name,
        Metric:
          metric === "spend"
            ? formatCurrency(entry.metrics.gross)
            : formatNumber(entry.metrics.ticketsSold),
        sortValue,
        reference: buildEventReference(entry.detail.event.id, entry.detail.event.name),
      });
    }
  }

  if (rows.length === 0) {
    return noData();
  }

  const sortedRows = [...rows].sort((left, right) =>
    direction === "asc" ? left.sortValue - right.sortValue : right.sortValue - left.sortValue,
  );

  return ok(
    [
      table(
        ["Entity", "Metric"],
        sortedRows.slice(0, 10).map(({ reference: _reference, sortValue: _sortValue, ...row }) => row),
        "Top movers",
      ),
    ],
    sortedRows.slice(0, 10).map((row) => row.reference),
  );
}

export async function getEventInsights({
  scope,
  eventIds,
  range,
}: {
  scope: ClientAgentScope;
  eventIds: string[];
  range: ResolvedRange;
}): Promise<DataResult> {
  const allowedEventIds = eventIds.filter((eventId) => isEventAllowed(scope, eventId));
  const details = await Promise.all(
    allowedEventIds.map((eventId) =>
      loadClientAgentEventDetail({
        slug: scope.clientSlug,
        eventId,
        scope: toScopeFilter(scope),
      }),
    ),
  );
  const visibleDetails = details.filter((detail) => detail != null);

  if (visibleDetails.length === 0) {
    return noData();
  }

  return ok(
    [
      table(
        ["Event", "Tickets Sold", "Gross"],
        visibleDetails.map((detail) => {
          const summary = summarizeEventRange(detail)?.(range);

          return {
            Event: detail.event.name,
            "Tickets Sold": summary?.ticketsSold ?? 0,
            Gross: formatCurrency(summary?.gross ?? 0),
          };
        }),
        "Event insights",
      ),
    ],
    visibleDetails.map((detail) => buildEventReference(detail.event.id, detail.event.name)),
  );
}
