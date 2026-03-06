import { NextResponse, type NextRequest } from "next/server";
import { adminGuard, apiError, parseJsonBody } from "@/lib/api-helpers";
import { getCurrentActor } from "@/features/system-events/server";
import { getAgentOutcomeContext } from "@/features/agent-outcomes/server";
import { jsonToText } from "@/features/agent-outcomes/summary";
import { createSystemCampaignActionItem } from "@/features/campaign-action-items/server";

function compactText(value: string, limit = 240) {
  const normalized = value.trim().replace(/\s+/g, " ");
  if (normalized.length <= limit) return normalized;
  return `${normalized.slice(0, limit - 1)}…`;
}

function metadataString(metadata: Record<string, unknown>, key: string) {
  const value = metadata[key];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function agentLabel(agentId: string) {
  switch (agentId) {
    case "meta-ads":
      return "Meta Ads";
    case "campaign-monitor":
      return "Campaign Monitor";
    case "tm-monitor":
      return "TM Monitor";
    case "assistant":
      return "Assistant";
    default:
      return agentId.replace(/-/g, " ");
  }
}

function buildActionItemTitle(context: NonNullable<Awaited<ReturnType<typeof getAgentOutcomeContext>>>) {
  const agentName = agentLabel(context.task?.toAgent ?? "assistant");

  if (context.task?.status === "failed") {
    return `Investigate ${agentName} outcome`;
  }

  if (context.task?.toAgent === "meta-ads") {
    return "Review Meta Ads recommendation";
  }

  return `Review ${agentName} outcome`;
}

function buildActionItemDescription(
  context: NonNullable<Awaited<ReturnType<typeof getAgentOutcomeContext>>>,
) {
  const outcomeText = context.task?.error ?? jsonToText(context.task?.result ?? null);
  const sections = [
    `Request: ${compactText(context.request.summary, 300)}`,
    context.request.detail ? `Request detail: ${compactText(context.request.detail, 600)}` : null,
    context.task
      ? `Agent: ${agentLabel(context.task.toAgent)} (${context.task.action})`
      : "Agent task record is not available yet.",
    outcomeText ? `Outcome: ${compactText(outcomeText, 1600)}` : null,
  ];

  return sections.filter(Boolean).join("\n\n");
}

export async function POST(request: NextRequest) {
  const guard = await adminGuard();
  if (guard) return guard;

  const parsed = await parseJsonBody<{ taskId?: string }>(request);
  if (parsed instanceof Response) return parsed;

  const taskId = parsed.taskId?.trim();
  if (!taskId) return apiError("taskId is required", 400);

  const context = await getAgentOutcomeContext(taskId);
  if (!context) return apiError("Agent outcome not found", 404);

  if (context.linkedActionItemId) {
    return NextResponse.json({ itemId: context.linkedActionItemId }, { status: 200 });
  }

  if (!context.task) {
    return apiError("Agent outcome is not ready yet", 409);
  }

  if (context.task.status === "pending" || context.task.status === "running") {
    return apiError("Wait for the agent outcome before creating a follow-up action", 409);
  }

  const campaignId = metadataString(context.request.metadata, "campaignId");
  const clientSlug =
    context.request.clientSlug ?? metadataString(context.request.metadata, "clientSlug");

  if (!campaignId || !clientSlug) {
    return apiError("Agent outcome is missing campaign context", 400);
  }

  const actor = await getCurrentActor();
  const item = await createSystemCampaignActionItem({
    actorId: actor.actorId,
    actorName: actor.actorName,
    actorType: actor.actorType,
    campaignId,
    clientSlug,
    description: buildActionItemDescription(context),
    priority: context.task.status === "failed" ? "high" : "medium",
    sourceEntityId: taskId,
    sourceEntityType: "agent_task",
    status: "todo",
    title: buildActionItemTitle(context),
    visibility: context.request.visibility,
  });

  if (!item) return apiError("Failed to create action item", 500);

  return NextResponse.json({ item }, { status: 201 });
}
