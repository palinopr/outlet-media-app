import { NextResponse } from "next/server";
import { authGuard, apiError, validateRequest } from "@/lib/api-helpers";
import { getClientToken } from "@/lib/client-token";
import { CampaignCreateSchema } from "@/lib/api-schemas";
import { META_API_VERSION } from "@/lib/constants";
import { fetchMetaApi, MetaApiError } from "@/lib/meta-api";
import { requireClientOwner } from "@/features/client-portal/ownership";

export async function POST(request: Request) {
  const { userId, error: authErr } = await authGuard();
  if (authErr) return authErr;

  const { data, error: valErr } = await validateRequest(request, CampaignCreateSchema);
  if (valErr) return valErr;

  const { ad_account_id, client_slug, name, objective, daily_budget, targeting, placements, creative } =
    data;
  const ownerGuard = await requireClientOwner(userId, client_slug, "manage Meta campaigns");
  if (ownerGuard) return ownerGuard;

  const token = await getClientToken(client_slug, ad_account_id);
  if (!token) {
    return apiError("Ad account not connected or token expired", 403);
  }

  const accountId = ad_account_id.replace(/^act_/, "");

  try {
    const campaignUrl = `https://graph.facebook.com/${META_API_VERSION}/act_${accountId}/campaigns`;
    const { id: campaignId } = await fetchMetaApi<{ id: string }>(campaignUrl, token, "POST", {
      name,
      objective,
      status: "PAUSED",
      special_ad_categories: "[]",
    });

    const targetingWithPlacements = placements
      ? { ...targeting, ...placements }
      : targeting;

    const adSetUrl = `https://graph.facebook.com/${META_API_VERSION}/act_${accountId}/adsets`;
    const { id: adSetId } = await fetchMetaApi<{ id: string }>(adSetUrl, token, "POST", {
      campaign_id: campaignId,
      name: `${name} - Ad Set`,
      daily_budget: String(daily_budget),
      billing_event: "IMPRESSIONS",
      optimization_goal: objective === "OUTCOME_SALES" ? "OFFSITE_CONVERSIONS" : "LINK_CLICKS",
      bid_strategy: "LOWEST_COST_WITHOUT_CAP",
      targeting: JSON.stringify(targetingWithPlacements),
      status: "PAUSED",
    });

    const adCreative: Record<string, unknown> = {
      object_story_spec: {
        page_id: process.env.META_PAGE_ID ?? "",
        link_data: {
          message: creative.primary_text,
          link: creative.link_url ?? "",
          name: creative.headline ?? "",
          description: creative.description ?? "",
          call_to_action: creative.call_to_action
            ? { type: creative.call_to_action }
            : undefined,
          image_hash: creative.image_hash,
        },
      },
    };

    const adUrl = `https://graph.facebook.com/${META_API_VERSION}/act_${accountId}/ads`;
    const { id: adId } = await fetchMetaApi<{ id: string }>(adUrl, token, "POST", {
      adset_id: adSetId,
      name: `${name} - Ad`,
      status: "PAUSED",
      creative: JSON.stringify(adCreative),
    });

    return NextResponse.json({
      campaign_id: campaignId,
      adset_id: adSetId,
      ad_id: adId,
    });
  } catch (err) {
    if (err instanceof MetaApiError) {
      return apiError(err.message, 400);
    }
    console.error("Campaign creation error:", err);
    return apiError("Campaign creation failed", 500);
  }
}
