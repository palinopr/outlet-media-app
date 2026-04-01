import { NextResponse } from "next/server";
import { getThread } from "@/features/client-agent/server";

type RouteContext = {
  params: Promise<{
    slug: string;
    threadId: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug, threadId } = await context.params;
  const result = await getThread({ slug, threadId });
  return NextResponse.json(result.body, { status: result.status });
}
