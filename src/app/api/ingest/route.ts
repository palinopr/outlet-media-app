import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { IngestPayloadSchema } from "@/lib/api-schemas";
import { apiError, secretGuard, validateRequest } from "@/lib/api-helpers";
import { enforceContentLength, enforceRateLimit } from "@/lib/request-guards";
import { ingestMetaCampaigns } from "./ingest-meta-campaigns";

export async function POST(request: Request) {
  const sizeError = enforceContentLength(request, 5 * 1024 * 1024);
  if (sizeError) return sizeError;

  const rateLimitError = enforceRateLimit(request, {
    limit: 120,
    scope: "ingest",
    windowMs: 60_000,
  });
  if (rateLimitError) return rateLimitError;

  const { data: body, error: valErr } = await validateRequest(request, IngestPayloadSchema);
  if (valErr) return valErr;

  const secretErr = secretGuard(body.secret);
  if (secretErr) return secretErr;

  if (!supabaseAdmin) {
    return apiError("Database not configured. Set SUPABASE_SERVICE_ROLE_KEY.", 500);
  }

  if (body.source === "meta") return ingestMetaCampaigns(body);

  return apiError("Unknown source", 400);
}

export async function GET(request: Request) {
  const rateLimitError = enforceRateLimit(request, {
    limit: 120,
    scope: "ingest-status",
    windowMs: 60_000,
  });
  if (rateLimitError) return rateLimitError;

  const { searchParams } = new URL(request.url);
  const secretErr = secretGuard(searchParams.get("secret"));
  if (secretErr) return secretErr;
  return NextResponse.json({
    ok: true,
    message: "Ingest endpoint ready. POST scraped data here.",
    supabase_connected: !!supabaseAdmin,
    sources: ["meta"],
  });
}
