import { NextResponse } from "next/server";
import { sanitizeId } from "@/lib/api-schemas";
import { authGuard, apiError } from "@/lib/api-helpers";

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

  const url = new URL(`https://graph.facebook.com/v21.0/act_${adAccountId}/campaigns`);
  url.searchParams.set("access_token", process.env.META_ACCESS_TOKEN);
  url.searchParams.set("fields", "id,name,status,objective,daily_budget,lifetime_budget");

  const res = await fetch(url.toString());
  const data = await res.json();

  return NextResponse.json(data);
}
