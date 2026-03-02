import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { sanitizeId } from "@/lib/api-schemas";

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const rawId = sanitizeId(searchParams.get("account_id")) ?? process.env.META_AD_ACCOUNT_ID;

  if (!process.env.META_ACCESS_TOKEN || !rawId) {
    return NextResponse.json({ error: "Meta API credentials not configured" }, { status: 500 });
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
