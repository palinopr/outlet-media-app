"use client";

import { CalendarClock, Flame, Share2, Users } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { CrmContactsPanel } from "@/components/crm/crm-contacts-panel";
import { CrmDiscussionsPanel } from "@/components/crm/crm-discussions-panel";
import { CrmFollowUpItemsPanel } from "@/components/crm/crm-follow-up-items-panel";
import { WorkspaceActivityFeed } from "@/components/workspace/workspace-activity-feed";
import type { CrmDiscussionThread } from "@/features/crm-comments/server";
import type { CrmFollowUpItem } from "@/features/crm-follow-up-items/server";
import type { CrmOverview } from "@/features/crm/server";

interface ClientCrmTabProps {
  clientSlug: string;
  discussions: CrmDiscussionThread[];
  followUpItems: CrmFollowUpItem[];
  overview: CrmOverview;
}

export function ClientCrmTab({
  clientSlug,
  discussions,
  followUpItems,
  overview,
}: ClientCrmTabProps) {
  const contactsForAttention =
    overview.upcomingFollowUps.length > 0 ? overview.upcomingFollowUps : overview.recentContacts;
  const activeFollowUpItems = followUpItems.filter((item) => item.status !== "done");

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          accent="from-cyan-500/20 to-blue-500/20"
          icon={Users}
          iconColor="text-cyan-400"
          label="Total contacts"
          value={String(overview.summary.totalContacts)}
        />
        <StatCard
          accent="from-rose-500/20 to-orange-500/20"
          icon={Flame}
          iconColor="text-rose-400"
          label="Hot contacts"
          value={String(overview.summary.hotContacts)}
        />
        <StatCard
          accent="from-amber-500/20 to-yellow-500/20"
          icon={CalendarClock}
          iconColor="text-amber-400"
          label="Due follow-ups"
          value={String(overview.summary.dueFollowUps)}
        />
        <StatCard
          accent="from-emerald-500/20 to-teal-500/20"
          icon={Share2}
          iconColor="text-emerald-400"
          label="Shared with client"
          value={String(overview.summary.sharedContacts)}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="space-y-6">
          <CrmContactsPanel
            canManage
            contacts={contactsForAttention}
            description="CRM relationships for this client account that need the most attention right now."
            detailHrefPrefix="/admin/crm"
            emptyState="No CRM contacts are attached to this client yet."
            title={overview.upcomingFollowUps.length > 0 ? "Upcoming follow-ups" : "Recent contacts"}
            variant="admin"
          />

          <WorkspaceActivityFeed
            assetHrefPrefix="/admin/assets"
            basePath="/admin/crm"
            campaignHrefPrefix="/admin/campaigns"
            crmHrefPrefix="/admin/crm"
            description="Recent CRM changes and follow-up work on the shared system timeline."
            eventHrefPrefix="/admin/events"
            events={overview.recentEvents}
            title={`${clientSlug} CRM activity`}
          />
        </div>

        <div className="space-y-6">
          <CrmFollowUpItemsPanel
            canManage
            clientSlug={clientSlug}
            contactHrefPrefix="/admin/crm"
            description="CRM next steps attached directly to contacts for this client account."
            emptyState="No CRM follow-up items are active for this client right now."
            items={activeFollowUpItems}
            showContactName
            title="CRM next steps"
            variant="admin"
          />

          <CrmDiscussionsPanel
            detailHrefPrefix="/admin/crm"
            discussions={discussions}
            description="Unresolved CRM conversations that still need a response or follow-up."
            emptyState="No unresolved CRM discussions are active for this client."
            title="Relationship discussion"
            variant="admin"
          />

          <CrmContactsPanel
            canManage
            contacts={overview.recentContacts}
            description="The full CRM pipeline on the same shared backbone as campaigns, approvals, and activity."
            detailHrefPrefix="/admin/crm"
            emptyState="Create the first CRM contact to start the shared pipeline."
            title="CRM pipeline"
            variant="admin"
          />
        </div>
      </div>
    </div>
  );
}
