import { z } from "zod";

import { resolveRangeFromMessage } from "./range";
import {
  AnswerPlanSchema,
  type PlannerResult,
  ClarifyPlanSchema,
  type ReferencedEntity,
  RefusePlanSchema,
  AgentHistoryMessageSchema,
  PlannerEntityMatchSchema,
  ReferencedEntitySchema,
} from "./types";

const PlanQuestionInputSchema = z.object({
  message: z.string().trim().min(1),
  timezone: z.string().min(1),
  now: z.date().optional(),
  eventsEnabled: z.boolean(),
  history: z.array(AgentHistoryMessageSchema),
  resolvedEntities: z.array(PlannerEntityMatchSchema),
  ambiguousEntities: z.array(ReferencedEntitySchema),
});

type PlanQuestionInput = z.infer<typeof PlanQuestionInputSchema>;

function buildFollowUpMessages(history: PlanQuestionInput["history"]) {
  return history.slice(-6);
}

function stripEntityTimezone(
  entities: PlanQuestionInput["resolvedEntities"],
): ReferencedEntity[] {
  return entities.map(({ entityId, entityType, name }) => ({
    entityId,
    entityType,
    name,
  }));
}

function isInternalQuestion(message: string) {
  const lowerMessage = message.toLowerCase();

  return (
    /\binternal(?:ly)?\b/.test(lowerMessage) ||
    /\bsource\b/.test(lowerMessage) ||
    /\bsetup\b/.test(lowerMessage) ||
    /\bset up\b/.test(lowerMessage) ||
    lowerMessage.includes("behind the scenes")
  );
}

function isComparisonQuestion(message: string) {
  return /\b(compare|comparison|versus|vs\.?|against)\b/i.test(message);
}

function isShowInventoryQuestion(message: string) {
  return /\bhow many shows\b|\bhow many events\b/.test(message.toLowerCase());
}

function isLastShowQuestion(message: string) {
  return /\blast show\b|\bmost recent show\b|\blast event\b/.test(message.toLowerCase());
}

function isBroadEventQuestion(message: string) {
  const lowerMessage = message.toLowerCase();

  if (/\bshow me\b/.test(lowerMessage)) {
    return false;
  }

  return (
    /\bevents?\b/.test(lowerMessage) ||
    /\bshows?\b/.test(lowerMessage) ||
    isShowInventoryQuestion(lowerMessage) ||
    isLastShowQuestion(lowerMessage)
  );
}

function selectRangeTimezone(input: PlanQuestionInput) {
  const eventTimezones = input.resolvedEntities
    .filter((entity) => entity.entityType === "event" && entity.timezone)
    .map((entity) => entity.timezone as string);

  if (eventTimezones.length > 0) {
    const uniqueTimezones = new Set(eventTimezones);

    if (uniqueTimezones.size === 1) {
      return eventTimezones[0];
    }
  }

  return input.timezone;
}

export function planQuestion(input: PlanQuestionInput): PlannerResult {
  const parsed = PlanQuestionInputSchema.parse(input);
  const followUpMessages = buildFollowUpMessages(parsed.history);
  const referencedEntities = stripEntityTimezone(parsed.resolvedEntities);
  const mentionsEventEntity =
    parsed.resolvedEntities.some((entity) => entity.entityType === "event") ||
    parsed.ambiguousEntities.some((entity) => entity.entityType === "event");

  if (isInternalQuestion(parsed.message)) {
    return RefusePlanSchema.parse({
      disposition: "refuse",
      reason: "internal_question",
      message: "I can only answer client-safe campaign and event questions.",
      followUpMessages,
      referencedEntities: [],
      resolvedRange: null,
    });
  }

  if (!parsed.eventsEnabled && (mentionsEventEntity || isBroadEventQuestion(parsed.message))) {
    return RefusePlanSchema.parse({
      disposition: "refuse",
      reason: "events_disabled",
      message: "This portal does not have event access enabled.",
      followUpMessages,
      referencedEntities: [],
      resolvedRange: null,
    });
  }

  if (parsed.ambiguousEntities.length > 0) {
    return ClarifyPlanSchema.parse({
      disposition: "clarify",
      reason: "ambiguous_entity",
      message: "Please clarify which campaign or event you mean.",
      followUpMessages,
      referencedEntities: [],
      resolvedRange: null,
    });
  }

  const entityTypes = new Set(parsed.resolvedEntities.map((entity) => entity.entityType));

  if (
    isComparisonQuestion(parsed.message) &&
    entityTypes.has("campaign") &&
    entityTypes.has("event")
  ) {
    return ClarifyPlanSchema.parse({
      disposition: "clarify",
      reason: "mixed_entity_types",
      message: "Please compare campaigns with campaigns or events with events.",
      followUpMessages,
      referencedEntities,
      resolvedRange: null,
    });
  }

  return AnswerPlanSchema.parse({
    disposition: "answer",
    message: parsed.message.trim(),
    followUpMessages,
    referencedEntities,
    resolvedRange: resolveRangeFromMessage(parsed.message, {
      now: parsed.now,
      timezone: selectRangeTimezone(parsed),
    }),
  });
}
