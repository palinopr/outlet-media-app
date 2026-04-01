import { NextResponse } from "next/server";
import { z } from "zod";

import { clientAgentWorkerGuard, validateRequest } from "@/lib/api-helpers";
import { AgentAnswerBlockSchema, ReferencedEntitySchema, ResolvedRangeSchema } from "@/features/client-agent/types";
import { ThreadContextPayloadSchema } from "@/features/client-agent/thread-context";
import { resolveTask } from "@/features/client-agent/worker-api";

const ResolveTaskSchema = z.object({
  status: z.enum(["answer", "clarify", "refuse", "error"]),
  text: z.string().trim().min(1),
  blocks: z.array(AgentAnswerBlockSchema).default([]),
  referenced_entities: z.array(ReferencedEntitySchema).default([]),
  context_payload: ThreadContextPayloadSchema.nullable().default(null),
  resolved_range: ResolvedRangeSchema.nullable().default(null),
  provider_response_id: z.string().min(1).nullable().default(null),
});

type RouteContext = {
  params: Promise<{
    taskId: string;
  }>;
};

export async function POST(request: Request, context: RouteContext) {
  const guard = clientAgentWorkerGuard(request.headers.get("Authorization"));
  if (guard) {
    return guard;
  }

  const parsed = await validateRequest(request, ResolveTaskSchema);
  if (parsed.error) {
    return parsed.error;
  }

  const { taskId } = await context.params;
  const result = await resolveTask(taskId, {
    status: parsed.data.status,
    text: parsed.data.text,
    blocks: parsed.data.blocks,
    referencedEntities: parsed.data.referenced_entities,
    contextPayload: parsed.data.context_payload,
    resolvedRange: parsed.data.resolved_range,
    providerResponseId: parsed.data.provider_response_id,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result.body);
}
