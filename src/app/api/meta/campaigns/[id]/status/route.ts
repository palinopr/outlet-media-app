import { NextResponse } from "next/server";
import { authGuard, apiError, validateRequest } from "@/lib/api-helpers";
import { getClientToken } from "@/lib/client-token";
import { META_API_VERSION } from "@/lib/constants";
import { fetchMetaApi, MetaApiError } from "@/lib/meta-api";
import { z } from "zod/v4";

const StatusSchema = z.object({
  ad_account_id: z.string().min(1),
  client_slug: z.string().min(1),
  status: z.enum(["ACTIVE", "PAUSED"]),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authErr } = await authGuard();
  if (authErr) return authErr;

  const { id: campaignId } = await params;
  const { data, error: valErr } = await validateRequest(request, StatusSchema);
  if (valErr) return valErr;

  const token = await getClientToken(data.client_slug, data.ad_account_id);
  if (!token) return apiError("Ad account not connected", 403);

  try {
    const url = `https://graph.facebook.com/${META_API_VERSION}/${campaignId}`;
    await fetchMetaApi(url, token, "POST", { status: data.status });
    return NextResponse.json({ ok: true, status: data.status });
  } catch (err) {
    if (err instanceof MetaApiError) return apiError(err.message, 400);
    return apiError("Status update failed", 500);
  }
}
