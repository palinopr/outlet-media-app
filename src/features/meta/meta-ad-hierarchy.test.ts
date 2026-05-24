import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearMetaAdHierarchyCacheForTests,
  enrichAttributionWithMetaAdHierarchy,
  resolveMetaAdHierarchy,
} from "./meta-ad-hierarchy";

const META_CAMPAIGN_ID = "120247445551520525";
const META_ADSET_ID = "120247445606520525";
const META_AD_ID = "120247446000000525";

function response(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json" },
    status: 200,
    ...init,
  });
}

describe("Meta ad hierarchy enrichment", () => {
  beforeEach(() => {
    clearMetaAdHierarchyCacheForTests();
    vi.stubEnv("META_ACCESS_TOKEN", "test-token");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("resolves an ad id into ad, ad set, and campaign attribution", async () => {
    const fetchFn = vi.fn(async () => response({
      id: META_AD_ID,
      name: "Story creative",
      adset: {
        id: META_ADSET_ID,
        name: "Cold - Proven Winners - Broad",
      },
      campaign: {
        id: META_CAMPAIGN_ID,
        name: "Ataca Sergio - Final Push CBO",
      },
    }));

    const hierarchy = await resolveMetaAdHierarchy(META_AD_ID, { fetchFn });

    expect(fetchFn).toHaveBeenCalledOnce();
    expect(hierarchy).toMatchObject({
      metaAdId: META_AD_ID,
      metaAdName: "Story creative",
      metaAdsetId: META_ADSET_ID,
      metaAdsetName: "Cold - Proven Winners - Broad",
      metaCampaignId: META_CAMPAIGN_ID,
      metaCampaignName: "Ataca Sergio - Final Push CBO",
    });
  });

  it("fills missing hierarchy fields without overwriting source-provided fields", async () => {
    const fetchFn = vi.fn(async () => response({
      id: META_AD_ID,
      name: "Graph ad name",
      adset: {
        id: META_ADSET_ID,
        name: "Graph ad set",
      },
      campaign: {
        id: META_CAMPAIGN_ID,
        name: "Graph campaign",
      },
    }));

    const attribution = await enrichAttributionWithMetaAdHierarchy({
      metaAdId: META_AD_ID,
      metaAdName: "Source ad name",
      utmContent: "story_v1",
    }, { fetchFn });

    expect(attribution).toMatchObject({
      metaAdId: META_AD_ID,
      metaAdName: "Source ad name",
      metaAdsetId: META_ADSET_ID,
      metaAdsetName: "Graph ad set",
      metaCampaignId: META_CAMPAIGN_ID,
      metaCampaignName: "Graph campaign",
      utmContent: "story_v1",
    });
  });

  it("does not merge hierarchy fields when Meta returns conflicting parent ids", async () => {
    const fetchFn = vi.fn(async () => response({
      id: META_AD_ID,
      name: "Graph ad name",
      adset: {
        id: "120247445606520999",
        name: "Wrong ad set",
      },
      campaign: {
        id: "120247445551520999",
        name: "Wrong campaign",
      },
    }));

    const attribution = await enrichAttributionWithMetaAdHierarchy({
      metaAdId: META_AD_ID,
      metaAdsetId: META_ADSET_ID,
      utmContent: "story_v1",
    }, { fetchFn });

    expect(fetchFn).toHaveBeenCalledOnce();
    expect(attribution).toMatchObject({
      metaAdId: META_AD_ID,
      metaAdsetId: META_ADSET_ID,
      utmContent: "story_v1",
    });
    expect(attribution.metaAdName).toBeUndefined();
    expect(attribution.metaAdsetName).toBeUndefined();
    expect(attribution.metaCampaignId).toBeUndefined();
    expect(attribution.metaCampaignName).toBeUndefined();
  });

  it("does not fetch when the attribution has no valid ad id", async () => {
    const fetchFn = vi.fn();

    const attribution = await enrichAttributionWithMetaAdHierarchy({
      metaAdId: "not-valid",
      utmContent: "organic_story",
    }, { fetchFn });

    expect(fetchFn).not.toHaveBeenCalled();
    expect(attribution.metaAdId).toBeUndefined();
    expect(attribution.utmContent).toBe("organic_story");
  });

  it("uses the CAPI token env when a general Meta token is not configured", async () => {
    vi.stubEnv("META_ACCESS_TOKEN", "");
    vi.stubEnv("META_CAPI_ACCESS_TOKEN", "capi-token");
    const fetchFn = vi.fn(async (..._args: Parameters<typeof fetch>) => response({
      id: META_AD_ID,
      adset: { id: META_ADSET_ID },
      campaign: { id: META_CAMPAIGN_ID },
    }));

    await resolveMetaAdHierarchy(META_AD_ID, { fetchFn });

    const calledUrl = new URL(String(fetchFn.mock.calls[0]?.[0]));
    expect(calledUrl.searchParams.get("access_token")).toBe("capi-token");
  });

  it("times out unresolved Meta Graph lookups", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const fetchFn = vi.fn((..._args: Parameters<typeof fetch>) => new Promise<Response>(() => undefined));

    const hierarchy = await resolveMetaAdHierarchy(META_AD_ID, { fetchFn, timeoutMs: 1 });

    expect(fetchFn).toHaveBeenCalledOnce();
    expect(hierarchy).toEqual({});
    expect(warn).toHaveBeenCalledWith("[meta:capi] failed to resolve Meta ad hierarchy");
  });
});
