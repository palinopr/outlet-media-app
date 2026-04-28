import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: {
    from() {
      return {
        select() {
          return this;
        },
        limit() {
          return this;
        },
        then(
          resolve: (value: unknown) => unknown,
          reject: (reason: Error) => unknown,
        ) {
          return Promise.reject(new Error("fetch failed")).then(resolve, reject);
        },
      };
    },
  },
}));

describe("fetchAllCampaigns", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    vi.spyOn(console, "warn").mockImplementation(() => {});
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
