import { NextResponse } from "next/server";
import { z } from "zod";
import { adminGuard, apiError, secretGuard } from "@/lib/api-helpers";
import { createTm1ClientFromEnv, Tm1ClientError } from "@/lib/ticketmaster/tm1-client";

const StringIdSchema = z.union([z.string().min(1), z.number()]).transform((value) => String(value));

const PlaceSelectionSchema = z.object({
  sectionId: StringIdSchema,
  rowId: StringIdSchema,
  placeId: StringIdSchema,
  source: z.unknown().optional(),
});

const RowSelectionSchema = z.object({
  sectionId: StringIdSchema,
  rowId: StringIdSchema,
  source: z.unknown().optional(),
});

const ReservedSectionSelectionSchema = z.object({
  sectionId: StringIdSchema,
  source: z.unknown().optional(),
});

const PartialGaSelectionSchema = z.object({
  sectionId: StringIdSchema,
  sources: z.array(z.unknown()),
});

const FullGaSelectionSchema = z.object({
  sectionId: StringIdSchema,
  source: z.unknown(),
});

const BackendSelectionSchema = z.object({
  placeSelections: z.array(PlaceSelectionSchema).optional(),
  rowSelections: z.array(RowSelectionSchema).optional(),
  rsSectionSelections: z.array(ReservedSectionSelectionSchema).optional(),
  partialGaSelections: z.array(PartialGaSelectionSchema).optional(),
  fullGaSelections: z.array(FullGaSelectionSchema).optional(),
});

const AllocationTargetSchema = z.object({
  kind: z.literal("allocation"),
  targetId: StringIdSchema,
  allocationDisplayName: z.string().min(1, "allocationDisplayName is required"),
});

const ResolutionStatusSchema = z.enum(["ACCEPTED", "DECLINED", "DELETED"]);

const BodySchema = z.object({
  eventId: z.string().min(1, "eventId is required"),
  message: z.string().optional(),
  selection: BackendSelectionSchema,
  target: AllocationTargetSchema,
  totalPlaces: z.number().int().positive().optional(),
  resolveStatus: ResolutionStatusSchema.optional(),
  resolutionMessage: z.string().optional(),
  secret: z.string().optional(),
});

async function guard(request: Request, bodySecret?: string): Promise<Response | null> {
  const url = new URL(request.url);
  const authHeader = request.headers.get("authorization");
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : null;
  const secret = bearer ?? bodySecret ?? url.searchParams.get("secret");

  if (secret) {
    const secretErr = secretGuard(secret);
    if (!secretErr) return null;
  }

  return adminGuard();
}

export async function POST(request: Request) {
  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch {
    return apiError("Malformed JSON body", 400);
  }

  const bodySecret =
    typeof rawBody === "object" &&
    rawBody !== null &&
    "secret" in rawBody &&
    typeof rawBody.secret === "string"
      ? rawBody.secret
      : undefined;
  const authErr = await guard(request, bodySecret);
  if (authErr) return authErr;

  const parsed = BodySchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const client = createTm1ClientFromEnv();
    const requestResult = await client.requestMoveToAllocation({
      eventId: parsed.data.eventId,
      message: parsed.data.message,
      selection: parsed.data.selection,
      target: parsed.data.target,
      totalPlaces: parsed.data.totalPlaces,
    });

    const resolution = parsed.data.resolveStatus
      ? await client.resolveChangeRequest({
          eventId: parsed.data.eventId,
          requestId: requestResult.requestId,
          status: parsed.data.resolveStatus,
          message: parsed.data.resolutionMessage,
        })
      : null;

    return NextResponse.json({
      ok: true,
      request: requestResult,
      resolution,
      capabilities: {
        browserlessRead: true,
        collaborationChangeRequestsReady: true,
      },
      notes: [
        "This route creates TM1 collaboration change requests instead of posting direct inventory moveSelection writes.",
        "Use resolveStatus only when you intentionally want the same TM1 session to resolve the created request.",
      ],
    });
  } catch (error) {
    if (error instanceof Tm1ClientError) {
      return apiError(error.message, error.status || 502);
    }

    return apiError(
      error instanceof Error ? error.message : "TM1 request-move-selection failed",
      500,
    );
  }
}
