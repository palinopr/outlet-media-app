import { describe, it, expect, vi, beforeEach } from "vitest";

const mockEventRows = [
  {
    id: "evt-1",
    client_slug: "zamora",
    name: "Concert Test",
    artist: "Aventura",
    date: "2026-05-01",
    venue: "Arena Miami",
    status: "onsale",
  },
];

const mockFollowUpRows = [
  {
    event_id: "evt-1",
    client_slug: "zamora",
    priority: "urgent",
    updated_at: "2026-04-01T10:00:00Z",
    status: "open",
  },
];

// Build a chainable Supabase query mock that resolves at the end of any chain
function makeChainable(resolveWith: { data: unknown[]; error: null }) {
  const terminal = () => Promise.resolve(resolveWith);
  const chainable: unknown = new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === "then") return terminal().then.bind(terminal());
        if (prop === "limit" || prop === "maybeSingle") return terminal;
        return () => chainable;
      },
    },
  );
  return chainable;
}

vi.mock("@/lib/supabase", () => {
  const db = {
    from: vi.fn((table: string) => {
      let rows: unknown[] = [];
      if (table === "tm_events") rows = mockEventRows;
      if (table === "event_follow_up_items") rows = mockFollowUpRows;
      return makeChainable({ data: rows, error: null });
    }),
  };

  return {
    getFeatureReadClient: vi.fn().mockResolvedValue(db),
    supabaseAdmin: {},
  };
});

vi.mock("@/features/system-events/server", () => ({
  listSystemEvents: vi.fn().mockResolvedValue([]),
}));

describe("getEventOperationsSummary integration", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns complete event operations summary with events and metrics", async () => {
    const { getEventOperationsSummary } = await import("@/features/events/server");
    const result = await getEventOperationsSummary({ mode: "admin" });

    expect(result).toHaveProperty("attentionEvents");
    expect(result).toHaveProperty("metrics");
    expect(result).toHaveProperty("eventsNeedingAttention");
    expect(Array.isArray(result.attentionEvents)).toBe(true);
    expect(Array.isArray(result.metrics)).toBe(true);
    expect(result.attentionEvents.length).toBeGreaterThan(0);

    const event = result.attentionEvents[0];
    expect(event.eventId).toBe("evt-1");
    expect(event.name).toBe("Aventura");
    expect(event.status).toBe("onsale");
    expect(event.urgentFollowUps).toBeGreaterThan(0);

    const followUpsMetric = result.metrics.find((m) => m.key === "open_follow_ups");
    expect(followUpsMetric).toBeDefined();
    expect(followUpsMetric!.value).toBe(1);
  });
});
