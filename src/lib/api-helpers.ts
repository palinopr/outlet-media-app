import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

/** Return a JSON error response. Defaults to 500 if no status provided. */
export function apiError(message: string, status = 500): NextResponse {
  return NextResponse.json({ error: message }, { status });
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
  const meta = (caller?.publicMetadata ?? {}) as { role?: string };
  if (meta.role !== "admin") {
    return apiError("Forbidden", 403);
  }
  return null;
}

/** Parse JSON body with error handling. Returns parsed data or a 400 Response. */
export async function parseJsonBody<T>(request: Request): Promise<T | Response> {
  try {
    return (await request.json()) as T;
  } catch {
    return apiError("Malformed JSON body", 400);
  }
}
