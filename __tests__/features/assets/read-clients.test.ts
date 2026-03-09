import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  createClerkSupabaseClient,
  currentUser,
  listEffectiveCampaignRowsForClientSlug,
  serviceState,
  supabaseAdmin,
  userScopedState,
  userScopedSupabase,
} = vi.hoisted(() => {
  const serviceState = {
    ad_assets: [] as Record<string, unknown>[],
  };

  const userScopedState = {
    ad_assets: [] as Record<string, unknown>[],
  };

  function applyFilters(
    rows: Record<string, unknown>[],
    filters: Array<{ field: string; type: "eq"; value: unknown }>,
  ) {
    return rows.filter((row) =>
      filters.every((filter) => row[filter.field] === filter.value),
    );
  }

  function buildClient(state: typeof serviceState) {
    return {
      from(table: string) {
        const filters: Array<{ field: string; type: "eq"; value: unknown }> = [];
        let limitValue: number | null = null;

        const query = {
          select() {
            return this;
          },
          eq(field: string, value: unknown) {
            filters.push({ field, type: "eq", value });
            return this;
          },
          order() {
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
          then(
            resolve: (value: { data: Record<string, unknown>[]; error: null }) => unknown,
          ) {
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
  }

  return {
    createClerkSupabaseClient: vi.fn(),
    currentUser: vi.fn(),
    listEffectiveCampaignRowsForClientSlug: vi.fn(),
    serviceState,
    supabaseAdmin: buildClient(serviceState),
    userScopedState,
    userScopedSupabase: buildClient(userScopedState),
  };
});

vi.mock("@clerk/nextjs/server", () => ({
  currentUser,
}));

vi.mock("@/lib/supabase", () => ({
  createClerkSupabaseClient,
  supabaseAdmin,
}));

vi.mock("@/lib/campaign-client-assignment", async () => {
  const actual = await vi.importActual<typeof import("@/lib/campaign-client-assignment")>(
    "@/lib/campaign-client-assignment",
  );

  return {
    ...actual,
    listEffectiveCampaignRowsForClientSlug,
  };
});

import {
  getAssetOperatingData,
  listAssetLibrary,
  listAssets,
  listCampaignAssets,
} from "@/features/assets/server";

function makeAsset(id: string, fileName: string) {
  return {
    id,
    client_slug: "zamora",
    created_at: "2026-03-07T12:00:00.000Z",
    file_name: fileName,
    folder: "Campaign Alpha/posters",
    format: null,
    height: 1080,
    labels: ["Campaign Alpha"],
    media_type: "image",
    placement: "feed",
    public_url: `https://example.com/${fileName}`,
    source_url: null,
    status: "approved",
    storage_path: null,
    uploaded_by: "user_1",
    width: 1080,
  };
}

describe("asset read clients", () => {
  beforeEach(() => {
    createClerkSupabaseClient.mockReset();
    currentUser.mockReset();
    listEffectiveCampaignRowsForClientSlug.mockReset();
    serviceState.ad_assets = [];
    userScopedState.ad_assets = [];
    currentUser.mockResolvedValue({ publicMetadata: { role: "member" } });
    createClerkSupabaseClient.mockResolvedValue(null);
    listEffectiveCampaignRowsForClientSlug.mockResolvedValue([
      {
        campaign_id: "cmp_1",
        client_slug: "zamora",
        clicks: 25,
        impressions: 1000,
        name: "Campaign Alpha",
        roas: 3.2,
        spend: 20000,
        status: "ACTIVE",
        tm_event_id: null,
      },
    ]);
  });

  it("prefers the Clerk-scoped client for client asset galleries", async () => {
    serviceState.ad_assets = [makeAsset("asset_service", "service.png")];
    userScopedState.ad_assets = [makeAsset("asset_rls", "rls.png")];
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);

    const assets = await listAssets("zamora");

    expect(assets.map((asset) => asset.id)).toEqual(["asset_rls"]);
  });

  it("prefers the Clerk-scoped client for client asset summaries", async () => {
    serviceState.ad_assets = [makeAsset("asset_service", "service.png")];
    userScopedState.ad_assets = [makeAsset("asset_rls", "rls.png")];
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);

    const summary = await listAssetLibrary("zamora", 6);

    expect(summary[0]?.asset.id).toBe("asset_rls");
    expect(summary[0]?.linkedCampaignNames).toEqual(["Campaign Alpha"]);
  });

  it("prefers the Clerk-scoped client for campaign asset reads", async () => {
    serviceState.ad_assets = [makeAsset("asset_service", "service.png")];
    userScopedState.ad_assets = [makeAsset("asset_rls", "rls.png")];
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);

    const assets = await listCampaignAssets("zamora", "Campaign Alpha", 6);

    expect(assets.map((asset) => asset.id)).toEqual(["asset_rls"]);
  });

  it("prefers the Clerk-scoped client for client asset detail reads", async () => {
    serviceState.ad_assets = [makeAsset("asset_service", "service.png")];
    userScopedState.ad_assets = [makeAsset("asset_rls", "rls.png")];
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);

    const data = await getAssetOperatingData("asset_rls", [], undefined, "zamora");

    expect(data?.asset.id).toBe("asset_rls");
    expect(data?.linkedCampaigns).toEqual([
      expect.objectContaining({
        campaignId: "cmp_1",
        name: "Campaign Alpha",
      }),
    ]);
  });

  it("keeps admin asset detail reads on the service role", async () => {
    currentUser.mockResolvedValue({ publicMetadata: { role: "admin" } });
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);
    serviceState.ad_assets = [makeAsset("asset_service", "service.png")];
    userScopedState.ad_assets = [makeAsset("asset_rls", "rls.png")];

    const data = await getAssetOperatingData("asset_service", [], undefined, "zamora");

    expect(data?.asset.id).toBe("asset_service");
    expect(createClerkSupabaseClient).not.toHaveBeenCalled();
  });
});
