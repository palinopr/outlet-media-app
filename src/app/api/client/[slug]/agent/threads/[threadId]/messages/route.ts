import { NextResponse } from "next/server";
import { z } from "zod";
import { validateRequest } from "@/lib/api-helpers";
import { sendMessage } from "@/features/client-agent/server";

const SendMessageSchema = z.object({
  message: z.string().trim().min(1),
  client_generated_id: z.string().min(1).optional(),
  history: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      text: z.string(),
    }),
  ).max(6).optional(),
});

type RouteContext = {
  params: Promise<{
    slug: string;
    threadId: string;
  }>;
};

export async function POST(request: Request, context: RouteContext) {
  const parsed = await validateRequest(request, SendMessageSchema);
  if (parsed.error) {
    return parsed.error;
  }

  const { slug, threadId } = await context.params;
  const result = await sendMessage({
    slug,
    threadId,
    message: parsed.data.message,
    clientGeneratedId: parsed.data.client_generated_id,
    history: parsed.data.history,
  });

  return NextResponse.json(result.body, { status: result.status });
}
