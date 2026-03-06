import { describe, expect, it } from "vitest";
import type { AgentOutcomeRequestRecord } from "@/features/agent-outcomes/summary";
import { matchesContext } from "@/features/agent-outcomes/server";

function request(metadata: Record<string, unknown>): AgentOutcomeRequestRecord {
  return {
    clientSlug: "zamora",
    createdAt: "2026-03-06T12:00:00.000Z",
    detail: null,
    metadata,
    summary: "Queued agent action",
    taskId: "task_123",
    visibility: "shared",
  };
}

describe("matchesContext", () => {
  it("keeps event-linked outcomes visible for scoped event members", () => {
    const result = matchesContext(
      request({
        eventId: "event_123",
        eventName: "Miami Arena",
      }),
      null,
      null,
      "all",
      null,
      null,
      new Set<string>(),
      new Set(["event_123"]),
    );

    expect(result).toBe(true);
  });

  it("allows event detail pages to show outcomes linked through either the event or a scoped campaign", () => {
    const eventScoped = matchesContext(
      request({
        eventId: "event_123",
      }),
      null,
      null,
      "all",
      null,
      "event_123",
      new Set<string>(),
      new Set(["event_123"]),
    );

    const campaignScoped = matchesContext(
      request({
        campaignId: "cmp_123",
        eventId: "event_123",
      }),
      null,
      null,
      "all",
      null,
      "event_123",
      new Set(["cmp_123"]),
      new Set<string>(),
    );

    expect(eventScoped).toBe(true);
    expect(campaignScoped).toBe(true);
  });

  it("filters unrelated outcomes when neither the campaign nor event scope matches", () => {
    const result = matchesContext(
      request({
        campaignId: "cmp_999",
        eventId: "event_999",
      }),
      null,
      null,
      "all",
      null,
      "event_123",
      new Set(["cmp_123"]),
      new Set(["event_123"]),
    );

    expect(result).toBe(false);
  });

  it("keeps only asset-linked outcomes when the asset context is requested", () => {
    const assetScoped = matchesContext(
      request({
        assetId: "asset_123",
        assetName: "Poster v3",
      }),
      null,
      null,
      "asset",
      null,
      null,
      null,
      null,
    );

    const campaignOnly = matchesContext(
      request({
        campaignId: "cmp_123",
      }),
      null,
      null,
      "asset",
      null,
      null,
      null,
      null,
    );

    expect(assetScoped).toBe(true);
    expect(campaignOnly).toBe(false);
  });
});
