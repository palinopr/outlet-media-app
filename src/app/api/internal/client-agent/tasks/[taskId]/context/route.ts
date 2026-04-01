import { NextResponse } from "next/server";

import { clientAgentWorkerGuard } from "@/lib/api-helpers";
import { getTaskContext } from "@/features/client-agent/worker-api";

type RouteContext = {
  params: Promise<{
    taskId: string;
  }>;
};

export async function GET(request: Request, context: RouteContext) {
  const guard = clientAgentWorkerGuard(request.headers.get("Authorization"));
  if (guard) {
    return guard;
  }

  const { taskId } = await context.params;
  const result = await getTaskContext(taskId);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result.context);
}
