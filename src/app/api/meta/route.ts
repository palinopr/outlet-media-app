import { NextResponse } from "next/server";
import { sanitizeId } from "@/lib/api-schemas";
import { authGuard, apiError } from "@/lib/api-helpers";
import { META_API_VERSION } from "@/lib/constants";

export async function GET(request: Request) {
  const { error } = await authGuard();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const rawId = sanitizeId(searchParams.get("account_id")) ?? process.env.META_AD_ACCOUNT_ID;

  if (!process.env.META_ACCESS_TOKEN || !rawId) {
    return apiError("Meta API credentials not configured");
  }

  // Strip act_ prefix if present -- the URL template adds it
  const adAccountId = rawId.replace(/^act_/, "");

  const url = new URL(`https://graph.facebook.com/${META_API_VERSION}/act_${adAccountId}/campaigns`);
  url.searchParams.set("access_token", process.env.META_ACCESS_TOKEN);
  url.searchParams.set("fields", "id,name,status,objective,daily_budget,lifetime_budget");

  const res = await fetch(url.toString());

  if (!res.ok) {
    return apiError(`Meta API returned ${res.status}`, res.status);
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    return apiError("Meta API returned invalid JSON", 502);
  }

  return NextResponse.json(data);
}
