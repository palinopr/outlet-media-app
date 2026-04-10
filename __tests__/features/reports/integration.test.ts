import { describe, it, expect, vi } from "vitest";

// Must be hoisted before imports
const mockEventData = [
  {
    id: "evt-1",
    name: "Test Event",
    venue: "Test Venue",
    city: "Miami",
    client_slug: "zamora",
    date: "2026-04-15",
    status: "active",
    tickets_sold: 100,
    tickets_available: 400,
    tm_id: "tm-abc123",
    avg_ticket_price: "45.00",
    potential_revenue: 22500,
    gross: 4500,
    updated_at: "2026-04-01T00:00:00Z",
    artist: "Test Artist",
    tickets_sold_today: 5,
    revenue_today: 225,
    conversion_rate: "0.12",
    edp_total_views: 1500,
    edp_avg_daily_views: 50,
  },
];

vi.mock("@/lib/supabase", () => {
  // Create a chainable query builder that resolves to mockEventData
  function makeChain() {
    const chain: Record<string, unknown> = {};
    const methods = ["select", "order", "limit", "eq", "in"];
    for (const m of methods) {
      chain[m] = vi.fn().mockImplementation(() => {
        // Return a thenable chain so it can be both awaited and further chained
        const next = makeChain();
        Object.assign(next, { then: (r: (v: unknown) => unknown) => Promise.resolve({ data: mockEventData, error: null }).then(r) });
        return next;
      });
    }
    chain.then = (r: (v: unknown) => unknown) => Promise.resolve({ data: mockEventData, error: null }).then(r);
    return chain;
  }

  return {
    getFeatureReadClient: vi.fn().mockResolvedValue({
      from: vi.fn().mockReturnValue(makeChain()),
    }),
    supabaseAdmin: {},
  };
});

vi.mock("@/lib/meta-campaigns", () => ({
  fetchAllCampaigns: vi.fn().mockResolvedValue({
    campaigns: [
      {
        campaignId: "camp-1",
        name: "Zamora Test Campaign",
        status: "ACTIVE",
        clientSlug: "zamora",
        spend: 1500,
        roas: 3.5,
        revenue: 5250,
        impressions: 120000,
        clicks: 3600,
        ctr: 3.0,
        cpc: 0.42,
        cpm: 12.5,
        dailyBudget: 5000,
        startTime: "2026-03-01T00:00:00Z",
      },
    ],
    dailyInsights: [
      {
        date: "2026-03-28",
        campaignId: "camp-1",
        roas: 3.2,
        spend: 500,
      },
      {
        date: "2026-03-29",
        campaignId: "camp-1",
        roas: 3.8,
        spend: 600,
      },
    ],
    clients: ["zamora"],
    error: null,
  }),
}));

vi.mock("@/features/client-portal/insights", () => ({
  buildTrendData: vi.fn().mockImplementation((snapshots) =>
    snapshots.map((s: { snapshot_date: string; roas: number | null; spend: number | null }) => ({
      date: s.snapshot_date,
      roas: s.roas ?? 0,
      spend: s.spend ?? 0,
    })),
  ),
}));

import { getReportsData } from "@/features/reports/server";

describe("getReportsData integration", () => {

  it("returns complete reports shape for a client slug", async () => {
    const result = await getReportsData({ clientSlug: "zamora" });

    // Top-level shape
    expect(result).toHaveProperty("campaigns");
    expect(result).toHaveProperty("snapshots");
    expect(result).toHaveProperty("trendData");
    expect(result).toHaveProperty("events");
    expect(result).toHaveProperty("summary");
    expect(result).toHaveProperty("dataSource");
    expect(result).toHaveProperty("clients");
  });

  it("transforms campaign data correctly", async () => {
    const result = await getReportsData({ clientSlug: "zamora" });

    expect(result.campaigns).toHaveLength(1);
    const campaign = result.campaigns[0];
    expect(campaign.campaignId).toBe("camp-1");
    expect(campaign.name).toBe("Zamora Test Campaign");
    expect(campaign.status).toBe("ACTIVE");
    expect(campaign.clientSlug).toBe("zamora");
    expect(campaign.spend).toBe(1500);
    expect(campaign.roas).toBe(3.5);
  });

  it("transforms event data correctly", async () => {
    const result = await getReportsData({ clientSlug: "zamora" });

    expect(result.events).toHaveLength(1);
    const event = result.events[0];
    expect(event.id).toBe("evt-1");
    expect(event.name).toBe("Test Event");
    expect(event.clientSlug).toBe("zamora");
    expect(event.ticketsSold).toBe(100);
    expect(event.ticketsAvailable).toBe(400);
    expect(event.sellThrough).toBe(20); // 100 / (100+400) * 100
    expect(event.ticketPlatform).toBe("ticketmaster");
  });

  it("builds snapshots from dailyInsights filtered to matching campaign ids", async () => {
    const result = await getReportsData({ clientSlug: "zamora" });

    expect(result.snapshots).toHaveLength(2);
    expect(result.snapshots[0]).toMatchObject({
      snapshot_date: "2026-03-28",
      campaign_id: "camp-1",
      roas: 3.2,
    });
    // spend is stored as cents
    expect(result.snapshots[0].spend).toBe(50000);
  });

  it("sets dataSource to meta_api when no error", async () => {
    const result = await getReportsData({ clientSlug: "zamora" });
    expect(result.dataSource).toBe("meta_api");
  });

  it("returns clients list from fetchAllCampaigns", async () => {
    const result = await getReportsData({ clientSlug: "zamora" });
    expect(result.clients).toEqual(["zamora"]);
  });

  it("filters campaigns by scope allowedCampaignIds", async () => {
    const result = await getReportsData({
      clientSlug: "zamora",
      scope: { allowedCampaignIds: ["other-id"], allowedEventIds: [] },
    });

    // camp-1 is not in allowedCampaignIds → filtered out
    expect(result.campaigns).toHaveLength(0);
    // snapshots filtered too since no matching campaign ids
    expect(result.snapshots).toHaveLength(0);
  });
});
