import { NextResponse } from "next/server";
import { authGuard, apiError, validateRequest } from "@/lib/api-helpers";
import { getClientToken } from "@/lib/client-token";
import { META_API_VERSION } from "@/lib/constants";
import { fetchMetaApi, MetaApiError } from "@/lib/meta-api";
import { z } from "zod/v4";

const UpdateSchema = z.object({
  ad_account_id: z.string().min(1),
  client_slug: z.string().min(1),
  name: z.string().min(1).optional(),
  daily_budget: z.number().int().min(100).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authErr } = await authGuard();
  if (authErr) return authErr;

  const { id: campaignId } = await params;
  const { data, error: valErr } = await validateRequest(request, UpdateSchema);
  if (valErr) return valErr;

  const token = await getClientToken(data.client_slug, data.ad_account_id);
  if (!token) return apiError("Ad account not connected", 403);

  const params2: Record<string, string> = {};
  if (data.name) params2.name = data.name;
  if (data.daily_budget) params2.daily_budget = String(data.daily_budget);

  try {
    const url = `https://graph.facebook.com/${META_API_VERSION}/${campaignId}`;
    await fetchMetaApi(url, token, "POST", params2);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof MetaApiError) return apiError(err.message, 400);
    return apiError("Update failed", 500);
  }
}
