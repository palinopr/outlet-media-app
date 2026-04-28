import { listEventApprovalRequests } from "@/features/approvals/server";
import { allowsEventInScope } from "@/features/client-portal/scope";
import {
  listEventComments,
  type EventComment,
} from "@/features/event-comments/server";
import {
  listEventFollowUpItems,
  type EventFollowUpItem,
} from "@/features/event-follow-up-items/server";
import {
  listEventSystemEvents,
  type SystemEvent,
} from "@/features/system-events/server";
import type { ScopeFilter } from "@/lib/member-access";

export interface ClientEventOperatingView {
  approvals: Awaited<ReturnType<typeof listEventApprovalRequests>>;
  comments: EventComment[];
  followUpItems: EventFollowUpItem[];
  systemEvents: SystemEvent[];
}

export async function getClientEventOperatingView(input: {
  eventId: string;
  clientSlug: string;
  linkedCampaignIds?: string[] | null;
  scope?: ScopeFilter;
}): Promise<ClientEventOperatingView> {
  if (!allowsEventInScope(input.scope, input.eventId)) {
    return {
      approvals: [],
      comments: [],
      followUpItems: [],
      systemEvents: [],
    };
  }

  const linkedCampaignIds = [...new Set((input.linkedCampaignIds ?? []).filter(Boolean))];

  const [approvals, followUpItems, comments, systemEvents] = await Promise.all([
    listEventApprovalRequests({
      audience: "shared",
      campaignIds: linkedCampaignIds,
      clientSlug: input.clientSlug,
      eventId: input.eventId,
      limit: 8,
      status: "pending",
    }),
    listEventFollowUpItems({
      audience: "shared",
      clientSlug: input.clientSlug,
      eventId: input.eventId,
      limit: 12,
    }),
    listEventComments({
      audience: "shared",
      clientSlug: input.clientSlug,
      eventId: input.eventId,
    }),
    listEventSystemEvents({
      audience: "shared",
      campaignIds: linkedCampaignIds,
      clientSlug: input.clientSlug,
      eventId: input.eventId,
      limit: 10,
    }),
  ]);

  return {
    approvals,
    comments,
    followUpItems: followUpItems.filter((item) => item.status !== "done"),
    systemEvents,
  };
}
