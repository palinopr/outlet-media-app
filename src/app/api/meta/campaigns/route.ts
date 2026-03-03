import { NextResponse } from "next/server";
import { authGuard, apiError, parseJsonBody } from "@/lib/api-helpers";
import { getClientToken } from "@/lib/client-token";
import { CampaignCreateSchema } from "@/lib/api-schemas";
import { META_API_VERSION } from "@/lib/constants";

export async function POST(request: Request) {
  const { userId, error: authErr } = await authGuard();
  if (authErr) return authErr;

  const raw = await parseJsonBody<unknown>(request);
  if (raw instanceof Response) return raw;

  const parsed = CampaignCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { ad_account_id, client_slug, name, objective, daily_budget, targeting, placements, creative } =
    parsed.data;

  const token = await getClientToken(client_slug, ad_account_id);
  if (!token) {
    return apiError("Ad account not connected or token expired", 403);
  }

  const accountId = ad_account_id.replace(/^act_/, "");

  try {
    // Step 1: Create campaign
    const campaignRes = await fetch(
      `https://graph.facebook.com/${META_API_VERSION}/act_${accountId}/campaigns`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          access_token: token,
          name,
          objective,
          status: "PAUSED",
          special_ad_categories: "[]",
        }),
      }
    );
    if (!campaignRes.ok) {
      const err = await campaignRes.json().catch(() => ({}));
      return apiError(`Campaign creation failed: ${err.error?.message ?? "Unknown error"}`, 400);
    }
    const { id: campaignId } = await campaignRes.json();

    // Step 2: Create ad set
    const targetingWithPlacements = placements
      ? { ...targeting, ...placements }
      : targeting;

    const adSetRes = await fetch(
      `https://graph.facebook.com/${META_API_VERSION}/act_${accountId}/adsets`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          access_token: token,
          campaign_id: campaignId,
          name: `${name} - Ad Set`,
          daily_budget: String(daily_budget),
          billing_event: "IMPRESSIONS",
          optimization_goal: objective === "OUTCOME_SALES" ? "OFFSITE_CONVERSIONS" : "LINK_CLICKS",
          bid_strategy: "LOWEST_COST_WITHOUT_CAP",
          targeting: JSON.stringify(targetingWithPlacements),
          status: "PAUSED",
        }),
      }
    );
    if (!adSetRes.ok) {
      const err = await adSetRes.json().catch(() => ({}));
      return apiError(`Ad set creation failed: ${err.error?.message ?? "Unknown error"}`, 400);
    }
    const { id: adSetId } = await adSetRes.json();

    // Step 3: Create ad with creative
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

    const adRes = await fetch(
      `https://graph.facebook.com/${META_API_VERSION}/act_${accountId}/ads`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          access_token: token,
          adset_id: adSetId,
          name: `${name} - Ad`,
          status: "PAUSED",
          creative: JSON.stringify(adCreative),
        }),
      }
    );
    if (!adRes.ok) {
      const err = await adRes.json().catch(() => ({}));
      return apiError(`Ad creation failed: ${err.error?.message ?? "Unknown error"}`, 400);
    }
    const { id: adId } = await adRes.json();

    return NextResponse.json({
      campaign_id: campaignId,
      adset_id: adSetId,
      ad_id: adId,
    });
  } catch (err) {
    console.error("Campaign creation error:", err);
    return apiError("Campaign creation failed", 500);
  }
}
