import { cleanAttributionQueryValue, sanitizeMarketingAttribution, type MarketingAttribution } from "@/features/meta/attribution";
import { META_API_VERSION } from "@/lib/constants";

type MetaGraphCampaign = {
  id?: string;
  name?: string;
};

type MetaGraphAdset = {
  campaign?: MetaGraphCampaign;
  id?: string;
  name?: string;
};

type MetaGraphAd = {
  adset?: MetaGraphAdset;
  id?: string;
  name?: string;
};

type MetaGraphErrorResponse = {
  error?: {
    message?: string;
  };
};

type FetchLike = typeof fetch;

export function getMetaAttributionEnrichmentToken() {
  return process.env.META_ACCESS_TOKEN || process.env.META_CAPI_ACCESS_TOKEN || "";
}

function fillMissingAttribution(base: MarketingAttribution, enrichment: MarketingAttribution): MarketingAttribution {
  if (!hierarchyMatches(base, enrichment)) return base;

  return sanitizeMarketingAttribution({
    ...base,
    metaAdId: base.metaAdId ?? enrichment.metaAdId,
    metaAdName: base.metaAdName ?? enrichment.metaAdName,
    metaAdsetId: base.metaAdsetId ?? enrichment.metaAdsetId,
    metaAdsetName: base.metaAdsetName ?? enrichment.metaAdsetName,
    metaCampaignId: base.metaCampaignId ?? enrichment.metaCampaignId,
    metaCampaignName: base.metaCampaignName ?? enrichment.metaCampaignName,
  });
}

function sameKnownId(baseValue: string | undefined, enrichmentValue: string | undefined) {
  return !baseValue || !enrichmentValue || baseValue === enrichmentValue;
}

function hierarchyMatches(base: MarketingAttribution, enrichment: MarketingAttribution) {
  return sameKnownId(base.metaAdId, enrichment.metaAdId)
    && sameKnownId(base.metaAdsetId, enrichment.metaAdsetId)
    && sameKnownId(base.metaCampaignId, enrichment.metaCampaignId);
}

function needsAdLookup(attribution: MarketingAttribution) {
  return Boolean(
    attribution.metaAdId
      && (
        !attribution.metaAdName
        || !attribution.metaAdsetId
        || !attribution.metaAdsetName
        || !attribution.metaCampaignId
        || !attribution.metaCampaignName
      ),
  );
}

function needsAdsetLookup(attribution: MarketingAttribution) {
  return Boolean(
    attribution.metaAdsetId
      && (
        !attribution.metaAdsetName
        || !attribution.metaCampaignId
        || !attribution.metaCampaignName
      ),
  );
}

function text(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim().replace(/[<>]/g, "").slice(0, 240) : undefined;
}

function attributionFromAd(ad: MetaGraphAd): MarketingAttribution {
  return sanitizeMarketingAttribution({
    metaAdId: cleanAttributionQueryValue("ad_id", ad.id),
    metaAdName: text(ad.name),
    metaAdsetId: cleanAttributionQueryValue("adset_id", ad.adset?.id),
    metaAdsetName: text(ad.adset?.name),
    metaCampaignId: cleanAttributionQueryValue("campaign_id", ad.adset?.campaign?.id),
    metaCampaignName: text(ad.adset?.campaign?.name),
  });
}

function attributionFromAdset(adset: MetaGraphAdset): MarketingAttribution {
  return sanitizeMarketingAttribution({
    metaAdsetId: cleanAttributionQueryValue("adset_id", adset.id),
    metaAdsetName: text(adset.name),
    metaCampaignId: cleanAttributionQueryValue("campaign_id", adset.campaign?.id),
    metaCampaignName: text(adset.campaign?.name),
  });
}

async function graphGet<T>(
  path: string,
  accessToken: string,
  fields: string,
  fetchImpl: FetchLike,
): Promise<T | null> {
  const url = new URL(`https://graph.facebook.com/${META_API_VERSION}/${path}`);
  url.searchParams.set("access_token", accessToken);
  url.searchParams.set("fields", fields);

  try {
    const response = await fetchImpl(url.toString(), { cache: "no-store" });
    if (!response.ok) {
      console.error(`[meta:attribution] hierarchy enrichment failed with HTTP ${response.status}`);
      return null;
    }
    const json = await response.json() as T & MetaGraphErrorResponse;
    if (json.error) {
      console.error("[meta:attribution] hierarchy enrichment returned a Meta API error");
      return null;
    }
    return json as T;
  } catch (error) {
    console.error("[meta:attribution] hierarchy enrichment fetch failed", error instanceof Error ? error.message : String(error));
    return null;
  }
}

export async function enrichMetaAttributionHierarchy(input: {
  accessToken?: string;
  attribution?: MarketingAttribution;
  fetchImpl?: FetchLike;
}): Promise<MarketingAttribution> {
  const base = sanitizeMarketingAttribution(input.attribution);
  const accessToken = input.accessToken?.trim();
  const fetchImpl = input.fetchImpl ?? fetch;

  if (!accessToken || (!base.metaAdId && !base.metaAdsetId)) return base;

  if (needsAdLookup(base)) {
    const metaAdId = base.metaAdId;
    if (!metaAdId) return base;
    const ad = await graphGet<MetaGraphAd>(
      encodeURIComponent(metaAdId),
      accessToken,
      "id,name,adset{id,name,campaign{id,name}}",
      fetchImpl,
    );
    return ad ? fillMissingAttribution(base, attributionFromAd(ad)) : base;
  }

  if (needsAdsetLookup(base)) {
    const metaAdsetId = base.metaAdsetId;
    if (!metaAdsetId) return base;
    const adset = await graphGet<MetaGraphAdset>(
      encodeURIComponent(metaAdsetId),
      accessToken,
      "id,name,campaign{id,name}",
      fetchImpl,
    );
    return adset ? fillMissingAttribution(base, attributionFromAdset(adset)) : base;
  }

  return base;
}
