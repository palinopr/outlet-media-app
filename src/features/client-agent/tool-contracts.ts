import { z } from "zod";

import { ResolvedRangeSchema } from "./types";

export const DomainSchema = z.enum(["ads", "events"]);
export const EntityTypeSchema = z.enum(["campaign", "creative", "event"]);
export const AdsMetricSchema = z.enum([
  "spend",
  "revenue",
  "roas",
  "impressions",
  "clicks",
  "ctr",
  "cpc",
  "cpm",
]);
export const EventsMetricSchema = z.enum([
  "tickets_sold",
  "gross",
  "sell_through",
  "views",
  "conversion",
]);
export const CompareMetricSchema = z.union([AdsMetricSchema, EventsMetricSchema]);
export const IntervalSchema = z.enum(["day", "week", "month"]);

const adsOnlyMetrics = new Set<string>(AdsMetricSchema.options);
const eventsOnlyMetrics = new Set<string>(EventsMetricSchema.options);

export const SearchScopeRequestSchema = z.object({
  query: z.string().trim().min(1),
});

export const AdsOverviewRequestSchema = z.object({
  range: ResolvedRangeSchema,
  campaignIds: z.array(z.string().min(1)).nullable(),
  creativeIds: z.array(z.string().min(1)).nullable(),
});

export const EventsOverviewRequestSchema = z.object({
  range: ResolvedRangeSchema,
  eventIds: z.array(z.string().min(1)).nullable(),
});

export const CampaignDetailsRequestSchema = z.object({
  campaignIds: z.array(z.string().min(1)).min(1),
  range: ResolvedRangeSchema,
});

export const EventDetailsRequestSchema = z.object({
  eventIds: z.array(z.string().min(1)).min(1),
  range: ResolvedRangeSchema,
});

export const CreativeDetailsRequestSchema = z
  .object({
    creativeIds: z.array(z.string().min(1)).nullable(),
    query: z.string().trim().min(1).nullable().optional(),
    range: ResolvedRangeSchema,
  })
  .superRefine((value, ctx) => {
    if (value.creativeIds == null && value.query == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Creative details require either creativeIds or query.",
        path: ["creativeIds"],
      });
    }
  });

const OptionalCampaignEventAnchorsSchema = z.object({
  campaignIds: z.array(z.string().min(1)).nullable().optional(),
  eventIds: z.array(z.string().min(1)).nullable().optional(),
  range: ResolvedRangeSchema,
});

export const DemographicBreakdownRequestSchema = OptionalCampaignEventAnchorsSchema;
export const GeographyBreakdownRequestSchema = OptionalCampaignEventAnchorsSchema;
export const PlacementBreakdownRequestSchema = z.object({
  campaignIds: z.array(z.string().min(1)).nullable().optional(),
  range: ResolvedRangeSchema,
});

export const CompareEntitiesRequestSchema = z
  .object({
    entityType: EntityTypeSchema,
    entityIds: z.array(z.string().min(1)).min(1),
    metric: CompareMetricSchema,
    range: ResolvedRangeSchema,
  })
  .superRefine((value, ctx) => {
    if (
      (value.entityType === "campaign" || value.entityType === "creative") &&
      !adsOnlyMetrics.has(value.metric)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Campaign and creative comparisons only support ads metrics.",
        path: ["metric"],
      });
    }

    if (value.entityType === "event" && !eventsOnlyMetrics.has(value.metric)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Event comparisons only support event metrics.",
        path: ["metric"],
      });
    }
  });

export const TimeseriesRequestSchema = z
  .object({
    domain: DomainSchema,
    entityType: EntityTypeSchema,
    entityIds: z.array(z.string().min(1)).min(1),
    metric: z.union([AdsMetricSchema, EventsMetricSchema]),
    range: ResolvedRangeSchema,
    interval: IntervalSchema,
  })
  .superRefine((value, ctx) => {
    if (value.domain === "ads" && value.entityType === "event") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ads timeseries cannot target event entities.",
        path: ["entityType"],
      });
    }

    if (value.domain === "events" && value.entityType !== "event") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Events timeseries must target event entities.",
        path: ["entityType"],
      });
    }

    if (value.domain === "ads" && !adsOnlyMetrics.has(value.metric)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ads timeseries only supports ads metrics.",
        path: ["metric"],
      });
    }

    if (value.domain === "events" && !eventsOnlyMetrics.has(value.metric)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Event timeseries only supports event metrics.",
        path: ["metric"],
      });
    }
  });

const SearchMatchSchema = z.object({
  entityId: z.string().min(1),
  entityType: EntityTypeSchema,
  name: z.string().min(1),
  domain: DomainSchema,
  campaignId: z.string().min(1).optional(),
  campaignName: z.string().min(1).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  city: z.string().optional(),
  venue: z.string().optional(),
});

const AdsOverviewTotalsSchema = z.object({
  spendUsd: z.number(),
  revenueUsd: z.number(),
  roas: z.number().nullable(),
  impressions: z.number(),
  clicks: z.number(),
  ctr: z.number().nullable(),
  cpcUsd: z.number().nullable(),
  cpmUsd: z.number().nullable(),
});

const EventsOverviewTotalsSchema = z.object({
  ticketsSold: z.number(),
  grossUsd: z.number(),
  avgSellThroughPct: z.number().nullable(),
  views: z.number().nullable(),
  conversionPct: z.number().nullable(),
});

const CampaignMetricsSchema = z.object({
  spendUsd: z.number(),
  revenueUsd: z.number().nullable(),
  roas: z.number().nullable(),
  impressions: z.number().nullable(),
  clicks: z.number().nullable(),
  ctr: z.number().nullable(),
  cpcUsd: z.number().nullable().optional(),
  cpmUsd: z.number().nullable().optional(),
});

