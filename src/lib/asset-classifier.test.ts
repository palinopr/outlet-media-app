import { beforeEach, describe, expect, it, vi } from "vitest";

const { listEffectiveCampaignRowsForClientSlug, supabaseAdmin } = vi.hoisted(() => {
  return {
    listEffectiveCampaignRowsForClientSlug: vi.fn(),
    supabaseAdmin: {
      from(table: string) {
        if (table !== "tm_events") {
          throw new Error(`Unexpected table: ${table}`);
        }

        return {
          select() {
            return this;
          },
          eq() {
            return Promise.resolve({ data: [], error: null });
          },
        };
      },
    },
  };
});

vi.mock("@/lib/campaign-client-assignment", () => ({
  listEffectiveCampaignRowsForClientSlug,
}));

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin,
}));

import { classifyAsset } from "@/lib/asset-classifier";

describe("classifyAsset", () => {
  beforeEach(() => {
    listEffectiveCampaignRowsForClientSlug.mockReset();
  });

  it("matches effective client campaigns during asset classification", async () => {
    listEffectiveCampaignRowsForClientSlug.mockResolvedValue([
      {
        campaign_id: "cmp_override",
        client_slug: "zamora",
        name: "Miami Launch",
      },
    ]);

    const result = await classifyAsset(
      "miami-launch_story_1080x1920.jpg",
      Buffer.alloc(0),
      "image/jpeg",
      "zamora",
    );

    expect(listEffectiveCampaignRowsForClientSlug).toHaveBeenCalledWith(
      "campaign_id, client_slug, name",
      "zamora",
    );
    expect(result).toMatchObject({
      placement: "story",
      folder: "Miami Launch/Story",
      campaignId: "cmp_override",
      campaignName: "Miami Launch",
      labels: ["story", "Miami Launch", "1080x1920"],
    });
  });
});
