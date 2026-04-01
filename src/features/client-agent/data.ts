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

export type EventIntentResolution =
  | { kind: "count"; totalEvents: number; referencedEntities: ReferencedEntity[] }
  | { kind: "entity"; eventId: string; referencedEntities: ReferencedEntity[] }
  | { kind: "clarify"; choices: ReferencedEntity[] }
  | { kind: "none" };

type EventWithEffectiveDate = {
  id: string;
  name: string;
  effectiveDate: string | null;
};

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

function isPresent<T>(value: T | null | undefined): value is T {
  return value != null;
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

function isShowInventoryQuestion(message: string) {
  return /\bhow many shows\b|\bhow many events\b/.test(message.toLowerCase());
}

function isLastShowQuestion(message: string) {
  return /\blast show\b|\bmost recent show\b|\blast event\b/.test(message.toLowerCase());
}

async function loadAllowedEventsWithEffectiveDates(scope: ClientAgentScope) {
  const reports = await getReportsData({
    clientSlug: scope.clientSlug,
    scope: toScopeFilter(scope),
  });
  const allowedEvents = reports.events.filter((event) => isEventAllowed(scope, event.id));
  const eventsWithEffectiveDates = await Promise.all(
    allowedEvents.map(async (event) => {
      const detail = await loadClientAgentEventDetail({
        slug: scope.clientSlug,
        eventId: event.id,
        scope: toScopeFilter(scope),
      });

      return {
        id: event.id,
        name: event.name,
        effectiveDate: detail?.event.date ?? event.date ?? null,
      } satisfies EventWithEffectiveDate;
    }),
  );

  return {
    allowedEvents,
    eventsWithEffectiveDates,
  };
}

function sortDatedEvents(events: EventWithEffectiveDate[]) {
  return [...events]
    .filter((event) => Boolean(event.effectiveDate))
    .sort((left, right) => (right.effectiveDate ?? "").localeCompare(left.effectiveDate ?? ""));
}

export async function resolveEventIntent({
  message,
  scope,
}: {
  message: string;
  scope: ClientAgentScope;
}): Promise<EventIntentResolution> {
  const { allowedEvents, eventsWithEffectiveDates } = await loadAllowedEventsWithEffectiveDates(scope);
  const lowerMessage = message.toLowerCase();

  if (isShowInventoryQuestion(lowerMessage)) {
    return {
      kind: "count",
      totalEvents: allowedEvents.length,
      referencedEntities: allowedEvents.map((event) => buildEventReference(event.id, event.name)),
    };
  }

  if (!isLastShowQuestion(lowerMessage)) {
    return { kind: "none" };
  }

  if (allowedEvents.length === 0) {
    return { kind: "none" };
  }

  const datedEvents = sortDatedEvents(eventsWithEffectiveDates);

  if (datedEvents.length > 0) {
    const latestDate = datedEvents[0]!.effectiveDate;
    const latestEvents = datedEvents.filter((event) => event.effectiveDate === latestDate);

    if (latestEvents.length === 1) {
      const latestEvent = latestEvents[0]!;
      return {
        kind: "entity",
        eventId: latestEvent.id,
        referencedEntities: [buildEventReference(latestEvent.id, latestEvent.name)],
      };
    }

    return {
      kind: "clarify",
      choices: latestEvents.map((event) => buildEventReference(event.id, event.name)),
    };
  }

  if (allowedEvents.length === 1) {
    const onlyEvent = allowedEvents[0]!;
    return {
      kind: "entity",
      eventId: onlyEvent.id,
      referencedEntities: [buildEventReference(onlyEvent.id, onlyEvent.name)],
    };
  }

  return {
    kind: "clarify",
    choices: eventsWithEffectiveDates.map((event) => buildEventReference(event.id, event.name)),
  };
}

export async function resolvePreviousEventIntent({
  currentEventId,
  scope,
}: {
  currentEventId: string;
  scope: ClientAgentScope;
}): Promise<EventIntentResolution> {
  const { eventsWithEffectiveDates } = await loadAllowedEventsWithEffectiveDates(scope);
  const currentEvent = eventsWithEffectiveDates.find((event) => event.id === currentEventId);

  if (!currentEvent?.effectiveDate) {
    return { kind: "none" };
  }

  const earlierEvents = sortDatedEvents(eventsWithEffectiveDates).filter(
    (event) => (event.effectiveDate ?? "") < currentEvent.effectiveDate!,
  );

  if (earlierEvents.length === 0) {
    return { kind: "none" };
  }

  const previousDate = earlierEvents[0]!.effectiveDate;
  const previousEvents = earlierEvents.filter((event) => event.effectiveDate === previousDate);

  if (previousEvents.length === 1) {
    const previousEvent = previousEvents[0]!;
    return {
      kind: "entity",
      eventId: previousEvent.id,
      referencedEntities: [buildEventReference(previousEvent.id, previousEvent.name)],
    };
  }

  return {
    kind: "clarify",
    choices: previousEvents.map((event) => buildEventReference(event.id, event.name)),
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
  sortDirection = "desc",
}: {
  scope: ClientAgentScope;
  entityType: EntityType;
  entityId: string | null;
  range: ResolvedRange;
  breakdown: "creative" | "placement" | "geography" | "age_gender";
  sortDirection?: "asc" | "desc";
}): Promise<DataResult> {
  if (entityType !== "campaign") {
    return noData();
  }

  const details = entityId
    ? await (async () => {
        if (!isCampaignAllowed(scope, entityId)) {
          return [];
        }

        const detail = await loadClientAgentCampaignDetail({
          slug: scope.clientSlug,
          campaignId: entityId,
          range,
          scope: toScopeFilter(scope),
        });

        return detail ? [detail] : [];
      })()
    : await (async () => {
        const reports = await getReportsData({
          clientSlug: scope.clientSlug,
          range: toReportsRange(range),
          scope: toScopeFilter(scope),
        });
        const allowedCampaigns = reports.campaigns.filter((campaign) =>
          isCampaignAllowed(scope, campaign.campaignId)
        );
        const loaded = await Promise.all(
          allowedCampaigns.map((campaign) =>
            loadClientAgentCampaignDetail({
              slug: scope.clientSlug,
              campaignId: campaign.campaignId,
              range,
              scope: toScopeFilter(scope),
            })
          ),
        );

        return loaded.filter(isPresent);
      })();

  if (details.length === 0) {
    return noData();
  }

  const rows =
    breakdown === "creative"
      ? Array.from(
          details
            .reduce<
              Map<string, {
                Creative: string;
                spend: number;
                impressions: number;
                clicks: number;
                roasWeight: number;
                roasWeightedTotal: number;
              }>
            >((result, detail) => {
              for (const ad of detail.ads) {
                const current = result.get(ad.name) ?? {
                  Creative: ad.name,
                  spend: 0,
                  impressions: 0,
                  clicks: 0,
                  roasWeight: 0,
                  roasWeightedTotal: 0,
                };

                current.spend += ad.spend ?? 0;
                current.impressions += ad.impressions ?? 0;
                current.clicks += ad.clicks ?? 0;
                if (ad.roas != null) {
                  const weight = ad.spend && ad.spend > 0 ? ad.spend : 1;
                  current.roasWeight += weight;
                  current.roasWeightedTotal += ad.roas * weight;
                }

                result.set(ad.name, current);
              }

              return result;
            }, new Map())
            .values(),
        )
          .map((row) => ({
            Creative: row.Creative,
            Spend: formatCurrency(row.spend),
            CTR: formatDecimal(row.impressions > 0 ? (row.clicks / row.impressions) * 100 : null),
            ROAS: formatDecimal(row.roasWeight > 0 ? row.roasWeightedTotal / row.roasWeight : null),
            _sortValue: row.roasWeight > 0 ? row.roasWeightedTotal / row.roasWeight : row.spend,
          }))
      : breakdown === "placement"
        ? Array.from(
            details
              .reduce<
                Map<string, { Platform: string; Position: string; spend: number; impressions: number; clicks: number }>
              >((result, detail) => {
                for (const placement of detail.placements) {
                  const key = `${placement.platform}::${placement.position}`;
                  const current = result.get(key) ?? {
                    Platform: placement.platform,
                    Position: placement.position,
                    spend: 0,
                    impressions: 0,
                    clicks: 0,
                  };

                  current.spend += placement.spend ?? 0;
                  current.impressions += placement.impressions ?? 0;
                  current.clicks += placement.clicks ?? 0;
                  result.set(key, current);
                }

                return result;
              }, new Map())
              .values(),
          )
            .map((row) => ({
              Platform: row.Platform,
              Position: row.Position,
              Spend: formatCurrency(row.spend),
              CTR: formatDecimal(row.impressions > 0 ? (row.clicks / row.impressions) * 100 : null),
              _sortValue: row.impressions > 0 ? (row.clicks / row.impressions) * 100 : row.spend,
            }))
        : breakdown === "geography"
          ? Array.from(
              details
                .reduce<Map<string, { Market: string; spend: number; impressions: number; clicks: number }>>(
                  (result, detail) => {
                    for (const geography of detail.geography) {
                      const current = result.get(geography.market) ?? {
                        Market: geography.market,
                        spend: 0,
                        impressions: 0,
                        clicks: 0,
                      };

                      current.spend += geography.spend ?? 0;
                      current.impressions += geography.impressions ?? 0;
                      current.clicks += geography.clicks ?? 0;
                      result.set(geography.market, current);
                    }

                    return result;
                  },
                  new Map(),
                )
                .values(),
            )
              .map((row) => ({
                Market: row.Market,
                Spend: formatCurrency(row.spend),
                CTR: formatDecimal(row.impressions > 0 ? (row.clicks / row.impressions) * 100 : null),
                _sortValue: row.impressions > 0 ? (row.clicks / row.impressions) * 100 : row.spend,
              }))
          : Array.from(
              details
                .reduce<
                  Map<string, {
                    Age: string;
                    Gender: string;
                    spend: number;
                    impressions: number;
                    clicks: number;
                    roasWeight: number;
                    roasWeightedTotal: number;
                  }>
                >((result, detail) => {
                  for (const row of detail.ageGender) {
                    const key = `${row.age}::${row.gender}`;
                    const current = result.get(key) ?? {
                      Age: row.age,
                      Gender: row.gender,
                      spend: 0,
                      impressions: 0,
                      clicks: 0,
                      roasWeight: 0,
                      roasWeightedTotal: 0,
                    };

                    current.spend += row.spend ?? 0;
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
                Age: row.Age,
                Gender: row.Gender,
                Spend: formatCurrency(row.spend),
                CTR: formatDecimal(row.impressions > 0 ? (row.clicks / row.impressions) * 100 : null),
                ROAS: formatDecimal(row.roasWeight > 0 ? row.roasWeightedTotal / row.roasWeight : null),
                _sortValue: row.roasWeight > 0 ? row.roasWeightedTotal / row.roasWeight : row.spend,
              }));

  const sortedRows = [...rows].sort((left, right) =>
    sortDirection === "asc"
      ? (left._sortValue ?? 0) - (right._sortValue ?? 0)
      : (right._sortValue ?? 0) - (left._sortValue ?? 0),
  );
  const outputRows = sortedRows.map(({ _sortValue: _ignore, ...row }) => row);

  const columns = Object.keys(outputRows[0] ?? { Label: null });

  return ok(
    [table(columns, outputRows, "Breakdown")],
    uniqueEntities(
      details.map((detail) => buildCampaignReference(detail.campaign.campaignId, detail.campaign.name)),
    ),
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
