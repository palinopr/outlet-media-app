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
  it("surfaces only campaigns and clients", async () => {
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

      throw new Error(`Unexpected table: ${table}`);
    });

    const records = await fetchSearchableRecords();

    expect(records).toHaveLength(2);
    expect(records.map((record) => record.type)).toEqual(["campaign", "client"]);
    expect(records.some((record) => record.href.startsWith("/admin/events"))).toBe(false);
  });
});
