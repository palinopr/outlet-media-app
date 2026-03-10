import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { IngestPayloadSchema } from "@/lib/api-schemas";
import { apiError, secretGuard, validateRequest } from "@/lib/api-helpers";
import { ingestTmEvents } from "./ingest-tm-events";
import { ingestMetaCampaigns } from "./ingest-meta-campaigns";
import { ingestTmDemographics } from "./ingest-tm-demographics";

export async function POST(request: Request) {
  const { data: body, error: valErr } = await validateRequest(request, IngestPayloadSchema);
  if (valErr) return valErr;

  const secretErr = secretGuard(body.secret);
  if (secretErr) return secretErr;

  if (!supabaseAdmin) {
    return apiError("Database not configured. Set SUPABASE_SERVICE_ROLE_KEY.", 500);
  }

  if (body.source === "ticketmaster_one") return ingestTmEvents(body);
  if (body.source === "meta") return ingestMetaCampaigns(body);
  if (body.source === "tm_demographics") return ingestTmDemographics(body);

  return apiError("Unknown source", 400);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secretErr = secretGuard(searchParams.get("secret"));
  if (secretErr) return secretErr;
  return NextResponse.json({
    ok: true,
    message: "Ingest endpoint ready. POST scraped data here.",
    supabase_connected: !!supabaseAdmin,
    sources: ["ticketmaster_one", "meta", "tm_demographics"],
  });
}
