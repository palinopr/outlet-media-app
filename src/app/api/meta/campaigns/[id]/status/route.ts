import { NextResponse } from "next/server";
import { authGuard, apiError, parseJsonBody } from "@/lib/api-helpers";
import { getClientToken } from "@/lib/client-token";
import { META_API_VERSION } from "@/lib/constants";
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
  const raw = await parseJsonBody<unknown>(request);
  if (raw instanceof Response) return raw;

  const parsed = StatusSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const token = await getClientToken(parsed.data.client_slug, parsed.data.ad_account_id);
  if (!token) return apiError("Ad account not connected", 403);

  const res = await fetch(
    `https://graph.facebook.com/${META_API_VERSION}/${campaignId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        access_token: token,
        status: parsed.data.status,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return apiError(`Status update failed: ${err.error?.message ?? "Unknown"}`, 400);
  }

  return NextResponse.json({ ok: true, status: parsed.data.status });
}
