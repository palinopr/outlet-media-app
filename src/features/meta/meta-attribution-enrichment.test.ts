import { describe, expect, it, vi } from "vitest";
import { enrichMetaAttributionHierarchy } from "./meta-attribution-enrichment";

const META_CAMPAIGN_ID = "120247445551520525";
const META_ADSET_ID = "120247445606520525";
const META_AD_ID = "120247446000000525";

describe("enrichMetaAttributionHierarchy", () => {
  it("fills campaign and ad set hierarchy from a direct ad id", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({
        id: META_AD_ID,
        name: "Story creative",
        adset: {
          id: META_ADSET_ID,
          name: "Newark buyers",
          campaign: {
            id: META_CAMPAIGN_ID,
            name: "Ataca Sergio final push",
          },
        },
      }), {
        headers: { "content-type": "application/json" },
        status: 200,
      }),
    );

    const enriched = await enrichMetaAttributionHierarchy({
      accessToken: "token",
      attribution: { metaAdId: META_AD_ID },
      fetchImpl,
    });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(enriched).toMatchObject({
      metaAdId: META_AD_ID,
      metaAdName: "Story creative",
      metaAdsetId: META_ADSET_ID,
      metaAdsetName: "Newark buyers",
      metaCampaignId: META_CAMPAIGN_ID,
      metaCampaignName: "Ataca Sergio final push",
    });
  });

  it("keeps existing hierarchy when Meta returns conflicting parent ids", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({
        id: META_AD_ID,
        adset: {
          id: "120247445606520999",
          campaign: { id: "120247445551520999" },
        },
      }), { status: 200 }),
    );

    const enriched = await enrichMetaAttributionHierarchy({
      accessToken: "token",
      attribution: {
        metaAdId: META_AD_ID,
        metaAdsetId: META_ADSET_ID,
        metaCampaignId: META_CAMPAIGN_ID,
      },
      fetchImpl,
    });

    expect(fetchImpl).not.toHaveBeenCalled();
    expect(enriched.metaAdsetId).toBe(META_ADSET_ID);
    expect(enriched.metaCampaignId).toBe(META_CAMPAIGN_ID);
  });

  it("does not call Meta without an access token", async () => {
    const fetchImpl = vi.fn();

    const enriched = await enrichMetaAttributionHierarchy({
      attribution: { metaAdId: META_AD_ID },
      fetchImpl,
    });

    expect(fetchImpl).not.toHaveBeenCalled();
    expect(enriched).toEqual({ metaAdId: META_AD_ID });
  });
});
