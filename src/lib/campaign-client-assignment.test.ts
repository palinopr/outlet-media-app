import { beforeEach, describe, expect, it, vi } from "vitest";

const { state, supabaseAdmin } = vi.hoisted(() => {
  const state = {
    campaign_client_overrides: [] as Record<string, unknown>[],
    meta_campaigns: [] as Record<string, unknown>[],
  };

  function applyFilters(
    rows: Record<string, unknown>[],
    filters: Array<{ field: string; type: "eq" | "in"; value: unknown }>,
  ) {
    return rows.filter((row) =>
      filters.every((filter) => {
        if (filter.type === "eq") {
          return row[filter.field] === filter.value;
        }

        const values = Array.isArray(filter.value) ? filter.value : [];
        return values.includes(row[filter.field]);
      }),
    );
  }

  const supabaseAdmin = {
    from(table: string) {
      const filters: Array<{ field: string; type: "eq" | "in"; value: unknown }> = [];
      let limitValue: number | null = null;

      const query = {
        select() {
          return this;
        },
        eq(field: string, value: unknown) {
          filters.push({ field, type: "eq", value });
          return this;
        },
        in(field: string, value: unknown[]) {
          filters.push({ field, type: "in", value });
          return this;
        },
        limit(value: number) {
          limitValue = value;
          return this;
        },
        async maybeSingle() {
          const rows = applyFilters(
            (state[table as keyof typeof state] ?? []) as Record<string, unknown>[],
            filters,
          );
          return { data: rows[0] ?? null, error: null };
        },
        then(resolve: (value: { data: Record<string, unknown>[]; error: null }) => unknown) {
          const rows = applyFilters(
            (state[table as keyof typeof state] ?? []) as Record<string, unknown>[],
            filters,
          );
          const data = limitValue == null ? rows : rows.slice(0, limitValue);
          return Promise.resolve({ data, error: null }).then(resolve);
        },
      };

      return query;
    },
  };

  return { state, supabaseAdmin };
});

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin,
}));

import {
  applyEffectiveCampaignClientSlugs,
  campaignBelongsToClientSlug,
  getEffectiveCampaignRowById,
  listEffectiveCampaignIdsForClientSlug,
  listEffectiveCampaignRowsForClientSlug,
} from "@/lib/campaign-client-assignment";

describe("campaign client assignment helpers", () => {
  beforeEach(() => {
    state.meta_campaigns = [
      {
        campaign_id: "cmp_override",
        client_slug: "legacy",
        name: "Legacy campaign",
        status: "ACTIVE",
      },
      {
        campaign_id: "cmp_direct",
        client_slug: "zamora",
        name: "Direct campaign",
        status: "ACTIVE",
      },
      {
        campaign_id: "cmp_guess",
        client_slug: null,
        name: "Arjona Summer Push",
        status: "ACTIVE",
      },
    ];
    state.campaign_client_overrides = [
      {
        campaign_id: "cmp_override",
        client_slug: "zamora",
      },
    ];
  });

  it("applies overrides before stored slug and guessed fallback", async () => {
    const rows = await applyEffectiveCampaignClientSlugs([
      {
        campaign_id: "cmp_override",
        client_slug: "legacy",
        name: "Legacy campaign",
      },
      {
        campaign_id: "cmp_guess",
        client_slug: null,
        name: "Arjona Summer Push",
      },
    ]);

    expect(rows).toEqual([
      expect.objectContaining({
        campaign_id: "cmp_override",
        client_slug: "zamora",
      }),
      expect.objectContaining({
        campaign_id: "cmp_guess",
        client_slug: "zamora",
      }),
    ]);
  });

  it("lists campaigns for a client using effective assignment", async () => {
    const campaigns = await listEffectiveCampaignRowsForClientSlug<{
      campaign_id: string;
      client_slug: string | null;
      name: string | null;
      status: string | null;
    }>("campaign_id, client_slug, name, status", "zamora");

    expect(campaigns.map((campaign) => campaign.campaign_id).sort()).toEqual([
      "cmp_direct",
      "cmp_override",
    ]);
  });

  it("checks client ownership against the effective assignment", async () => {
    await expect(campaignBelongsToClientSlug("cmp_override", "zamora")).resolves.toBe(true);
    await expect(campaignBelongsToClientSlug("cmp_override", "legacy")).resolves.toBe(false);

    const row = await getEffectiveCampaignRowById<{
      campaign_id: string;
      client_slug: string | null;
      name: string | null;
    }>("cmp_override", "campaign_id, client_slug, name");

    expect(row).toMatchObject({
      campaign_id: "cmp_override",
      client_slug: "zamora",
    });
  });

  it("lists effective campaign ids for a client", async () => {
    await expect(listEffectiveCampaignIdsForClientSlug("zamora")).resolves.toEqual([
      "cmp_direct",
      "cmp_override",
    ]);
  });
});
