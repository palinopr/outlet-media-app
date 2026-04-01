import { describe, expect, it } from "vitest";

import {
  AnswerPlanSchema,
  ChartBlockSchema,
  ClarifyPlanSchema,
  ClientAgentScopeSchema,
  MetricCardsBlockSchema,
  RefusePlanSchema,
  TableBlockSchema,
} from "./types";
import { planQuestion } from "./planner";

describe("client agent planner contracts", () => {
  it("exports the scope, block, and planner schemas", () => {
    expect(
      ClientAgentScopeSchema.parse({
        clientId: "client_1",
        clientMemberId: "member_1",
        clientSlug: "acme",
        allowedCampaignIds: ["cmp_1"],
        allowedEventIds: ["evt_1"],
        eventsEnabled: true,
        viewer: "member",
      }),
    ).toMatchObject({ clientId: "client_1" });

    expect(
      MetricCardsBlockSchema.parse({
        type: "metric_cards",
        cards: [{ label: "Spend", value: "$1,250" }],
        title: "Top metrics",
      }),
    ).toMatchObject({ type: "metric_cards" });

    expect(
      TableBlockSchema.parse({
        type: "table",
        columns: ["Campaign", "Spend"],
        rows: [{ Campaign: "Spring Tour", Spend: "$400" }],
        title: "Campaign spend",
      }),
    ).toMatchObject({ type: "table" });

    expect(
      ChartBlockSchema.parse({
        type: "chart",
        xKey: "date",
        series: [
          {
            name: "Revenue",
            points: [{ x: "2026-03-31", y: 1200 }],
          },
        ],
      }),
    ).toMatchObject({ type: "chart" });

    expect(
      AnswerPlanSchema.parse({
        disposition: "answer",
        message: "How did Spring Tour do today?",
        followUpMessages: [],
        referencedEntities: [
          {
            entityId: "cmp_1",
            entityType: "campaign",
            name: "Spring Tour",
          },
        ],
        resolvedRange: {
          preset: "today",
          startDate: "2026-03-31",
          endDate: "2026-03-31",
          timezone: "America/Chicago",
        },
      }),
    ).toMatchObject({ disposition: "answer" });

    expect(
      ClarifyPlanSchema.parse({
        disposition: "clarify",
        reason: "ambiguous_entity",
        message: "Please clarify which entity you mean.",
        followUpMessages: [],
        referencedEntities: [],
        resolvedRange: null,
      }),
    ).toMatchObject({ disposition: "clarify" });

    expect(
      RefusePlanSchema.parse({
        disposition: "refuse",
        reason: "internal_question",
        message: "I can only answer client-safe campaign and event questions.",
        followUpMessages: [],
        referencedEntities: [],
        resolvedRange: null,
      }),
    ).toMatchObject({ disposition: "refuse" });
  });
});

