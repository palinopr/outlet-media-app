import { CalendarClock, Flame, Share2, Users } from "lucide-react";
import { AgentOutcomesPanel } from "@/components/agents/agent-outcomes-panel";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ClientFilter } from "@/components/admin/campaigns/client-filter";
import { StatCard } from "@/components/admin/stat-card";
import { WorkspaceActivityFeed } from "@/components/workspace/workspace-activity-feed";
import { CrmContactsPanel } from "@/components/crm/crm-contacts-panel";
import { CrmCreateContactForm } from "@/components/crm/crm-create-contact-form";
import { getCrmOverview } from "@/features/crm/server";
import { listAgentOutcomes } from "@/features/agent-outcomes/server";
import { slugToLabel } from "@/lib/formatters";

interface Props {
  searchParams?: Promise<{ client?: string }>;
}

export default async function AdminCrmPage({ searchParams }: Props) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const selectedClient =
    resolvedSearchParams.client && resolvedSearchParams.client !== "all"
      ? resolvedSearchParams.client
      : null;

  const crm = await getCrmOverview({
    audience: "all",
    clientSlug: selectedClient,
  });
  const agentOutcomes = await listAgentOutcomes({
    audience: "all",
    clientSlug: selectedClient,
    contextType: "crm_contact",
    limit: 4,
  });

  const contactsForAttention =
    crm.upcomingFollowUps.length > 0 ? crm.upcomingFollowUps : crm.recentContacts;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="CRM"
        description={
          selectedClient
            ? `Client relationships, follow-ups, and pipeline state for ${slugToLabel(selectedClient)}.`
            : "Client relationships, follow-ups, and pipeline state across Outlet."
        }
      >
        {crm.clients.length > 0 ? (
          <ClientFilter clients={crm.clients.map((client) => client.slug)} />
        ) : null}
      </AdminPageHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total contacts"
          value={String(crm.summary.totalContacts)}
          icon={Users}
          accent="from-cyan-500/20 to-blue-500/20"
          iconColor="text-cyan-400"
        />
        <StatCard
          label="Hot contacts"
          value={String(crm.summary.hotContacts)}
          icon={Flame}
          accent="from-rose-500/20 to-orange-500/20"
          iconColor="text-rose-400"
        />
        <StatCard
          label="Due follow-ups"
          value={String(crm.summary.dueFollowUps)}
          icon={CalendarClock}
          accent="from-amber-500/20 to-yellow-500/20"
          iconColor="text-amber-400"
        />
        <StatCard
          label="Shared with client"
          value={String(crm.summary.sharedContacts)}
          icon={Share2}
          accent="from-emerald-500/20 to-teal-500/20"
          iconColor="text-emerald-400"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-6">
          <CrmCreateContactForm
            clientOptions={
              selectedClient
                ? [{ slug: selectedClient, name: slugToLabel(selectedClient) }]
                : crm.clients
            }
            defaultClientSlug={selectedClient ?? undefined}
          />

          <WorkspaceActivityFeed
            events={crm.recentEvents}
            basePath="/admin/crm"
            title="CRM activity"
            description="Recent CRM additions and follow-up work on the shared product timeline."
            emptyState="CRM activity will appear here as contacts are created and updated."
            showClientSlug={!selectedClient}
          />

          <AgentOutcomesPanel
            outcomes={agentOutcomes}
            title="CRM follow-through"
            description="Recent bounded agent triage and recommendations for CRM contacts that need attention."
            emptyState="No CRM follow-through is queued yet."
            variant="admin"
            crmHrefPrefix="/admin/crm"
          />
        </div>

        <div className="space-y-6">
          <CrmContactsPanel
            canManage
            contacts={contactsForAttention}
            detailHrefPrefix="/admin/crm"
            title={crm.upcomingFollowUps.length > 0 ? "Upcoming follow-ups" : "Recent contacts"}
            description={
              crm.upcomingFollowUps.length > 0
                ? "The next CRM follow-ups the team should work through."
                : "The most recent CRM records across the selected client scope."
            }
            emptyState="No follow-ups or contacts are available yet."
            showClientSlug={!selectedClient}
            variant="admin"
          />

          <CrmContactsPanel
            canManage
            contacts={crm.recentContacts}
            detailHrefPrefix="/admin/crm"
            title="CRM pipeline"
            description="A first-class CRM list on the same shared backbone as campaigns, approvals, and activity."
            emptyState="Create the first CRM contact to start the shared pipeline."
            showClientSlug={!selectedClient}
            variant="admin"
          />
        </div>
      </div>
    </div>
  );
}
