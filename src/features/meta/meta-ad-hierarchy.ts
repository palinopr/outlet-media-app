import {
  cleanAttributionQueryValue,
  sanitizeMarketingAttribution,
  type MarketingAttribution,
} from "@/features/meta/attribution";
import { META_API_VERSION } from "@/lib/constants";

type MetaGraphEntity = {
  id?: string;
  name?: string;
};

type MetaGraphAd = MetaGraphEntity & {
  adset?: MetaGraphEntity;
  campaign?: MetaGraphEntity;
};

type FetchLike = typeof fetch;

type ResolveMetaAdHierarchyOptions = {
  accessToken?: string;
  fetchFn?: FetchLike;
  timeoutMs?: number;
};

const adHierarchyCache = new Map<string, Promise<MarketingAttribution>>();

function cleanMetaName(key: "ad_name" | "adset_name" | "campaign_name", value: unknown) {
  return cleanAttributionQueryValue(key, typeof value === "string" ? value : undefined);
}

function attributionFromGraphAd(ad: MetaGraphAd): MarketingAttribution {
  return sanitizeMarketingAttribution({
    metaAdId: cleanAttributionQueryValue("ad_id", ad.id),
    metaAdName: cleanMetaName("ad_name", ad.name),
    metaAdsetId: cleanAttributionQueryValue("adset_id", ad.adset?.id),
    metaAdsetName: cleanMetaName("adset_name", ad.adset?.name),
    metaCampaignId: cleanAttributionQueryValue("campaign_id", ad.campaign?.id),
    metaCampaignName: cleanMetaName("campaign_name", ad.campaign?.name),
  });
}

async function fetchMetaAdHierarchy(
  adId: string,
  options: ResolveMetaAdHierarchyOptions,
): Promise<MarketingAttribution> {
  const accessToken = options.accessToken || process.env.META_CAPI_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN || "";
  if (!accessToken) return {};

  const endpoint = new URL(`https://graph.facebook.com/${META_API_VERSION}/${adId}`);
  endpoint.searchParams.set("fields", "id,name,adset{id,name},campaign{id,name}");
  endpoint.searchParams.set("access_token", accessToken);

  const controller = new AbortController();
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    const response = await Promise.race([
      (options.fetchFn ?? fetch)(endpoint.toString(), { signal: controller.signal }),
      new Promise<Response>((_, reject) => {
        timeout = setTimeout(() => {
          controller.abort();
          reject(new Error("meta_ad_hierarchy_timeout"));
        }, options.timeoutMs ?? 1_200);
      }),
    ]);
    const text = await response.text();
    let body: unknown = text;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = text;
    }

    if (!response.ok || !body || typeof body !== "object" || "error" in body) {
      console.warn(`[meta:capi] failed to resolve Meta ad hierarchy (${response.status})`);
      return {};
    }

    return attributionFromGraphAd(body as MetaGraphAd);
  } catch {
    console.warn("[meta:capi] failed to resolve Meta ad hierarchy");
    return {};
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

export async function resolveMetaAdHierarchy(
  adId: string | undefined,
  options: ResolveMetaAdHierarchyOptions = {},
): Promise<MarketingAttribution> {
  const sanitizedAdId = cleanAttributionQueryValue("ad_id", adId);
  if (!sanitizedAdId) return {};

  if (options.fetchFn || options.accessToken) {
    return fetchMetaAdHierarchy(sanitizedAdId, options);
  }

  const cached = adHierarchyCache.get(sanitizedAdId);
  if (cached) return cached;

  if (adHierarchyCache.size > 500) adHierarchyCache.clear();
  const promise = fetchMetaAdHierarchy(sanitizedAdId, options).then((result) => {
    if (!result.metaAdName && !result.metaAdsetId && !result.metaCampaignId) {
      adHierarchyCache.delete(sanitizedAdId);
    }
    return result;
  });
  adHierarchyCache.set(sanitizedAdId, promise);
  return promise;
}

export async function enrichAttributionWithMetaAdHierarchy(
  attribution: MarketingAttribution | undefined,
  options: ResolveMetaAdHierarchyOptions = {},
): Promise<MarketingAttribution> {
  const sanitized = sanitizeMarketingAttribution(attribution);
  if (!sanitized.metaAdId) return sanitized;
  if (sanitized.metaAdName && sanitized.metaAdsetId && sanitized.metaAdsetName && sanitized.metaCampaignId && sanitized.metaCampaignName) {
    return sanitized;
  }

  const hierarchy = await resolveMetaAdHierarchy(sanitized.metaAdId, options);
  return sanitizeMarketingAttribution({
    ...sanitized,
    metaAdName: sanitized.metaAdName ?? hierarchy.metaAdName,
    metaAdsetId: sanitized.metaAdsetId ?? hierarchy.metaAdsetId,
    metaAdsetName: sanitized.metaAdsetName ?? hierarchy.metaAdsetName,
    metaCampaignId: sanitized.metaCampaignId ?? hierarchy.metaCampaignId,
    metaCampaignName: sanitized.metaCampaignName ?? hierarchy.metaCampaignName,
  });
}

export function clearMetaAdHierarchyCacheForTests() {
  adHierarchyCache.clear();
}
