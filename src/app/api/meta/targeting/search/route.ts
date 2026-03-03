import { NextResponse } from "next/server";
import { authGuard, apiError } from "@/lib/api-helpers";
import { getClientToken } from "@/lib/client-token";
import { META_API_VERSION } from "@/lib/constants";

export async function GET(request: Request) {
  const { error: authErr } = await authGuard();
  if (authErr) return authErr;

  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const slug = url.searchParams.get("slug");
  const accountId = url.searchParams.get("account_id");

  if (!q || !slug || !accountId) {
    return apiError("Missing q, slug, or account_id", 400);
  }

  const token = await getClientToken(slug, accountId);
  if (!token) return apiError("Ad account not connected", 403);

  const res = await fetch(
    `https://graph.facebook.com/${META_API_VERSION}/search?type=adinterest&q=${encodeURIComponent(q)}&access_token=${token}`
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return apiError(`Search failed: ${err.error?.message ?? "Unknown"}`, 400);
  }

  const data = await res.json();
  return NextResponse.json(data);
}
