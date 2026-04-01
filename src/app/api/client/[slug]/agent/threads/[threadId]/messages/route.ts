import { NextResponse } from "next/server";
import { z } from "zod";
import { validateRequest } from "@/lib/api-helpers";
import { sendMessage } from "@/features/client-agent/server";

const SendMessageSchema = z.object({
  message: z.string().trim().min(1),
  client_request_id: z.string().min(1).optional(),
  client_generated_id: z.string().min(1).optional(),
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
  const clientRequestId =
    parsed.data.client_request_id ?? parsed.data.client_generated_id ?? crypto.randomUUID();
  const result = await sendMessage({
    slug,
    threadId,
    message: parsed.data.message,
    clientGeneratedId: clientRequestId,
  });

  if (result.ok && result.body.status === "queued") {
    return NextResponse.json(
      {
        ...result.body,
        client_request_id: clientRequestId,
      },
      { status: result.status },
    );
  }

  return NextResponse.json(result.body, { status: result.status });
}
