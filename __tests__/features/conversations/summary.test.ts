import { describe, expect, it } from "vitest";
import { buildConversationsSummary } from "@/features/conversations/summary";
import { matchesConversationKinds } from "@/features/conversations/server";

describe("buildConversationsSummary", () => {
  it("counts open threads across campaign, CRM, asset, and event surfaces", () => {
    const summary = buildConversationsSummary([
      {
        authorName: "Jamie",
        clientSlug: "zamora",
        content: "Can we update the launch copy?",
        createdAt: "2026-03-06T09:00:00.000Z",
        id: "thread_1",
        kind: "campaign",
        targetId: "cmp_1",
        targetName: "Arjona launch",
      },
      {
        authorName: "Carla",
        clientSlug: "zamora",
        content: "Need the approved poster variant here.",
        createdAt: "2026-03-06T08:00:00.000Z",
        id: "thread_2",
        kind: "asset",
        targetId: "asset_1",
        targetName: "Poster v3",
      },
      {
        authorName: "Support",
        clientSlug: "zamora",
        content: "Follow up on ticket bundle question.",
        createdAt: "2026-03-05T10:00:00.000Z",
        id: "thread_3",
        kind: "crm",
        targetId: "contact_1",
        targetName: "Maria Gomez",
      },
      {
        authorName: "Outlet",
        clientSlug: "zamora",
        content: "Venue still needs final promo timing.",
        createdAt: "2026-03-05T12:00:00.000Z",
        id: "thread_4",
        kind: "event",
        targetId: "event_1",
        targetName: "Miami Arena",
      },
    ]);

    expect(summary.totalThreads).toBe(4);
    expect(summary.metrics).toEqual([
      expect.objectContaining({ key: "open_threads", value: 4 }),
      expect.objectContaining({ key: "campaign_threads", value: 1 }),
      expect.objectContaining({ key: "crm_threads", value: 1 }),
      expect.objectContaining({ key: "asset_threads", value: 1 }),
      expect.objectContaining({ key: "event_threads", value: 1 }),
    ]);
  });
});

describe("matchesConversationKinds", () => {
  it("keeps only requested conversation surfaces", () => {
    expect(matchesConversationKinds({ kind: "asset" }, ["asset"])).toBe(true);
    expect(matchesConversationKinds({ kind: "campaign" }, ["asset"])).toBe(false);
    expect(matchesConversationKinds({ kind: "event" }, ["asset", "event"])).toBe(true);
  });
});
