import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { authGuard, apiError, parseJsonBody } from "@/lib/api-helpers";

const ProfileSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
});

export async function POST(request: Request) {
  const { userId, error } = await authGuard();
  if (error) return error;

  const raw = await parseJsonBody<unknown>(request);
  if (raw instanceof Response) return raw;

  const parsed = ProfileSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const client = await clerkClient();
  await client.users.updateUser(userId, {
    firstName: parsed.data.firstName,
    lastName: parsed.data.lastName,
  });

  return NextResponse.json({ ok: true });
}
