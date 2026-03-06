import { describe, expect, it } from "vitest";
import { filterSystemEventsByScope, type SystemEvent } from "@/features/system-events/server";

function makeEvent(overrides: Partial<SystemEvent>): SystemEvent {
  return {
    id: "event-1",
    createdAt: "2026-03-06T00:00:00.000Z",
    eventName: "campaign_updated",
    visibility: "shared",
    actorType: "user",
    actorId: "user_1",
    actorName: "Outlet",
    clientSlug: "zamora",
    summary: "Updated campaign pacing",
    detail: null,
    entityType: "campaign",
    entityId: "cmp_1",
    pageId: null,
    taskId: null,
    metadata: {},
    ...overrides,
  };
}

describe("filterSystemEventsByScope", () => {
  it("keeps events that match allowed campaign or event ids", () => {
    const filtered = filterSystemEventsByScope(
      [
        makeEvent({ entityId: "cmp_allowed" }),
        makeEvent({
          entityId: "asset_allowed",
          entityType: "asset",
        }),
        makeEvent({
          entityId: "comment_1",
          entityType: "event_comment",
          metadata: { eventId: "evt_allowed" },
        }),
        makeEvent({ entityId: "cmp_blocked" }),
      ],
      {
        allowedCampaignIds: ["cmp_allowed"],
        allowedEventIds: ["evt_allowed"],
        allowedAssetIds: ["asset_allowed"],
      },
    );

    expect(filtered.map((event) => event.entityId)).toEqual([
      "cmp_allowed",
      "asset_allowed",
      "comment_1",
    ]);
  });

  it("preserves unscoped shared events when no campaign or event context exists", () => {
    const filtered = filterSystemEventsByScope(
      [
        makeEvent({
          entityId: "workspace_1",
          entityType: "workspace_page",
          eventName: "workspace_page_updated",
          metadata: {},
        }),
      ],
      {
        allowedCampaignIds: ["cmp_allowed"],
        allowedEventIds: [],
      },
    );

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.entityType).toBe("workspace_page");
  });

  it("blocks scoped asset and campaign events when the assigned scope is empty", () => {
    const filtered = filterSystemEventsByScope(
      [
        makeEvent({ entityId: "cmp_blocked" }),
        makeEvent({ entityId: "asset_blocked", entityType: "asset" }),
        makeEvent({
          entityId: "page_1",
          entityType: "workspace_page",
          eventName: "workspace_page_updated",
          metadata: {},
        }),
      ],
      {
        allowedCampaignIds: [],
        allowedEventIds: [],
        allowedAssetIds: [],
      },
    );

    expect(filtered.map((event) => event.entityId)).toEqual(["page_1"]);
  });
});
