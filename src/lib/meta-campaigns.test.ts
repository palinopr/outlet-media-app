import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { supabaseState } = vi.hoisted(() => ({
  supabaseState: {
    reject: true,
    tableData: {} as Record<string, unknown[]>,
    upserts: [] as Array<{ table: string; rows: unknown[]; options: unknown }>,
  },
}));

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: {
    from(table: string) {
      return {
        eq() {
          return this;
        },
        gte() {
          return this;
        },
        in() {
          return this;
        },
        limit() {
          return this;
        },
        lte() {
          return this;
        },
        order() {
          return this;
        },
        select() {
          return this;
        },
        upsert(rows: unknown[], options: unknown) {
          if (supabaseState.reject) {
            return Promise.reject(new Error("fetch failed"));
          }
          supabaseState.upserts.push({ table, rows, options });
          return Promise.resolve({ data: rows, error: null });
        },
        then(
          resolve: (value: unknown) => unknown,
          reject: (reason: Error) => unknown,
        ) {
          if (supabaseState.reject) {
            return Promise.reject(new Error("fetch failed")).then(resolve, reject);
          }
          return Promise.resolve({ data: supabaseState.tableData[table] ?? [], error: null }).then(resolve, reject);
        },
      };
    },
  },
}));

describe("fetchAllCampaigns", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    supabaseState.reject = true;
    supabaseState.tableData = {};
    supabaseState.upserts = [];
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    process.env = {
      ...originalEnv,
      META_ACCESS_TOKEN: "token",
      META_AD_ACCOUNT_ID: "act_123",
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.env = originalEnv;
  });

  it("fetches one live campaign for detail-page fallback", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = new URL(String(input));

      if (url.pathname.endsWith("/cmp_1")) {
        return Response.json({
          id: "cmp_1",
          name: "Arjona Chicago",
          status: "ACTIVE",
          objective: "OUTCOME_SALES",
          daily_budget: "5000",
          start_time: "2026-04-01T00:00:00-0500",
        });
      }

      if (url.pathname.endsWith("/cmp_1/insights") && url.searchParams.get("time_increment") === "1") {
        return Response.json({
          data: [
            {
              campaign_id: "cmp_1",
              spend: "12.50",
              date_start: "2026-04-01",
              purchase_roas: [{ action_type: "omni_purchase", value: "3.2" }],
            },
          ],
        });
      }

      if (url.pathname.endsWith("/cmp_1/insights")) {
        return Response.json({
          data: [
            {
              campaign_id: "cmp_1",
              campaign_name: "Arjona Chicago",
              spend: "12.50",
              impressions: "1000",
              clicks: "50",
              ctr: "5",
              cpc: "0.25",
              cpm: "12.5",
              purchase_roas: [{ action_type: "omni_purchase", value: "3.2" }],
            },
          ],
        });
      }

      return Response.json({ data: [] });
    });
    vi.stubGlobal("fetch", fetchMock);

    const { fetchCampaignById } = await import("@/lib/meta-campaigns");
    const result = await fetchCampaignById("cmp_1", "30");

    expect(result.error).toBeNull();
    expect(result.campaign).toEqual(
      expect.objectContaining({
        campaignId: "cmp_1",
        clientSlug: "zamora",
        dailyBudget: 50,
        name: "Arjona Chicago",
        roas: 3.2,
        spend: 12.5,
      }),
    );
    expect(result.dailyInsights).toEqual([
      expect.objectContaining({
        campaignId: "cmp_1",
        date: "2026-04-01",
        spend: 12.5,
        roas: 3.2,
      }),
    ]);
  });

  it("reports Meta fetch failures instead of silently returning an empty successful result", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("bad token", { status: 401 })));

    const { fetchAllCampaigns } = await import("@/lib/meta-campaigns");
    const result = await fetchAllCampaigns("30");

    expect(result.error).toContain("campaigns failed (401)");
    expect(result.campaigns).toEqual([]);
    expect(result.dailyInsights).toEqual([]);
  });

  it("falls back to stored Supabase campaign data when Meta is unavailable", async () => {
    supabaseState.reject = false;
    supabaseState.tableData = {
      clients: [{ slug: "zamora" }],
      campaign_client_overrides: [],
      campaign_snapshots: [
        {
          campaign_id: "cmp_1",
          snapshot_date: new Date().toISOString().slice(0, 10),
          spend: 1250,
          roas: 3.2,
        },
      ],
      meta_campaigns: [
        {
          campaign_id: "cmp_1",
          campaign_type: "music",
          client_slug: "zamora",
          clicks: 50,
          cpc: 25,
          cpm: 1250,
          ctr: 5,
          daily_budget: 5000,
          impressions: 1000,
          name: "Stored Arjona Chicago",
          objective: "OUTCOME_SALES",
          roas: 3.2,
          spend: 1250,
          start_time: "2026-04-01T00:00:00-0500",
          status: "ACTIVE",
        },
      ],
    };
    vi.stubGlobal("fetch", vi.fn(async () => new Response("bad token", { status: 401 })));

    const { fetchAllCampaigns } = await import("@/lib/meta-campaigns");
    const result = await fetchAllCampaigns("today", "zamora");

    expect(result.error).toContain("campaigns failed (401)");
    expect(result.campaigns).toEqual([
      expect.objectContaining({
        campaignId: "cmp_1",
        campaignType: "music",
        clientSlug: "zamora",
        dailyBudget: 50,
        name: "Stored Arjona Chicago",
        spend: 12.5,
      }),
    ]);
    expect(result.dailyInsights).toEqual([
      expect.objectContaining({
        campaignId: "cmp_1",
        spend: 12.5,
        roas: 3.2,
      }),
    ]);
    expect(result.clients).toContain("zamora");
  });

  it("honors stored campaign client assignment metadata for live Meta results", async () => {
    supabaseState.reject = false;
    supabaseState.tableData = {
      clients: [{ slug: "sienna" }],
      campaign_client_overrides: [],
      meta_campaigns: [
        {
          campaign_id: "cmp_2",
          campaign_type: "music",
          client_slug: "sienna",
        },
      ],
    };
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = new URL(String(input));

      if (url.pathname.endsWith("/campaigns")) {
        return Response.json({
          data: [
            {
              id: "cmp_2",
              name: "Unbranded Campaign",
              status: "ACTIVE",
              objective: "OUTCOME_SALES",
            },
          ],
        });
      }

      if (url.pathname.endsWith("/insights")) {
        return Response.json({ data: [] });
      }

      return Response.json({ data: [] });
    });
    vi.stubGlobal("fetch", fetchMock);

    const { fetchAllCampaigns } = await import("@/lib/meta-campaigns");
    const result = await fetchAllCampaigns("30", "sienna");

    expect(result.error).toBeNull();
    expect(result.campaigns).toEqual([
      expect.objectContaining({
        campaignId: "cmp_2",
        campaignType: "music",
        clientSlug: "sienna",
      }),
    ]);
    expect(supabaseState.upserts).toEqual([
      expect.objectContaining({
        table: "meta_campaigns",
        rows: [
          expect.objectContaining({
            campaign_id: "cmp_2",
            campaign_type: "music",
            client_slug: "sienna",
            status: "ACTIVE",
          }),
        ],
      }),
    ]);
  });

  it("persists client-visible daily snapshots from live Meta results", async () => {
    supabaseState.reject = false;
    supabaseState.tableData = {
      clients: [{ slug: "zamora" }],
      campaign_client_overrides: [],
      meta_campaigns: [],
    };
    vi.stubGlobal("fetch", vi.fn(async (input: RequestInfo | URL) => {
      const url = new URL(String(input));

      if (url.pathname.endsWith("/campaigns")) {
        return Response.json({
          data: [
            {
              id: "cmp_1",
              name: "Zamora Campaign",
              status: "ACTIVE",
              objective: "OUTCOME_SALES",
              daily_budget: "5000",
              start_time: "2026-04-01T00:00:00-0500",
            },
          ],
        });
      }

      if (url.pathname.endsWith("/insights") && url.searchParams.get("time_increment") === "1") {
        return Response.json({
          data: [
            {
              campaign_id: "cmp_1",
              campaign_name: "Zamora Campaign",
              spend: "12.50",
              impressions: "1000",
              clicks: "50",
              ctr: "5",
              cpc: "0.25",
              cpm: "12.5",
              date_start: "2026-04-01",
              purchase_roas: [{ action_type: "purchase", value: "3.2" }],
            },
          ],
        });
      }

      if (url.pathname.endsWith("/insights")) {
        return Response.json({
          data: [
            {
              campaign_id: "cmp_1",
              campaign_name: "Zamora Campaign",
              spend: "12.50",
              impressions: "1000",
              clicks: "50",
              ctr: "5",
              cpc: "0.25",
              cpm: "12.5",
              purchase_roas: [{ action_type: "purchase", value: "3.2" }],
            },
          ],
        });
      }

      return Response.json({ data: [] });
    }));

    const { fetchAllCampaigns } = await import("@/lib/meta-campaigns");
    const result = await fetchAllCampaigns("today", "zamora");

    expect(result.error).toBeNull();
    expect(result.campaigns[0]).toEqual(expect.objectContaining({ campaignId: "cmp_1", roas: 3.2 }));
    expect(supabaseState.upserts).toEqual([
      expect.objectContaining({
        table: "meta_campaigns",
        rows: [
          expect.objectContaining({
            campaign_id: "cmp_1",
            spend: 1250,
            roas: 3.2,
            daily_budget: 5000,
          }),
        ],
      }),
      expect.objectContaining({
        table: "campaign_snapshots",
        rows: [
          expect.objectContaining({
            campaign_id: "cmp_1",
            snapshot_date: "2026-04-01",
            spend: 1250,
            roas: 3.2,
          }),
        ],
      }),
    ]);
  });

  it("skips Supabase persistence when client campaign rows were recently synced", async () => {
    supabaseState.reject = false;
    supabaseState.tableData = {
      clients: [{ slug: "zamora" }],
      campaign_client_overrides: [],
      meta_campaigns: [
        {
          campaign_id: "cmp_1",
          campaign_type: "sales",
          client_slug: "zamora",
          synced_at: new Date().toISOString(),
        },
      ],
    };
    vi.stubGlobal("fetch", vi.fn(async (input: RequestInfo | URL) => {
      const url = new URL(String(input));

      if (url.pathname.endsWith("/campaigns")) {
        return Response.json({
          data: [
            {
              id: "cmp_1",
              name: "Zamora Campaign",
              status: "ACTIVE",
              objective: "OUTCOME_SALES",
            },
          ],
        });
      }

      if (url.pathname.endsWith("/insights")) {
        return Response.json({ data: [] });
      }

      return Response.json({ data: [] });
    }));

    const { fetchAllCampaigns } = await import("@/lib/meta-campaigns");
    const result = await fetchAllCampaigns("today", "zamora");

    expect(result.error).toBeNull();
    expect(result.campaigns).toHaveLength(1);
    expect(supabaseState.upserts).toEqual([]);
  });

  it("still returns Meta campaigns when optional Supabase enrichment is unavailable", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = new URL(String(input));

      if (url.pathname.endsWith("/campaigns")) {
        return Response.json({
          data: [
            {
              id: "cmp_1",
              name: "Arjona Chicago",
              status: "ACTIVE",
              objective: "OUTCOME_SALES",
              daily_budget: "5000",
              start_time: "2026-04-01T00:00:00-0500",
            },
          ],
        });
      }

      if (url.pathname.endsWith("/insights") && url.searchParams.get("time_increment") === "1") {
        return Response.json({
          data: [
            {
              campaign_id: "cmp_1",
              campaign_name: "Arjona Chicago",
              spend: "12.50",
              impressions: "1000",
              clicks: "50",
              ctr: "5",
              cpc: "0.25",
              cpm: "12.5",
              date_start: "2026-04-01",
              purchase_roas: [{ action_type: "omni_purchase", value: "3.2" }],
            },
          ],
        });
      }

      if (url.pathname.endsWith("/insights")) {
        return Response.json({
          data: [
            {
              campaign_id: "cmp_1",
              campaign_name: "Arjona Chicago",
              spend: "12.50",
              impressions: "1000",
              clicks: "50",
              ctr: "5",
              cpc: "0.25",
              cpm: "12.5",
              purchase_roas: [{ action_type: "omni_purchase", value: "3.2" }],
            },
          ],
        });
      }

      return Response.json({ data: [] });
    });
    vi.stubGlobal("fetch", fetchMock);

    const { fetchAllCampaigns } = await import("@/lib/meta-campaigns");
    const result = await fetchAllCampaigns("30");

    expect(result.error).toBeNull();
    expect(result.campaigns).toEqual([
      expect.objectContaining({
        campaignId: "cmp_1",
        clientSlug: "zamora",
        campaignType: "sales",
        spend: 12.5,
        roas: 3.2,
      }),
    ]);
    expect(result.dailyInsights).toEqual([
      expect.objectContaining({
        campaignId: "cmp_1",
        date: "2026-04-01",
        spend: 12.5,
        roas: 3.2,
      }),
    ]);
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("optional Supabase campaign overrides unavailable"),
    );
  });
});
