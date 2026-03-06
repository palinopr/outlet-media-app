import Link from "next/link";
import { ArrowLeft, CalendarClock, Flame, Share2, Users } from "lucide-react";
import { AgentOutcomesPanel } from "@/components/agents/agent-outcomes-panel";
import { WorkspaceActivityFeed } from "@/components/workspace/workspace-activity-feed";
import { CrmContactsPanel } from "@/components/crm/crm-contacts-panel";
import { listAgentOutcomes } from "@/features/agent-outcomes/server";
import { getCrmOverview } from "@/features/crm/server";
import { requireClientAccess } from "@/features/client-portal/access";
import { ClientPortalFooter } from "../components/client-portal-footer";
import { StatCard } from "../components/stat-card";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ClientCrmPage({ params }: Props) {
  const { slug } = await params;
  await requireClientAccess(slug, "crm");

  const crm = await getCrmOverview({
    audience: "shared",
    clientSlug: slug,
  });
  const agentOutcomes = await listAgentOutcomes({
    audience: "shared",
    clientSlug: slug,
    contextType: "crm_contact",
    limit: 4,
  });

  const contactsForAttention =
    crm.upcomingFollowUps.length > 0 ? crm.upcomingFollowUps : crm.recentContacts;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={`/client/${slug}`}
          className="inline-flex items-center gap-1.5 text-xs text-white/45 transition-colors hover:text-white/80"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to dashboard
        </Link>
      </div>

      <div className="space-y-2">
        <p className="section-label">CRM</p>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Relationship pipeline</h1>
        <p className="max-w-3xl text-sm text-white/55">
          A simple view of the contacts, follow-ups, and recent CRM activity tied to your account.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={Users}
          iconColor="bg-cyan-500/10 ring-1 ring-cyan-500/20 text-cyan-400"
          label="Contacts"
          value={String(crm.summary.totalContacts)}
        />
        <StatCard
          icon={Flame}
          iconColor="bg-rose-500/10 ring-1 ring-rose-500/20 text-rose-400"
          label="Hot contacts"
          value={String(crm.summary.hotContacts)}
        />
        <StatCard
          icon={CalendarClock}
          iconColor="bg-amber-500/10 ring-1 ring-amber-500/20 text-amber-400"
          label="Due follow-ups"
          value={String(crm.summary.dueFollowUps)}
        />
        <StatCard
          icon={Share2}
          iconColor="bg-emerald-500/10 ring-1 ring-emerald-500/20 text-emerald-400"
          label="Shared contacts"
          value={String(crm.summary.sharedContacts)}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <div className="space-y-6">
          <CrmContactsPanel
            contacts={contactsForAttention}
            detailHrefPrefix={`/client/${slug}/crm`}
            title={crm.upcomingFollowUps.length > 0 ? "Next follow-ups" : "Recent contacts"}
            description={
              crm.upcomingFollowUps.length > 0
                ? "The relationship follow-ups currently due or coming up next."
                : "The latest shared CRM contacts tied to your account."
            }
            emptyState="No shared CRM contacts are visible yet."
            variant="client"
          />
          <CrmContactsPanel
            contacts={crm.recentContacts}
            detailHrefPrefix={`/client/${slug}/crm`}
            title="Shared CRM contacts"
            description="Contacts, owners, and notes that the Outlet team has chosen to share with you."
            emptyState="No CRM contacts have been shared yet."
            variant="client"
          />
        </div>

        <div className="space-y-6">
          <WorkspaceActivityFeed
            events={crm.recentEvents}
            basePath={`/client/${slug}/crm`}
            title="CRM activity"
            description="Recent shared CRM updates on the same timeline as the rest of your account work."
            emptyState="CRM activity will appear here as contacts are added and updated."
          />

          <AgentOutcomesPanel
            outcomes={agentOutcomes}
            title="CRM follow-through"
            description="Shared agent recommendations for CRM contacts that currently need follow-up."
            emptyState="No shared CRM follow-through is available yet."
            variant="client"
            crmHrefPrefix={`/client/${slug}/crm`}
          />
        </div>
      </div>

      <ClientPortalFooter dataSource="supabase" />
    </div>
  );
}
