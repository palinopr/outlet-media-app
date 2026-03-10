import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import type { ZodType } from "zod";

/** Return a JSON error response. Defaults to 500 if no status provided. */
export function apiError(message: string, status = 500): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

/** Log real DB/Supabase error and return a generic message to the client. */
export function dbError(err: { message: string }, status = 500): NextResponse {
  console.error("[db]", err.message);
  return apiError("Database error", status);
}

/** Check Clerk auth. Returns userId on success, or a 401 error response. */
export async function authGuard(): Promise<
  { userId: string; error: null } | { userId: null; error: NextResponse }
> {
  const { userId } = await auth();
  if (!userId) {
    return { userId: null, error: apiError("Unauthenticated", 401) };
  }
  return { userId, error: null };
}

/** Validate INGEST_SECRET. Returns error Response if invalid, null if OK. */
export function secretGuard(secret: unknown): Response | null {
  if (!process.env.INGEST_SECRET || secret !== process.env.INGEST_SECRET) {
    return apiError("Unauthorized", 401);
  }
  return null;
}

/** Check Clerk auth + admin role. Returns error Response if not admin, null if OK. */
export async function adminGuard(): Promise<Response | null> {
  const { error } = await authGuard();
  if (error) return error;

  const caller = await currentUser();
  const meta = caller?.publicMetadata ?? {};
  const role =
    typeof meta === "object" &&
    meta !== null &&
    "role" in meta &&
    typeof (meta as Record<string, unknown>).role === "string"
      ? ((meta as Record<string, unknown>).role as string)
      : undefined;
  if (role !== "admin") {
    return apiError("Forbidden", 403);
  }
  return null;
}

/** Parse JSON body with error handling. Returns parsed data or a 400 NextResponse. */
export async function parseJsonBody<T>(request: Request): Promise<T | NextResponse> {
  try {
    return (await request.json()) as T;
  } catch {
    return apiError("Malformed JSON body", 400);
  }
}

/**
 * Parse + validate a JSON request body against a Zod schema.
 * Returns `{ data, error: null }` on success, or `{ data: null, error: Response }` on failure.
 */
export async function validateRequest<T>(
  request: Request,
  schema: ZodType<T>,
): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
  const raw = await parseJsonBody<unknown>(request);
  if (raw instanceof NextResponse) return { data: null, error: raw };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      data: null,
      error: NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      ),
    };
  }
  return { data: parsed.data, error: null };
}

// ─── Shared helpers (extracted from comment + approval routes) ──────────

/** Extract a display name from a Clerk user object. Returns "Unknown" if no name parts exist. */
export function getAuthorName(user: {
  firstName?: string | null;
  lastName?: string | null;
} | null): string {
  return [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Unknown";
}

/** Determine whether a new comment thread needs agent triage/review. */
export function shouldEnqueueCommentTriage(options: {
  isAdmin: boolean;
  parentCommentId?: string;
  visibility: string;
}): boolean {
  return !options.isAdmin && !options.parentCommentId && options.visibility === "shared";
}

/** Check whether a role value represents an admin. */
export function isAdminRole(role: unknown): boolean {
  return typeof role === "string" && role === "admin";
}