const EventMetricsSchema = z.object({
  ticketsSold: z.number(),
  grossUsd: z.number(),
  avgDailySales: z.number().nullable(),
  currentSellThroughPct: z.number().nullable(),
  currentConversionPct: z.number().nullable(),
  currentViews: z.number().nullable(),
});

const CreativeMetricsSchema = CampaignMetricsSchema;

const DemographicRowSchema = z.object({
  age: z.string().min(1),
  gender: z.string().min(1),
  spendUsd: z.number(),
  revenueUsd: z.number().nullable(),
  roas: z.number().nullable(),
  impressions: z.number().nullable(),
  clicks: z.number().nullable(),
  ctr: z.number().nullable(),
});

const GeographyRowSchema = z.object({
  market: z.string().min(1),
  marketType: z.string().min(1),
  spendUsd: z.number(),
  revenueUsd: z.number().nullable(),
  roas: z.number().nullable(),
  impressions: z.number().nullable(),
  clicks: z.number().nullable(),
  ctr: z.number().nullable(),
});

const PlacementRowSchema = z.object({
  platform: z.string().min(1),
  position: z.string().min(1),
  spendUsd: z.number(),
  revenueUsd: z.number().nullable(),
  roas: z.number().nullable(),
  impressions: z.number().nullable(),
  clicks: z.number().nullable(),
  ctr: z.number().nullable(),
});

const CompareRowSchema = z.object({
  entityId: z.string().min(1),
  entityType: EntityTypeSchema,
  name: z.string().min(1),
  metric: CompareMetricSchema,
  value: z.number().nullable(),
});

const TimeseriesPointSchema = z.object({
  x: z.string().min(1),
  y: z.number().nullable(),
});

export const SearchScopeResponseSchema = z.object({
  matches: z.array(SearchMatchSchema),
});

export const AdsOverviewResponseSchema = z.object({
  totals: AdsOverviewTotalsSchema,
});

export const EventsOverviewResponseSchema = z.object({
  totals: EventsOverviewTotalsSchema,
});

export const CampaignDetailsResponseSchema = z.object({
  campaigns: z.array(
    z.object({
      campaignId: z.string().min(1),
      name: z.string().min(1),
      metrics: CampaignMetricsSchema,
    }),
  ),
});

export const EventDetailsResponseSchema = z.object({
  events: z.array(
    z.object({
      eventId: z.string().min(1),
      name: z.string().min(1),
      metrics: EventMetricsSchema,
    }),
  ),
});

export const CreativeDetailsResponseSchema = z.object({
  creatives: z.array(
    z.object({
      creativeId: z.string().min(1),
      name: z.string().min(1),
      campaignId: z.string().min(1),
      campaignName: z.string().min(1),
      metrics: CreativeMetricsSchema,
    }),
  ),
});

export const DemographicBreakdownResponseSchema = z.object({
  rows: z.array(DemographicRowSchema),
});

export const GeographyBreakdownResponseSchema = z.object({
  rows: z.array(GeographyRowSchema),
});

export const PlacementBreakdownResponseSchema = z.object({
  rows: z.array(PlacementRowSchema),
});

export const CompareEntitiesResponseSchema = z.object({
  rows: z.array(CompareRowSchema),
});

export const TimeseriesResponseSchema = z.object({
  series: z.array(TimeseriesPointSchema),
});

export type SearchScopeRequest = z.infer<typeof SearchScopeRequestSchema>;
export type AdsOverviewRequest = z.infer<typeof AdsOverviewRequestSchema>;
export type EventsOverviewRequest = z.infer<typeof EventsOverviewRequestSchema>;
export type CampaignDetailsRequest = z.infer<typeof CampaignDetailsRequestSchema>;
export type EventDetailsRequest = z.infer<typeof EventDetailsRequestSchema>;
export type CreativeDetailsRequest = z.infer<typeof CreativeDetailsRequestSchema>;
export type DemographicBreakdownRequest = z.infer<typeof DemographicBreakdownRequestSchema>;
export type GeographyBreakdownRequest = z.infer<typeof GeographyBreakdownRequestSchema>;
export type PlacementBreakdownRequest = z.infer<typeof PlacementBreakdownRequestSchema>;
export type CompareEntitiesRequest = z.infer<typeof CompareEntitiesRequestSchema>;
export type TimeseriesRequest = z.infer<typeof TimeseriesRequestSchema>;

export type SearchScopeResponse = z.infer<typeof SearchScopeResponseSchema>;
export type AdsOverviewResponse = z.infer<typeof AdsOverviewResponseSchema>;
export type EventsOverviewResponse = z.infer<typeof EventsOverviewResponseSchema>;
export type CampaignDetailsResponse = z.infer<typeof CampaignDetailsResponseSchema>;
export type EventDetailsResponse = z.infer<typeof EventDetailsResponseSchema>;
export type CreativeDetailsResponse = z.infer<typeof CreativeDetailsResponseSchema>;
export type DemographicBreakdownResponse = z.infer<typeof DemographicBreakdownResponseSchema>;
export type GeographyBreakdownResponse = z.infer<typeof GeographyBreakdownResponseSchema>;
export type PlacementBreakdownResponse = z.infer<typeof PlacementBreakdownResponseSchema>;
export type CompareEntitiesResponse = z.infer<typeof CompareEntitiesResponseSchema>;
export type TimeseriesResponse = z.infer<typeof TimeseriesResponseSchema>;
