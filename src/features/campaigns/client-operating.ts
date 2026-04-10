import {
  listCampaignActionItems,
  type CampaignActionItem,
} from "@/features/campaign-action-items/server";
import {
  listCampaignComments,
  type CampaignComment,
} from "@/features/campaign-comments/server";
import { listCampaignApprovalRequests } from "@/features/approvals/server";
import {
  listCampaignSystemEvents,
  type SystemEvent,
} from "@/features/system-events/server";
import { listAgentOutcomes } from "@/features/agent-outcomes/server";
import type { AgentOutcomeView } from "@/features/agent-outcomes/summary";
import { allowsCampaignInScope } from "@/features/client-portal/scope";
import type { ScopeFilter } from "@/lib/member-access";

export interface ClientCampaignOperatingView {
  actionItems: CampaignActionItem[];
  agentOutcomes: AgentOutcomeView[];
  approvals: Awaited<ReturnType<typeof listCampaignApprovalRequests>>;
  comments: CampaignComment[];
  systemEvents: SystemEvent[];
}

export async function getClientCampaignOperatingView(input: {
  campaignId: string;
  clientSlug: string;
  scope?: ScopeFilter;
}): Promise<ClientCampaignOperatingView> {
  if (!allowsCampaignInScope(input.scope, input.campaignId)) {
    return {
      actionItems: [],
      agentOutcomes: [],
      approvals: [],
      comments: [],
      systemEvents: [],
    };
  }

  const [approvals, actionItems, comments, systemEvents, agentOutcomes] = await Promise.all([
    listCampaignApprovalRequests({
      audience: "shared",
      campaignId: input.campaignId,
      clientSlug: input.clientSlug,
      limit: 8,
      status: "pending",
    }),
    listCampaignActionItems({
      audience: "shared",
      campaignId: input.campaignId,
      clientSlug: input.clientSlug,
      limit: 12,
    }),
    listCampaignComments({
      audience: "shared",
      campaignId: input.campaignId,
      clientSlug: input.clientSlug,
    }),
    listCampaignSystemEvents({
      audience: "shared",
      campaignId: input.campaignId,
      clientSlug: input.clientSlug,
      limit: 10,
    }),
    listAgentOutcomes({
      audience: "shared",
      campaignId: input.campaignId,
      clientSlug: input.clientSlug,
      limit: 6,
      scopeCampaignIds: input.scope?.allowedCampaignIds ?? null,
      scopeEventIds: input.scope?.allowedEventIds ?? null,
    }),
  ]);

  return {
    actionItems: actionItems.filter((item) => item.status !== "done"),
    agentOutcomes,
    approvals,
    comments,
    systemEvents,
  };
}
