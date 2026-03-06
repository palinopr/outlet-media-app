import { describe, expect, it } from "vitest";
import { buildEventOperationsSummary } from "@/features/events/summary";

describe("event operations summary", () => {
  it("ranks events with the most workflow pressure", () => {
    const summary = buildEventOperationsSummary({
      comments: [
        {
          clientSlug: "zamora",
          createdAt: "2026-03-06T09:00:00.000Z",
          eventId: "evt_1",
        },
      ],
      events: [
        {
          clientSlug: "zamora",
          date: "2026-04-01",
          eventId: "evt_1",
          name: "Aventura",
          status: "onsale",
          venue: "Miami Arena",
        },
        {
          clientSlug: "zamora",
          date: "2026-04-12",
          eventId: "evt_2",
          name: "Camila",
          status: "onsale",
          venue: "Houston Center",
        },
      ],
      followUps: [
        {
          clientSlug: "zamora",
          eventId: "evt_1",
          priority: "urgent",
          updatedAt: "2026-03-06T10:00:00.000Z",
        },
        {
          clientSlug: "zamora",
          eventId: "evt_2",
          priority: "medium",
          updatedAt: "2026-03-06T08:00:00.000Z",
        },
      ],
      limit: 5,
      updates: [
        {
          clientSlug: "zamora",
          createdAt: "2026-03-06T11:00:00.000Z",
          eventId: "evt_1",
        },
      ],
    });

    expect(summary.metrics).toEqual([
      expect.objectContaining({ key: "open_follow_ups", value: 2 }),
      expect.objectContaining({ key: "urgent_follow_ups", value: 1 }),
      expect.objectContaining({ key: "open_discussions", value: 1 }),
      expect.objectContaining({ key: "recent_updates", value: 1 }),
    ]);

    expect(summary.attentionEvents[0]).toEqual(
      expect.objectContaining({
        eventId: "evt_1",
        openDiscussions: 1,
        openFollowUps: 1,
        recentUpdates: 1,
        urgentFollowUps: 1,
      }),
    );
    expect(summary.eventsNeedingAttention).toBe(2);
  });
});
