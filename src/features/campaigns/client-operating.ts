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
import { allowsCampaignInScope } from "@/features/client-portal/scope";
import type { ScopeFilter } from "@/lib/member-access";

export interface ClientCampaignOperatingView {
  actionItems: CampaignActionItem[];
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
      approvals: [],
      comments: [],
      systemEvents: [],
    };
  }

  const [approvals, actionItems, comments, systemEvents] = await Promise.all([
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
  ]);

  return {
    actionItems: actionItems.filter((item) => item.status !== "done"),
    approvals,
    comments,
    systemEvents,
  };
}