describe("planQuestion", () => {
  it("uses the single event timezone when resolving a range", () => {
    const result = planQuestion({
      message: "How did Tokyo Dome do today?",
      timezone: "America/Chicago",
      now: new Date("2026-03-31T18:30:00.000Z"),
      eventsEnabled: true,
      history: [],
      resolvedEntities: [
        {
          entityId: "evt_tokyo_dome",
          entityType: "event",
          name: "Tokyo Dome",
          timezone: "Asia/Tokyo",
        },
      ],
      ambiguousEntities: [],
    });

    expect(result).toMatchObject({
      disposition: "answer",
      resolvedRange: {
        preset: "today",
        startDate: "2026-04-01",
        endDate: "2026-04-01",
        timezone: "Asia/Tokyo",
      },
    });
  });

  it("uses a shared event timezone when multiple events resolve to the same timezone", () => {
    const result = planQuestion({
      message: "Compare Tokyo Dome and Osaka Hall today",
      timezone: "America/Chicago",
      now: new Date("2026-03-31T18:30:00.000Z"),
      eventsEnabled: true,
      history: [],
      resolvedEntities: [
        {
          entityId: "evt_tokyo_dome",
          entityType: "event",
          name: "Tokyo Dome",
          timezone: "Asia/Tokyo",
        },
        {
          entityId: "evt_osaka_hall",
          entityType: "event",
          name: "Osaka Hall",
          timezone: "Asia/Tokyo",
        },
      ],
      ambiguousEntities: [],
    });

    expect(result).toMatchObject({
      disposition: "answer",
      resolvedRange: {
        preset: "today",
        startDate: "2026-04-01",
        endDate: "2026-04-01",
        timezone: "Asia/Tokyo",
      },
    });
  });

  it("returns clarify for ambiguous entity matches", () => {
    const result = planQuestion({
      message: "How is Spring Launch doing?",
      timezone: "America/Chicago",
      eventsEnabled: true,
      history: [],
      resolvedEntities: [],
      ambiguousEntities: [
        {
          entityId: "cmp_1",
          entityType: "campaign",
          name: "Spring Launch East",
        },
        {
          entityId: "cmp_2",
          entityType: "campaign",
          name: "Spring Launch West",
        },
      ],
    });

    expect(result).toMatchObject({
      disposition: "clarify",
      reason: "ambiguous_entity",
    });
  });

  it.each([
    "How are you doing this internally?",
    "What source are you pulling this from?",
    "How is the client agent set up behind the scenes?",
  ])("refuses internal or source questions: %s", (message) => {
    const result = planQuestion({
      message,
      timezone: "America/Chicago",
      eventsEnabled: true,
      history: [],
      resolvedEntities: [],
      ambiguousEntities: [],
    });

    expect(result).toMatchObject({
      disposition: "refuse",
      reason: "internal_question",
    });
  });

  it("rejects empty or whitespace-only messages", () => {
    expect(() =>
      planQuestion({
        message: "   ",
        timezone: "America/Chicago",
        eventsEnabled: true,
        history: [],
        resolvedEntities: [],
        ambiguousEntities: [],
      }),
    ).toThrow();
  });

  it("returns clarify for mixed campaign and event comparison questions", () => {
    const result = planQuestion({
      message: "Compare Spring Tour against Tokyo Dome",
      timezone: "America/Chicago",
      eventsEnabled: true,
      history: [],
      resolvedEntities: [
        {
          entityId: "cmp_1",
          entityType: "campaign",
          name: "Spring Tour",
        },
        {
          entityId: "evt_1",
          entityType: "event",
          name: "Tokyo Dome",
          timezone: "Asia/Tokyo",
        },
      ],
      ambiguousEntities: [],
    });

    expect(result).toMatchObject({
      disposition: "clarify",
      reason: "mixed_entity_types",
    });
  });

  it("refuses event questions when events are disabled", () => {
    const result = planQuestion({
      message: "How did Tokyo Dome do yesterday?",
      timezone: "America/Chicago",
      eventsEnabled: false,
      history: [],
      resolvedEntities: [
        {
          entityId: "evt_1",
          entityType: "event",
          name: "Tokyo Dome",
          timezone: "Asia/Tokyo",
        },
      ],
      ambiguousEntities: [],
    });

    expect(result).toMatchObject({
      disposition: "refuse",
      reason: "events_disabled",
    });
  });

  it("refuses broad event questions when events are disabled", () => {
    const result = planQuestion({
      message: "How are events doing today?",
      timezone: "America/Chicago",
      eventsEnabled: false,
      history: [],
      resolvedEntities: [],
      ambiguousEntities: [],
    });

    expect(result).toMatchObject({
      disposition: "refuse",
      reason: "events_disabled",
    });
  });

  it("does not misclassify 'show me' prompts as event questions when events are disabled", () => {
    const result = planQuestion({
      message: "Show me Spring Tour today",
      timezone: "America/Chicago",
      eventsEnabled: false,
      history: [],
      resolvedEntities: [
        {
          entityId: "cmp_1",
          entityType: "campaign",
          name: "Spring Tour",
        },
      ],
      ambiguousEntities: [],
    });

    expect(result).toMatchObject({
      disposition: "answer",
      referencedEntities: [
        {
          entityId: "cmp_1",
          entityType: "campaign",
          name: "Spring Tour",
        },
      ],
    });
  });

  it("refuses ambiguous event questions when events are disabled", () => {
    const result = planQuestion({
      message: "How is the Miami event trending?",
      timezone: "America/Chicago",
      eventsEnabled: false,
      history: [],
      resolvedEntities: [],
      ambiguousEntities: [
        {
          entityId: "evt_1",
          entityType: "event",
          name: "Miami Arena Night",
        },
        {
          entityId: "evt_2",
          entityType: "event",
          name: "Miami Beach Festival",
        },
      ],
    });

    expect(result).toMatchObject({
      disposition: "refuse",
      reason: "events_disabled",
    });
  });

  it("rejects table blocks whose row keys do not match the declared columns", () => {
    expect(() =>
      TableBlockSchema.parse({
        type: "table",
        columns: ["Campaign", "Spend"],
        rows: [{ Campaign: "Spring Tour", Revenue: "$400" }],
      }),
    ).toThrow(/declared columns/i);
  });

  it("uses only the six most recent messages for follow-up context", () => {
    const result = planQuestion({
      message: "How is Spring Tour doing this month?",
      timezone: "America/Chicago",
      eventsEnabled: true,
      history: [
        { role: "user", text: "message 1" },
        { role: "assistant", text: "message 2" },
        { role: "user", text: "message 3" },
        { role: "assistant", text: "message 4" },
        { role: "user", text: "message 5" },
        { role: "assistant", text: "message 6" },
        { role: "user", text: "message 7" },
        { role: "assistant", text: "message 8" },
      ],
      resolvedEntities: [
        {
          entityId: "cmp_1",
          entityType: "campaign",
          name: "Spring Tour",
        },
      ],
      ambiguousEntities: [],
    });

    expect(result.disposition).toBe("answer");
    expect(result.followUpMessages).toHaveLength(6);
    expect(result.followUpMessages.map((entry) => entry.text)).toEqual([
      "message 3",
      "message 4",
      "message 5",
      "message 6",
      "message 7",
      "message 8",
    ]);
  });

  it("defaults to the last 30 days when no timeframe is provided", () => {
    const result = planQuestion({
      message: "Show spend by date for Spring Tour",
      timezone: "America/Chicago",
      now: new Date("2026-03-31T15:00:00.000Z"),
      eventsEnabled: true,
      history: [],
      resolvedEntities: [
        {
          entityId: "cmp_1",
          entityType: "campaign",
          name: "Spring Tour",
        },
      ],
      ambiguousEntities: [],
    });

    expect(result).toMatchObject({
      disposition: "answer",
      referencedEntities: [
        {
          entityId: "cmp_1",
          entityType: "campaign",
          name: "Spring Tour",
        },
      ],
      resolvedRange: {
        preset: "last_30_days",
        startDate: "2026-03-02",
        endDate: "2026-03-31",
        timezone: "America/Chicago",
      },
    });
  });

  it("treats 'how many shows we have' as a broad event question", () => {
    const result = planQuestion({
      message: "how many shows we have",
      timezone: "America/Chicago",
      now: new Date("2026-03-31T15:00:00.000Z"),
      eventsEnabled: true,
      history: [],
      resolvedEntities: [],
      ambiguousEntities: [],
    });

    expect(result).toMatchObject({
      disposition: "answer",
      resolvedRange: {
        preset: "last_30_days",
        startDate: "2026-03-02",
        endDate: "2026-03-31",
        timezone: "America/Chicago",
      },
    });
  });

  it("does not treat 'show me spend by date' as an event question", () => {
    const result = planQuestion({
      message: "show me spend by date for Camila",
      timezone: "America/Chicago",
      now: new Date("2026-03-31T15:00:00.000Z"),
      eventsEnabled: true,
      history: [],
      resolvedEntities: [],
      ambiguousEntities: [],
    });

    expect(result).toMatchObject({
      disposition: "answer",
      resolvedRange: {
        preset: "last_30_days",
        startDate: "2026-03-02",
        endDate: "2026-03-31",
        timezone: "America/Chicago",
      },
    });
  });

  it("marks 'last show' questions as event-intent questions", () => {
    const result = planQuestion({
      message: "how we did last show",
      timezone: "America/Chicago",
      now: new Date("2026-03-31T15:00:00.000Z"),
      eventsEnabled: true,
      history: [],
      resolvedEntities: [],
      ambiguousEntities: [],
    });

    expect(result).toMatchObject({
      disposition: "answer",
      resolvedRange: {
        preset: "last_30_days",
        startDate: "2026-03-02",
        endDate: "2026-03-31",
        timezone: "America/Chicago",
      },
    });
  });

  it("refuses broad show questions when events are disabled", () => {
    const result = planQuestion({
      message: "how many shows we have",
      timezone: "America/Chicago",
      eventsEnabled: false,
      history: [],
      resolvedEntities: [],
      ambiguousEntities: [],
    });

    expect(result).toMatchObject({
      disposition: "refuse",
      reason: "events_disabled",
    });
  });

  it("refuses last-show questions when events are disabled", () => {
    const result = planQuestion({
      message: "how we did last show",
      timezone: "America/Chicago",
      eventsEnabled: false,
      history: [],
      resolvedEntities: [],
      ambiguousEntities: [],
    });

    expect(result).toMatchObject({
      disposition: "refuse",
      reason: "events_disabled",
    });
  });
});
