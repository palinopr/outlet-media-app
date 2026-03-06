import { NextResponse, type NextRequest } from "next/server";
import { adminGuard, apiError, parseJsonBody } from "@/lib/api-helpers";
import { getCurrentActor } from "@/features/system-events/server";
import { getAgentOutcomeContext } from "@/features/agent-outcomes/server";
import { jsonToText } from "@/features/agent-outcomes/summary";
import { createSystemAssetFollowUpItem } from "@/features/asset-follow-up-items/server";
import { createSystemCampaignActionItem } from "@/features/campaign-action-items/server";
import { createSystemCrmFollowUpItem } from "@/features/crm-follow-up-items/server";
import { createSystemEventFollowUpItem } from "@/features/event-follow-up-items/server";
import {
  getAssetWorkflowPaths,
  getCampaignWorkflowPaths,
  getCrmWorkflowPaths,
  getEventWorkflowPaths,
  revalidateWorkflowPaths,
} from "@/features/workflow/revalidation";

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
  const assetName = metadataString(context.request.metadata, "assetName");
  const crmContactName = metadataString(context.request.metadata, "crmContactName");
  const eventName = metadataString(context.request.metadata, "eventName");

  if (context.task?.status === "failed") {
    return `Investigate ${agentName} outcome`;
  }

  if (crmContactName) {
    return `Follow up with ${crmContactName}`;
  }

  if (assetName) {
    return `Review ${assetName}`;
  }

  if (eventName) {
    return `Follow up on ${eventName}`;
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
  if (context.linkedAssetFollowUpItemId) {
    return NextResponse.json({ itemId: context.linkedAssetFollowUpItemId }, { status: 200 });
  }
  if (context.linkedEventFollowUpItemId) {
    return NextResponse.json({ itemId: context.linkedEventFollowUpItemId }, { status: 200 });
  }
  if (context.linkedCrmFollowUpItemId) {
    return NextResponse.json({ itemId: context.linkedCrmFollowUpItemId }, { status: 200 });
  }

  if (!context.task) {
    return apiError("Agent outcome is not ready yet", 409);
  }

  if (context.task.status === "pending" || context.task.status === "running") {
    return apiError("Wait for the agent outcome before creating a follow-up action", 409);
  }

  const campaignId = metadataString(context.request.metadata, "campaignId");
  const assetId = metadataString(context.request.metadata, "assetId");
  const crmContactId = metadataString(context.request.metadata, "crmContactId");
  const eventId = metadataString(context.request.metadata, "eventId");
  const clientSlug =
    context.request.clientSlug ?? metadataString(context.request.metadata, "clientSlug");

  if (!clientSlug) return apiError("Agent outcome is missing client context", 400);

  const actor = await getCurrentActor();
  const itemTitle = buildActionItemTitle(context);
  const itemDescription = buildActionItemDescription(context);
  const itemPriority = context.task.status === "failed" ? "high" : "medium";

  const item = campaignId
    ? await createSystemCampaignActionItem({
        actorId: actor.actorId,
        actorName: actor.actorName,
        actorType: actor.actorType,
        campaignId,
        clientSlug,
        description: itemDescription,
        priority: itemPriority,
        sourceEntityId: taskId,
        sourceEntityType: "agent_task",
        status: "todo",
        title: itemTitle,
        visibility: context.request.visibility,
      })
    : crmContactId
      ? await createSystemCrmFollowUpItem({
          actorId: actor.actorId,
          actorName: actor.actorName,
          actorType: actor.actorType,
          clientSlug,
          contactId: crmContactId,
          description: itemDescription,
          priority: itemPriority,
          sourceEntityId: taskId,
          sourceEntityType: "agent_task",
          status: "todo",
          title: itemTitle,
          visibility: context.request.visibility,
        })
      : assetId
        ? await createSystemAssetFollowUpItem({
            actorId: actor.actorId,
            actorName: actor.actorName,
            actorType: actor.actorType,
            assetId,
            clientSlug,
            description: itemDescription,
            priority: itemPriority,
            sourceEntityId: taskId,
            sourceEntityType: "agent_task",
            status: "todo",
            title: itemTitle,
            visibility: context.request.visibility,
          })
      : eventId
        ? await createSystemEventFollowUpItem({
            actorId: actor.actorId,
            actorName: actor.actorName,
            actorType: actor.actorType,
            clientSlug,
            description: itemDescription,
            eventId,
            priority: itemPriority,
            sourceEntityId: taskId,
            sourceEntityType: "agent_task",
            status: "todo",
            title: itemTitle,
            visibility: context.request.visibility,
          })
      : null;

  if (!item) return apiError("Failed to create action item", 500);

  if (campaignId) {
    revalidateWorkflowPaths(getCampaignWorkflowPaths(clientSlug, campaignId));
  } else if (crmContactId) {
    revalidateWorkflowPaths(getCrmWorkflowPaths(clientSlug, crmContactId));
  } else if (assetId) {
    revalidateWorkflowPaths(getAssetWorkflowPaths(clientSlug, assetId));
  } else if (eventId) {
    revalidateWorkflowPaths(getEventWorkflowPaths(clientSlug, eventId));
  }

  return NextResponse.json({ item }, { status: 201 });
}
