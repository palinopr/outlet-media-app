import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

/** Return a JSON error response. Defaults to 500 if no status provided. */
export function apiError(message: string, status = 500): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

/** Return a JSON success response (200). */
export function apiSuccess(data: unknown): NextResponse {
  return NextResponse.json(data);
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
