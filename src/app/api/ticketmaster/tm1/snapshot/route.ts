import { NextResponse } from "next/server";
import { z } from "zod";
import { adminGuard, apiError, secretGuard } from "@/lib/api-helpers";
import { createTm1ClientFromEnv, Tm1ClientError } from "@/lib/ticketmaster/tm1-client";

const QuerySchema = z.object({
  eventId: z.string().min(1, "eventId is required"),
  eventStartDate: z.string().optional(),
  eventEndDate: z.string().optional(),
  includeRaw: z.enum(["0", "1", "false", "true"]).optional(),
  reportStartDate: z.string().optional(),
  reportEndDate: z.string().optional(),
  secret: z.string().optional(),
});

function wantsRaw(value: string | undefined): boolean {
  return value === "1" || value === "true";
}

async function guard(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  const authHeader = request.headers.get("authorization");
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : null;
  const secret = bearer ?? url.searchParams.get("secret");
  if (secret) {
    const secretErr = secretGuard(secret);
    if (!secretErr) return null;
  }
  return adminGuard();
}

export async function GET(request: Request) {
  const authErr = await guard(request);
  if (authErr) return authErr;

  const url = new URL(request.url);
  const parsed = QuerySchema.safeParse({
    eventId: url.searchParams.get("eventId") ?? "",
    eventStartDate: url.searchParams.get("eventStartDate") ?? undefined,
    eventEndDate: url.searchParams.get("eventEndDate") ?? undefined,
    includeRaw: url.searchParams.get("includeRaw") ?? undefined,
    reportStartDate: url.searchParams.get("reportStartDate") ?? undefined,
    reportEndDate: url.searchParams.get("reportEndDate") ?? undefined,
    secret: url.searchParams.get("secret") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const client = createTm1ClientFromEnv();
    const snapshot = await client.getEventSnapshot({
      eventId: parsed.data.eventId,
      eventStartDate: parsed.data.eventStartDate,
      eventEndDate: parsed.data.eventEndDate,
      reportStartDate: parsed.data.reportStartDate,
      reportEndDate: parsed.data.reportEndDate,
      includeRaw: wantsRaw(parsed.data.includeRaw),
    });

    return NextResponse.json({
      ok: true,
      snapshot,
      capabilities: {
        browserlessRead: true,
        dynamicSeatingWritesReady: true,
      },
      notes: [
        "This route uses direct TM1 HTTP calls with env-based session auth, not a browser session.",
        "Seat-move writes are available through /api/ticketmaster/tm1/move-selection for open and allocation targets.",
      ],
    });
  } catch (error) {
    if (error instanceof Tm1ClientError) {
      return apiError(error.message, error.status || 502);
    }
    return apiError(
      error instanceof Error ? error.message : "TM1 snapshot failed",
      500,
    );
  }
}
