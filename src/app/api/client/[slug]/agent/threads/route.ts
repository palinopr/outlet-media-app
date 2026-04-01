import { NextResponse } from "next/server";
import { createThread, listThreads } from "@/features/client-agent/server";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const result = await listThreads({ slug });
  return NextResponse.json(result.body, { status: result.status });
}

export async function POST(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const result = await createThread({ slug });
  return NextResponse.json(result.body, { status: result.status });
}
