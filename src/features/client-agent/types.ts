import { z } from "zod";

export const AgentResponseStatusSchema = z.enum(["answer", "clarify", "refuse", "error"]);
export type AgentResponseStatus = z.infer<typeof AgentResponseStatusSchema>;

const CampaignReferencedEntitySchema = z.object({
  entityId: z.string().min(1),
  entityType: z.literal("campaign"),
  name: z.string().min(1),
});

const EventReferencedEntitySchema = z.object({
  entityId: z.string().min(1),
  entityType: z.literal("event"),
  name: z.string().min(1),
});

const CreativeReferencedEntitySchema = z.object({
  entityId: z.string().min(1),
  entityType: z.literal("creative"),
  name: z.string().min(1),
  campaignId: z.string().min(1),
});

export const ReferencedEntitySchema = z.discriminatedUnion("entityType", [
  CampaignReferencedEntitySchema,
  EventReferencedEntitySchema,
  CreativeReferencedEntitySchema,
]);
export type ReferencedEntity = z.infer<typeof ReferencedEntitySchema>;

export const ResolvedRangePresetSchema = z.enum([
  "today",
  "yesterday",
  "last_7_days",
  "last_30_days",
  "lifetime",
  "this_week",
  "this_month",
  "this_quarter",
  "custom",
]);

export const ResolvedRangeSchema = z.object({
  preset: ResolvedRangePresetSchema,
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timezone: z.string().min(1),
});
export type ResolvedRange = z.infer<typeof ResolvedRangeSchema>;

export const ClientAgentScopeSchema = z.object({
  clientId: z.string().min(1),
  clientMemberId: z.string().min(1),
  clientSlug: z.string().min(1),
  allowedCampaignIds: z.array(z.string().min(1)).nullable(),
  allowedEventIds: z.array(z.string().min(1)).nullable(),
  eventsEnabled: z.boolean(),
  viewer: z.enum(["member", "admin_preview"]),
});
export type ClientAgentScope = z.infer<typeof ClientAgentScopeSchema>;

const AgentHistoryContextPayloadSchema = z.object({
  primaryDomain: z.enum(["ads", "events", "mixed"]),
  referencedEntities: z.array(ReferencedEntitySchema),
  resolvedRange: ResolvedRangeSchema.nullable(),
  comparisonSet: z.array(z.string().min(1)),
  pronounTargets: z.array(z.string().min(1)),
});

export const AgentHistoryMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  text: z.string(),
  referencedEntities: z.array(ReferencedEntitySchema).optional(),
  contextPayload: AgentHistoryContextPayloadSchema.nullable().optional(),
  resolvedRange: ResolvedRangeSchema.nullable().optional(),
});
export type AgentHistoryMessage = z.infer<typeof AgentHistoryMessageSchema>;

export const PlannerEntityMatchSchema = z.discriminatedUnion("entityType", [
  CampaignReferencedEntitySchema.extend({
    timezone: z.string().min(1).optional(),
  }),
  EventReferencedEntitySchema.extend({
    timezone: z.string().min(1).optional(),
  }),
  CreativeReferencedEntitySchema.extend({
    timezone: z.string().min(1).optional(),
  }),
]);
export type PlannerEntityMatch = z.infer<typeof PlannerEntityMatchSchema>;

const MetricCardSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  change: z.string().min(1).optional(),
  trend: z.enum(["up", "down", "flat"]).optional(),
});

export const MetricCardsBlockSchema = z.object({
  type: z.literal("metric_cards"),
  cards: z.array(MetricCardSchema).max(6),
  title: z.string().min(1).optional(),
});

const TableCellSchema = z.union([z.string(), z.number(), z.null()]);

export const TableBlockSchema = z
  .object({
    type: z.literal("table"),
    columns: z.array(z.string().min(1)).min(1),
    rows: z.array(z.record(z.string(), TableCellSchema)).max(12),
    title: z.string().min(1).optional(),
  })
  .superRefine((value, ctx) => {
    const sortedColumns = [...value.columns].sort();

    value.rows.forEach((row, index) => {
      const sortedKeys = Object.keys(row).sort();

      if (
        sortedKeys.length !== sortedColumns.length ||
        sortedKeys.some((key, keyIndex) => key !== sortedColumns[keyIndex])
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Table rows must match the declared columns exactly.",
          path: ["rows", index],
        });
      }
    });
  });

const ChartPointSchema = z.object({
  x: z.string().min(1),
  y: z.number().nullable(),
});

const ChartSeriesSchema = z.object({
  name: z.string().min(1),
  points: z.array(ChartPointSchema).max(31),
});

export const ChartBlockSchema = z.object({
  type: z.literal("chart"),
  xKey: z.string().min(1),
  title: z.string().min(1).optional(),
  series: z.array(ChartSeriesSchema).min(1),
});

export const AgentAnswerBlockSchema = z.discriminatedUnion("type", [
  MetricCardsBlockSchema,
  TableBlockSchema,
  ChartBlockSchema,
]);
export type AgentAnswerBlock = z.infer<typeof AgentAnswerBlockSchema>;
