import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const adAccountId = searchParams.get("account_id") ?? process.env.META_AD_ACCOUNT_ID;

  if (!process.env.META_ACCESS_TOKEN || !adAccountId) {
    return NextResponse.json({ error: "Meta API credentials not configured" }, { status: 500 });
  }

  const url = new URL(`https://graph.facebook.com/v21.0/act_${adAccountId}/campaigns`);
  url.searchParams.set("access_token", process.env.META_ACCESS_TOKEN);
  url.searchParams.set("fields", "id,name,status,objective,daily_budget,lifetime_budget");

  const res = await fetch(url.toString());
  const data = await res.json();

  return NextResponse.json(data);
}
