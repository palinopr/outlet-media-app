import { NextResponse } from "next/server";
import { z } from "zod";

import { clientAgentWorkerGuard, validateRequest } from "@/lib/api-helpers";
import { runTool, WorkerToolNameSchema } from "@/features/client-agent/worker-api";

const WorkerToolRequestSchema = z.object({
  task_id: z.string().min(1),
  tool_name: WorkerToolNameSchema,
  args: z.unknown(),
});

export async function POST(request: Request) {
  const guard = clientAgentWorkerGuard(request.headers.get("Authorization"));
  if (guard) {
    return guard;
  }

  const parsed = await validateRequest(request, WorkerToolRequestSchema);
  if (parsed.error) {
    return parsed.error;
  }

  const result = await runTool({
    taskId: parsed.data.task_id,
    toolName: parsed.data.tool_name,
    args: parsed.data.args,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result.body);
}
