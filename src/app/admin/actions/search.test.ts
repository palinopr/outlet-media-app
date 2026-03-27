import { describe, expect, it, vi } from "vitest";

const { applyEffectiveCampaignClientSlugs, supabaseAdmin } = vi.hoisted(() => {
  const queryResult = {
    data: [],
    error: null,
  };

  const query = {
    limit: vi.fn().mockResolvedValue(queryResult),
  };

  const supabaseAdmin = {
    from: vi.fn().mockReturnValue(query),
  };

  return {
    applyEffectiveCampaignClientSlugs: vi.fn(),
    supabaseAdmin,
  };
});

vi.mock("@/lib/campaign-client-assignment", () => ({
  applyEffectiveCampaignClientSlugs,
}));

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin,
}));

describe("fetchSearchableRecords", () => {
  it("does not surface asset results", async () => {
    applyEffectiveCampaignClientSlugs.mockResolvedValue([
      {
        campaign_id: "campaign-1",
        client_slug: "acme",
        name: "Spring Launch",
        status: "active",
      },
    ]);

    const { fetchSearchableRecords } = await import("./search");

    supabaseAdmin.from.mockImplementation((table: string) => {
      if (table === "meta_campaigns") {
        return {
          select: () => ({
            limit: vi.fn().mockResolvedValue({
              data: [
                {
                  campaign_id: "campaign-1",
                  client_slug: "acme",
                  name: "Spring Launch",
                  status: "active",
                },
              ],
              error: null,
            }),
          }),
        };
      }

      if (table === "tm_events") {
        return {
          select: () => ({
            limit: vi.fn().mockResolvedValue({
              data: [
                {
                  id: "event-1",
                  name: "Arena Night",
                  venue: "United Center",
                  city: "Chicago",
                },
              ],
              error: null,
            }),
          }),
        };
      }

      if (table === "clients") {
        return {
          select: () => ({
            limit: vi.fn().mockResolvedValue({
              data: [
                {
                  id: "client-1",
                  name: "Acme Live",
                  slug: "acme",
                },
              ],
              error: null,
            }),
          }),
        };
      }

      if (table === "ad_assets") {
        return {
          select: () => ({
            limit: vi.fn().mockResolvedValue({
              data: [
                {
                  id: "asset-1",
                  file_name: "Hero.mp4",
                  client_slug: "acme",
                  folder: "library",
                  status: "ready",
                },
              ],
              error: null,
            }),
          }),
        };
      }

      throw new Error(`Unexpected table: ${table}`);
    });

    const records = await fetchSearchableRecords();

    expect(records).toHaveLength(3);
    expect(records.map((record) => record.type)).toEqual(["campaign", "event", "client"]);
    expect(records.some((record) => record.href.startsWith("/admin/assets/"))).toBe(false);
  });
});
